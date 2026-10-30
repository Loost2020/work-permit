import assert from "node:assert/strict";
import test from "node:test";
import { analyze, type JobInput } from "./analyze.ts";

function job(partial: Partial<JobInput>): JobInput {
  return {
    plant: "",
    location: "",
    work: "",
    tools: "",
    duration: "",
    forces: {},
    ...partial,
  };
}

function required(input: JobInput) {
  return analyze(input)
    .permits.filter((p) => p.required)
    .map((p) => p.code)
    .sort();
}

test("welding an oil line is hot work with blinding and gas test", () => {
  const result = analyze(
    job({
      plant: "معمل الغاز",
      location: "ترين ٢",
      work: "لحام وقطع على خط زيت معزول داخل منطقة العمليات",
      tools: "ماكينة لحام، قص أوكسي، طفاية",
    }),
  );
  assert.deepEqual(
    required(
      job({
        plant: "معمل الغاز",
        work: "لحام وقطع على خط زيت معزول داخل منطقة العمليات",
        tools: "ماكينة لحام، قص أوكسي، طفاية",
      }),
    ),
    ["hot"],
  );
  assert.equal(result.sections.fireWatch.on, true);
  assert.equal(result.sections.sewer.on, true);
  assert.equal(result.gas.required, true);
  assert.equal(result.sections.C.find((f) => f.id === "blinding")?.on, true);
  assert.equal(result.sections.C.find((f) => f.id === "single")?.on, false);
  assert.equal(result.sections.C.find((f) => f.id === "dbb")?.on, false);
});

test("brush painting is cold only", () => {
  const result = analyze(job({ work: "دهان هيكل بالفرشاة", tools: "فرشاة، بوية، سلم قصير تحت 1.8 م" }));
  assert.deepEqual(required(job({ work: "دهان هيكل بالفرشاة", tools: "فرشاة وبوية" })), ["cold"]);
  assert.equal(result.sections.fireWatch.on, false);
  assert.equal(result.gas.required, false);
  assert.equal(result.sections.E.find((f) => f.id === "fall")?.on, false);
});

test("tank entry is confined space plus cold work", () => {
  const codes = required(job({ work: "دخول الخزان للتفتيش الداخلي", tools: "كشاف مناسب، جهاز غاز، حزام إنقاذ" }));
  assert.deepEqual(codes, ["cold", "cse"]);
  const result = analyze(job({ work: "دخول الخزان للتفتيش الداخلي", tools: "حزام إنقاذ" }));
  assert.equal(result.gas.required, true);
  assert.equal(result.gas.periodic, true);
  assert.equal(result.sections.standby.on, true);
  assert.equal(result.sections.fireWatch.on, false);
});

test("opening an H2S gas flange is a yellow permit, not single-block isolation", () => {
  const result = analyze(job({ work: "فك فلانجة خط غاز يحتوي H2S", tools: "مفاتيح يدوية، بليند" }));
  assert.deepEqual(required(job({ work: "فك فلانجة خط غاز يحتوي H2S", tools: "مفاتيح يدوية" })), ["cold", "line"]);
  assert.equal(result.sections.C.find((f) => f.id === "blinding")?.on, true);
  assert.equal(result.sections.C.find((f) => f.id === "single")?.on, false);
  assert.equal(result.sections.D.find((f) => f.id === "h2s")?.on, true);
  assert.equal(result.sections.E.find((f) => f.id === "respiratory")?.on, true);
});

test("scaffold is cold work at height", () => {
  const result = analyze(job({ work: "تركيب وتفكيك سقالة بجانب المعدة", tools: "أنابيب سقالة، مفاتيح يدوية، حزام" }));
  assert.deepEqual(required(job({ work: "تركيب سقالة", tools: "أنابيب سقالة ومفاتيح" })), ["cold"]);
  assert.equal(result.sections.E.find((f) => f.id === "fall")?.on, true);
  assert.equal(result.checklist.find((c) => c.id === "q9")?.suggest, "Y");
  assert.equal(result.checklist.find((c) => c.id === "q15")?.suggest, "NA");
});

