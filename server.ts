import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization helper for Gemini
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set. Please set it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Repository Intelligence Endpoint (Agent 1)
app.post("/api/gemini/scan-repo", async (req: Request, res: Response) => {
  try {
    const { repoName, codeFiles } = req.body;
    if (!codeFiles || !Array.isArray(codeFiles) || codeFiles.length === 0) {
      res.status(400).json({ error: "At least one code file is required for scanning." });
      return;
    }

    const ai = getGeminiClient();
    
    // Create a detailed prompt containing the file contents to analyze
    const filesRepresentation = codeFiles
      .map((f: any) => `=== File: ${f.name} ===\n${f.content}`)
      .join("\n\n");

    const prompt = `You are the Repository Intelligence Agent in CodePilot AI, an autonomous engineering manager.
Analyze the following source files from the repository '${repoName || "demo-repo"}':

${filesRepresentation}

Perform a rigorous check for:
1. Architectural and design patterns (structure, modularity, readability).
2. Technical debt (dead code, logic errors, poorly styled code, TODOs, nested loops).
3. Security issues (SQL injection, unsafe dependencies, hardcoded keys, improper error handling).

Provide your response strictly in the following JSON format:
{
  "healthScore": 85, // an integer from 0 to 100 representing general code safety and quality
  "summary": "Short paragraph summarizing project state and architectural health.",
  "techDebt": [
    { "file": "filename.js", "issue": "Brief description of the debt item", "severity": "low/medium/high", "line": 23 }
  ],
  "securityVulnerabilities": [
    { "file": "filename.js", "vulnerability": "e.g., SQL Injection Risk", "details": "Description of vulnerability", "severity": "high/medium/low", "suggestion": "How to fix it" }
  ],
  "structuralStrengths": ["Elegant async/await usage", "Great modular division"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/gemini/scan-repo:", error);
    res.status(500).json({ error: error.message || "Failed to analyze repository." });
  }
});

// 3. AI Code Reviewer Endpoint (Agent 2)
app.post("/api/gemini/review-mr", async (req: Request, res: Response) => {
  try {
    const { title, description, diff } = req.body;
    if (!diff) {
      res.status(400).json({ error: "Diff content is required for code review." });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `You are the Code Review Agent in CodePilot AI, an autonomous engineering manager.
Review the following Merge Request description and Code Diff to find bugs, security concerns, performance problems, or style deviations:

Merge Request: ${title || "Add features"}
Description: ${description || "N/A"}

=== CODE DIFF ===
${diff}

Analyze the changes. Provide a highly actionable, constructive review in the following JSON format:
{
  "summary": "High-level summary of the review decision and code changes.",
  "performanceScore": 90, // score from 0 to 100
  "securityScore": 95, // score from 0 to 100
  "maintainabilityScore": 85, // score from 0 to 100
  "approved": true, // boolean, false if severe blockers/bugs exist
  "comments": [
    {
      "filePath": "src/controllers/auth.js",
      "line": 42,
      "text": "Detailed feedback about this block",
      "type": "performance/security/style/bug",
      "severity": "low/medium/high",
      "originalCode": "app.post('/login', (req, res) => ...)",
      "suggestedCode": "async (req, res) => { ... }"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/review-mr:", error);
    res.status(500).json({ error: error.message || "Failed to conduct code review." });
  }
});

// 4. Sprint Planning Assistant Endpoint (Agent 3)
app.post("/api/gemini/plan-sprint", async (req: Request, res: Response) => {
  try {
    const { requirementsText } = req.body;
    if (!requirementsText) {
      res.status(400).json({ error: "Requirements text is required for sprint planning." });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `You are the Sprint Planning Agent in CodePilot AI, an autonomous engineering manager.
Convert the following natural language product requirement or feature request into a list of structured engineering items (user stories, feature tickets) complete with description, estimative priority, and acceptance criteria:

${requirementsText}

Generate exactly 3 to 5 realistic items inside the sprint backlog. Format your output strictly in JSON as follows:
{
  "epicTitle": "A summarized dynamic title for the overall epic/sprint goal",
  "totalEstimatedPoints": 13, // sum of points of generated issues
  "issues": [
    {
      "id": "GP-101",
      "title": "A concise, developer-oriented issue title",
      "description": "Clear developer description of the task and what needs to be built.",
      "storyPoints": 5, // choose from standard Fibonacci (1, 2, 3, 5, 8, 13)
      "priority": "High" | "Medium" | "Low",
      "acceptanceCriteria": [
        "First condition of success",
        "Second condition of success"
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/plan-sprint:", error);
    res.status(500).json({ error: error.message || "Failed to generate sprint plan." });
  }
});

// 5. Release Guardian Endpoint (Agent 4)
app.post("/api/gemini/release-guard", async (req: Request, res: Response) => {
  try {
    const { pipelineMetrics, unmergedIssues, recentChangelog } = req.body;

    const ai = getGeminiClient();

    const prompt = `You are the Release Guardian Agent in CodePilot AI, an autonomous engineering manager.
Evaluate the deployment readiness of the upcoming release using the metrics and history below:

Pipeline & Build Metrics:
- Pipeline Status: ${pipelineMetrics?.status || "SUCCESS"}
- Test Pass Rate: ${pipelineMetrics?.testPassRate || "100%"}
- Code Coverage: ${pipelineMetrics?.codeCoverage || "85%"}
- Critical Security Scanner Warnings: ${pipelineMetrics?.securityWarnings || "0"}

Pending Risk Factors:
- Unmerged Hot Issues / Blockers: ${JSON.stringify(unmergedIssues || [])}

Recent Commit/Changelog summary:
${recentChangelog || "No recent changes provided."}

Analyze whether this release is a GO or NO-GO. Provide a detailed final release check in this JSON format:
{
  "decision": "GO" | "NO-GO",
  "reasoningSummary": "Professional explanation of risk factors, success metrics and readiness.",
  "overallRiskRating": "Low" | "Medium" | "High",
  "checklist": [
    { "task": "Task name", "completed": true, "reason": "Why this must be check-off" }
  ],
  "suggestedReleaseNote": "A bulleted summary of features included in this release version."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/release-guard:", error);
    res.status(500).json({ error: error.message || "Failed to make release assessment." });
  }
});

// 6. Engineering Insights Endpoint (Agent 5)
app.post("/api/gemini/engineering-insights", async (req: Request, res: Response) => {
  try {
    const { recentActivityLog } = req.body;

    const ai = getGeminiClient();

    const prompt = `You are the Engineering Insights Agent in CodePilot AI.
Review the following active team dashboard log to produce a high-impact engineering executive summary, identifying workspace bottleneck trends, productivity scores, and specific leadership action items:

${recentActivityLog || "No logs available."}

Provide a dynamic breakdown in JSON:
{
  "projectVelocityRank": "Excellent" | "Moderate" | "Needs Attention",
  "velocityExplanation": "Why this score was assigned.",
  "cycleTimeTrend": "Decreasing" | "Increasing" | "Stable",
  "topBottlenecks": [
    "e.g., Code Review is averaging 48 hours to complete",
    "e.g., Flaky CI/CD test pipelines in pipeline #342"
  ],
  "recommenedActions": [
    "Introduce automated lint pre-commit hooks to save MR cycle time",
    "Allocate tech-debt focus time during next sprint cycle"
  ],
  "executiveBriefing": "A paragraph summarizing general engineering recommendations.",
  "velocityTrends": [
    { "month": "Jan", "mergeRequests": 8, "commits": 18 },
    { "month": "Feb", "mergeRequests": 10, "commits": 25 },
    { "month": "Mar", "mergeRequests": 15, "commits": 35 },
    { "month": "Apr", "mergeRequests": 11, "commits": 22 },
    { "month": "May", "mergeRequests": 14, "commits": 42 },
    { "month": "Jun", "mergeRequests": 18, "commits": 48 }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/engineering-insights:", error);
    res.status(500).json({ error: error.message || "Failed to compile insights report." });
  }
});

// -------------------------------------------------------------
// Dev Server & Build Bundling Setup
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodePilot AI Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
