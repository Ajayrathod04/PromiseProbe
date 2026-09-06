  # PromiseProbe

## Workflow Promise Verification & Resilience Analysis

> **PromiseProbe does not stop at "the workflow ran successfully."** It
> checks whether a workflow continues to satisfy its declared promises
> across baseline, changed, and boundary conditions, and turns broken
> promises into visible, actionable engineering evidence.

[![Rote Play](https://img.shields.io/badge/Rote%20Play-PromiseProbe-blue)](https://play.modiqo.ai/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Deno-3178C6)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Play-Validated-brightgreen)](https://play.modiqo.ai/)

------------------------------------------------------------------------

## The 30-Second Pitch

| What PromiseProbe Does | Why It Matters |
|---|---|
| Declares workflow promises | Makes expected behavior explicit instead of implicit |
| Runs baseline observations | Establishes whether the normal path keeps its contract |
| Tests changed conditions | Checks whether the workflow adapts when reality changes |
| Tests boundary conditions | Exposes behavior at the edges of the expected operating range |
| Compares expected vs observed behavior | Makes contract failures directly visible |
| Scores reliability | Converts multiple checks into a simple engineering signal |
| Surfaces violations | Shows exactly which promise failed and why |
| Recommends the next action | Turns a detected weakness into a concrete verification step |
| Ships as a reusable Rote Play | Makes promise verification repeatable rather than a one-off inspection |

**The core idea is simple:**

```text
DECLARED PROMISES
       ↓
BASELINE OBSERVATION
       ↓
CHANGED OBSERVATION
       ↓
BOUNDARY OBSERVATION
       ↓
EXPECTED vs OBSERVED
       ↓
PROMISE VERDICT
       ↓
ACTIONABLE NEXT STEP
```

------------------------------------------------------------------------

## The Problem PromiseProbe Solves

A workflow can execute successfully while still violating an important
behavioral promise.

That creates a dangerous gap:

```text
"The workflow completed."
        ≠
"The workflow behaved as promised."
```

A normal run tells you whether execution completed.

PromiseProbe asks the next question:

> **Does the workflow still behave as promised when reality changes?**

That turns an invisible reliability weakness into a measurable,
inspectable result.

------------------------------------------------------------------------

## The PromiseProbe Workflow

```text
                    ┌──────────────────────────┐
                    │      WORKFLOW / PLAY     │
                    │   Declared expectations  │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │    PROMISE DEFINITION    │
                    │ What must remain true?   │
                    └────────────┬─────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
     ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
     │    BASELINE    │ │    CHANGED     │ │    BOUNDARY    │
     │ normal reality │ │ reality shifts │ │ edge condition │
     └───────┬────────┘ └───────┬────────┘ └───────┬────────┘
             │                  │                  │
             └──────────────────┼──────────────────┘
                                ▼
                    ┌──────────────────────────┐
                    │   EXPECTED vs OBSERVED   │
                    │     Promise analysis     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │    RELIABILITY REPORT    │
                    │ score + violations +     │
                    │ evidence + next action   │
                    └──────────────────────────┘
```

The workflow is intentionally **contract-oriented**: it evaluates
behavior against explicit promises instead of treating successful
execution as proof of reliability.

------------------------------------------------------------------------

## The Strongest Point: Judge-Readable Output

PromiseProbe is designed so that the most important result is visible
immediately.

Instead of making a judge interpret raw logs, the presentation produces
a compact verification dashboard:

```text
┌──────────────────────────────────────────────┐
│                PROMISEPROBE                  │
│       Workflow Promise Verification          │
├──────────────────────────────────────────────┤
│ Reliability Score                 80 / 100  │
│ Promises Verified                    4 / 5  │
│ Violations                              1  │
├──────────────────────────────────────────────┤
│ CASE            EXPECTED       RESULT       │
├──────────────────────────────────────────────┤
│ P-001 baseline  RESULT_READY   ✓ PASS       │
│ P-001 changed   RESULT_READY   ✓ PASS       │
│ P-001 boundary  RESULT_READY   ✓ PASS       │
│ P-002 changed   ADAPTED        ✗ VIOLATION  │
│ P-003 boundary  BOUNDARY_HAND  ✓ PASS       │
├──────────────────────────────────────────────┤
│ ⚠ PROMISE VIOLATION                         │
│                                             │
│ P-002 — changed — HIGH                      │
│                                             │
│ Expected: ADAPTED                           │
│ Observed: RESULT_READY STALE_RESULT         │
├──────────────────────────────────────────────┤
│ NEXT ACTION                                 │
│ Review violated promise and add             │
│ explicit handling for this case.            │
└──────────────────────────────────────────────┘
```

The key advantage is **visual evidence**:

```text
SCORE
  ↓
COVERAGE
  ↓
VIOLATION
  ↓
EXPECTED vs OBSERVED
  ↓
NEXT ACTION
```

A judge can understand the result in seconds without reading the
implementation.

------------------------------------------------------------------------

## What PromiseProbe Actually Does

### 1. Define promises

PromiseProbe establishes explicit expected outcomes for the workflow.

A promise is treated as a contract that can be checked against an
observation.

### 2. Establish the baseline

The normal observation is evaluated first.

This confirms that the expected behavior holds under ordinary
conditions.

### 3. Introduce changed reality

A changed observation tests whether the workflow continues to behave
correctly when conditions differ.

This is where adaptation promises become important.

### 4. Probe boundaries

Boundary observations test behavior near an operating edge or special
condition.

This helps expose failures that may remain invisible on the normal path.

### 5. Compare expected and observed behavior

Each declared promise is evaluated against the corresponding
observation.

The result is classified as:

```text
✓ PASS
✗ VIOLATION
```

### 6. Calculate reliability

PromiseProbe aggregates the checks into a reliability score and reports
the number of promises held versus violated.

### 7. Explain the violation

When a promise fails, the report identifies:

- promise ID
- case
- severity
- expected behavior
- observed behavior
- recommended next action

This turns a failure from a generic error into an actionable signal.

------------------------------------------------------------------------

## Demonstration Result

The current demonstration intentionally contains one violated promise.

```text
Promise checks:       5
Passed:               4
Violations:           1
Reliability score:   80 / 100
```

The failing case is:

```text
Promise:    P-002
Case:       changed
Expected:   ADAPTED
Observed:   RESULT_READY STALE_RESULT
Severity:   HIGH
```

The other declared checks hold:

```text
P-001 baseline   ✓
P-001 changed    ✓
P-001 boundary   ✓
P-003 boundary   ✓
```

This is intentional: PromiseProbe demonstrates that a workflow can
complete all execution steps while still exposing a behavioral promise
violation.

------------------------------------------------------------------------

## Why the Result Is Different from a Normal Run

A conventional workflow run answers:

```text
Did execution complete?
```

PromiseProbe adds:

```text
Did the workflow keep its declared promises?
```

And then:

```text
If a promise broke, what exactly should be fixed?
```

So the output becomes:

```text
Execution
   +
Declared contract
   +
Multiple reality conditions
   +
Expected vs observed
   ↓
Reliability evidence
```

------------------------------------------------------------------------

## Evidence, Not Just a Score

PromiseProbe does not rely only on a number.

The result contains structured evidence such as:

-   Promise definitions
-   Baseline observation
-   Changed observation
-   Boundary observation
-   Individual evaluations
-   Reliability score
-   Failed-check count
-   Violation IDs
-   Severity
-   Expected behavior
-   Observed behavior
-   Next corrective action

The structured result is also emitted through the Play's result output,
making the analysis machine-readable as well as human-readable.

------------------------------------------------------------------------

## Rote Play

PromiseProbe is implemented as a reusable Rote Play.

### Input model

The current Play is intentionally self-contained and uses its declared
workflow observations rather than requiring a large external setup.

The execution is composed of four parallel effect steps:

```text
Promise Definition
Baseline Observation
Changed Observation
Boundary Observation
```

The presentation layer then analyzes those observations and produces
the final report.

### Execution

Run the Play from outside the Rote workspace:

```bash
cd /tmp && rote play run ~/.rote/flows/ajayrathod04/promise-probe/main.ts
```

------------------------------------------------------------------------

## The Four-Step Execution

```text
┌───────────────────────────────┐
│       PROMISE DEFINITION      │
└───────────────┬───────────────┘
                │
┌───────────────┼───────────────┐
│               │               │
▼               ▼               ▼
BASELINE      CHANGED        BOUNDARY
   │             │               │
   └─────────────┼───────────────┘
                 ▼
        PROMISE ANALYSIS
                 │
                 ▼
       PRESENTATION REPORT
```

The three observation steps execute in parallel, making the workflow
compact while keeping each condition independently inspectable.

------------------------------------------------------------------------

## Validation and Runtime Verification

The Play was checked through the Rote validation and lint workflow.

### Validate

```bash
rote play validate main.ts
```

Expected result:

```text
Quality score: 0.88 (Pass)
OK: Play validation passed!
```

### Lint

```bash
rote play lint promise-probe
```

The final validated version passed:

```text
✓ lint passed
Static: pass
Runtime: pass
```

Runtime presentation checks cover:

```text
Human mode
Summary mode
JSON mode
```

------------------------------------------------------------------------

## Dependency Preflight

Before a final smoke run:

```bash
rote deps check deps.toml
```

Expected final state:

```text
ok: true
tools_missing_required: 0
tools_version_rejected: 0
tools_version_unverified: 0
files_missing_required: 0
readiness_failed_required: 0
```

------------------------------------------------------------------------

## Real Smoke Run

Always run the Play from `/tmp`:

```bash
cd /tmp && rote play run ~/.rote/flows/ajayrathod04/promise-probe/main.ts
```

The final demonstrated run completed:

```text
Summary: 4/4 completed, 0 failed, 0 blocked
```

The execution then produced the PromiseProbe verification dashboard.

------------------------------------------------------------------------

## Release and Discoverability

The finalized Play was released locally through the Rote release flow.

Release verification:

```bash
rote play release promise-probe
```

Index the released Play:

```bash
rote play index --rebuild
```

Verify discoverability:

```bash
rote play search promise-probe
```

The search result identified:

```text
"promise-probe"
Match: 100%
```

------------------------------------------------------------------------

## GitHub Repository

The finalized implementation was committed and pushed to:

```text
https://github.com/Ajayrathod04/PromiseProbe
```

Latest presentation-polish commit:

```text
f2677b1
Polish PromiseProbe presentation
```

The GitHub repository contains the implementation, dependency manifest,
presentation fixtures, and release metadata required by the finalized
project state.

------------------------------------------------------------------------

## Repository Structure

```text
PromiseProbe/
├── main.ts
├── deps.toml
├── resources/
│   └── presentation-fixtures/
│       ├── promise_definition/
│       ├── baseline_observation/
│       ├── changed_observation/
│       └── boundary_observation/
├── .rote-flow-lint.json
├── .rote-source
└── .rote-release.lock
```

------------------------------------------------------------------------

## Key Capabilities

| Capability | Purpose |
|---|---|
| **Explicit promise definition** | Makes expected workflow behavior testable |
| **Baseline verification** | Establishes normal-path correctness |
| **Changed-condition verification** | Tests resilience when reality changes |
| **Boundary verification** | Tests behavior at important edges |
| **Expected vs observed analysis** | Detects behavioral contract violations |
| **Reliability scoring** | Compresses verification into a fast signal |
| **Violation severity** | Helps prioritize important failures |
| **Actionable next step** | Connects detection to remediation |
| **Human-readable dashboard** | Makes the result immediately understandable |
| **Machine-readable result** | Keeps the output useful for automation |
| **Reusable Rote Play** | Makes the verification workflow repeatable |

------------------------------------------------------------------------

## Design Principle

> **A workflow completing successfully is not the same as a workflow
> keeping its promises.**

PromiseProbe is based on a simple engineering principle:

```text
SUCCESSFUL EXECUTION
        ≠
PROMISE SATISFACTION
```

A reliable workflow should be evaluated not only on whether it runs,
but also on whether it continues to produce the behavior it promised
under changed and boundary conditions.

------------------------------------------------------------------------

## Why It Matters

Real workflows operate in environments that change.

Inputs change.
Conditions change.
Dependencies change.
Assumptions become false.

PromiseProbe creates a lightweight contract-verification layer:

```text
DECLARE
  ↓
OBSERVE
  ↓
COMPARE
  ↓
VERIFY
  ↓
EXPLAIN
  ↓
ACT
```

The goal is not to replace the workflow.

The goal is to make its behavioral promises **visible, testable, and
actionable**.

------------------------------------------------------------------------

## Judge Takeaway

```text
WORKFLOW COMPLETED
        ↓
DID IT KEEP ITS PROMISE?
        ↓
YES → PROMISE HELD
        │
        └──────────────┐
                       │
NO → PROMISE VIOLATION│
        ↓              │
EXPECTED vs OBSERVED  │
        ↓              │
NEXT ACTION            │
        └──────────────┘
```

**PromiseProbe turns workflow reliability from a vague assumption into
visible, testable evidence.**

------------------------------------------------------------------------

## Status

```text
PromiseProbe
Finalized Rote Play hackathon project

Validation:     Passed
Lint:           Passed
Runtime checks: Passed
Dependency check: Passed
Smoke run:      4/4 completed
Discoverability: 100% match
GitHub:         Pushed
```

------------------------------------------------------------------------

## License

This project is provided as part of the Rote Playoffs Hackathon
submission.