test("scaffold plus welding needs both permits", () => {
  assert.deepEqual(
    required(job({ work: "تركيب سقالة ثم لحام على خط هيدروكربون", tools: "أنابيب سقالة، ماكينة لحام" })),
    ["cold", "hot"],
  );
});

test("crane inside a plant is hot work", () => {
  const result = analyze(job({ plant: "معمل", work: "رفع معدة بالكرين", tools: "كرين وأسلاك رفع" }));
  assert.equal(result.permits.find((p) => p.code === "hot")?.required, true);
  assert.equal(result.sections.A.find((f) => f.id === "criticalLift")?.on, true);
});

test("laptop configuration in a plant rack room is hot work only", () => {
  const result = analyze(
    job({
      plant: "Q42 Manifa CPF",
      location: "CCB rack room",
      work: "To do configuration for CMS cabinet",
      tools: "Hand tools, Laptop",
    }),
  );
  assert.deepEqual(
    required(job({ plant: "Q42 Manifa CPF", work: "To do configuration for CMS cabinet", tools: "Hand tools, Laptop" })),
    ["hot"],
  );
  assert.equal(result.sections.fireWatch.on, true);
  assert.equal(result.sections.sewer.on, false);
  assert.equal(result.sections.C.every((item) => !item.on), true);
  assert.equal(result.gas.required, true);
  assert.equal(result.gas.periodic, false);
  assert.equal(result.sections.E.find((item) => item.id === "frc")?.on, true);
  assert.equal(result.sections.E.find((item) => item.id === "h2sMonitor")?.on, true);
});

test("swing blind on a water line is yellow plus cold, with blinding", () => {
  const result = analyze(
    job({
      plant: "Q-41 utility plant",
      location: "D-981 Raw Water Tank",
      work: "To do break the line / swing blind",
      tools: "Hand tools",
    }),
  );
  assert.deepEqual(
    required(job({ plant: "Q-41 utility plant", work: "To do break the line / swing blind", tools: "Hand tools" })),
    ["cold", "line"],
  );
  assert.equal(result.sections.C.find((item) => item.id === "blinding")?.on, true);
  assert.equal(result.sections.C.find((item) => item.id === "single")?.on, false);
  assert.equal(result.sections.fireWatch.on, false);
  assert.equal(result.gas.readings, "break");
  assert.equal(result.gas.periodic, false);
});

test("re-entry to an evaporation pond is confined space plus hot work", () => {
  const result = analyze(
    job({
      plant: "Manifa TSF",
      location: "New evaporation pond",
      work: "Re-entry into confined space",
      tools: "Hand tools",
    }),
  );
  assert.deepEqual(
    required(
      job({
        plant: "Manifa TSF",
        location: "New evaporation pond",
        work: "Re-entry into confined space",
        tools: "Hand tools",
      }),
    ),
    ["cse", "hot"],
  );
  assert.equal(result.sections.A.find((item) => item.id === "csePlan")?.on, true);
  assert.equal(result.sections.standby.on, true);
  assert.equal(result.gas.periodic, true);
  assert.equal(result.sections.D.find((item) => item.id === "h2s")?.on, true);
});

test("removing scaffolding is cold work at height", () => {
  const result = analyze(
    job({
      plant: "Q41 utility plant",
      location: "PNB-06",
      work: "To remove scaffolding",
      tools: "Hand tools",
    }),
  );
  assert.deepEqual(required(job({ work: "To remove scaffolding", tools: "Hand tools" })), ["cold"]);
  assert.equal(result.sections.E.find((item) => item.id === "fall")?.on, true);
  assert.equal(result.sections.B.find((item) => item.id === "potential")?.on, true);
  assert.equal(result.sections.fireWatch.on, false);
});

test("repairing a utility water leak is cold work with single block and bleed", () => {
  const result = analyze(
    job({
      plant: "Q41 utility plant",
      location: "2 inch utility water",
      work: "repair water leaks",
      tools: "Hand tools",
    }),
  );
  assert.deepEqual(required(job({ work: "repair water leaks", tools: "Hand tools" })), ["cold"]);
  assert.equal(result.sections.C.find((item) => item.id === "single")?.on, true);
  assert.equal(result.sections.C.find((item) => item.id === "blinding")?.on, false);
  assert.equal(result.permits.find((permit) => permit.code === "line")?.required, false);
});
