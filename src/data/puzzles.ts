/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Puzzle {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  hint: string;
  category: "Riddle" | "Math" | "Logical" | "IQ" | "General";
  explanation: string;
  image?: string;
}

export const INITIAL_PUZZLES: Puzzle[] = [
  { id: 1, question: "কুকুরকে আমরা 'ঘেউ ঘেউ' বলি, বিড়ালকে কী বলি?", options: ["ম্যাঁও ম্যাঁও", "হাম্বা", "কুহু", "হুক্কাহুয়া"], answerIndex: 0, hint: "এটি বিড়ালের ডাক", category: "General", explanation: "বিড়ালের ডাককে সাধারণত 'ম্যাঁও ম্যাঁও' বলা হয়।" },
  { id: 2, question: "মুখে নেই ভাষা, কিন্তু সারাদিন কথা বলে। সেটি কী?", options: ["বই", "পাখি", "কলম", "রেডিও"], answerIndex: 0, hint: "জ্ঞান অর্জনের প্রধান উৎস", category: "Riddle", explanation: "বইয়ের ভেতরে অনেক কথা লেখা থাকে যা আমরা পড়লে বুঝতে পারি, কিন্তু বই নিজে কথা বলতে পারে না।" },
  { id: 3, question: "কোন জিনিসটি কাটলে আলাদা না হয়ে আরও বড় হয়?", options: ["গর্ত", "নদী", "গাছ", "পাহাড়"], answerIndex: 0, hint: "মাটির নিচে তৈরি হয়", category: "Logical", explanation: "গর্ত থেকে মাটি সরালে বা কাটলে সেটি আরও বড় হয়।" },
  { id: 4, question: "কোন ফল আমরা পাকার আগে রান্না করে খাই আর পাকলে এমনি খাই?", options: ["কলা", "পেঁপে", "আম", "কাঁঠাল"], answerIndex: 1, hint: "সবজি হিসেবেও জনপ্রিয়", category: "General", explanation: "কাঁচা পেঁপে সবজি হিসেবে রান্না করে খাওয়া হয় এবং পাকলে ফল হিসেবে খাওয়া হয়।" },
  { id: 5, question: "২ + ২ x ২ = কত?", options: ["৪", "৬", "৮", "১০"], answerIndex: 1, hint: "বদমাস (BODMAS) নিয়ম অনুসরণ করুন", category: "Math", explanation: "BODMAS নিয়ম অনুযায়ী আগে গুণের কাজ করতে হয় (২ x ২ = ৪), তারপর যোগ (২ + ৪ = ৬)।" },
  { id: 6, question: "এমন কোন জিনিস যা ধুলে ময়লা হয়?", options: ["পানি", "কাপড়", "হাত", "প্লেট"], answerIndex: 0, hint: "সব কিছু পরিষ্কার করে কিন্তু নিজে...", category: "Riddle", explanation: "পানি অন্য কিছু পরিষ্কার করতে গিয়ে নিজে ঘোলা বা ময়লা হয়ে যায়।" },
  { id: 7, question: "কোন মাস সব থেকে ছোট হয়?", options: ["ফেব্রুয়ারি", "মে", "জুন", "আগস্ট"], answerIndex: 0, hint: "দিন সংখ্যায় কম", category: "General", explanation: "ফেব্রুয়ারি মাস সাধারণত ২৮ দিনে হয় (অধিবর্ষে ২৯), যা অন্যান্য মাসের চেয়ে কম।" },
  { id: 8, question: "এক হাত গাছ তার ফল ধরে না। কী সেটি?", options: ["লাঠি", "কলম", "দাড়ি", "ছাতা"], answerIndex: 3, hint: "বৃষ্টিতে কাজে লাগে", category: "Logical", explanation: "ছাতা লম্বায় প্রায় এক হাত হয় এবং এটি গাছে ধরে না।" },
  { id: 9, question: "কোন প্রাণীর পাঁচটি চোখ আছে?", options: ["মৌমাছি", "মাকড়সা", "পিঁপড়া", "মাছি"], answerIndex: 0, hint: "মধু সংগ্রহ করে", category: "IQ", explanation: "মৌমাছির মাথার ওপরে তিনটি ছোট চোখ এবং দুই পাশে দুটি বড় চোখ থাকে।" },
  { id: 10, question: "সাদা পিঠ তার, কালো বুক, কথা বলে কিন্তু নেই মুখ। সেটি কী?", options: ["বই", "খাতা", "মোবাইল", "পিয়ানো"], answerIndex: 0, hint: "পড়াশোনার সাথী", category: "Riddle", explanation: "বইয়ের সাদা পাতায় কালো অক্ষরে অনেক তথ্য থাকে যা মুখ ছাড়াই আমাদের অনেক কিছু শেখায়।" },
  { id: 11, question: "কোন জিনিস ভাঙলে ব্যবহার করা যায়?", options: ["কাঁচ", "ডিম", "পাথর", "কাঠ"], answerIndex: 1, hint: "এটি সকালে আমরা খাই।", category: "Riddle", explanation: "ডিম ভেঙে রান্না করলে তবেই তা খাওয়া সম্ভব হয়।" },
  { id: 12, question: "এক কেজি তুলা আর এক কেজি লোহা, কোনটা বেশি ভারী?", options: ["তুলা", "লোহা", "দুইটাই সমান", "কোনোটিই নয়"], answerIndex: 2, hint: "দুইটারই ওজন এক কেজি।", category: "Logical", explanation: "যেহেতু দুটিরই ওজন ১ কেজি, তাই দুটিই সমান ভারী।" },
  { id: 13, question: "৩ জন মানুষের ৩টি আপেল খেতে ৩ মিনিট লাগে। তবে ১০০ জন মানুষের ১০০টি আপেল খেতে কত সময় লাগবে?", options: ["৩ মিনিট", "১০০ মিনিট", "৩০ মিনিট", "১ মিনিট"], answerIndex: 0, hint: "প্রত্যেক মানুষ ১টি করে আপেল খাচ্ছে।", category: "Math", explanation: "প্রত্যেক ব্যক্তি যদি একই সাথে খেতে শুরু করে, তবে প্রত্যেকে ৩ মিনিটেই আপেলটি শেষ করবে।" }
];

export function getPuzzleByLevel(level: number): Puzzle {
  // Cycle through initial puzzles and maybe procedurally modify them for "50,000 levels"
  const basePuzzle = INITIAL_PUZZLES[(level - 1) % INITIAL_PUZZLES.length];
  
  // For levels beyond initial ones, we could add complexity or variations 
  // For now, mirroring correctly for long retention
  return {
    ...basePuzzle,
    id: level
  };
}
