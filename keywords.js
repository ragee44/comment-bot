// ============================================================
//  КОДОВЫЕ СЛОВА И ШАБЛОНЫ СООБЩЕНИЙ  (рынок: Польша)
// ============================================================
//
//  Как редактировать:
//  - keyword       — основное кодовое слово (нижний регистр)
//  - variations    — синонимы/контекст + варианты написания.
//                    Опечатки ловятся автоматически, сюда — осознанные
//                    варианты: синонимы по смыслу, написание без польских
//                    диакритиков (np. plaski / płaski).
//  - reply         — текст, который уйдёт человеку в личку.
//
//  ВАЖНО: одно и то же слово не должно стоять в двух блоках —
//  иначе сработает только первый по списку. Файл проверен: дублей нет.
//
// ============================================================

export const TRIGGERS = [
  {
    // ТЕМА: диета / питание
    keyword: "dieta",
    variations: ["dieta keto", "jadłospis", "jadlospis", "zdrowe odżywianie", "zdrowe odzywianie", "plan żywieniowy", "plan zywieniowy", "chcę dietę", "chce diete"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że interesuje Cię temat diety. Napisz proszę, co najbardziej Cię teraz blokuje albo z czym masz największy problem.",
  },
  {
    // ТЕМА: вес / похудение
    keyword: "waga",
    variations: ["schudnąć", "schudnac", "odchudzanie", "spadek wagi", "nadwaga", "zrzucić kilogramy", "zrzucic kilogramy", "chcę schudnąć", "chce schudnac"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że chodzi o temat wagi. Napisz proszę, co dokładnie Cię martwi i jaki efekt chcesz osiągnąć.",
  },
  {
    // ТЕМА: детокс / очищение
    keyword: "detoks",
    variations: ["oczyszczanie", "oczyszczenie", "pasożyty", "pasozyty", "toksyny", "oczyścić organizm", "oczyscic organizm", "chcę detoks", "chce detoks"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że interesuje Cię detoks. Napisz proszę, co dokładnie Cię niepokoi i dlaczego szukasz takiego rozwiązania.",
  },
  {
    // ТЕМА: живот / вздутие / ЖКТ
    keyword: "brzuch",
    variations: ["brzuszek", "płaski brzuch", "plaski brzuch", "wzdęcia", "wzdecia", "opuchnięty brzuch", "opuchniety brzuch", "jelita", "talia"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że chodzi o brzuch. Napisz proszę, co konkretnie Ci przeszkadza i od jak dawna to zauważasz.",
  },
  {
    // ТЕМА: кожа / уход
    keyword: "skora",
    variations: ["skóra", "cera", "problemy skórne", "problemy skorne", "sucha skóra", "sucha skora", "pryszcze", "trądzik", "tradzik"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że interesuje Cię pielęgnacja skóry. Napisz proszę, co najbardziej chciałabyś poprawić w wyglądzie skóry.",
  },
  {
    // ТЕМА: сияние / состояние лица
    keyword: "blask",
    variations: ["promienność", "promiennosc", "rozświetlenie", "rozswietlenie", "glow", "blask twarzy", "rozświetlona twarz", "rozswietlona twarz", "blask i promienność", "rozjaśnienie"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że chcesz przywrócić skórze blask. Napisz proszę, co dokładnie Ci przeszkadza w jej obecnym wyglądzie.",
  },
  {
    // ТЕМА: волосы (состояние / выпадение)
    keyword: "wlosy",
    variations: ["włosy", "cienkie włosy", "cienkie wlosy", "słabe włosy", "slabe wlosy", "wypadają włosy", "wypadaja wlosy", "łysienie", "lysienie"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że chodzi o włosy. Napisz proszę, co najbardziej Cię martwi i kiedy zaczęłaś to zauważać.",
  },
  {
    // ТЕМА: рост волос / густота
    keyword: "porost",
    variations: ["na porost", "porost włosów", "porost wlosow", "odrost", "gęstość włosów", "gestosc wlosow", "szybszy porost", "więcej włosów", "wiecej wlosow"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że interesuje Cię porost włosów. Napisz proszę, co dokładnie dzieje się z Twoimi włosami i jaki efekt chcesz uzyskać.",
  },
  {
    // ТЕМА: вены / варикоз
    keyword: "zylaki",
    variations: ["żylaki", "żyły", "zyly", "pajączki", "pajaczki", "widoczne żyły", "widoczne zyly", "problem z żyłami", "problem z zylami"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że chodzi o nogi i żyły. Napisz proszę, co dokładnie Cię niepokoi i w jakich momentach najbardziej to odczuwasz.",
  },
  {
    // ТЕМА: лёгкость / усталость ног
    keyword: "lekkość",
    variations: ["lekkosc", "lekkie nogi", "ciężkie nogi", "ciezkie nogi", "zmęczone nogi", "zmeczone nogi", "opuchnięte nogi", "opuchniete nogi", "ulga dla nóg", "ulga dla nog"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że chcesz poczuć większą lekkość nóg. Napisz proszę, co dokładnie odczuwasz i kiedy problem jest najbardziej zauważalny.",
  },
  {
    // ТЕМА: стопы / пятки
    keyword: "stopy",
    variations: ["stopki", "suche stopy", "pięty", "piety", "popękane pięty", "popekane piety", "twarde pięty", "twarde piety", "pielęgnacja stóp", "pielegnacja stop"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że chodzi o stopy. Napisz proszę, co dokładnie Ci przeszkadza i jak długo trwa ten problem.",
  },
  {
    // ТЕМА: зуд / жжение (стопы)
    keyword: "swiad",
    variations: ["świąd", "swędzenie", "swedzenie", "pieczenie", "drapanie", "grzybica", "swędzi", "swedzi", "swędzące", "swedzace"],
    reply: "Cześć, dziękuję za komentarz. Widzę, że chodzi o swędzenie. Napisz proszę, co dokładnie zauważasz i kiedy najbardziej Ci to dokucza.",
  },
];

// Насколько строго прощать опечатки (0 = точно как написано, выше = мягче).
// 1 = разрешаем максимум 1 ошибку на коротких словах, 2 — на длинных.
// Менять обычно не нужно.
export const FUZZY_MAX_DISTANCE = 2;
