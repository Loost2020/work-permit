export type ForceId =
  | "hot"
  | "cold"
  | "cse"
  | "line"
  | "excavation"
  | "crane"
  | "hydrocarbon"
  | "h2s"
  | "height"
  | "simops";

export type ForceChoice = "on" | "off";
export type ForceMap = Partial<Record<ForceId, ForceChoice>>;

export interface JobInput {
  plant: string;
  location: string;
  work: string;
  tools: string;
  duration: string;
  forces: ForceMap;
}

export interface Flag {
  id: string;
  en: string;
  ar: string;
  on: boolean;
  why: string;
}

export interface PermitCard {
  code: "hot" | "cold" | "cse" | "line";
  form: string;
  titleEn: string;
  titleAr: string;
  required: boolean;
  reasons: string[];
}

export interface GasRow {
  id: string;
  label: string;
  on: boolean;
  limit: string;
}

export interface GasPlan {
  required: boolean;
  recommended: boolean;
  periodic: boolean;
  readings: "shift" | "break";
  frequency: string;
  rows: GasRow[];
  notes: string[];
}

export type CheckMark = "Y" | "N" | "NA" | "CONFIRM";

export interface CheckItem {
  id: string;
  en: string;
  suggest: CheckMark;
  why: string;
}

export interface Analysis {
  ready: boolean;
  headline: string;
  detail: string;
  permits: PermitCard[];
  isolationNote: string;
  hits: string[];
  suppressed: string[];
  sections: {
    A: Flag[];
    B: Flag[];
    C: Flag[];
    D: Flag[];
    E: Flag[];
    fire: Flag[];
    sewer: Flag;
    standby: Flag;
    fireWatch: Flag;
  };
  precautions: string[];
  gas: GasPlan;
  checklist: CheckItem[];
  warnings: string[];
}

export const EMPTY_JOB: JobInput = {
  plant: "",
  location: "",
  work: "",
  tools: "",
  duration: "",
  forces: {},
};

export const EXAMPLES: { id: string; title: string; hint: string; job: Omit<JobInput, "forces"> }[] = [
  {
    id: "pm-check",
    title: "PM check",
    hint: "Cold 9873-3",
    job: {
      plant: "CPF",
      location: "Air compressor area",
      work: "PM check on local transmitter",
      tools: "Instrument devices",
      duration: "07:00–15:00",
    },
  },
  {
    id: "weld",
    title: "Weld on a line",
    hint: "Hot 9873-2",
    job: {
      plant: "Gas plant",
      location: "Train 2, oil line",
      work: "Weld and torch cut an isolated oil line inside the process area",
      tools: "Welding machine, oxy-acetylene torch, fire extinguisher, spark barrier",
      duration: "07:00–15:00",
    },
  },
  {
    id: "paint",
    title: "Brush painting",
    hint: "Cold 9873-3",
    job: {
      plant: "Support workshop",
      location: "Structure outside the process area",
      work: "Brush paint a steel structure",
      tools: "Brush, paint, short ladder under 1.8 m",
      duration: "07:00–15:00",
    },
  },
  {
    id: "tank",
    title: "Tank entry",
    hint: "Green + cold",
    job: {
      plant: "Maintenance yard",
      location: "Tank T-12",
      work: "Confined space entry for internal inspection of the tank",
      tools: "Area-rated flashlight, gas detector, rescue harness",
      duration: "07:00–15:00",
    },
  },
  {
    id: "flange",
    title: "Open a gas line",
    hint: "Yellow + cold",
    job: {
      plant: "GOSP",
      location: "Gas manifold",
      work: "Open the flange on a gas line that contains H2S",
      tools: "Hand tools, blind, breathing apparatus, personal H2S monitor",
      duration: "07:00–15:00",
    },
  },
  {
    id: "scaffold",
    title: "Erect scaffold",
    hint: "Cold + height",
    job: {
      plant: "Stabilizer unit",
      location: "Beside exchanger E-201",
      work: "Erect scaffold beside the equipment",
      tools: "Scaffold tubes, hand tools, fall-protection harness",
      duration: "07:00–15:00",
    },
  },
  {
    id: "both",
    title: "Scaffold then weld",
    hint: "Hot and cold",
    job: {
      plant: "Process plant",
      location: "Unit 4 pipeline",
      work: "Erect scaffold then weld on a hydrocarbon line",
      tools: "Scaffold tubes, welding machine, oxy-acetylene torch",
      duration: "07:00–15:00",
    },
  },
  {
    id: "laptop",
    title: "Laptop in rack room",
    hint: "Hot 9873-2",
    job: {
      plant: "Q42 Manifa CPF",
      location: "CCB rack room",
      work: "To do configuration for CMS cabinet",
      tools: "Hand tools, Laptop",
      duration: "14:00–17:00",
    },
  },
  {
    id: "blind",
    title: "Swing blind",
    hint: "Yellow + cold",
    job: {
      plant: "Q-41 utility plant",
      location: "D-981 Raw Water Tank",
      work: "To do break the line / swing blind",
      tools: "Hand tools",
      duration: "08:45–16:00",
    },
  },
  {
    id: "pond",
    title: "Pond re-entry",
    hint: "Green + hot",
    job: {
      plant: "Manifa TSF",
      location: "New evaporation pond",
      work: "Re-entry into confined space",
      tools: "Hand tools",
      duration: "07:10–17:00",
    },
  },
  {
    id: "leak",
    title: "Water leak",
    hint: "Cold 9873-3",
    job: {
      plant: "Q41 utility plant",
      location: "2 inch utility water",
      work: "repair water leaks",
      tools: "Hand tools",
      duration: "08:30–16:00",
    },
  },
  {
    id: "removeScaffold",
    title: "Remove scaffold",
    hint: "Cold 9873-3",
    job: {
      plant: "Q41 utility plant",
      location: "PNB-06",
      work: "To remove scaffolding",
      tools: "Hand tools",
      duration: "09:00–16:00",
    },
  },
];

type Signal =
  | "welding"
  | "torch"
  | "oxyFuel"
  | "grind"
  | "blast"
  | "flame"
  | "engine"
  | "powerTool"
  | "unratedDevice"
  | "paint"
  | "spray"
  | "scaffold"
  | "handDig"
  | "asbestos"
  | "concrete"
  | "shoring"
  | "cse"
  | "line"
  | "excavation"
  | "machineDig"
  | "deep"
  | "crane"
  | "manbasket"
  | "hydrotest"
  | "radiation"
  | "h2s"
  | "chemical"
  | "hydrocarbon"
  | "processArea"
  | "pond"
  | "steam"
  | "electricalWork"
  | "mechanical"
  | "pneumatic"
  | "height"
  | "shortLadder"
  | "noise"
  | "pressure"
  | "maintenance"
  | "handTools"
  | "waterLeak";

