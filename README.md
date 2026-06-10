# CodePilot AI: Autonomous Engineering Manager

An autonomous, multi-agent AI Engineering Manager powered by Gemini and the Model Context Protocol (MCP) to automate repository safety analysis, merge request code reviews, sprint backlog generation, and release readiness checks directly integrated into GitLab.

This project was built for the **Google Cloud Rapid Agent Hackathon** (GitLab Integration Track).

---

## ⏳ Hackathon Context
* **Timeline Constraint:** Submitted ahead of the cutoff of **Jun 12, 2026 @ 2:30 AM GMT+5:30**.
* **Global Track Prize Pool:** $60,000 across multiple partner tracks ($5,000 for 1st, $3,000 for 2nd, and $2,000 for 3rd).
* **Partner Focus Track:** GitLab Track.

---

## 🎨 Design Theme: Bento Grid
The user interface implements a highly polished, responsive, and visually modern **Bento Grid** dashboard. It presents unified statuses of independent engineering agents, live-updated markdown audit records, direct prompt execution consoles, and automated decision highlights with elegant spatial negative spacing and color accents.

---

## 🎯 Core Mission & Inspiration

Modern software teams spend significant bandwidth coordinating and reviewing development workflows—auditing code for performance bottlenecks, checking files for security risks, translating feedback sheets into structured feature tickets, and checking CI/CD quality checklist barriers before release flags. Traditional AI assistants remain conversation-bound in a sandbox, requiring engineers to manually transfer suggestions and make operational decisions.

**CodePilot AI** breaks past standard chatbots to realize a true autonomous software workflow partner. Utilizing **Google Cloud Agent Builder** and **Gemini**, CodePilot AI evaluates actual repository files, executes continuous code review assertions, plans robust Sprints, and acts as a **Release Guardian** deciding on Go/No-Go release states. Powered by the **Model Context Protocol (MCP)**, the platform executes real actions back into GitLab—such as submitting reviewer comment annotations, creating issues, and updating sprint logs.

---

## 🚀 Key Actions & Multi-Agent Capabilities

CodePilot AI coordinates five specialized agents performing cooperative engineering management workflows:

1. **Repository Intelligence Agent (Agent 1)**
   * Parses active folder files recursively.
   * Audits security flaws (SQL injection risk, hardcoded credentials, leak logging).
   * Calculates overall codebase health metrics.
   * Auto-submits static vulnerability issues.

2. **AI Code Review Agent (Agent 2)**
   * Assesses active GitLab Merge Request diff streams.
   * Scores MR metrics across Performance, Security, and Maintainability.
   * Generates actionable feedback comments mapping code line numbers.

3. **Sprint Planning Assistant (Agent 3)**
   * Converts unstructured requirements documents and feedback sheets into ready sprint epics.
   * Generates Fibonacci-based story estimates, priorities, and condition criteria.
   * Synthesizes organized issue backlogs.

4. **Release Guardian Agent (Agent 4)**
   * Scans production staging pipeline and code coverage criteria.
   * Reviews pending user blockers list.
   * Makes final autonomous Release **GO** or **NO-GO** decisions backed by structured reasoning.

5. **Engineering Insights Agent (Agent 5)**
   * Evaluates weekly pipeline frequencies and wait durations.
   * Identifies team review bottlenecks.
   * Generates strategic engineering briefings for leadership.

---

## 📦 Built With

CodePilot AI leverages a robust production tech stack across cloud platforms, AI orchestration software, languages, and frameworks:
- **React & TypeScript:** Modern state-driven frontend.
- **Vite:** High-performance local bundling and dev environment optimization.
- **Tailwind CSS:** Streamlined utility-first styling.
- **Google Cloud Agent Builder:** Backing orchestrator facilitating multi-agent workflows and task synchronization.
- **Gemini:** Core reasoning AI model.
- **GitLab MCP:** Secure server tools integration protocol.
- **Cloud Run:** Serverless scale-to-zero container hosting.

### 1. AI & Reasoning Core
* **Gemini (gemini-3.5-flash):** Serves as the primary reasoning engine to analyze raw code structures, parse developer diff files, generate structured JSON responses, and assess release safety parameters.
* **@google/genai SDK:** The official, modern Google GenAI TypeScript library used for robust, server-side content generation.
* **Google Cloud Agent Builder:** Backing orchestrator facilitating multi-agent workflows and task synchronization.

### 2. Integration & Tool Protocol
* **Model Context Protocol (MCP):** The client-server standard connecting AI models with secure external data sources.
* **GitLab MCP Server API:** Direct gateway exposing secure GitLab tools (e.g., repository reading, issue creation, merge request reviews posting) to CodePilot AI agents.

### 3. Backend Architecture
* **Node.js (v22+):** Primary server-side execution runtime.
* **Express & TypeScript:** Custom full-stack router setup with strong typing, proxying all Gemini requests via secure `/api/*` endpoints to protect key credentials.
* **tsx & esbuild:** High-performance TypeScript development execution and production bundling to single CommonJS outputs inside `dist/server.cjs`.

### 4. Frontend & Layout Engine
* **React 19 & TypeScript:** State-driven component interface building polished live interaction previews.
* **Tailwind CSS v4:** Beautiful utility styling, custom shadows, deep slate gradients, and fluid containers.
* **Motion (motion/react):** Elegant micro-animations and staggered entrance transitions for dynamic elements.
* **Lucide React:** Minimalist, high-quality vector icons for smooth iconography pairings.

### 5. Deployment & Cloud Services
* **Google Cloud Run:** Continuous, scale-to-zero container hosting providing ultra-low cold starts and secure environment configurations routing metadata.

---

## 🛠️ Unified Installation & Development

To configure or run CodePilot AI locally or in a container, follow these steps:

### Prerequisites
Add your Gemini Key to your configuration environment variables:
```env
# .env.example
GEMINI_API_KEY="YOUR_GEMINI_KEY"
APP_URL="YOUR_HOSTED_URL"
```

### Installation
1. Install project packages:
   ```bash
   npm install
   ```

2. Run the application in development mode:
   ```bash
   npm run dev
   ```
   *The server starts on port `3000` exposing both API controllers and Vite hot delivery.*

3. Compile the production-ready bundle:
   ```bash
   npm run build
   ```
   *Compiles front-end assets to `/dist` and compiles server entry points directly to `/dist/server.cjs` via esbuild.*

4. Launch production server:
   ```bash
   npm run start
   ```

---

## 🧑‍⚖️ Submission Validation Checklist
- [x] **Hosted Project URL:** Provisioned via secure GCP container services.
- [x] **Public Code Repository:** Root directory is public and contains open-source licensing.
- [x] **Walkthrough Video:** ~3 minute length demonstrating direct GitLab MCP agent tool integrations and bento grid parameters.
- [x] **Partner Track:** Strictly categorized in the **GitLab Track** of the Google Cloud Rapid Agent Hackathon.
