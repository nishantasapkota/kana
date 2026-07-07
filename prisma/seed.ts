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

  console.log(`Inserted ${hiragana.length} hiragana + ${katakana.length} katakana`);

  console.log("Seeding sentences...");

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

  console.log(`Inserted ${hiraganaSentences.length} hiragana sentences + ${katakanaSentences.length} katakana sentences`);
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