const RULES: { signal: Signal; phrase: string; label: string }[] = [
  { signal: "powerTool", phrase: "drill", label: "drill" },
  { signal: "grind", phrase: "grind", label: "grind" },
  { signal: "handTools", phrase: "ادوات يدويه", label: "أدوات يدوية" },
  { signal: "cse", phrase: "دخول خزان", label: "دخول خزان" },
  { signal: "cse", phrase: "دخول وعاء", label: "دخول وعاء" },
  { signal: "cse", phrase: "tank entry", label: "tank entry" },
  { signal: "cse", phrase: "enter a tank", label: "enter a tank" },
  { signal: "cse", phrase: "enter a clean tank", label: "enter a clean tank" },
  { signal: "cse", phrase: "enter tank", label: "enter tank" },
  { signal: "handDig", phrase: "manual excavation", label: "manual excavation" },
  { signal: "unratedDevice", phrase: "phone", label: "phone" },
  { signal: "unratedDevice", phrase: "camera", label: "camera" },
  { signal: "welding", phrase: "لحام", label: "لحام" },
  { signal: "welding", phrase: "welding", label: "welding" },
  { signal: "welding", phrase: "weld", label: "weld" },
  { signal: "torch", phrase: "قص بالغاز", label: "قص بالغاز" },
  { signal: "torch", phrase: "قطع بالغاز", label: "قطع بالغاز" },
  { signal: "torch", phrase: "اوكسي", label: "أوكسي" },
  { signal: "torch", phrase: "اكسجين واستيلين", label: "أكسجين وأستيلين" },
  { signal: "torch", phrase: "acetylene", label: "acetylene" },
  { signal: "torch", phrase: "torch", label: "torch" },
  { signal: "torch", phrase: "oxy cut", label: "oxy-cut" },
  { signal: "oxyFuel", phrase: "اوكسي", label: "أسطوانات أوكسي" },
  { signal: "oxyFuel", phrase: "acetylene", label: "acetylene" },
  { signal: "oxyFuel", phrase: "استيلين", label: "أستيلين" },
  { signal: "grind", phrase: "جلخ", label: "جلخ" },
  { signal: "grind", phrase: "جلاخ", label: "جلاخة" },
  { signal: "grind", phrase: "صاروخ", label: "صاروخ جلخ" },
  { signal: "grind", phrase: "grinder", label: "grinder" },
  { signal: "grind", phrase: "grinding", label: "grinding" },
  { signal: "blast", phrase: "سفع", label: "سفع رملي" },
  { signal: "blast", phrase: "abrasive", label: "abrasive blasting" },
  { signal: "blast", phrase: "grit", label: "grit blast" },
  { signal: "blast", phrase: "sandblast", label: "sandblast" },
  { signal: "blast", phrase: "blast pot", label: "blast pot" },
  { signal: "flame", phrase: "شعله مكشوفه", label: "شعلة" },
  { signal: "flame", phrase: "لهب مفتوح", label: "لهب مفتوح" },
  { signal: "flame", phrase: "open flame", label: "open flame" },
  { signal: "flame", phrase: "مسدس حرار", label: "مسدس حرارة" },
  { signal: "engine", phrase: "مولد", label: "مولد" },
  { signal: "engine", phrase: "generator", label: "generator" },
  { signal: "engine", phrase: "ديزل", label: "محرك ديزل" },
  { signal: "engine", phrase: "forklift", label: "forklift" },
  { signal: "engine", phrase: "رافعه شوكيه", label: "رافعة شوكية" },
  { signal: "engine", phrase: "combustion", label: "combustion engine" },
  { signal: "engine", phrase: "كمبروسر ديزل", label: "كمبروسر ديزل" },
  { signal: "powerTool", phrase: "دريل", label: "دريل" },
  { signal: "powerTool", phrase: "مثقاب", label: "مثقاب" },
  { signal: "powerTool", phrase: "هيلتي", label: "هيلتي" },
  { signal: "powerTool", phrase: "hilti", label: "hilti" },
  { signal: "powerTool", phrase: "منشار كهرب", label: "منشار كهربائي" },
  { signal: "powerTool", phrase: "power tool", label: "power tool" },
  { signal: "powerTool", phrase: "electric drill", label: "electric drill" },
  { signal: "powerTool", phrase: "اداه كهرب", label: "أداة كهربائية" },
  { signal: "unratedDevice", phrase: "لابتوب", label: "لابتوب" },
  { signal: "unratedDevice", phrase: "laptop", label: "laptop" },
  { signal: "unratedDevice", phrase: "جوال", label: "جوال" },
  { signal: "unratedDevice", phrase: "موبايل", label: "جوال" },
  { signal: "unratedDevice", phrase: "كاميرا", label: "كاميرا" },
  { signal: "unratedDevice", phrase: "boroscope", label: "boroscope" },
  { signal: "unratedDevice", phrase: "بوروسكوب", label: "بوروسكوب" },
  { signal: "paint", phrase: "دهان", label: "دهان" },
  { signal: "paint", phrase: "طلاء", label: "طلاء" },
  { signal: "paint", phrase: "بويه", label: "بوية" },
  { signal: "paint", phrase: "paint", label: "paint" },
  { signal: "paint", phrase: "coating", label: "coating" },
  { signal: "spray", phrase: "دهان بالرش", label: "دهان بالرش" },
  { signal: "spray", phrase: "رش بويه", label: "رش بوية" },
  { signal: "spray", phrase: "spray paint", label: "spray paint" },
  { signal: "scaffold", phrase: "سقال", label: "سقالة" },
  { signal: "scaffold", phrase: "scaffold", label: "scaffold" },
  { signal: "scaffold", phrase: "scaffolding", label: "scaffolding" },
  { signal: "handDig", phrase: "حفر يدوي", label: "حفر يدوي" },
  { signal: "handDig", phrase: "excavating by hand", label: "hand excavation" },
  { signal: "asbestos", phrase: "اسبست", label: "أسبستوس" },
  { signal: "asbestos", phrase: "asbestos", label: "asbestos" },
  { signal: "concrete", phrase: "خرسانه", label: "خرسانة" },
  { signal: "concrete", phrase: "concrete", label: "concrete" },
  { signal: "concrete", phrase: "صب خرسان", label: "صب خرسانة" },
  { signal: "shoring", phrase: "تدعيم", label: "تدعيم" },
  { signal: "shoring", phrase: "shoring", label: "shoring" },
  { signal: "cse", phrase: "دخول الخزان", label: "دخول خزان" },
  { signal: "cse", phrase: "داخل الخزان", label: "داخل الخزان" },
  { signal: "cse", phrase: "دخول الوعاء", label: "دخول وعاء" },
  { signal: "cse", phrase: "داخل الوعاء", label: "داخل الوعاء" },
  { signal: "cse", phrase: "تفتيش داخلي", label: "تفتيش داخلي" },
  { signal: "cse", phrase: "internal inspection", label: "internal inspection" },
  { signal: "cse", phrase: "confined", label: "confined space" },
  { signal: "cse", phrase: "re-entry", label: "re-entry" },
  { signal: "cse", phrase: "reentry", label: "re-entry" },
  { signal: "cse", phrase: "اعاده دخول", label: "إعادة دخول" },
  { signal: "cse", phrase: "حيز محصور", label: "حيز محصور" },
  { signal: "cse", phrase: "مكان محصور", label: "مكان محصور" },
  { signal: "cse", phrase: "منهول", label: "منهول" },
  { signal: "cse", phrase: "manhole", label: "manhole" },
  { signal: "cse", phrase: "manway", label: "manway" },
  { signal: "line", phrase: "فك فلانجه", label: "فك فلانجة" },
  { signal: "line", phrase: "فلانجه", label: "فلانجة" },
  { signal: "line", phrase: "flange", label: "flange" },
  { signal: "line", phrase: "فتح خط", label: "فتح خط" },
  { signal: "line", phrase: "فك خط", label: "فك خط" },
  { signal: "line", phrase: "swing blind", label: "swing blind" },
  { signal: "line", phrase: "break the line", label: "break the line" },
  { signal: "line", phrase: "سوينق", label: "سوينق بليند" },
  { signal: "line", phrase: "بليند", label: "بليند" },
  { signal: "line", phrase: "فتح المعده", label: "فتح المعدة" },
  { signal: "line", phrase: "فتح معده", label: "فتح معدة" },
  { signal: "line", phrase: "equipment opening", label: "equipment opening" },
  { signal: "line", phrase: "تركيب بليند", label: "تركيب بليند" },
  { signal: "line", phrase: "سبول", label: "سبول" },
  { signal: "line", phrase: "spool", label: "spool" },
  { signal: "line", phrase: "استبدال صمام", label: "استبدال صمام" },
  { signal: "line", phrase: "ازاله صمام", label: "إزالة صمام" },
  { signal: "excavation", phrase: "حفر", label: "حفر" },
  { signal: "excavation", phrase: "excavation", label: "excavation" },
  { signal: "excavation", phrase: "trench", label: "trench" },
  { signal: "excavation", phrase: "خندق", label: "خندق" },
  { signal: "machineDig", phrase: "حفار", label: "حفار" },
  { signal: "machineDig", phrase: "باقر", label: "باقر" },
  { signal: "machineDig", phrase: "excavator", label: "excavator" },
  { signal: "machineDig", phrase: "backhoe", label: "backhoe" },
  { signal: "deep", phrase: "حفر عميق", label: "حفر عميق" },
  { signal: "deep", phrase: "اعمق من", label: "عمق يتجاوز حد المكان المحصور" },
  { signal: "crane", phrase: "كرين", label: "كرين" },
  { signal: "crane", phrase: "crane", label: "crane" },
  { signal: "crane", phrase: "ونش", label: "ونش" },
  { signal: "manbasket", phrase: "سله اشخاص", label: "سلة أشخاص" },
  { signal: "manbasket", phrase: "مان باسكت", label: "مان باسكت" },
  { signal: "manbasket", phrase: "manbasket", label: "manbasket" },
  { signal: "manbasket", phrase: "man basket", label: "man basket" },
  { signal: "hydrotest", phrase: "هيدروتست", label: "هيدروتست" },
  { signal: "hydrotest", phrase: "hydrotest", label: "hydrotest" },
  { signal: "hydrotest", phrase: "اختبار ضغط", label: "اختبار ضغط" },
  { signal: "hydrotest", phrase: "pressure test", label: "pressure test" },
  { signal: "radiation", phrase: "اشعه", label: "أشعة" },
  { signal: "radiation", phrase: "radiograph", label: "radiography" },
  { signal: "radiation", phrase: "gamma", label: "gamma" },
  { signal: "radiation", phrase: "x-ray", label: "x-ray" },
  { signal: "radiation", phrase: "مصدر مشع", label: "مصدر مشع" },
  { signal: "h2s", phrase: "h2s", label: "H2S" },
  { signal: "h2s", phrase: "كبريتيد", label: "كبريتيد الهيدروجين" },
  { signal: "h2s", phrase: "hydrogen sulfide", label: "hydrogen sulfide" },
  { signal: "chemical", phrase: "حمض", label: "حمض" },
  { signal: "chemical", phrase: "acid", label: "acid" },
  { signal: "chemical", phrase: "كاوي", label: "مادة كاوية" },
  { signal: "chemical", phrase: "caustic", label: "caustic" },
  { signal: "chemical", phrase: "مذيب", label: "مذيب" },
  { signal: "chemical", phrase: "solvent", label: "solvent" },
  { signal: "chemical", phrase: "كيميائ", label: "كيماويات" },
  { signal: "hydrocarbon", phrase: "هيدروكربون", label: "هيدروكربون" },
  { signal: "hydrocarbon", phrase: "نفط", label: "نفط" },
  { signal: "hydrocarbon", phrase: "زيت", label: "زيت" },
  { signal: "hydrocarbon", phrase: "خام", label: "خام" },
  { signal: "hydrocarbon", phrase: "crude", label: "crude" },
  { signal: "hydrocarbon", phrase: "naphtha", label: "naphtha" },
  { signal: "hydrocarbon", phrase: "خط غاز", label: "خط غاز" },
  { signal: "hydrocarbon", phrase: "غاز حامض", label: "غاز حامض" },
  { signal: "hydrocarbon", phrase: "gas line", label: "gas line" },
  { signal: "hydrocarbon", phrase: "oil", label: "oil" },
  { signal: "processArea", phrase: "معمل", label: "معمل" },
  { signal: "processArea", phrase: "محطه", label: "محطة" },
  { signal: "processArea", phrase: "gosp", label: "GOSP" },
  { signal: "processArea", phrase: "منطقه عمليات", label: "منطقة عمليات" },
  { signal: "processArea", phrase: "process", label: "process area" },
  { signal: "processArea", phrase: "plant", label: "plant" },
  { signal: "processArea", phrase: "cpf", label: "CPF" },
  { signal: "processArea", phrase: "tsf", label: "TSF" },
  { signal: "processArea", phrase: "evaporation", label: "evaporation pond" },
  { signal: "pond", phrase: "evaporation", label: "حوض تبخير" },
  { signal: "pond", phrase: "حوض تبخير", label: "حوض تبخير" },
  { signal: "processArea", phrase: "مزرعه خزانات", label: "مزرعة خزانات" },
  { signal: "processArea", phrase: "tank farm", label: "tank farm" },
  { signal: "steam", phrase: "بخار", label: "بخار" },
  { signal: "steam", phrase: "steam", label: "steam" },
  { signal: "electricalWork", phrase: "لوحه كهرب", label: "لوحة كهرباء" },
  { signal: "electricalWork", phrase: "قاطع", label: "قاطع" },
  { signal: "electricalWork", phrase: "كابل", label: "كابل" },
  { signal: "electricalWork", phrase: "switchgear", label: "switchgear" },
  { signal: "electricalWork", phrase: "mcc", label: "MCC" },
  { signal: "electricalWork", phrase: "عزل كهرب", label: "عزل كهربائي" },
  { signal: "electricalWork", phrase: "محرك", label: "محرك" },
  { signal: "mechanical", phrase: "مضخ", label: "مضخة" },
  { signal: "mechanical", phrase: "pump", label: "pump" },
  { signal: "mechanical", phrase: "صمام", label: "صمام" },
  { signal: "mechanical", phrase: "valve", label: "valve" },
  { signal: "mechanical", phrase: "كمبروسر", label: "كمبروسر" },
  { signal: "mechanical", phrase: "compressor", label: "compressor" },
  { signal: "mechanical", phrase: "دوار", label: "معدة دوارة" },
  { signal: "pneumatic", phrase: "هواء مضغوط", label: "هواء مضغوط" },
  { signal: "pneumatic", phrase: "pneumatic", label: "pneumatic" },
  { signal: "pneumatic", phrase: "هيدرول", label: "هيدروليك" },
  { signal: "pneumatic", phrase: "hydraulic", label: "hydraulic" },
  { signal: "height", phrase: "ارتفاع", label: "عمل على ارتفاع" },
  { signal: "height", phrase: "سطح", label: "سطح" },
  { signal: "height", phrase: "سلم", label: "سلم" },
  { signal: "height", phrase: "ladder", label: "ladder" },
  { signal: "height", phrase: "roof", label: "roof" },
  { signal: "shortLadder", phrase: "تحت 1.8", label: "سلم أقصر من 1.8 م" },
  { signal: "shortLadder", phrase: "short ladder", label: "short ladder" },
  { signal: "noise", phrase: "ضجيج", label: "ضجيج" },
  { signal: "pressure", phrase: "ضغط عالي", label: "ضغط عالٍ" },
  { signal: "pressure", phrase: "high pressure", label: "high pressure" },
  { signal: "maintenance", phrase: "صيانه", label: "صيانة" },
  { signal: "maintenance", phrase: "اصلاح", label: "إصلاح" },
  { signal: "maintenance", phrase: "repair", label: "repair" },
  { signal: "maintenance", phrase: "maintenance", label: "maintenance" },
  { signal: "maintenance", phrase: "pm", label: "PM check / preventive maintenance" },
  { signal: "maintenance", phrase: "p.m.", label: "PM check / preventive maintenance" },
  { signal: "maintenance", phrase: "routine inspection", label: "routine inspection" },
  { signal: "maintenance", phrase: "calibration", label: "instrument calibration" },
  { signal: "maintenance", phrase: "function test", label: "function test" },
  { signal: "maintenance", phrase: "فحص دوري", label: "فحص دوري" },
  { signal: "maintenance", phrase: "صيانه وقائيه", label: "صيانة وقائية" },
  { signal: "maintenance", phrase: "معايره", label: "معايرة أجهزة" },
  { signal: "handTools", phrase: "مفاتيح", label: "مفاتيح" },
  { signal: "handTools", phrase: "مفتاح", label: "مفتاح" },
  { signal: "handTools", phrase: "سبان", label: "سبانة" },
  { signal: "handTools", phrase: "فرشاه", label: "فرشاة" },
  { signal: "handTools", phrase: "brush", label: "brush" },
  { signal: "handTools", phrase: "spanner", label: "spanner" },
  { signal: "handTools", phrase: "wrench", label: "wrench" },
  { signal: "handTools", phrase: "hand tool", label: "hand tool" },
  { signal: "handTools", phrase: "hand tools", label: "hand tools" },
  { signal: "handTools", phrase: "عدد يدوي", label: "عدد يدوية" },
  { signal: "waterLeak", phrase: "water leak", label: "water leak" },
  { signal: "waterLeak", phrase: "تسريب ماء", label: "تسريب ماء" },
  { signal: "waterLeak", phrase: "تسرب ماء", label: "تسرب ماء" },
];

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/٫/g, ".")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasPhrase(text: string, phrase: string): boolean {
  const p = norm(phrase);
  if (!p) return false;
  if (/^[a-z0-9]+$/.test(p)) {
    return new RegExp(`(?:^|[^a-z0-9])${p}(?:[^a-z0-9]|$)`).test(text);
  }
  return text.includes(p);
}

