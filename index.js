import express from "express";
import crypto from "crypto";
import fs from "fs";
import { TRIGGERS, FUZZY_MAX_DISTANCE } from "./keywords.js";

// ============================================================
//  НАСТРОЙКИ (берутся из переменных окружения на Railway)
// ============================================================
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "my_verify_token";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "";
const APP_SECRET = process.env.APP_SECRET || "";
const GRAPH = "https://graph.facebook.com/v21.0";

// Файл, где помечаем уже обработанные комментарии (чтобы не слать дважды)
const PROCESSED_FILE = process.env.PROCESSED_FILE || "./processed.json";

// ============================================================
//  ХРАНИЛИЩЕ ОБРАБОТАННЫХ КОММЕНТАРИЕВ
// ============================================================
let processed = new Set();
try {
  if (fs.existsSync(PROCESSED_FILE)) {
    processed = new Set(JSON.parse(fs.readFileSync(PROCESSED_FILE, "utf8")));
  }
} catch (e) {
  console.error("Не удалось прочитать processed.json, начинаю с пустого списка");
}

function markProcessed(commentId) {
  processed.add(commentId);
  try {
    fs.writeFileSync(PROCESSED_FILE, JSON.stringify([...processed]));
  } catch (e) {
    console.error("Не удалось сохранить processed.json:", e.message);
  }
}

// ============================================================
//  ПОИСК КОДОВОГО СЛОВА (с учётом опечаток)
// ============================================================

// Расстояние Левенштейна — сколько правок отделяют два слова
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

// Допустимое число опечаток зависит от длины слова
function allowedDistance(word) {
  if (word.length <= 3) return 0;          // очень короткие — только точно
  if (word.length <= 6) return 1;          // средние — 1 опечатка
  return Math.min(2, FUZZY_MAX_DISTANCE);  // длинные — до 2
}

// Нормализация: нижний регистр + сохраняем буквы любого алфавита
// (включая польские ą ę ł ż ó ś ć ń и кириллицу). Выкидываем только
// пунктуацию/эмодзи, буквы и цифры оставляем.
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/ё/g, "е")
    // \p{L} = любая буква Unicode, \p{N} = любая цифра. Всё прочее → пробел.
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Проверяем, встречается ли кодовое слово (или его вариация) в комментарии
function findTrigger(commentText) {
  const norm = normalize(commentText);
  const words = norm.split(" ").filter(Boolean);

  for (const trigger of TRIGGERS) {
    const candidates = [trigger.keyword, ...(trigger.variations || [])]
      .map(normalize);

    for (const cand of candidates) {
      // Многословные варианты ("сколько стоит") — ищем как подстроку
      if (cand.includes(" ")) {
        if (norm.includes(cand)) return trigger;
        continue;
      }
      // Однословные — точное совпадение ИЛИ опечатка в пределах нормы
      const maxDist = allowedDistance(cand);
      for (const w of words) {
        if (w === cand) return trigger;
        if (maxDist > 0 && levenshtein(w, cand) <= maxDist) return trigger;
      }
    }
  }
  return null;
}

// ============================================================
//  ОТПРАВКА ЛИЧНОГО СООБЩЕНИЯ НА КОММЕНТАРИЙ (Private Reply)
// ============================================================
async function sendPrivateReply(commentId, message) {
  const url = `${GRAPH}/${commentId}/private_replies`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      access_token: PAGE_ACCESS_TOKEN,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`Private reply failed [${commentId}]:`, JSON.stringify(data));
    return false;
  }
  console.log(`✅ Отправлено в личку на комментарий ${commentId}`);
  return true;
}

// ============================================================
//  ПРОВЕРКА ПОДПИСИ ЗАПРОСА (что webhook действительно от Facebook)
// ============================================================
function verifySignature(req) {
  if (!APP_SECRET) return true; // если секрет не задан — пропускаем (не рекомендуется)
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", APP_SECRET).update(req.rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

// ============================================================
//  СЕРВЕР
// ============================================================
const app = express();
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// 1) Проверка webhook при подключении (Facebook шлёт GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook подтверждён");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// 2) Приём событий (Facebook шлёт POST)
app.post("/webhook", async (req, res) => {
  // --- ДИАГНОСТИКА: печатаем ЛЮБОЙ входящий запрос до всех фильтров ---
  console.log("📩 ВХОДЯЩИЙ POST:", JSON.stringify(req.body));

  if (!verifySignature(req)) {
    console.error("❌ Неверная подпись запроса");
    return res.sendStatus(403);
  }

  // Отвечаем сразу, обработку делаем после
  res.sendStatus(200);

  const body = req.body;
  if (body.object !== "page") return;

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      // Нас интересуют только новые комментарии
      if (change.field !== "feed") continue;
      const v = change.value || {};
      if (v.item !== "comment" || v.verb !== "add") continue;

      const commentId = v.comment_id;
      const text = v.message || "";
      const fromId = v.from?.id;

      // Не отвечаем сами себе (на комментарии страницы)
      if (fromId && entry.id && fromId === entry.id) continue;

      // Уже обрабатывали этот комментарий?
      if (!commentId || processed.has(commentId)) continue;

      const trigger = findTrigger(text);
      if (!trigger) continue;

      console.log(`🔎 Совпадение "${trigger.keyword}" в комментарии: "${text}"`);
      const ok = await sendPrivateReply(commentId, trigger.reply);
      if (ok) markProcessed(commentId);
    }
  }
});

// Простая проверка, что сервер жив
app.get("/", (_req, res) => res.send("Comment bot is running"));

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
