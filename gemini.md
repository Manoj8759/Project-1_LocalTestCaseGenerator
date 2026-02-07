# Project Constitution (Gemini)

## Data Schemas

### Request Object
```json
{
  "user_input": "string",
  "context": "string (optional)"
}
```

### Test Case Template (Output Structure)
The LLM should return test cases in this format (Markdown or JSON):
```markdown
**Test Case ID**: [TC_001]
**Title**: [Short Title]
**Description**: [What is being tested]
**Preconditions**:
- [Condition 1]
**Steps**:
1. [Step 1]
2. [Step 2]
**Expected Result**: [Result]
```

## Behavioral Rules
- **Model**: Must use `llama3.2` via Ollama.
- **Interface**: Chat-based UI.
- **Tone**: Professional, precise QA terminology.
- **Interaction**: User provides requirements -> System returns formatted test cases.
- **Reliability**: If Ollama fails, provide a clear error message.

## Architectural Invariants
- A.N.T. 3-layer architecture (if applicable)
- B.L.A.S.T. protocol compliance
- **Data-First**: Always define schema before coding.

## Maintenance Log
| Date | Event | Details |
| :--- | :--- | :--- |
| 2026-01-24 | Initialization | Project created with B.L.A.S.T. protocol. |
| 2026-01-24 | Infrastructure | Node.js/Express backend setup. |
| 2026-01-24 | Model Install | `llama3.2` model pulled and verified. |
| 2026-01-24 | Deployment | App deployed locally via PM2 (Process ID: 0). |