function uniq(list: string[]): string[] {
  return [...new Set(list.filter(Boolean))];
}

function joinAr(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function flag(id: string, en: string, ar: string, on: boolean, why: string): Flag {
  return { id, en, ar, on, why: on ? why : "" };
}

function apply(auto: boolean, force?: ForceChoice): boolean {
  if (force === "on") return true;
  if (force === "off") return false;
  return auto;
}

const EMPTY_GAS: GasPlan = {
  required: false,
  recommended: false,
  periodic: false,
  readings: "shift",
  frequency: "",
  rows: [],
  notes: [],
};

export function analyze(input: JobInput): Analysis {
  const raw = norm(`${input.plant} ${input.location} ${input.work} ${input.tools}`);
  const text = raw
    .replace(/جهاز غاز|كاشف غاز|فاحص غاز|gas tester|gas test|gas detector|جهاز قياس/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const taskText = norm(`${input.work} ${input.tools}`);
  const hasWork = norm(input.work).length >= 3 || norm(input.tools).length >= 3;

  const found = new Map<Signal, string[]>();
  const hits: string[] = [];
  if (hasWork) {
    for (const rule of RULES) {
      // A location names where the job happens; it does not authorize working
      // on that location's rotating equipment, motor or electrical panel.
      const taskOnly = ["maintenance", "mechanical", "electricalWork"].includes(rule.signal);
      if (!hasPhrase(taskOnly ? taskText : text, rule.phrase)) continue;
      const list = found.get(rule.signal) ?? [];
      if (!list.includes(rule.label)) list.push(rule.label);
      found.set(rule.signal, list);
      if (!hits.includes(rule.label)) hits.push(rule.label);
    }
  }
  const on = (s: Signal) => found.has(s);

  const f = input.forces;
  const suppressed: string[] = [];

  const crane = apply(on("crane") || on("manbasket"), f.crane);
  if (f.crane === "off" && (on("crane") || on("manbasket"))) {
    suppressed.push("Crane lift was hidden manually even though the text names it.");
  }
  const atomicHot =
    on("welding") ||
    on("torch") ||
    on("grind") ||
    on("blast") ||
    on("flame") ||
    on("engine") ||
    on("powerTool") ||
    on("unratedDevice") ||
    on("machineDig") ||
    crane;
  let hot = apply(atomicHot, f.hot);
  if (f.hot === "off" && atomicHot) suppressed.push("Hot work was hidden manually even though an ignition source is named.");

  const coldActivity =
    on("paint") ||
    on("scaffold") ||
    on("handDig") ||
    on("asbestos") ||
    on("concrete") ||
    on("shoring") ||
    on("hydrotest");
  const deviceOnly = on("unratedDevice") && !on("welding") && !on("torch") && !on("grind") && !on("blast") && !on("flame") && !on("powerTool") && !on("engine") && !on("machineDig") && !crane;
  const independentHandWork = on("handTools") && !deviceOnly && !on("pond");
  const coldAuto = coldActivity || independentHandWork || (!atomicHot && on("maintenance"));
  let cold = apply(coldAuto, f.cold);
  if (f.cold === "off" && coldAuto) suppressed.push("Cold work was hidden manually.");

  const metricDimensions = [...text.matchAll(/(\d+(?:\.\d+)?)\s*(?:meters?|metres?|m\b|متر|م(?:\s|$))/g)].map((match) => ({
    value: Number(match[1]),
    before: text.slice(Math.max(0, (match.index ?? 0) - 35), match.index),
    after: text.slice((match.index ?? 0) + match[0].length, (match.index ?? 0) + match[0].length + 18),
  }));
  const digging = on("excavation") || on("machineDig") || on("handDig");
  const deepExcavation = digging && metricDimensions.some(({value, before, after}) => value > 1.2 && (/depth\s*(?:of)?\s*$|عمق\s*$/.test(before) || /^\s*deep\b/.test(after)));
  const cseAuto = on("cse") || deepExcavation || (on("deep") && digging);
  const cse = apply(cseAuto, f.cse);
  if (f.cse === "off" && cseAuto) suppressed.push("Confined space entry was hidden manually.");

  const line = apply(on("line"), f.line);
  if (f.line === "off" && on("line")) suppressed.push("Line break was hidden manually.");

  const excavation = apply(on("excavation") || on("machineDig") || on("handDig") || on("shoring") || on("pond"), f.excavation);
  const hydrocarbon = apply(on("hydrocarbon") || on("steam"), f.hydrocarbon);
  const h2s = apply(on("h2s"), f.h2s);
  const numericHeight = !digging && metricDimensions.some(({value, before, after}) => value > 1.8 && (/\b(?:at|above|height)\s*(?:of)?\s*$|ارتفاع\s*$|علي\s*$|فوق\s*$/.test(before) || /^\s*(?:high|above ground)\b/.test(after)));
  const heightAuto = numericHeight || (on("height") && !on("shortLadder")) || on("scaffold") || on("manbasket");
  const height = apply(heightAuto, f.height);
  const simops = apply(hasPhrase(text, "simops") || hasPhrase(text, "simultaneous operations") || hasPhrase(text, "عمليات متزامنه"), f.simops);
  const processArea = on("processArea") || hydrocarbon || on("pond");
  if (cse && (processArea || h2s || hydrocarbon) && f.hot !== "off") hot = true;
  if (hot && !coldActivity && !independentHandWork && f.cold !== "on") cold = false;
  if (!hot && (cse || line) && f.cold !== "off") cold = true;
  const scaffold = on("scaffold");
  const motorized =
    hasPhrase(taskText, "مضخ") ||
    hasPhrase(taskText, "pump") ||
    hasPhrase(taskText, "كمبروسر") ||
    hasPhrase(taskText, "compressor") ||
    hasPhrase(taskText, "محرك");
  const electricalWork = on("electricalWork") || motorized;
  const mechanical = on("mechanical");
  const pneumatic = on("pneumatic") || on("blast");
  const chemical = on("chemical") || on("asbestos") || on("spray");
  const radiation = on("radiation");
  const noise = on("noise") || on("grind") || on("blast") || on("welding") || on("engine") || crane || on("pneumatic");
  const pressure = on("pressure") || on("hydrotest") || on("steam") || line;
  const touchEquipment = line || mechanical || hydrocarbon || on("cse") || on("welding");

  const ready = hasWork && (hot || cold || cse || line);
  const names: string[] = [];
  if (hot) names.push("Hot Work Permit");
  if (cold) names.push("Cold Work Permit");
  if (cse) names.push("Confined Space Entry Permit");
  if (line) names.push("Equipment Opening / Line Break Permit");

  const hotReasons = hot
    ? uniq([
        "Form 9873-2 (red) is required when the work can ignite a flammable atmosphere.",
        on("welding") || on("torch") || on("flame") ? "Welding or torch cutting is an ignition source." : "",
        on("grind") || on("blast") ? "Grinding and abrasive blasting are hot work inside a restricted area." : "",
        on("powerTool") ? "A powered hand tool is a fire hazard inside a restricted area." : "",
        on("unratedDevice")
          ? "A laptop, phone, or camera that is not rated for the area is hot work, even with hand tools. Fire extinguisher and fire watch are required. Isolation is not, unless equipment is opened."
          : "",
        cse && !atomicHot ? "Entry into a space that may contain vapor or H2S is issued with a hot work permit, even for hand tools." : "",
        on("engine") || crane || on("machineDig") ? "An internal-combustion engine inside a restricted area is hot work." : "",
        "Issue it only after the joint site inspection.",
      ])
    : [];

  const coldReasons = cold
    ? uniq([
        "Form 9873-3 (blue) covers work that does not create enough ignition energy, but still has hazards.",
        on("scaffold") ? "Scaffold erection or removal is cold work." : "",
        on("paint") && !on("spray") ? "Brush painting is cold work." : "",
        on("spray") ? "Spray painting stays cold if there is no ignition source, with vapor controls." : "",
        on("handDig") || on("shoring") ? "Hand excavation and shoring are cold work." : "",
        on("asbestos") ? "Disturbing asbestos is cold work with its own controls." : "",
        on("concrete") ? "Concrete pour and formwork are cold work." : "",
        !hot && (cse || line) ? "With no ignition source, the blue permit is issued together with confined-space entry or line break." : "",
        !hot && (on("maintenance") || on("handTools")) && !cse && !line
          ? "Hand-tool maintenance that does not make sparks is covered by the cold work permit."
          : "",
        hot ? "This is a separate activity. The red permit does not cover cold work that is not in its scope." : "",
      ])
    : [];

  const cseReasons = cse
    ? uniq([
        "Form 9873-4 (green) is required when any part of the body enters a space with limited exit, not meant for occupancy, or a possible hazardous atmosphere.",
        "Examples: tank, vessel, manhole, sewer, valve box, and an excavation 1.2 m or deeper.",
        "Confined space entry is added to a hot or cold permit. One does not replace the other.",
        hot ? "This matches a pond re-entry: green form plus a hot work permit." : "With no ignition source outside a flammable atmosphere: green form plus the blue permit.",
      ])
    : [];

  const lineReasons = line
    ? uniq([
        "Form 9873-1 (yellow) is the first opening of equipment or a closed line that may hold flammable, toxic, or injurious liquid or gas.",
        "It covers oil, gas, steam, condensate, H2S, nitrogen, and hazardous chemicals.",
        "Do not open the first bolt until the line is isolated and depressurized per GI 6.012.",
        "Swing blind or line break uses the yellow form. With hand tools, also issue the blue permit. Isolation method is blinding.",
      ])
    : [];

  const permits: PermitCard[] = [
    { code: "hot", form: "9873-2", titleEn: "Hot Work Permit", titleAr: "عمل ساخن", required: hot, reasons: hotReasons },
    { code: "cold", form: "9873-3", titleEn: "Cold Work Permit", titleAr: "عمل بارد", required: cold, reasons: coldReasons },
    { code: "cse", form: "9873-4", titleEn: "Confined Space Entry", titleAr: "دخول محصور", required: cse, reasons: cseReasons },
    {
      code: "line",
      form: "9873-1",
      titleEn: "Equipment Opening / Line Break",
      titleAr: "فتح خط أو معدة",
      required: line,
      reasons: lineReasons,
    },
  ];

  const blinding = cse || line || (hot && hydrocarbon && touchEquipment);
  const disconnect = hasPhrase(text, "disconnect") || hasPhrase(text, "فصل فيزي");
  const doubleBlock = false;
  const singleBlock = on("waterLeak") && !line && !hot && !cse;
  const blockValve = false;
  const lockedSwitch = electricalWork;
  const mechanicalBlock = mechanical && !line;
  const anyIsolation = blinding || disconnect || doubleBlock || blockValve || lockedSwitch || mechanicalBlock;

  const sectionC: Flag[] = [
    flag("locked", "Locked switch/breaker", "قاطع أو مفتاح مقفول", lockedSwitch, "Electrical isolation is a locked breaker or disconnect, not the start button."),
    flag("mechanical", "Mechanical block", "حجب ميكانيكي", mechanicalBlock, "Rotating equipment is mechanically blocked so it cannot move."),
    flag("blockValve", "Block valve", "صمام بلوك", blockValve, "A single block is the minimum only for routine work with no flame and no toxic material."),
    flag("single", "Single block & bleed", "بلوك واحد مع تصريف", singleBlock, "A utility water leak uses single block and bleed, not a blind."),
    flag("dbb", "Double block & bleed", "دبل بلوك اند بليد", doubleBlock, "Not used alone to open a hazardous line for hot work or confined space entry."),
    flag(
      "blinding",
      "Blinding",
      "تعمية / بليند",
      blinding,
      "Blinding with a lock and a hold tag. A single block, or double block and bleed, is not enough to open a hazardous line for hot work or confined space entry.",
    ),
    flag("disconnect", "Disconnect", "فصل فيزيائي", disconnect, "Physical disconnect of pipe or cable, with a hold tag on the break."),
  ];

  const sectionB: Flag[] = [
    flag("hydrocarbon", "Hydrocarbon/gas/steam/chemicals", "هيدروكربون / غاز / بخار / كيميائيات", hydrocarbon || h2s || chemical, "The service itself is the chemical or hydrocarbon energy."),
    flag("mechanical", "Mechanical", "ميكانيكية", mechanical || on("grind"), "Mechanical movement, rotating equipment, or grinding."),
    flag("electrical", "Electrical", "كهربائية", electricalWork || on("powerTool") || on("welding"), "Electrical work, a power tool, or a welding machine."),
    flag("pneumatic", "Hydraulic/pneumatic", "هيدروليك / هواء", pneumatic, "Air or hydraulic energy."),
    flag("potential", "Potential energy (spring, gravity)", "طاقة كامنة (نابض / جاذبية)", height || crane || scaffold, "A raised load or work at height."),
    flag("extinguish", "Automated extinguishing systems", "أنظمة إطفاء آلية", false, ""),
    flag("energyOther", "Other", "أخرى", radiation, "Ionizing radiation."),
  ];

  const sparkHot = on("welding") || on("torch") || on("grind") || on("flame") || on("blast");
  const gasRequired =
    cse ||
    line ||
    excavation ||
    h2s ||
    (hot && (processArea || hydrocarbon || chemical || on("spray"))) ||
    on("spray") ||
    (cold && h2s);
  const gasRecommended = hot && !gasRequired;

  const sectionA: Flag[] = [
    flag("cseLog", "Confined space entry log", "سجل الدخول", cse, "The log is mandatory on the green form when the site uses it."),
    flag("csePlan", "CSE Plan", "خطة دخول المكان المحصور", cse, "Required on 9873-4: rescue, standby, and the entry supervisor."),
    flag("jsa", "Job Safety Analysis", "تحليل سلامة العمل", false, "Select only when required by the applicable site procedure or issuer; permit type alone does not establish a JSA requirement."),
    flag("gasRecords", "Gas test records", "سجلات فحص الغاز", gasRequired, "A certified tester and an approved instrument only."),
    flag(
      "isolationPlan",
      "Isolation plan",
      "خطة عزل",
      cse || line || blinding || lockedSwitch || mechanicalBlock,
      "Isolation points and method, per GI 6.012.",
    ),
    flag("blindList", "Blind list", "قائمة التعمية", blinding || cse, "Blind number, rating, location, and who installs and removes it."),
    flag("criticalLift", "Critical Lift Plan", "خطة الرفع الحرج", crane || on("manbasket"), "A lift near hydrocarbon, a personnel basket, or a large load."),
    flag("excavationList", "Excavation Checklist", "قائمة الحفر", excavation, "Locate underground services before digging."),
    flag("hydrotest", "Hydrotest procedure(s)", "إجراء اختبار الضغط", on("hydrotest"), "Pressure testing needs the approved procedure."),
    flag("isolationRisk", "Isolation Risk Assessment", "تقييم مخاطر العزل", false, "Mark it if the issuer asks for it on the yellow form."),
    flag("otherForm", "Other", "أخرى", false, ""),
  ];

  const sectionD: Flag[] = [
    flag("noise", "High noise level", "ضجيج عالٍ", noise, "Grinding, welding, a crane, or compressed air may exceed the hearing limit."),
    flag(
      "h2s",
      "Hydrogen Sulfide (H2S)",
      "كبريتيد الهيدروجين",
      h2s || on("pond") || (line && hydrocarbon),
      "The service or the pond may release H2S. The personal monitor is separate from this exposure box.",
    ),
    flag("flammable", "Flammable liquids/gases", "سوائل أو غازات لهوبة", hydrocarbon || on("spray"), "Flammable material or paint vapor. Being inside a plant does not check this box by itself."),
    flag("toxic", "Hazardous/toxic materials", "مواد خطرة أو سامة", chemical || h2s || on("asbestos"), "Toxic, corrosive, or asbestos material."),
    flag("radiation", "Radioactive materials", "مواد مشعة", radiation, "Radiography or a radioactive source."),
    flag("temperature", "Temperature", "حرارة أو برودة", on("welding") || on("steam") || on("torch") || on("flame"), "A hot surface, steam, or flame."),
    flag("highPressure", "High pressure", "ضغط عالٍ", pressure, "A line or pressure test that still holds energy."),
    flag(
      "exposureOther",
      scaffold ? "Other: falling objects" : excavation ? "Other: excavation atmosphere" : cse ? "Other: confined-space atmosphere" : "Other",
      "أخرى",
      excavation || cse || scaffold,
      "The other exposure named by this job.",
    ),
  ];

  const sectionE: Flag[] = [
    flag("h2sMonitor", "Personal H2S monitor", "جهاز H2S شخصي", h2s || processArea || hydrocarbon || cse, "Worn in a process area even when the H2S reading is zero."),
    flag("frc", "FRC", "ملابس مقاومة للهب", hot || hydrocarbon || processArea || cse, "Restricted-area clothing on the field examples."),
    flag("arc", "ARC rated PPE", "PPE مقاوم للقوس الكهربائي", on("electricalWork"), "Switchgear and breaker work needs arc-rated PPE."),
    flag("goggles", "Goggles/face shield", "نظارة أو واقي وجه", on("welding") || on("grind") || on("blast") || on("torch") || chemical, "Sparks, chemicals, or pressure."),
    flag("chemicalSuit", "Chemical suit/coveralls", "بدلة كيماوية", on("asbestos") || on("chemical") || on("spray"), "Skin contact with the product or asbestos fiber."),
    flag("fall", "Fall protection", "حماية من السقوط", height, "Above 1.8 m (6 ft): harness, or an approved scaffold."),
    flag(
      "barricades",
      "Barricades/warning signs",
      "حواجز ولوحات تحذير",
      cse || line || excavation || crane || scaffold || radiation || on("blast") || sparkHot,
      "Keep people who have no work here out of the area.",
    ),
    flag(
      "respiratory",
      "Respiratory protection",
      "حماية تنفس",
      on("welding") || on("blast") || on("asbestos") || on("spray") || h2s || (line && (hydrocarbon || chemical)),
      "SCBA or SABA when the atmosphere requires it. Goggles and gloves do not protect against H2S.",
    ),
  ];

  const sectionFire: Flag[] = [
    flag("extinguisher", "Fire extinguisher", "طفاية حريق", hot, "An extinguisher within reach of the fire watch."),
    flag("monitor", "Fire monitor/hose", "مدفع أو خرطوم حريق", sparkHot && (hydrocarbon || processArea || line), "Welding, cutting, or grinding near flammable material needs water, not only an extinguisher."),
    flag("wetted", "Area wetted", "تبليل المنطقة", sparkHot && (hydrocarbon || line), "Wet around the weld if flammable residue remains."),
    flag("barriers", "Fire barriers/shields", "حواجز شرر", sparkHot, "A barrier so sparks cannot reach sewers or combustibles."),
  ];

  const sewer = flag(
    "sewer",
    "Cover/water-seal sewers within 23 m (75 ft)",
    "تغطية البيارات خلال 23 م",
    sparkHot && (processArea || hydrocarbon || line),
    "During welding, cutting, or grinding, cover or water-seal sewers within 23 m. Laptop work inside a room does not check this box.",
  );
  const standby = flag(
    "standby",
    "Standby man needed",
    "رجل احتياط",
    cse || line || h2s || (excavation && on("deep")),
    cse ? "A standby man at the opening, and a rescue plan before entry." : "A standby man for a line break or an H2S atmosphere.",
  );
  const fireWatch = flag("fireWatch", "Fire watch needed", "مراقب حريق", hot, "A trained fire watch stays during the hot work and for the time the permit requires after it.");

  const gasRows: GasRow[] = [
    { id: "lel", label: "LEL %", on: gasRequired, limit: hot ? "Hot work is not allowed above 0% LEL." : "Record LEL and verify the site-approved atmospheric limits before work. A gas reading does not authorize hot work." },
    { id: "h2s", label: "H2S ppm", on: gasRequired && (h2s || hydrocarbon || cse || line || processArea), limit: "Respiratory protection from 10 to 100 ppm. Above that, stop and follow the emergency plan." },
    { id: "o2", label: "O2 %", on: gasRequired, limit: "Respiratory protection if oxygen is below 20.0%. Only a certified tester records the number." },
    { id: "co", label: "CO ppm", on: gasRequired && (on("welding") || on("engine") || on("blast") || cse || crane), limit: "Record CO and compare it with the current GI 2.709 limit on site." },
    { id: "others", label: "Others", on: gasRequired && (chemical || on("spray")), limit: "Solvent or product vapor listed on the safety data sheet." },
  ];

  const frequencyBits = uniq([
    cse ? (line ? "Initial entry test with mechanical ventilation off. Prepare the separate entry monitoring plan on the green permit." : "Initial test before entry with mechanical ventilation off, then every 2 hours while anyone is inside.") : "",
    sparkHot && gasRequired && !line ? "Before issue, when conditions change, and periodically during welding or cutting. Hot work starts only at 0% LEL." : "",
    hot && !sparkHot && gasRequired ? "Initial test before issue. Unrated-device work does not need periodic monitoring if the atmosphere stays stable." : "",
    line ? "One test before the break and one after. Periodic monitoring is No." : "",
    excavation && !cse && !line ? "Before anyone enters the excavation, and again if the smell or the soil changes." : "",
  ]);

  const gas: GasPlan = {
    required: gasRequired,
    recommended: gasRecommended,
    periodic: Boolean(gasRequired && !line && (cse || (sparkHot && hot) || excavation)),
    readings: line ? "break" : "shift",
    frequency: gasRequired
      ? frequencyBits.join(" ")
      : gasRecommended
        ? "Recommended because the work is hot. Required if flammable vapor is suspected."
        : "Not required from this description. The issuer adds it if the joint inspection finds a suspect atmosphere.",
    rows: gasRows,
    notes: uniq([
      "Only a certified gas tester writes the numbers and signs. These cells stay blank on this draft.",
      gasRequired && hot ? "Hot work limit: LEL = 0%." : "",
      cse ? "The initial entry test is done with mechanical ventilation off." : "",
      line ? "The yellow form records Before break and After break." : "",
    ]),
  };

  const precautions = uniq([
    hot ? "Fire watch with an extinguisher ready. Keep sparks off sewers." : "",
    sewer.on ? "Cover or water-seal every sewer within 23 m (75 ft) of the hot work." : "",
    gasRequired && hot ? "Do not start hot work before a certified gas test reads 0% LEL." : "",
    blinding ? "Isolate by blinding, with lock and a Do Not Operate tag. A single block is not enough to open a hazardous line. Double block and bleed is not enough for hot work or confined space entry." : "",
    singleBlock ? "Single block and bleed, as used for a utility water leak. Not for a hazardous opening." : "",
    anyIsolation ? "Every worker applies a personal lock. Operations locks first and unlocks last. Try the start after the area is clear." : "",
    cse ? "Green permit, standby man, and a rescue plan. No entry until the atmosphere is declared acceptable." : "",
    line ? "Depressure and drain before the first bolt is broken. Stay out of the line of release." : "",
    h2s || on("pond") ? "Personal H2S monitor. Move upwind and uphill on alarm. SCBA or SABA if the reading requires it." : "",
    height ? "Fall protection above 1.8 m (6 ft)." : "",
    scaffold && !/remov|dismantl|تفكيك|فك/.test(text) ? "Signed scaffold tag with a valid inspection date before anyone climbs." : "",
    noise ? "Provide task-appropriate hearing protection for the identified high-noise exposure." : "",
    scaffold ? "Check planks, base plates, and gaps. Stop scaffold work above the approved site wind limit." : "",
    crane ? "Certified operator and rigger. Stop the lift above the approved site wind limit for the crane or personnel basket." : "",
    on("manbasket") ? "A personnel basket needs its own authorized basket permit. It is not a normal crane move." : "",
    on("oxyFuel") ? "Keep the fuel-gas cylinder 6.1 m (20 ft) from oxygen, or separate them with a 1.5 m noncombustible barrier." : "",
    on("welding") ? "Ventilation for welding fume, and the correct face shield." : "",
    on("asbestos") ? "Do not remove asbestos dry without the approved respirator and wetting." : "",
    on("blast") ? "CE supplied-air hood, barricades, and bonding to control static. Abrasive blasting is hot work." : "",
    radiation ? "Barricade, warning lights, and an exclusion zone per the radiation permit." : "",
    excavation ? "Locate underground services before digging. An excavation deeper than 1.2 m is a confined space." : "",
    on("unratedDevice") ? "An unrated phone, camera, or laptop enters a classified area only on a hot work permit." : "",
    "Issuer and receiver inspect the site together before signing. The receiver stays on site or hands the permit to another certified receiver accepted by the issuer.",
    "An emergency cancels every open permit and stops the work.",
  ]);

  const dismantle =
    hasPhrase(text, "remove scaffold") ||
    hasPhrase(text, "remove scaffolding") ||
    hasPhrase(text, "dismantl") ||
    ((hasPhrase(text, "فك") || hasPhrase(text, "ازال")) && hasPhrase(text, "سقال") && !hasPhrase(text, "تركيب"));
  const contactHazard = on("welding") || on("grind") || on("torch") || on("flame") || mechanical || electricalWork || on("steam");
  const flammableRelease = hydrocarbon || on("spray") || (line && hydrocarbon);
  const exposureControlled = noise || h2s || hydrocarbon || on("asbestos") || chemical || radiation || on("pond") || processArea;
  const needsSticker = crane || (scaffold && !dismantle) || on("powerTool") || on("blast") || on("engine") || on("welding");

  const supplementaryRequired = sectionA.some((form) => form.on);
  const checklist: CheckItem[] = [
    { id: "q1", en: "Is the correct type of permit(s) issued for the work?", suggest: ready ? "Y" : "NA", why: ready ? `Yes. Required: ${joinAr(names)}.` : "The description does not name a permit." },
    { id: "q2", en: "Have the JSA and other applicable supplementary forms been communicated to the work crew?", suggest: supplementaryRequired ? "Y" : "NA", why: supplementaryRequired ? "Applicable supplementary forms are selected; brief the crew on those forms." : "N/A. No supplementary forms selected for this job." },
    {
      id: "q3",
      en: "Are weather conditions (e.g., wind speed, rain, fog, heat, lightning) acceptable to perform the work?",
      suggest: ready ? "Y" : "NA",
      why: crane
        ? "Yes, provided the lift is inside the site wind limit. Common review figures: crane 32 km/h, man basket 25 km/h."
        : scaffold
          ? "Yes, provided scaffold work is inside the site wind limit. A common review figure is 65 km/h."
          : "Yes. Rain, wind, fog, heat, and lightning are acceptable for this job unless the joint inspection finds otherwise.",
    },
    { id: "q4", en: "Are slip and trip hazards controlled?", suggest: ready ? "Y" : "NA", why: "Yes. Hoses, cables, and spills are kept off the walkway before work starts." },
    { id: "q5", en: "Does the work crew have the correct tools/equipment for the job? Are they in good condition?", suggest: input.tools.trim() ? "Y" : "NA", why: input.tools.trim() ? `Yes. Tools for this job: ${input.tools.trim()}.` : "No tools were listed." },
    {
      id: "q6",
      en: "Do personnel have the proper certifications to perform the activity and/or operate the equipment?",
      suggest: ready ? "Y" : "NA",
      why: uniq(["Yes.", "Issuer and receiver hold a valid work permit certificate.", gasRequired ? "Certified gas tester." : "", hot ? "Fire watch." : "", on("welding") ? "Qualified welder." : "", crane ? "Crane operator and rigger per GI 7.025." : "", scaffold ? "Qualified scaffold crew." : "", on("blast") ? "Certified blaster." : "", cse ? "Confined space entry supervisor and standby." : ""]).join(" "),
    },
    { id: "q7", en: "Is the equipment's inspection sticker valid?", suggest: needsSticker ? "Y" : "NA", why: needsSticker ? "Yes. The crane, scaffold, power tool, or machine on this job needs a current inspection sticker." : "N/A. This job does not use equipment that carries an inspection sticker." },
    { id: "q8", en: "Have all requirements for working at heights (i.e., fall protection) been applied?", suggest: height ? "Y" : "NA", why: height ? "Yes. Fall protection is required above 1.8 m and is part of this job." : "N/A. The work is not above 1.8 m." },
    {
      id: "q9",
      en: "Is the scaffold tag completed correctly, signed, and with a valid inspection date?",
      suggest: scaffold && !dismantle ? "Y" : "NA",
      why: scaffold && !dismantle ? "Yes. No one climbs until the scaffold tag is signed and in date." : dismantle && scaffold ? "N/A. The scaffold is being removed, so the tag is not used for access. Fall protection still applies." : "N/A. No scaffold in this job.",
    },
    { id: "q10", en: "Has the potential for contact with sharp objects, rotating equipment, hot/cold surfaces, or live electricity been eliminated?", suggest: contactHazard ? "Y" : "NA", why: contactHazard ? "Yes. Isolation, guarding, or the correct gloves address the contact hazard for this job." : "N/A. No rotating, hot, or live electrical contact in this description." },
    { id: "q11", en: "Is the system/equipment properly isolated and locked out? Did all workers apply their personal locks?", suggest: anyIsolation ? "Y" : "NA", why: anyIsolation ? "Yes. The isolation method checked in Section 2 is in place, with personal locks, before work starts." : "N/A. This job does not open or lock out plant equipment." },
    { id: "q12", en: "Has the system/equipment been depressurized, drained, and/or purged before opening it?", suggest: line ? "Y" : "NA", why: line ? "Yes. Depressure and drain before the first opening." : "N/A. Nothing is being opened." },
    { id: "q13", en: "Has the potential for releasing flammable liquids and gases been controlled?", suggest: flammableRelease ? "Y" : "NA", why: flammableRelease ? "Yes. Isolation, draining, and the gas test control the release." : "N/A. No flammable liquid or gas release in this job." },
    { id: "q14", en: "Are all ignition sources eliminated or controlled?", suggest: hot ? "Y" : "NA", why: hot ? "Yes. The ignition source is the work itself and is controlled by the fire watch, gas test, and barriers." : "N/A. This cold work does not introduce an ignition source." },
    { id: "q15", en: "Does the fire watch have firefighting equipment readily available and know how to use the equipment?", suggest: hot ? "Y" : "NA", why: hot ? "Yes. The fire watch and extinguisher are part of this hot work." : "N/A. No hot work, so no fire watch." },
    { id: "q16", en: "Has the potential for exposure to high noise levels, H2S, hydrocarbons, asbestos, hazardous chemicals, or radioactive materials been controlled?", suggest: exposureControlled ? "Y" : "NA", why: exposureControlled ? "Yes. The PPE and gas test checked for this job control that exposure." : "N/A. Those exposures are not part of this job." },
    { id: "q17", en: "Is the correct personal protective equipment (PPE) available for use by personnel?", suggest: ready ? "Y" : "NA", why: "Yes. The protective equipment checked in Section 2 is the PPE for this job." },
    { id: "q18", en: "If the work may impact others nearby, or vice versa, have the work crews discussed their activities with each other (i.e., simultaneous operations (SIMOPS))?", suggest: simops ? "Y" : "NA", why: simops ? "Yes. Simultaneous operations were identified and the crews are to brief each other." : "N/A. No other crew is identified on this job." },
    { id: "q19", en: "Is there an emergency contingency plan in place to respond to the work being performed?", suggest: ready ? "Y" : "NA", why: "Yes. Stop work, evacuate, and call the site emergency number." },
    { id: "q20", en: "Does the work crew know what to do in the event of an emergency, such as evacuation routes, location of emergency equipment, and where assembly areas are located?", suggest: ready ? "Y" : "NA", why: "Yes. The receiver briefs the crew on the route, the extinguisher, and the assembly point before the first move." },
  ];

  const isolationNote = anyIsolation
    ? blinding
      ? "Isolation: blinding with lock and hold tag. Do not rely on a single block, or on double block and bleed, when the opening is for hot work or confined space entry."
      : "Isolation is marked in Section 2. Lock, tag, and try-start are part of GI 6.012. They are not a separate permit."
    : singleBlock
      ? "Isolation: single block and bleed for this utility water leak. Not a line-break permit."
      : "";

  const headline = !hasWork ? "Enter the work and the tools." : ready ? `This job needs ${joinAr(names)}.` : "This description does not name a permit type.";
  const detail = ready
    ? "Checked boxes and checklist answers follow the work and the tools. An N on the checklist is a stop until the issuer and receiver control that hazard."
    : "Name the action: weld, brush paint, tank entry, swing blind, scaffold, excavate, crane lift, laptop.";

  const warnings = uniq([
    "Preparation draft only. It is not an issued permit. Gas tests, locks, and signatures are completed on the official form after the joint site inspection.",
    "One permit, one task, one location. Do not widen the scope by a verbal instruction.",
    "The usual duration is one shift. An extension does not pass two consecutive shifts or 24 hours except under the long-extension rules.",
    ...suppressed,
  ]);

  return {
    ready,
    headline,
    detail,
    permits,
    isolationNote,
    hits,
    suppressed,
    sections: { A: sectionA, B: sectionB, C: sectionC, D: sectionD, E: sectionE, fire: sectionFire, sewer, standby, fireWatch },
    precautions,
    gas: hasWork ? gas : EMPTY_GAS,
    checklist,
    warnings,
  };
}
