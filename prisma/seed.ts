import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const hiragana = [
  { char: "あ", romaji: "a", group: "vowel" },
  { char: "い", romaji: "i", group: "vowel" },
  { char: "う", romaji: "u", group: "vowel" },
  { char: "え", romaji: "e", group: "vowel" },
  { char: "お", romaji: "o", group: "vowel" },
  { char: "か", romaji: "ka", group: "k" },
  { char: "き", romaji: "ki", group: "k" },
  { char: "く", romaji: "ku", group: "k" },
  { char: "け", romaji: "ke", group: "k" },
  { char: "こ", romaji: "ko", group: "k" },
  { char: "さ", romaji: "sa", group: "s" },
  { char: "し", romaji: "shi", group: "s" },
  { char: "す", romaji: "su", group: "s" },
  { char: "せ", romaji: "se", group: "s" },
  { char: "そ", romaji: "so", group: "s" },
  { char: "た", romaji: "ta", group: "t" },
  { char: "ち", romaji: "chi", group: "t" },
  { char: "つ", romaji: "tsu", group: "t" },
  { char: "て", romaji: "te", group: "t" },
  { char: "と", romaji: "to", group: "t" },
  { char: "な", romaji: "na", group: "n" },
  { char: "に", romaji: "ni", group: "n" },
  { char: "ぬ", romaji: "nu", group: "n" },
  { char: "ね", romaji: "ne", group: "n" },
  { char: "の", romaji: "no", group: "n" },
  { char: "は", romaji: "ha", group: "h" },
  { char: "ひ", romaji: "hi", group: "h" },
  { char: "ふ", romaji: "fu", group: "h" },
  { char: "へ", romaji: "he", group: "h" },
  { char: "ほ", romaji: "ho", group: "h" },
  { char: "ま", romaji: "ma", group: "m" },
  { char: "み", romaji: "mi", group: "m" },
  { char: "む", romaji: "mu", group: "m" },
  { char: "め", romaji: "me", group: "m" },
  { char: "も", romaji: "mo", group: "m" },
  { char: "や", romaji: "ya", group: "y" },
  { char: "ゆ", romaji: "yu", group: "y" },
  { char: "よ", romaji: "yo", group: "y" },
  { char: "ら", romaji: "ra", group: "r" },
  { char: "り", romaji: "ri", group: "r" },
  { char: "る", romaji: "ru", group: "r" },
  { char: "れ", romaji: "re", group: "r" },
  { char: "ろ", romaji: "ro", group: "r" },
  { char: "わ", romaji: "wa", group: "w" },
  { char: "を", romaji: "wo", group: "w" },
  { char: "ん", romaji: "n", group: "special" },
];

const katakana = [
  { char: "ア", romaji: "a", group: "vowel" },
  { char: "イ", romaji: "i", group: "vowel" },
  { char: "ウ", romaji: "u", group: "vowel" },
  { char: "エ", romaji: "e", group: "vowel" },
  { char: "オ", romaji: "o", group: "vowel" },
  { char: "カ", romaji: "ka", group: "k" },
  { char: "キ", romaji: "ki", group: "k" },
  { char: "ク", romaji: "ku", group: "k" },
  { char: "ケ", romaji: "ke", group: "k" },
  { char: "コ", romaji: "ko", group: "k" },
  { char: "サ", romaji: "sa", group: "s" },
  { char: "シ", romaji: "shi", group: "s" },
  { char: "ス", romaji: "su", group: "s" },
  { char: "セ", romaji: "se", group: "s" },
  { char: "ソ", romaji: "so", group: "s" },
  { char: "タ", romaji: "ta", group: "t" },
  { char: "チ", romaji: "chi", group: "t" },
  { char: "ツ", romaji: "tsu", group: "t" },
  { char: "テ", romaji: "te", group: "t" },
  { char: "ト", romaji: "to", group: "t" },
  { char: "ナ", romaji: "na", group: "n" },
  { char: "ニ", romaji: "ni", group: "n" },
  { char: "ヌ", romaji: "nu", group: "n" },
  { char: "ネ", romaji: "ne", group: "n" },
  { char: "ノ", romaji: "no", group: "n" },
  { char: "ハ", romaji: "ha", group: "h" },
  { char: "ヒ", romaji: "hi", group: "h" },
  { char: "フ", romaji: "fu", group: "h" },
  { char: "ヘ", romaji: "he", group: "h" },
  { char: "ホ", romaji: "ho", group: "h" },
  { char: "マ", romaji: "ma", group: "m" },
  { char: "ミ", romaji: "mi", group: "m" },
  { char: "ム", romaji: "mu", group: "m" },
  { char: "メ", romaji: "me", group: "m" },
  { char: "モ", romaji: "mo", group: "m" },
  { char: "ヤ", romaji: "ya", group: "y" },
  { char: "ユ", romaji: "yu", group: "y" },
  { char: "ヨ", romaji: "yo", group: "y" },
  { char: "ラ", romaji: "ra", group: "r" },
  { char: "リ", romaji: "ri", group: "r" },
  { char: "ル", romaji: "ru", group: "r" },
  { char: "レ", romaji: "re", group: "r" },
  { char: "ロ", romaji: "ro", group: "r" },
  { char: "ワ", romaji: "wa", group: "w" },
  { char: "ヲ", romaji: "wo", group: "w" },
  { char: "ン", romaji: "n", group: "special" },
];

