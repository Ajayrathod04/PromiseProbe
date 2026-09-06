/**
 * PromiseProbe
 *
 * Tests whether a workflow actually keeps the promises it makes
 * across baseline, changed, and boundary inputs.
 *
 * @rote-frontmatter
 * ---
 * name: promise-probe
 * version: 0.1.0
 * description: Probes whether a workflow keeps declared promises across baseline, changed, and boundary observations.
 * source: https://github.com/wemakedevs/rote
 * provenance:
 *   author: Hackathon team
 * metadata:
 *   rote_version: 0.78.0
 *   version: 0.1.0
 *   status: released
 *   kind: atomic
 *   flow_type: sequential
 *   execution_model: steps_with_presentation
 *   format: typescript
 *   requires_endpoints: []
 *   requires_sessions: false
 *   discoverability:
 *     tags:
 *     - verification
 *     - testing
 *     - workflow
 *     - resilience
 *     - contracts
 *   contract:
 *     atomic: true
 *     input:
 *       type: file
 *     output:
 *       format: json
 *       destination: stdout
 *     composable: true
 * steps:
 *   promise_definition:
 *     type: process.exec
 *     argv:
 *     - cat
 *     - '@resource{fixtures/promise.md}'
 *   baseline_observation:
 *     type: process.exec
 *     argv:
 *     - cat
 *     - '@resource{fixtures/baseline-input.json}'
 *   changed_observation:
 *     type: process.exec
 *     argv:
 *     - cat
 *     - '@resource{fixtures/changed-input.json}'
 *   boundary_observation:
 *     type: process.exec
 *     argv:
 *     - cat
 *     - '@resource{fixtures/boundary-input.json}'
 * presentation_fixtures:
 *   promise_definition: resources/presentation-fixtures/promise_definition/fixture.yaml
 *   baseline_observation: resources/presentation-fixtures/baseline_observation/fixture.yaml
 *   changed_observation: resources/presentation-fixtures/changed_observation/fixture.yaml
 *   boundary_observation: resources/presentation-fixtures/boundary_observation/fixture.yaml
 * ---
 */

import { analyzePromises } from "./lib/analyze.ts";

type PromiseRule = {
  id: string;
  statement: string;
  expected: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

type Observation = {
  case: string;
  input: string;
  output: string;
};

function parsePromises(markdown: string): PromiseRule[] {
  const rules: PromiseRule[] = [];
  const blocks = markdown.split(/^## /m).slice(1);

  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim());

    const id = lines[0]?.trim() ?? "";
    const statement = lines
      .find((line) => line.startsWith("Statement:"))
      ?.replace("Statement:", "")
      .trim() ?? "";
    const expected = lines
      .find((line) => line.startsWith("Expected:"))
      ?.replace("Expected:", "")
      .trim() ?? "";
    const severityValue = lines
      .find((line) => line.startsWith("Severity:"))
      ?.replace("Severity:", "")
      .trim() ?? "MEDIUM";

    if (!id || !statement || !expected) {
      throw new Error(`Invalid promise definition: ${id || "(missing id)"}`);
    }

    const severity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(
      severityValue,
    )
      ? severityValue as PromiseRule["severity"]
      : "MEDIUM";

    rules.push({
      id,
      statement,
      expected,
      severity,
    });
  }

  return rules;
}

function readProcessText(
  ctx: Awaited<ReturnType<typeof loadPresentationContext>>,
  step: ReturnType<Awaited<ReturnType<typeof loadPresentationContext>>["requireAvailable"]>,
  name: string,
): string {

  if (!isProcessExecBody(step.body)) {
    throw new Error(`${name} did not record a process.exec observation`);
  }

  if (
    step.body.status.exit.kind !== "code" ||
    step.body.status.exit.code !== 0
  ) {
    throw new Error(
      `${name} failed: ${step.body.stderr?.text ?? "no stderr captured"}`,
    );
  }

  const text = step.body.stdout?.text;
  if (text === undefined) {
    throw new Error(`${name} captured no stdout`);
  }

  return text;
}

const {
  FlowOutput,
  isProcessExecBody,
  loadPresentationContext,
  stepName,
} = await import("__ROTE_PRESENTATION_SDK__");

const out = new FlowOutput();
const ctx = await loadPresentationContext();

if (ctx.run.status === "failed") {
  out.result({
    run_id: ctx.run.run_id,
    verdict: "RUN_FAILED",
    error: "One or more PromiseProbe effect steps failed.",
  });
  Deno.exit(1);
}

const promiseText = readProcessText(ctx, ctx.requireAvailable(stepName("promise_definition")), "promise_definition");
const baselineText = readProcessText(ctx, ctx.requireAvailable(stepName("baseline_observation")), "baseline_observation");
const changedText = readProcessText(ctx, ctx.requireAvailable(stepName("changed_observation")), "changed_observation");
const boundaryText = readProcessText(ctx, ctx.requireAvailable(stepName("boundary_observation")), "boundary_observation");

