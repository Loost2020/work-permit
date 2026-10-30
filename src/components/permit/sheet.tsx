import {isValidElement, type ReactElement, type ReactNode} from "react";
import {effectiveGas} from "@/lib/permit/review";
import {englishDraft} from "@/lib/permit/language";
import type { Analysis, CheckItem, Flag, JobInput } from "@/lib/permit/analyze";

type Mark = "Y" | "N" | "NA";
type Kind = "hot" | "cold" | "cse" | "line";

interface SheetProps {
  job: JobInput;
  result: Analysis;
  kind: Kind;
  flags: Record<string, boolean | undefined>;
  checks: Record<string, Mark | undefined>;
  onFlag: (key: string, on: boolean) => void;
  onCheck: (id: string, mark: Mark) => void;
  onJob: (partial: Partial<JobInput>) => void;
  note: string;
  onNote: (value:string) => void;
}

const FORMS: Record<Kind, { form: string; title: string; tint: string; ink: string; band: string }> = {
  hot: { form: "9873-2", title: "HOT WORK PERMIT", tint: "bg-sheet-hot", ink: "text-hot", band: "bg-hot" },
  cold: { form: "9873-3", title: "COLD WORK PERMIT", tint: "bg-sheet-cold", ink: "text-cold", band: "bg-cold" },
  cse: { form: "9873-4", title: "CONFINED SPACE ENTRY PERMIT", tint: "bg-sheet-cse", ink: "text-cse", band: "bg-cse" },
  line: { form: "9873-1", title: "EQUIPMENT OPENING / LINE BREAK PERMIT", tint: "bg-sheet-line", ink: "text-line", band: "bg-line" },
};

const SECTION_A: Record<Kind, string[]> = {
  hot: ["jsa", "gasRecords", "isolationPlan", "blindList", "criticalLift", "excavationList", "hydrotest", "otherForm"],
  cold: ["jsa", "gasRecords", "isolationPlan", "blindList", "criticalLift", "excavationList", "hydrotest", "otherForm"],
  cse: ["cseLog", "csePlan", "jsa", "gasRecords", "isolationPlan", "blindList", "criticalLift", "excavationList", "hydrotest", "otherForm"],
  line: ["jsa", "gasRecords", "isolationPlan", "blindList", "criticalLift", "excavationList", "hydrotest", "isolationRisk", "otherForm"],
};

function valueOf(flag: Flag, flags: Record<string, boolean | undefined>, group: string) {
  const key = `${group}:${flag.id}`;
  return flags[key] ?? flag.on;
}

function markOf(item: CheckItem, checks: Record<string, Mark | undefined>, answered: boolean): Mark | null {
  const chosen = checks[item.id];
  if (chosen) return chosen;
  if (!answered) return null;
  if (item.suggest === "NA") return "NA";
  if (item.suggest === "N") return "N";
  return "Y";
}

export function openStops(result: Analysis, checks: Record<string, Mark | undefined>) {
  if (!result.ready) return 0;
  return result.checklist.filter((item) => markOf(item, checks, true) === "N").length;
}

export function PermitSheet({ job, result, kind, flags, checks, onFlag, onCheck, onJob, note, onNote }: SheetProps) {
  const meta = FORMS[kind];
  const stops = openStops(result, checks);
  const showFire = kind === "hot" || kind === "line";
  const isolation = result.sections.C.filter((item) =>
    kind === "cse" ? ["locked", "mechanical", "blinding", "disconnect"].includes(item.id) : true,
  );
  const supplements = SECTION_A[kind]
    .map((id) => result.sections.A.find((item) => item.id === id))
    .filter((item): item is Flag => Boolean(item));
  const gasNames = result.gas.readings === "break" ? ["Before break", "After break"] : ["Initial", "Renewed"];
  const gasRows = result.gas.rows.length
    ? result.gas.rows
    : [
        { id: "lel", label: "LEL %", on: false, limit: "" },
        { id: "h2s", label: "H2S ppm", on: false, limit: "" },
        { id: "o2", label: "O2 %", on: false, limit: "" },
        { id: "co", label: "CO ppm", on: false, limit: "" },
      ];
  const companions = result.permits.filter((permit) => permit.required && permit.code !== kind);
  const gas = effectiveGas(result,flags);
  const gasRequired = gas.required;
  const gasPeriodic = gas.periodic;
  const notes = result.ready ? result.precautions : [];

  return (
    <article dir="ltr" className={`print-sheet border-2 border-ink text-ink shadow-xl ${meta.tint}`}>
      <div className={`h-1.5 ${meta.band}`} />
      <header className="flex items-start justify-between gap-3 border-b-2 border-ink px-3 py-2">
        <div>
          <p className="font-latin text-micro font-bold tracking-[0.18em] text-ink">SAUDI ARAMCO</p>
          <p className="font-latin text-micro text-ink">Work Permit System · DRAFT — NOT VALID FOR WORK</p>
        </div>
        <div className="text-end">
          <p className="font-latin text-micro font-bold text-ink">SA {meta.form}</p>
          <h2 className={`font-latin text-permit font-bold ${meta.ink}`}>{meta.title}</h2>
        </div>
      </header>

      <div className="grid grid-cols-2 border-b border-ink sm:grid-cols-4">
        <Meta label="Work permit no." value="Issuer assigns" />
        <Meta label="Date" value="Joint inspection" />
        <Meta label="Org. code" value={job.plant.trim() ? "See Section 1" : "—"} />
        <Meta label="Duration" value={job.duration.trim() || "One shift"} />
      </div>

      {result.ready ? (
        <p className="border-b border-ink px-3 py-1.5 font-latin text-form font-semibold text-ink">{result.headline}</p>
      ) : (
        <p className="border-b border-ink px-3 py-1.5 font-latin text-form text-ink">
          Type the work and the tools in Section 1. The boxes and the checklist fill in from that.
        </p>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
        <div className="contents lg:block lg:border-e-2 lg:border-ink">
          <div className="order-1">
            <Block title="1. WORK DESCRIPTION">
              <Field label="A. Identify plant / facility area">
                <input className="ink-line font-latin text-form" value={job.plant} onChange={(event) => onJob({ plant: event.target.value })} placeholder="Plant or facility" />
              </Field>
              <Field label="Duration, from – to">
                <input className="ink-line font-latin text-form" value={job.duration} onChange={(event) => onJob({ duration: event.target.value })} placeholder="07:00–15:00" />
              </Field>
              <Field label="B. Specify exact work location">
                <input className="ink-line font-latin text-form" value={job.location} onChange={(event) => onJob({ location: event.target.value })} placeholder="Unit, equipment, line number" />
              </Field>
              <Field label="C. Describe the work to be done">
                <textarea className="ink-line min-h-16 resize-y font-latin text-form" value={job.work} onChange={(event) => onJob({ work: event.target.value })} placeholder="Work to be done" />
              </Field>
              <Field label="D. Equipment to be used at the site">
                <textarea className="ink-line min-h-14 resize-y font-latin text-form" value={job.tools} onChange={(event) => onJob({ tools: event.target.value })} placeholder="Tools and equipment" />
              </Field>
            </Block>

            <Block title="2. HAZARD IDENTIFICATION AND CONTROL">
              <Group title="A. Supplementary forms required">
                {supplements.map((item) => (
                  <Box key={item.id} on={valueOf(item, flags, "A")} label={item.en} reason={item.id === "jsa" ? "Select JSA only when required by the applicable site procedure or issuer. It is not automatic for every permit." : item.why} onClick={() => onFlag(`A:${item.id}`, !valueOf(item, flags, "A"))} />
                ))}
              </Group>
              <p className="mt-1 font-latin text-micro text-muted">JSA: select when required by the applicable site procedure or issuer.</p>
              {companions.length > 0 ? (
                <p className="mt-1 font-latin text-micro text-ink">Prepare with: {companions.map((item) => `${item.titleEn} ${item.form}`).join("; ")}</p>
              ) : null}
              <Group title="B. Energy types">
                {result.sections.B.map((item) => (
                  <Box key={item.id} on={valueOf(item, flags, "B")} label={item.en} reason={item.id === "jsa" ? "Select JSA only when required by the applicable site procedure or issuer. It is not automatic for every permit." : item.why} onClick={() => onFlag(`B:${item.id}`, !valueOf(item, flags, "B"))} />
                ))}
              </Group>
              <Group title="C. Isolation method(s)">
                {kind === "cse" ? <p className="mb-1 font-latin text-micro text-ink">Positive isolation (blind or disconnect) for every pipe into the space.</p> : null}
                {isolation.map((item) => (
                  <Box key={item.id} on={valueOf(item, flags, "C")} label={item.en} reason={item.id === "jsa" ? "Select JSA only when required by the applicable site procedure or issuer. It is not automatic for every permit." : item.why} onClick={() => onFlag(`C:${item.id}`, !valueOf(item, flags, "C"))} />
                ))}
              </Group>
              <Group title="D. Potential exposures">
                {result.sections.D.map((item) => (
                  <Box key={item.id} on={valueOf(item, flags, "D")} label={item.en} reason={item.id === "jsa" ? "Select JSA only when required by the applicable site procedure or issuer. It is not automatic for every permit." : item.why} onClick={() => onFlag(`D:${item.id}`, !valueOf(item, flags, "D"))} />
                ))}
              </Group>
              <Group title="E. Protective equipment">
                {result.sections.E.map((item) => (
                  <Box key={item.id} on={valueOf(item, flags, "E")} label={item.en} reason={item.id === "jsa" ? "Select JSA only when required by the applicable site procedure or issuer. It is not automatic for every permit." : item.why} onClick={() => onFlag(`E:${item.id}`, !valueOf(item, flags, "E"))} />
                ))}
              </Group>
              {showFire ? (
                <Group title="F. Fire protection methods">
                  {result.sections.fire.map((item) => (
                    <Box key={item.id} on={valueOf(item, flags, "F")} label={item.en} reason={item.id === "jsa" ? "Select JSA only when required by the applicable site procedure or issuer. It is not automatic for every permit." : item.why} onClick={() => onFlag(`F:${item.id}`, !valueOf(item, flags, "F"))} />
                  ))}
                  {kind === "hot" ? (
                    <Box
                      on={valueOf(result.sections.sewer, flags, "G")}
                      label={result.sections.sewer.en}
                      onClick={() => onFlag(`G:${result.sections.sewer.id}`, !valueOf(result.sections.sewer, flags, "G"))}
                    />
                  ) : null}
                </Group>
              ) : null}
              <div className="mt-2 flex flex-wrap">
                <Box
                  on={valueOf(result.sections.standby, flags, "H")}
                  label={kind === "cse" ? "Confined space entry standby man" : result.sections.standby.en}
                  onClick={() => onFlag(`H:${result.sections.standby.id}`, !valueOf(result.sections.standby, flags, "H"))}
                />
                {kind === "hot" ? (
                  <Box
                    on={valueOf(result.sections.fireWatch, flags, "H")}
                    label={result.sections.fireWatch.en}
                    onClick={() => onFlag(`H:${result.sections.fireWatch.id}`, !valueOf(result.sections.fireWatch, flags, "H"))}
                  />
                ) : null}
              </div>
              <p className="mt-3 font-latin text-form font-bold text-ink">Additional safety precautions</p>
              <div className="mt-1 border border-ink">
                {Array.from({ length: Math.max(4, notes.length) }, (_, index) => (
                  <p key={index} className="min-h-7 border-b border-ink px-2 py-1 font-latin text-micro leading-4 text-ink last:border-b-0">
                    {notes[index] ?? ""}
                  </p>
                ))}
              </div>
              <label className="mt-2 block text-micro font-bold">Site-specific precautions
                <textarea aria-label="Site-specific precautions" className="ink-line mt-1 min-h-14 resize-y font-normal" value={note} onChange={e=>onNote(e.target.value)} placeholder="Issuer / receiver: record additional precautions for this site." />
              </label>
              <p className="mt-2 font-latin text-micro font-bold text-ink">IN AN EMERGENCY: stop work, evacuate, and call the site emergency number.</p>
            </Block>
          </div>

          <div className="order-3 lg:hidden">
            <Checklist result={result} checks={checks} stops={stops} onCheck={onCheck} />
          </div>

          <div className="order-4">
            <Block title="3. GAS TESTING / MONITORING">
              <div className="mb-2 flex flex-wrap gap-x-4">
                <Box on={gasRequired} label="Gas testing required" onClick={() => onFlag("gas:required", !gasRequired)} />
                <Box on={!gasRequired && result.ready} label="Not required" onClick={() => onFlag("gas:required", false)} />
                <Box on={gasPeriodic} label="Periodic monitoring: Yes" onClick={() => onFlag("gas:periodic", true)} />
                <Box on={result.ready && !gasPeriodic} label="Periodic monitoring: No" onClick={() => onFlag("gas:periodic", false)} />
              </div>
              {gasRequired && gas.frequency ? <p className="mb-2 font-latin text-micro leading-4 text-ink">{gas.frequency}</p> : null}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] border-collapse border border-ink font-latin text-micro">
                  <thead>
                    <tr>
                      <th className="border border-ink px-1 py-1 text-start">Test</th>
                      {gasRows.map((row) => (
                        <th key={row.id} className="border border-ink px-1 py-1">
                          {row.label}
                        </th>
                      ))}
                      <th className="border border-ink px-1 py-1">Badge</th>
                      <th className="border border-ink px-1 py-1">Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gasNames.map((name) => (
                      <tr key={name}>
                        <th scope="row" className="border border-ink px-1 py-3 text-start font-semibold">{name}</th>
                        {gasRows.map((row) => (
                          <td key={row.id} className="border border-ink px-1 py-3 text-center text-muted">
                            {""}
                          </td>
                        ))}
                        <td className="border border-ink" />
                        <td className="border border-ink" />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-1 font-latin text-micro font-bold text-ink">ONLY A CERTIFIED GAS TESTER WRITES THE NUMBERS AND SIGNS.</p>
              <ul className="mt-1">
                {gasRows
                  .filter((row) => row.on && row.limit)
                  .map((row) => (
                    <li key={row.id} className="font-latin text-micro leading-4 text-ink">
                      {row.label}: {row.limit}
                    </li>
                  ))}
              </ul>
            </Block>

            <Block title="4. PERMIT AUTHORIZATION AND CLOSURE">
              <p className="mb-2 font-latin text-micro text-ink">Signatures stay blank. Issuer and receiver sign the official form after the joint site inspection.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {["Receiver", "Issuer", "Countersignature", "Close-out"].map((role) => (
                  <div key={role} className="border border-ink px-2 py-2">
                    <p className="font-latin text-micro font-bold">{role}</p>
                    <p className="mt-2 font-latin text-micro text-muted">Name / badge</p>
                    <p className="mt-3 border-b border-ink" />
                    <p className="mt-2 font-latin text-micro text-muted">Signature / time</p>
                    <p className="mt-3 border-b border-ink" />
                  </div>
                ))}
              </div>
            </Block>
          </div>
        </div>

        <aside className="order-2 hidden border-ink lg:block">
          <Checklist result={result} checks={checks} stops={stops} onCheck={onCheck} />
        </aside>
      </div>
    </article>
  );
}

function Checklist({
  result,
  checks,
  stops,
  onCheck,
}: {
  result: Analysis;
  checks: Record<string, Mark | undefined>;
  stops: number;
  onCheck: (id: string, mark: Mark) => void;
}) {
  return (
    <section className="border-b border-ink px-2 py-2 lg:border-b-0">
      <h3 className="font-latin text-form font-bold tracking-wide text-ink">HAZARD ANALYSIS CHECKLIST</h3>
      <p className="mt-1 font-latin text-micro leading-4 text-ink">
        Any “N” answer below shall initiate a STOP point. The issuer and receiver then list the extra precautions on this permit.
        {stops ? ` ${stops} item${stops === 1 ? "" : "s"} marked N.` : result.ready ? " Answers follow the work and the tools." : ""}
      </p>
      <div className="mt-2 grid grid-cols-[1fr_5.5rem] border-y border-ink font-latin text-micro font-bold">
        <span className="px-1 py-1">Question</span>
        <span className="grid grid-cols-3 border-s border-ink text-center">
          <span className="py-1">Y</span>
          <span className="border-s border-ink py-1">N</span>
          <span className="border-s border-ink py-1">N/A</span>
        </span>
      </div>
      <ol>
        {result.checklist.map((item, index) => {
          const mark = markOf(item, checks, result.ready);
          return (
            <li key={item.id} className="grid grid-cols-[1fr_5.5rem] border-b border-ink">
              <p className="px-1 py-2 font-latin text-micro leading-4 text-ink">
                {index + 1}. {item.en}
              </p>
              <div className="grid grid-cols-3 border-s border-ink">
                {(["Y", "N", "NA"] as Mark[]).map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={mark === choice}
                    aria-label={`${index + 1} ${choice === "NA" ? "N/A" : choice}`}
                    onClick={() => onCheck(item.id, choice)}
                    className={`grid min-h-11 place-items-center border-e border-ink last:border-e-0 ${choice === "N" && mark === "N" ? "bg-hot/15" : ""}`}
                  >
                    <Square on={mark === choice} />
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-ink px-3 py-2">
      <h3 className="mb-2 font-latin text-form font-bold tracking-wide text-ink">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  const value = isValidElement(children) ? (children as ReactElement<{value?:string}>).props.value || '' : '';
  const arabic=/[\u0600-\u06ff]/.test(value);
  const english=englishDraft(value);
  return <label className="mb-2 grid gap-0.5">
    <span className="font-latin text-micro font-semibold text-ink">{label}</span>
    <span className="no-print">{children}</span>
    {arabic&&<span className="no-print english-draft"><strong>English draft:</strong> {english.text||'English wording required.'}{english.needsReview&&<span className="block font-semibold text-hot">Review English wording — some words were not recognized.</span>}</span>}
    <span className="print-text hidden min-h-6 whitespace-pre-wrap border-b border-ink pb-1 text-form">{english.text}{english.needsReview?' [English wording requires review]':''}</span>
  </label>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <p className="border-e border-ink px-2 py-1.5 font-latin text-micro last:border-e-0">
      <span className="block font-bold text-ink">{label}</span>
      <span className="text-muted">{value}</span>
    </p>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-2">
      <p className="mb-1 font-latin text-micro font-bold text-ink">{title}</p>
      <div className="flex flex-wrap">{children}</div>
    </div>
  );
}

function Square({ on }: { on: boolean }) {
  return (
    <span className={`grid size-3.5 place-items-center border border-ink font-latin text-micro leading-none ${on ? "bg-ink text-paper" : "bg-paper-2"}`}>
      {on ? "✓" : ""}
    </span>
  );
}

function Box({ on, label, reason, onClick }: { on: boolean; label: string; reason?:string; onClick: () => void }) {
  return (
    <button type="button" title={reason || (on ? "Selected manually for this job" : "Not selected from this description")} onClick={onClick} aria-pressed={on} className="me-2 mb-1 inline-flex min-h-11 items-center gap-1.5 text-start">
      <Square on={on} />
      <span className="font-latin text-micro leading-4 text-ink">{label}</span>
    </button>
  );
}