const digitReadings = ["ぜろ", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう"];
const tensPrefixes: Record<number, string> = {
  1: "じゅう",
  2: "にじゅう",
  3: "さんじゅう",
  4: "よんじゅう",
  5: "ごじゅう",
  6: "ろくじゅう",
  7: "ななじゅう",
  8: "はちじゅう",
  9: "きゅうじゅう",
};
const hundredsPrefixes: Record<number, string> = {
  1: "ひゃく",
  2: "にひゃく",
  3: "さんびゃく",
  4: "よんひゃく",
  5: "ごひゃく",
  6: "ろっぴゃく",
  7: "ななひゃく",
  8: "はっぴゃく",
  9: "きゅうひゃく",
};
const thousandsPrefixes: Record<number, string> = {
  1: "せん",
  2: "にせん",
  3: "さんぜん",
  4: "よんせん",
  5: "ごせん",
  6: "ろくせん",
  7: "ななせん",
  8: "はっせん",
  9: "きゅうせん",
};

function chunkToJapanese(n: number): string {
  const thousands = Math.floor(n / 1000);
  const hundreds = Math.floor((n % 1000) / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;
  let result = "";
  if (thousands) result += thousandsPrefixes[thousands];
  if (hundreds) result += hundredsPrefixes[hundreds];
  if (tens) result += tensPrefixes[tens];
  if (ones) result += digitReadings[ones];
  return result;
}

function numberToJapanese(n: number): string {
  if (n === 0) return "ぜろ";

  const units = ["", "まん", "おく", "ちょう", "けい"];
  const parts: string[] = [];
  let remaining = n;
  let unitIndex = 0;

  while (remaining > 0) {
    const chunk = remaining % 10000;
    if (chunk > 0) {
      const chunkText = chunkToJapanese(chunk);
      const suffix = units[unitIndex];
      parts.unshift(chunkText + suffix);
    }
    remaining = Math.floor(remaining / 10000);
    unitIndex += 1;
  }

  return parts.join("");
}

const numbers = [
  ...Array.from({ length: 1000 }, (_, i) => ({
    char: numberToJapanese(i),
    romaji: String(i),
    group: i < 10 ? "digit" : i < 100 ? "tens" : "hundreds",
  })),
  ...[
    1000,
    10000,
    12345,
    100000,
    123456,
    1000000,
    10000000,
    100000000,
    1000000000,
    12233445562,
  ].map((value) => ({
    char: numberToJapanese(value),
    romaji: String(value),
    group: "large",
  })),
];

const days = [
  { char: "日", romaji: "nichi", group: "day" },
  { char: "月", romaji: "getsu", group: "day" },
  { char: "火", romaji: "ka", group: "day" },
  { char: "水", romaji: "sui", group: "day" },
  { char: "木", romaji: "moku", group: "day" },
  { char: "金", romaji: "kin", group: "day" },
  { char: "土", romaji: "do", group: "day" },
];

const hiraganaSentences = [
  { text: "おはようございます", reading: "ohayou gozaimasu", meaning: "Good morning", missingIndices: [3], blanks: ["よ"] },
  { text: "こんにちは", reading: "konnichiwa", meaning: "Good afternoon", missingIndices: [2, 4], blanks: ["に", "ち"] },
  { text: "さようなら", reading: "sayounara", meaning: "Goodbye", missingIndices: [1], blanks: ["よ"] },
  { text: "ありがとうございます", reading: "arigatou gozaimasu", meaning: "Thank you very much", missingIndices: [3], blanks: ["と"] },
  { text: "すみません", reading: "sumimasen", meaning: "Excuse me / I'm sorry", missingIndices: [2, 3], blanks: ["み", "ま"] },
  { text: "たべもの", reading: "tabemono", meaning: "Food", missingIndices: [1, 3], blanks: ["べ", "も"] },
  { text: "のみもの", reading: "nomimono", meaning: "Drink / Beverage", missingIndices: [0, 2], blanks: ["の", "み"] },
  { text: "おかあさん", reading: "okaasan", meaning: "Mother", missingIndices: [2, 3], blanks: ["あ", "さ"] },
  { text: "おとうさん", reading: "otousan", meaning: "Father", missingIndices: [2], blanks: ["う"] },
  { text: "わたし", reading: "watashi", meaning: "I / Me", missingIndices: [1, 2], blanks: ["た", "し"] },
  { text: "くるま", reading: "kuruma", meaning: "Car", missingIndices: [0, 2], blanks: ["く", "ま"] },
  { text: "くるしい", reading: "kurushii", meaning: "Painful / Difficult", missingIndices: [2, 4], blanks: ["し", "し"] },
  { text: "なまえ", reading: "namae", meaning: "Name", missingIndices: [1, 3], blanks: ["ま", "え"] },
  { text: "みず", reading: "mizu", meaning: "Water", missingIndices: [1], blanks: ["ず"] },
  { text: "ほし", reading: "hoshi", meaning: "Star", missingIndices: [0, 1], blanks: ["ほ", "し"] },
  { text: "やま", reading: "yama", meaning: "Mountain", missingIndices: [1], blanks: ["ま"] },
  { text: "かわ", reading: "kawa", meaning: "River", missingIndices: [0, 2], blanks: ["か", "わ"] },
  { text: "きつね", reading: "kitsune", meaning: "Fox", missingIndices: [1, 3], blanks: ["つ", "ね"] },
  { text: "とり", reading: "tori", meaning: "Bird", missingIndices: [0], blanks: ["と"] },
  { text: "はな", reading: "hana", meaning: "Flower", missingIndices: [0, 1], blanks: ["は", "な"] },
];

const katakanaSentences = [
  { text: "サンキュー", reading: "sankyu", meaning: "Thank you (casual, from English)", missingIndices: [0, 2], blanks: ["サ", "キ"] },
  { text: "コンニチハ", reading: "konnichiha", meaning: "Hello (written formally in katakana)", missingIndices: [2], blanks: ["ニ"] },
  { text: "アイスクリーム", reading: "aisukuriimu", meaning: "Ice cream", missingIndices: [0, 5], blanks: ["ア", "ム"] },
  { text: "テレビ", reading: "terebi", meaning: "Television", missingIndices: [1], blanks: ["レ"] },
  { text: "カメラ", reading: "kamera", meaning: "Camera", missingIndices: [0, 2], blanks: ["カ", "ラ"] },
  { text: "ナイフ", reading: "naifu", meaning: "Knife", missingIndices: [0, 1], blanks: ["ナ", "イ"] },
  { text: "ニュース", reading: "nyuusu", meaning: "News", missingIndices: [3], blanks: ["ス"] },
  { text: "タクシー", reading: "takushii", meaning: "Taxi", missingIndices: [2], blanks: ["シ"] },
  { text: "ホテル", reading: "hoteru", meaning: "Hotel", missingIndices: [2, 3], blanks: ["テ", "ル"] },
  { text: "レストラン", reading: "resutoran", meaning: "Restaurant", missingIndices: [1, 3], blanks: ["ス", "ト"] },
  { text: "コーヒー", reading: "koohii", meaning: "Coffee", missingIndices: [0], blanks: ["コ"] },
  { text: "ジュース", reading: "juusu", meaning: "Juice", missingIndices: [3], blanks: ["ス"] },
  { text: "ケーキ", reading: "keeki", meaning: "Cake", missingIndices: [0], blanks: ["ケ"] },
  { text: "ソファー", reading: "sofaa", meaning: "Sofa", missingIndices: [0], blanks: ["ソ"] },
  { text: "ノート", reading: "nooto", meaning: "Notebook", missingIndices: [3], blanks: ["ト"] },
  { text: "マット", reading: "matto", meaning: "Mat", missingIndices: [0, 2], blanks: ["マ", "ト"] },
  { text: "ハサミ", reading: "hasami", meaning: "Scissors", missingIndices: [0, 2], blanks: ["ハ", "ミ"] },
  { text: "キセル", reading: "kiseru", meaning: "Pipe (smoking)", missingIndices: [0, 2], blanks: ["キ", "ル"] },
  { text: "オルガン", reading: "orugan", meaning: "Organ", missingIndices: [1, 3], blanks: ["ル", "カ"] },
  { text: "ワイン", reading: "wain", meaning: "Wine", missingIndices: [0, 2], blanks: ["ワ", "ン"] },
];

const numbersSentences = [
  { text: "いちご", reading: "ichigo", meaning: "Strawberry", missingIndices: [0], blanks: ["いち"] },
  { text: "ににん", reading: "ninin", meaning: "Two people", missingIndices: [0], blanks: ["に"] },
  { text: "ごほん", reading: "gohon", meaning: "Five long objects", missingIndices: [0], blanks: ["ご"] },
  { text: "よんほん", reading: "yonhon", meaning: "Four long objects", missingIndices: [0], blanks: ["よん"] },
  { text: "ななつ", reading: "nanatsu", meaning: "Seven items", missingIndices: [0], blanks: ["なな"] },
  { text: "はちにん", reading: "hachinin", meaning: "Eight people", missingIndices: [0], blanks: ["はち"] },
  { text: "きゅうこう", reading: "kyuukou", meaning: "Express train", missingIndices: [0], blanks: ["きゅう"] },
  { text: "ごじゅうえん", reading: "gojuu en", meaning: "Fifty yen", missingIndices: [0], blanks: ["ご"] },
  { text: "せんえん", reading: "sen en", meaning: "One thousand yen", missingIndices: [0], blanks: ["せん"] },
  { text: "ひゃくえん", reading: "hyaku en", meaning: "One hundred yen", missingIndices: [0], blanks: ["ひゃく"] },
];

const daysSentences = [
  { text: "げつようび", reading: "getsuyoubi", meaning: "Monday", missingIndices: [0], blanks: ["月"] },
  { text: "かようび", reading: "kayoubi", meaning: "Tuesday", missingIndices: [0], blanks: ["火"] },
  { text: "すいようび", reading: "suiyoubi", meaning: "Wednesday", missingIndices: [0], blanks: ["水"] },
  { text: "もくようび", reading: "mokuyoubi", meaning: "Thursday", missingIndices: [0], blanks: ["木"] },
  { text: "きんようび", reading: "kinyoubi", meaning: "Friday", missingIndices: [0], blanks: ["金"] },
  { text: "どようび", reading: "doyoubi", meaning: "Saturday", missingIndices: [0], blanks: ["土"] },
  { text: "にちようび", reading: "nichiyoubi", meaning: "Sunday", missingIndices: [0], blanks: ["日"] },
];

async function seed() {
  console.log("Seeding kana characters...");

  // Insert hiragana
  for (const k of hiragana) {
    await prisma.kanaCharacter.upsert({
      where: { char_kanaType: { char: k.char, kanaType: "hiragana" } },
      update: {},
      create: { ...k, kanaType: "hiragana" },
    });
  }

  // Insert katakana
  for (const k of katakana) {
    await prisma.kanaCharacter.upsert({
      where: { char_kanaType: { char: k.char, kanaType: "katakana" } },
      update: {},
      create: { ...k, kanaType: "katakana" },
    });
  }

  // Insert numbers into dedicated NumbersCharacter
  await prisma.numbersCharacter.deleteMany();
  await prisma.numbersCharacter.createMany({
    data: numbers,
    skipDuplicates: true,
  });

  // Insert days
  for (const k of days) {
    await prisma.kanaCharacter.upsert({
      where: { char_kanaType: { char: k.char, kanaType: "days" } },
      update: {},
      create: { ...k, kanaType: "days" },
    });
  }

  console.log(`Inserted ${hiragana.length} hiragana + ${katakana.length} katakana + ${numbers.length} numbers + ${days.length} days`);

  console.log("Seeding sentences...");

  // Clear and repopulate sentence samples so repeated seed runs stay consistent.
  await prisma.kanaSentence.deleteMany({
    where: { kanaType: { in: ["hiragana", "katakana", "days"] } },
  });
  await prisma.numbersSentence.deleteMany();

  // Insert hiragana sentences
  for (const s of hiraganaSentences) {
    await prisma.kanaSentence.create({
      data: {
        ...s,
        kanaType: "hiragana",
        missingIndices: JSON.stringify(s.missingIndices),
        blanks: JSON.stringify(s.blanks),
      },
    });
  }

  // Insert katakana sentences
  for (const s of katakanaSentences) {
    await prisma.kanaSentence.create({
      data: {
        ...s,
        kanaType: "katakana",
        missingIndices: JSON.stringify(s.missingIndices),
        blanks: JSON.stringify(s.blanks),
      },
    });
  }

  // Insert numbers sentences into dedicated NumbersSentence
  for (const s of numbersSentences) {
    await prisma.numbersSentence.create({
      data: {
        ...s,
        missingIndices: JSON.stringify(s.missingIndices),
        blanks: JSON.stringify(s.blanks),
      },
    });
  }

  // Insert days sentences
  for (const s of daysSentences) {
    await prisma.kanaSentence.create({
      data: {
        ...s,
        kanaType: "days",
        missingIndices: JSON.stringify(s.missingIndices),
        blanks: JSON.stringify(s.blanks),
      },
    });
  }

  console.log(`Inserted ${hiraganaSentences.length} hiragana sentences + ${katakanaSentences.length} katakana sentences + ${numbersSentences.length} numbers sentences + ${daysSentences.length} days sentences`);
  console.log("Done!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });