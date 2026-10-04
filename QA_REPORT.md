# CardioLens AI — functional verification

Tested 4 October 2026 using the local website at http://127.0.0.1:4173. All inputs, notes and downloads used fictional QA data in an isolated browser tab.

## Result

The implemented frontend prototype executes successfully in the tested environment. The final automated run passed **81 tests, with zero failures, skips or cancellations**. Browser checks covered **all 19 routes**, and the browser console reported no errors or warnings at the final inspection.

The browser ledger contains **217 check executions: 207 passing observations and 10 earlier failed observations**. Every earlier failure has a recorded resolution and a passing retest. Seven failed observations exposed defects (including one repeated layout failure); three were test setup/assertion mistakes. There are **zero unresolved browser failures** in this ledger. This is functional verification of the current prototype, not evidence of clinical validation or exhaustive coverage of every browser/environment.

## Working features checked

| Area | Verified behavior |
|---|---|
| Navigation | All 19 pages render, workspace navigation and role switching work, selected doctor patient survives reload, skip-to-content preserves the current route. |
| Access screens | Patient, doctor and administrator demo entry; local profile creation; empty and whitespace-only names rejected; trimmed names stored. These controls do not authenticate users. |
| Assessment | All six steps; forward/back navigation; age validation; date validation; BP consistency; calculated BMI; missing values; lifestyle and history entries; review/save; repeated assessment saves without duplicate manual records. |
| Emergency interruption | Each of severe chest pain, severe shortness of breath and fainting independently stops the assessment before any score is displayed. Correction returns to the symptom form. |
| Measurements | Add, edit, cancel deletion and confirm deletion; 14 measurement range boundaries; unit/date validation; unverified provenance; persistence after reload; Enter/Space record inspection. |
| CSV imports | File selection, staging before storage, editing/removing staged rows, confirmation, discard, template download; malformed headers/rows, invalid values, unsupported types and oversized files rejected. |
| FHIR imports | Supported LOINC Observation quantities and BP components, UCUM unit codes, confirmation/discard, invalid shapes and units rejected; cancelled, entered-in-error and inequality observations rejected. |
| Charts and timeline | All 14 metric choices; empty-state charts; 1Y/3Y/5Y ranges; all five sample timeline years; chart point provenance; chronological trends and duplicate-date handling. |
| Doctor workspace | Six sample patients, search, empty search, alphabetical sorting and category/review filters; selected-patient report context; note draft retained through chart changes and saved note retained after reload. |
| Reports | Personal/doctor report histories kept separate; immediate export history update; patient name/record count/clinical note correct; HTML content escaped; actual downloaded files inspected; Download again produces identical content. |
| Profile/reset | Clear/sample-load cancellation; confirmed clear removes records; confirmed sample load restores 50 fictional records; stale unsaved doctor note and selection/filter state reset. |
| Administration | Model metrics remain unmeasured; four planned model versions; session activity entries and reload persistence. These pages do not run training or enforce releases on a server. |
| Responsive UI | Ten representative pages at 320, 390, 768 and 1280 pixels: all 40 combinations pass after fixes. All six assessment steps and measurement dialog also fit 320 pixels. Mobile menu opens/closes; hidden navigation is excluded from keyboard focus. |
| HTTP/runtime | Five required assets return correct status and MIME; missing files/APIs return 404; encoded traversal does not expose source; HEAD returns no body; both JavaScript modules pass syntax checks. |

The 19 checked routes are home, login, register, dashboard, assessment, history, timeline, risk, reports, profile, doctor, patients, patient-detail, monitor, doctor-reports, models, versions, audit and evidence.

## Fixes made during verification

- Numeric validation no longer converts booleans, arrays or objects into medical values; inherited keys cannot bypass the metric whitelist.
- CSV headers and row lengths are validated. FHIR prefers canonical UCUM codes and refuses inappropriate observation states/comparators.
- Trends use actual date cutoffs, collapse duplicate dates and label short intervals accurately. Newest same-date measurements take precedence.
- Saved doctor patient selection persists. Doctor exports and print content use the selected patient, available measurements and saved note.
- Entered records remove fictional sample data and suppress illustrative risk; inconsistent BP pairs fail without replacing existing records.
- Assessment BMI clears immediately when an input becomes unknown. Names/ages/dates are validated and repeat saves update matching manual entries.
- Corrupt session data no longer crashes the page. Skip links preserve routes; landing charts no longer inherit another page's metric.
- Narrow-screen assessment/report/landing layouts and mobile navigation focus were corrected.
- Session reset also clears unsaved note drafts, patient selection and filters.
- Calendar defaults and validation now use the current local date instead of a fixed October date.
- Record keyboard inspection prevents duplicate native activation; both Enter and Space open the dialog correctly.

## Not implemented / not verified

| Capability | Status |
|---|---|
| Actual cardiovascular risk calculators and ML predictions | Not connected. The 18.4% example and roster scores are fictional. No clinical performance claim is verified. |
| Model training, calibration, SHAP, confidence, validation and server release gate | Not implemented; displayed metrics are unavailable/unmeasured. |
| Secure authentication, enforced role permissions, clinical database, durable storage and server security audit | Not implemented. All workspaces are freely selectable demos; records use browser-session storage. |
| PDF/image OCR and medical LLM/RAG | Not connected. Supported local CSV/FHIR parsing is the implemented import path. |
| Print/save PDF | Print action executes without detected browser error; isolated regression verifies selected patient content and print invocation. Native Windows print dialog and a resulting saved PDF were not verified. HTML downloads were verified on disk. |
| Cross-browser, assistive technology and production testing | Only the provided in-app Chromium browser was exercised. Keyboard/mobile checks do not constitute a full accessibility audit. No load, penetration, clinical, external-model or production deployment test was performed. |
| Public hosting | Not deployed. Local preview remains available. |

## Repeat the automated checks

From the project folder, run `npm start` to serve the site. With the server running:

```text
node --test tests/core.test.mjs tests/audit.test.mjs tests/http.test.mjs
```

`npm test` runs the 73 core/app tests; `npm run test:http` runs the 8 HTTP checks. App tests use an isolated VM and minimal DOM stubs; actual UI interactions were checked separately in the browser. The fixtures contain synthetic data only.

Detailed browser evidence: [tests/browser-results.json](tests/browser-results.json). Screenshot: [qa-desktop.png](qa-desktop.png).
