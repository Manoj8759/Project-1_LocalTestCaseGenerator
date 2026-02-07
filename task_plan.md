# Task Plan

## Phase 1: Initialization & Planning
- [ ] Receive User Requirements/Prompt
- [ ] Define Data Schema in `gemini.md`
- [ ] Approve Blueprint

## Phase 2: Core Development
- [x] **Infrastructure Setup**
    - [x] Create Node.js backend (proxy for Ollama)
    - [x] Verify `llama3.2` availability in Ollama
- [x] **Frontend Development**
    - [x] Design Chat Interface (HTML/CSS) for "Premium" look
    - [x] Implement Chat Logic (JS)
- [x] **Ollama Integration**
    - [x] Define System Prompt & Test Case Template
    - [x] Connect Frontend -> Backend -> Ollama API

## Phase 3: Testing & Refinement
- [x] Validation: User enters input -> Test cases generated
- [x] UI Polish: Ensure "Rich Aesthetics" (Glassmorphism, Animations)
- [x] SEO: Update meta tags (Title, Description)

## Phase 4: Deployment (Local)
- [x] Install PM2 (Process Manager)
- [x] Deploy application in background (`pm2 start`)
- [x] Persist process list (`pm2 save`)

## Phase 5: Trigger (Maintenance & Handover)
- [x] **Documentation**: Finalize `gemini.md` Maintenance Log.
- [x] **Automation**: Verify PM2 process stability.
- [x] **Handover**: Project is live at `http://localhost:3000`.

