# CardioLens AI

Interactive clinical decision-support website prototype. Run `npm start` and visit http://127.0.0.1:4173. No installation is required. Run `npm test` for 73 core/app regression checks, and `npm run test:http` with the server running for 8 HTTP checks. See [QA_REPORT.md](QA_REPORT.md) for the full verification and limitations.

## Implemented

Responsive patient dashboard, landing page, six-step assessment, immediate emergency-symptom interruption, automatically calculated BMI, missing-value handling, dated measurements, editable health history, selectable timelines, patient roster and sorting, sample patient details, session-only clinical notes, model validation/version screens, session activity log, reviewed CSV/FHIR imports, HTML exports with PDF printing, and local profile creation.

Entries use the record shape `{id,type,value,unit,recorded_at,source,verified}`. Confirmed user imports remain clinically unverified. Browser-session storage is temporary. Clear session data from My profile. Use fictional or de-identified information.

## Medical and infrastructure limits

The 18.4% example and clinician roster are fictional demonstration data. No clinical risk equation, ML prediction, model confidence or SHAP output is fabricated for submitted inputs. Actual prediction remains unavailable. Sensitivity ≥95% is an unmet validation target; performance metrics remain unmeasured. A PREVENT age/history screen is preliminary and does not replace full equation eligibility and input checks.

This website does not implement secure authentication, enforced roles, a backend clinical database, OCR, medical LLM/RAG, or model training. Role selection is a demonstration navigation control. PDF/image files are not uploaded or parsed. CSV imports require `type,value,unit,recorded_at`; FHIR supports selected LOINC Observation quantities and BP components with matching units. Values are staged for explicit confirmation before saving.

Production development requires a secure backend, identity and role enforcement, consent and access controls, audited durable storage, validated clinical equations, patient-level dataset splits, calibrated models, measured feature explanations, external/subgroup validation, and clinical review.

Source references are linked in the Evidence & limitations page to the American Heart Association PREVENT guidance and NHS emergency symptom guidance.