const promises = parsePromises(promiseText);

const observations: Observation[] = [
  JSON.parse(baselineText),
  JSON.parse(changedText),
  JSON.parse(boundaryText),
];

const report = analyzePromises(promises, observations);

  const verdictIcon = report.verdict === "PASS" ? "✓" : "⚠";
  const verdictLabel = report.verdict === "PASS"
    ? "ALL PROMISES HELD"
    : "PROMISE VIOLATION";

  const matrix = report.evaluations.map((evaluation) => {
    const icon = evaluation.passed ? "✓" : "✗";
    const state = evaluation.passed ? "PASS" : "VIOLATION";

    return [
      `| ${evaluation.case} | ${evaluation.expected} | ${icon} ${state} |`,
      `| | | observed: ${evaluation.observed} |`,
    ].join("\n");
  }).join("\n");

  const risk = report.violations.length > 0
    ? [
        "## ⚠ RISK SIGNAL",
        "",
        ...report.violations.map(
          (violation) =>
            `**${violation.id}** — ${violation.case} — severity=${violation.severity}`,
        ),
        "",
        "The workflow produced an observation that did not satisfy a declared promise.",
      ].join("\n")
    : "## ✓ NO PROMISE VIOLATIONS";

  const nextAction = report.violations.length > 0
    ? "Review the violated promise and add explicit handling for the failing case."
    : "No corrective action required.";

  const W = 46;
  const pad = (text: string) => `│ ${text.slice(0, W - 4).padEnd(W - 4)} │`;
  const line = "├" + "─".repeat(W - 2) + "┤";
  const top = "┌" + "─".repeat(W - 2) + "┐";
  const bottom = "└" + "─".repeat(W - 2) + "┘";

  const centered = (text: string) => {
    const inner = W - 4;
    const clipped = text.slice(0, inner);
    const left = Math.floor((inner - clipped.length) / 2);
    return `│ ${" ".repeat(left)}${clipped}${" ".repeat(inner - left - clipped.length)} │`;
  };

  const metric = (label: string, value: string) =>
    `│ ${label.padEnd(28)}${value.padStart(14)} │`;

  const resultRows = report.evaluations.map((evaluation) => {
    const icon = evaluation.passed ? "✓" : "✗";
    const state = evaluation.passed ? "PASS" : "VIOLATION";
    const caseName = `${evaluation.id} ${evaluation.case}`.slice(0, 15).padEnd(15);
    const expected = evaluation.expected.slice(0, 13).padEnd(13);
    const result = `${icon} ${state}`.slice(0, 13).padEnd(13);
    return `│ ${caseName} │ ${expected} │ ${result} │`;
  });

  const violation = report.violations[0];

  const violationRows = violation
    ? [
        pad("⚠ PROMISE VIOLATION"),
        pad(""),
        pad(`${violation.id} — ${violation.case} — ${violation.severity}`),
        pad(""),
        pad(`Expected: ${violation.expected}`),
        pad(`Observed: ${violation.observed}`),
      ]
    : [
        pad("✓ ALL DECLARED PROMISES HELD"),
        pad(""),
        pad("No promise violations detected."),
      ];

  const uiNextAction = violation
    ? "Review violated promise and add"
    : "No corrective action required.";

  const uiNextAction2 = violation
    ? "explicit handling for this case."
    : "";

  out.human(
    [
      "```text",
      top,
      centered("PROMISEPROBE"),
      centered("Workflow Promise Verification"),
      line,
      metric("Reliability Score", `${report.score} / 100`),
      metric("Promises Verified", `${report.passed_checks} / ${report.total_checks}`),
      metric("Violations", `${report.failed_checks}`),
      line,
      pad("CASE            EXPECTED       RESULT"),
      line,
      ...resultRows,
      line,
      ...violationRows,
      line,
      pad("NEXT ACTION"),
      pad(uiNextAction),
      pad(uiNextAction2),
      bottom,
      "```",
      "",
      "> **Core question:** Does the workflow still behave as promised when reality changes?",
    ].join("\n"),
  );
out.summary(
  `PromiseProbe: ${report.verdict}; score=${report.score}/100; ` +
    `${report.passed_checks}/${report.total_checks} checks passed; ` +
    `${report.failed_checks} violations`,
);

out.result({
  run_id: ctx.run.run_id,
  verdict: report.verdict,
  score: report.score,
  passed_checks: report.passed_checks,
  total_checks: report.total_checks,
  failed_checks: report.failed_checks,
  evaluations: report.evaluations,
  violations: report.violations,
});
