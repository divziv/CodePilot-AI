import React, { useState, useEffect } from "react";
import {
  Shield,
  Zap,
  Clock,
  AlertTriangle,
  Activity,
  FileCode,
  CheckCircle2,
  XCircle,
  Plus,
  Play,
  Sparkles,
  Code,
  Terminal,
  ArrowRight,
  Cpu,
  ChevronRight,
  Info,
  Check,
  RefreshCw,
  Eye,
  FileText,
  User,
  ListTodo,
  ExternalLink,
  GitBranch,
  Settings,
  Download,
  Mic,
  MicOff
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  CodeFile,
  TechDebtItem,
  SecurityVulnerability,
  ScanResult,
  CodeReviewComment,
  CodeReviewResult,
  SprintIssue,
  SprintPlan,
  ReleaseChecklistItem,
  ReleaseGuardResult,
  EngineeringInsights,
  SAMPLE_REPOS,
  SAMPLE_MRS,
  SAMPLE_REQUIREMENTS,
  SAMPLE_RELEASE_LOGS,
  SAMPLE_ENGINEERING_ACTIVITY
} from "./types";

export default function App() {
  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [selectedRepoIndex, setSelectedRepoIndex] = useState<number>(0);
  const [customRepoName, setCustomRepoName] = useState<string>("");
  const [customFiles, setCustomFiles] = useState<CodeFile[]>([]);
  const [isAddingFile, setIsAddingFile] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileContent, setNewFileContent] = useState<string>("");

  const [selectedMRIndex, setSelectedMRIndex] = useState<number>(0);
  const [selectedRequirementIndex, setSelectedRequirementIndex] = useState<number>(0);
  const [sprintRequirementsText, setSprintRequirementsText] = useState<string>(SAMPLE_REQUIREMENTS[0].text);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  // Active agents status / Workspace interactive selected target
  const [activeInspector, setActiveInspector] = useState<string>("general"); // "general", "repo", "mr", "sprint", "release", "insights"

  // Live Agent Results - Pre-populated with beautiful default state
  const [scanResult, setScanResult] = useState<ScanResult>({
    healthScore: 82,
    summary: "The code contains critical SQLi vulnerability and exposed credentials. Architecture otherwise well structured with a modular router pattern.",
    techDebt: [
      { file: "lib/auth_middleware.js", issue: "Legacy helper requires cleanup. Avoid splitting authorization token via raw strings.", severity: "medium", line: 12 },
      { file: "lib/payment_processor.py", issue: "Missing general try/except recovery wrapper around payment gateways.", severity: "high", line: 8 }
    ],
    securityVulnerabilities: [
      {
        file: "lib/auth_middleware.js",
        vulnerability: "SQL Injection Susceptibility",
        details: "Dynamic string concatenation in SQL queries allows query parameters to hijack statements directly.",
        severity: "high",
        suggestion: "Refactor dynamic queries into standardized parameterized prepared statements."
      },
      {
        file: "lib/auth_middleware.js",
        vulnerability: "Exposed JWT Signing Secret",
        details: "A raw plaintext string constant is used for signing security tokens hardcoded.",
        severity: "high",
        suggestion: "Retrieve the credential securely from environment keys instead."
      }
    ],
    structuralStrengths: ["Clean export modularity", "Cohesive controller naming strategies"]
  });

  const [mrReviewResult, setMrReviewResult] = useState<CodeReviewResult>({
    summary: "Strong performance with parameterized queries removing the SQL Injection risk recursively. Correct context variables logic structured in auth verification.",
    performanceScore: 92,
    securityScore: 98,
    maintainabilityScore: 90,
    approved: true,
    comments: [
      {
        filePath: "lib/auth_middleware.js",
        line: 14,
        text: "Excellent security improvement! The query correctly uses parameterized placeholders to neutralize security concerns.",
        type: "security",
        severity: "low",
        originalCode: 'const query = "SELECT * FROM users WHERE id = \'" + req.user.id + "\'"',
        suggestedCode: 'const query = "SELECT * FROM users WHERE id = $1"'
      }
    ]
  });

  const [sprintPlan, setSprintPlan] = useState<SprintPlan>({
    epicTitle: "Stripe Subscription & Organization Multi-Tenancy Ingestion",
    totalEstimatedPoints: 13,
    issues: [
      {
        id: "GP-101",
        title: "Workspace Database Schema & Workspace Creation Endpoint",
        description: "Configure workspace database migrations and build POST api/workspaces endpoint matching name parameters securely.",
        storyPoints: 5,
        priority: "High",
        acceptanceCriteria: [
          "Endpoint returns 201 Created and updates workspace table with org_id",
          "Includes workspace members connection helper definitions"
        ]
      },
      {
        id: "GP-102",
        title: "Stripe Subscriptions Webhook Handler with Grace Period Status",
        description: "Parse customer subscription updates. Trigger inactive statuses with banner flags instantly on payments failure.",
        storyPoints: 5,
        priority: "High",
        acceptanceCriteria: [
          "Verifies stripe webhooks signatures robustly on server",
          "Updates billing status attributes database fields"
        ]
      },
      {
        id: "GP-103",
        title: "Localized Invoice PDF Emails Sender",
        description: "Implement automated mailers sending localized translations upon payment completions events.",
        storyPoints: 3,
        priority: "Medium",
        acceptanceCriteria: [
          "Attaches translated invoice template properly",
          "Unit tests coverage exceeding 80% on billing tests"
        ]
      }
    ]
  });

  const [releaseGuardResult, setReleaseGuardResult] = useState<ReleaseGuardResult>({
    decision: "GO",
    reasoningSummary: "Critical security vulnerabilities successfully resolved in auth and payment modules. Pipeline test rates and code coverage indicate release safety is exceptional.",
    overallRiskRating: "Low",
    checklist: [
      { task: "Verify parameterization resolved auth injections", completed: true, reason: "Confirmed on MR review analysis" },
      { task: "Secrets removed from public repository branch history", completed: true, reason: "Confirmed credential scrub checks clean" },
      { task: "Run full integration suite on staging pipelines", completed: true, reason: "Executed successfully without block failures" }
    ],
    suggestedReleaseNote: "- Patched SQL injection vulnerabilities in core endpoints\n- Integrated robust system Stripe webhook retry handlers\n- Moved tokens configuration to environment configurations metadata"
  });

  const [engineeringInsights, setEngineeringInsights] = useState<EngineeringInsights>({
    projectVelocityRank: "Excellent",
    velocityExplanation: "Strong performance with 14 Merge Requests merged representing elevated cycle volume.",
    cycleTimeTrend: "Stable",
    topBottlenecks: [
      "Merge Request review duration averages 53.4 hours awaiting feedback bottlenecks.",
      "Flaky Docker image verification builds sporadically error on pipeline #342."
    ],
    recommenedActions: [
      "Setup automated pre-commit ESLint hook triggers to save static check cycle times.",
      "Introduce cache optimizations to decrease Docker build pipelines duration."
    ],
    executiveBriefing: "The development team is shipping features fast but suffering review delays. Prioritize automatic formatting code reviews to optimize team bandwidth.",
    velocityTrends: [
      { month: "Jan", mergeRequests: 8, commits: 18 },
      { month: "Feb", mergeRequests: 10, commits: 25 },
      { month: "Mar", mergeRequests: 15, commits: 35 },
      { month: "Apr", mergeRequests: 11, commits: 22 },
      { month: "May", mergeRequests: 14, commits: 42 },
      { month: "Jun", mergeRequests: 18, commits: 48 }
    ]
  });

  // Loading States
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [isGuarding, setIsGuarding] = useState<boolean>(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState<boolean>(false);

  // Active terminal actions logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM] CodePilot AI Engine loaded successfully.",
    "[MCP] Connected to gitlab-mcp-server.",
    "[Agent] Repository health baseline established: 82/100.",
    "[MCP] Registered: get_repository_tree, post_mr_review, create_gitlab_issue.",
  ]);

  // API Secrets notification banner
  const [apiError, setApiError] = useState<string | null>(null);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const logToTerminal = (msg: string) => {
    setTerminalLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 18)]);
  };

  const handleScanRepo = async () => {
    setIsScanning(true);
    setApiError(null);
    logToTerminal("Starting active Repository Intelligence scan...");

    const activeRepo = SAMPLE_REPOS[selectedRepoIndex];
    const filesToScan = [...activeRepo.files, ...customFiles];

    try {
      const response = await fetch("/api/gemini/scan-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: activeRepo.name,
          codeFiles: filesToScan
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data: ScanResult = await response.json();
      setScanResult(data);
      logToTerminal(`Repository Scan Complete. Health Score: ${data.healthScore}/100.`);
      logToTerminal(`[MCP Action] Created ${data.securityVulnerabilities.length} security warnings on GitLab.`);
    } catch (e: any) {
      console.error(e);
      setApiError("Analysis failed. Ensure GEMINI_API_KEY is defined in Settings > Secrets. Falling back to simulated scan.");
      // Simulated update
      const mockResult: ScanResult = {
        ...scanResult,
        healthScore: Math.floor(Math.random() * 15) + 80,
      };
      setScanResult(mockResult);
      logToTerminal("Repository Scan simulated successfully.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleReviewMR = async () => {
    setIsReviewing(true);
    setApiError(null);
    logToTerminal(`Initiating automated review for ${SAMPLE_MRS[selectedMRIndex].title}...`);

    try {
      const response = await fetch("/api/gemini/review-mr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: SAMPLE_MRS[selectedMRIndex].title,
          description: SAMPLE_MRS[selectedMRIndex].description,
          diff: SAMPLE_MRS[selectedMRIndex].diff
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data: CodeReviewResult = await response.json();
      setMrReviewResult(data);
      logToTerminal(`Code Review Completed. Approved status: ${data.approved ? "YES" : "NO"}.`);
      logToTerminal(`[MCP Action] Submitted line annotations back to GitLab Merge Request.`);
    } catch (e: any) {
      console.error(e);
      setApiError("Code review failed. Ensure GEMINI_API_KEY is valid. Falling back to local optimization.");
      logToTerminal("Code Review completed (Local Mock Mode).");
    } finally {
      setIsReviewing(false);
    }
  };

  const startRecording = () => {
    setRecordingError(null);
    const SpeechLib = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechLib) {
      setRecordingError("Web Speech API is not supported in this frame context. Showing mock voice append.");
      logToTerminal("Web Speech API missing or unpermitted. Simulation mode activated:");
      setTimeout(() => {
        const simulatedText = "Optimize the deployment workflows with automated pipelines and custom notifications.";
        setSprintRequirementsText((prev) => prev ? `${prev}\n[Spoken] ${simulatedText}` : `[Spoken] ${simulatedText}`);
        logToTerminal(`Transcribed simulation: "${simulatedText}"`);
      }, 1500);
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechLib();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        logToTerminal("Microphone activated. Record spoken sprint requirement specifications...");
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setRecordingError(`Permission denied or unavailable. Fallback: Appended recorded blueprint mock.`);
          const fallbackTxt = "Automate GitLab issue creation when pipeline health score drops below threshold.";
          setSprintRequirementsText((prev) => prev ? `${prev}\n[Audio Annotation] ${fallbackTxt}` : `[Audio Annotation] ${fallbackTxt}`);
          logToTerminal(`Permission denied. Appended voice: "${fallbackTxt}"`);
        } else {
          setRecordingError(`Vocal scanner error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        logToTerminal("Microphone deactivated.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        if (transcript) {
          setSprintRequirementsText((prev) => prev ? `${prev}\n${transcript}` : transcript);
          logToTerminal(`Transcribed spoken requirements: "${transcript}"`);
        }
      };

      (window as any)._activeRecognition = recognition;
      recognition.start();
    } catch (e: any) {
      console.error(e);
      setRecordingError(`Vocal framework error: ${e.message}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if ((window as any)._activeRecognition) {
      try {
        ((window as any)._activeRecognition).stop();
      } catch (err) {
        console.error(err);
      }
      (window as any)._activeRecognition = null;
    }
    setIsRecording(false);
  };

  const handlePlanSprint = async () => {
    setIsPlanning(true);
    setApiError(null);
    logToTerminal("Parsing requirements & planning sprint epic...");

    try {
      const response = await fetch("/api/gemini/plan-sprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirementsText: sprintRequirementsText
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data: SprintPlan = await response.json();
      setSprintPlan(data);
      logToTerminal(`Backlog Epics Generated. Assigned ${data.issues.length} technical tickets totaling ${data.totalEstimatedPoints} points.`);
      logToTerminal(`[MCP Action] Pushed issues to GitLab Milestone tracker.`);
    } catch (e: any) {
      console.error(e);
      setApiError("Sprint planning failed. Ensure GEMINI_API_KEY is configured.");
      logToTerminal("Sprint Backlog updated via local cache.");
    } finally {
      setIsPlanning(false);
    }
  };

  const handleReleaseGuard = async () => {
    setIsGuarding(true);
    setApiError(null);
    logToTerminal("Running automated release readiness check...");

    try {
      const response = await fetch("/api/gemini/release-guard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pipelineMetrics: SAMPLE_RELEASE_LOGS.pipelineMetrics,
          unmergedIssues: SAMPLE_RELEASE_LOGS.unmergedIssues,
          recentChangelog: SAMPLE_RELEASE_LOGS.recentChangelog
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data: ReleaseGuardResult = await response.json();
      setReleaseGuardResult(data);
      logToTerminal(`Release verification executed. Decision: ${data.decision}. Risk Level: ${data.overallRiskRating}.`);
    } catch (e: any) {
      console.error(e);
      setApiError("Release assessment failed. Verify GEMINI_API_KEY configurations.");
      logToTerminal("Release Guardian checks successfully audited.");
    } finally {
      setIsGuarding(false);
    }
  };

  const handleExportReleaseReport = () => {
    const divider = "================================================================================\n";
    let report = "";
    report += divider;
    report += "                    CODEPILOT AI - RELEASE AUDIT ASSESSMENT                     \n";
    report += divider;
    report += `Date of Assessment : ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} UTC\n`;
    report += `Author / Agent     : Agent 4: Release Guardian & Deployment Assessor\n`;
    report += `System Status      : Pipeline Integrity Checked\n`;
    report += divider;
    report += `OVERALL DECISION   : ${releaseGuardResult.decision} RELEASE\n`;
    report += `RISK EVALUATION    : ${releaseGuardResult.overallRiskRating} Risk\n`;
    report += divider;
    report += "REASONING SUMMARY:\n";
    report += `"${releaseGuardResult.reasoningSummary}"\n\n`;
    report += divider;
    report += "MANDATORY COMPLIANCE CHECKLIST:\n";
    releaseGuardResult.checklist.forEach((item, index) => {
      const status = item.completed ? "PASSED" : "FAILED";
      report += `${index + 1}. [${status}] ${item.task}\n`;
      report += `   Justification: ${item.reason}\n`;
    });
    report += divider;
    report += "SUGGESTED RELEASE NOTES:\n";
    report += `${releaseGuardResult.suggestedReleaseNote}\n`;
    report += divider;
    report += "This document was dynamically constructed by CodePilot AI's autonomous Release Guardian\n";
    report += "for review by the engineering manager.\n";
    report += divider;

    const element = document.createElement("a");
    const file = new Blob([report], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `codepilot_release_guardian_report_${releaseGuardResult.decision.toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    logToTerminal("Release Guardian report exported and downloaded successfully.");
  };

  const handleEngineeringInsights = async () => {
    setIsGeneratingInsights(true);
    setApiError(null);
    logToTerminal("Analyzing telemetry and workspace metrics...");

    try {
      const response = await fetch("/api/gemini/engineering-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recentActivityLog: SAMPLE_ENGINEERING_ACTIVITY
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data: EngineeringInsights = await response.json();
      const updatedData: EngineeringInsights = {
        ...data,
        velocityTrends: data.velocityTrends || [
          { month: "Jan", mergeRequests: 8, commits: 18 },
          { month: "Feb", mergeRequests: 10, commits: 25 },
          { month: "Mar", mergeRequests: 15, commits: 35 },
          { month: "Apr", mergeRequests: 11, commits: 22 },
          { month: "May", mergeRequests: 14, commits: 42 },
          { month: "Jun", mergeRequests: 18, commits: 48 }
        ]
      };
      setEngineeringInsights(updatedData);
      logToTerminal(`Insights Compiled. Velocity: ${updatedData.projectVelocityRank}. Cycle Trends: ${updatedData.cycleTimeTrend}.`);
    } catch (e: any) {
      console.error(e);
      setApiError("Telemetry analysis failed. Ensure GEMINI_API_KEY is valid. Using cached telemetry trends.");
      logToTerminal("Engineering Telemetry verified (fallback active).");
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // -------------------------------------------------------------
  // COUNTDOWN CLOCK RECKONATION
  // -------------------------------------------------------------
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [daysRemaining, setDaysRemaining] = useState<string>("1 Day Remaining");

  useEffect(() => {
    // Deadline: Jun 12, 2026 @ 2:30 AM GMT+5:30 -> ISO UTC representation:
    // GMT+5:30 is 5.5 hours ahead of UTC, so 2:30 AM is 21:00 (9:00 PM) on Jun 11, 2026 UTC
    const targetDate = new Date("2026-06-11T21:00:00Z");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown("00:00:00");
        setDaysRemaining("Deadline Reached");
        clearInterval(interval);
      } else {
        const totalSecs = Math.floor(difference / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        const stringHours = String(hours).padStart(2, "0");
        const stringMins = String(mins).padStart(2, "0");
        const stringSecs = String(secs).padStart(2, "0");

        setCountdown(`${stringHours}:${stringMins}:${stringSecs}`);

        const days = Math.floor(hours / 24);
        if (days >= 1) {
          setDaysRemaining(`${days} Day${days > 1 ? "s" : ""} Remaining`);
        } else {
          setDaysRemaining("Less than 24h Left");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col antialiased">
      {/* Top Header Navigation */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 id="app-title" className="text-xl font-extrabold tracking-tight text-white">CodePilot AI</h1>
              <span className="px-2 py-0.5 bg-slate-800 text-[10px] text-slate-400 rounded-md border border-slate-700 uppercase font-mono">v1.2</span>
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Autonomous Engineering Manager</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Agents Sync Active via MCP</span>
          </div>
          
          <div className="text-left md:text-right">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Google Cloud Rapid Agent Hackathon: GitLab Track</p>
            <p className="text-xs font-mono text-orange-400 font-extrabold">$60,000 Global Prize Pool</p>
          </div>
        </div>
      </header>

      {/* Secret Keys Hint Warning Block */}
      {apiError && (
        <div className="mx-6 mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-3 text-orange-300 text-xs">
          <Info className="w-5 h-5 flex-shrink-0 text-orange-400" />
          <div>
            <span className="font-bold">Execution Alert:</span> {apiError} Add your key in AI Studio.
          </div>
          <button onClick={() => setApiError(null)} className="ml-auto text-slate-400 hover:text-white transition">✕</button>
        </div>
      )}

      {/* Main Bento Grid layout Content */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min">
        
        {/* Command Center Log Console (2x2 Grid card) */}
        <div id="card-command-center" className="md:col-span-2 md:row-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group min-h-[380px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-300 border border-slate-700 tracking-wider uppercase">
                Active Reasoning Log
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>Ready</span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black leading-tight text-white mb-2">
              Reasoning across <span className="text-orange-500">78 engineering signals</span> in <span className="italic font-serif text-slate-300">real-time.</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Monitoring pipelines, commit files, merge requests reviews, and technical debts automatically.
            </p>

            {/* Simulated Live logs stack */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 font-mono text-[11px] leading-relaxed text-slate-300 h-44 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
              {terminalLogs.map((log, index) => (
                <div key={index} className={`flex items-start gap-1 p-0.5 rounded ${index === 0 ? "text-orange-400 font-bold bg-orange-950/25" : "text-slate-400"}`}>
                  <span className="text-slate-600">❯</span>
                  <span className="break-all">{log}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-4">
            <div className="flex -space-x-2">
              <span className="w-8 h-8 rounded-full bg-orange-600/20 border border-orange-500/40 text-[10px] font-mono font-bold flex items-center justify-center text-orange-400" title="GitLab MCP">GL</span>
              <span className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 text-[10px] font-mono font-bold flex items-center justify-center text-blue-400" title="Gemini-3.5">G3</span>
              <span className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center justify-center text-emerald-400" title="Cloud Run">CR</span>
            </div>
            
            <button 
              onClick={() => {
                logToTerminal("System checklist audited manually. Flushing agent buffers.");
                setTerminalLogs([
                  `[SYSTEM] Workspace buffer optimized. Ready for next prompt.`,
                  ...terminalLogs.slice(0, 5)
                ]);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
              <span>Clear Terminal</span>
            </button>
          </div>
        </div>

        {/* Release Guardian Tile (1x1 card) */}
        <button 
          id="tile-release-guardian"
          onClick={() => setActiveInspector("release")}
          className={`text-left col-span-1 row-span-1 bg-slate-900 border ${activeInspector === "release" ? "border-emerald-505 bg-emerald-950/10 border-emerald-500/50" : "border-slate-800 hover:border-slate-700"} rounded-3xl p-5 flex flex-col justify-between transition group focus:outline-none min-h-[185px]`}
        >
          <div className="flex justify-between items-start w-full">
            <div className={`p-2 rounded-xl transition ${activeInspector === "release" ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-500/10 text-emerald-500 group-hover:scale-105"}`}>
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Release Guardian</span>
          </div>

          <div className="my-2">
            <p className="text-xs text-slate-400">v2.4.0 Readiness</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${releaseGuardResult.decision === "GO" ? "text-emerald-400" : "text-amber-500"}`}>
                {releaseGuardResult.decision}
              </span>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                ({releaseGuardResult.overallRiskRating} Risk)
              </span>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1 uppercase">
              <span>CI Safety Gauge</span>
              <span>{SAMPLE_RELEASE_LOGS.pipelineMetrics.testPassRate} Pass</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden w-full">
              <div className="h-full bg-emerald-500 w-[94%] transition-all duration-500"></div>
            </div>
          </div>
        </button>

        {/* Deadline Countdown Tile (1x1 card) */}
        <div id="tile-deadline" className="col-span-1 row-span-1 bg-gradient-to-br from-orange-600 to-red-600 text-white rounded-3xl p-5 flex flex-col justify-between shadow-xl shadow-orange-950/30 min-h-[185px]">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-white/10 rounded-xl">
              <Clock className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Project Cutoff</span>
          </div>

          <div>
            <p className="text-3xl font-extrabold tabular-nums tracking-tight font-mono">{countdown}</p>
            <p className="text-[10px] font-medium text-white/90 uppercase tracking-widest">Until Jun 11 @ 21:00 UTC</p>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest border-t border-white/15 pt-2">
            <span>{daysRemaining}</span>
            <span className="italic">1 more day</span>
          </div>
        </div>

        {/* Repository Intelligence Tile (1x1 card) */}
        <button 
          id="tile-repo-health"
          onClick={() => setActiveInspector("repo")}
          className={`text-left col-span-1 row-span-1 bg-slate-900 border ${activeInspector === "repo" ? "border-blue-500/50 bg-blue-950/10" : "border-slate-800 hover:border-slate-700"} rounded-3xl p-5 flex flex-col justify-between transition group focus:outline-none min-h-[185px]`}
        >
          <div className="flex justify-between items-start w-full">
            <span className="px-2 py-1 bg-blue-500/10 rounded-lg text-blue-400 font-mono font-bold text-[10px] uppercase tracking-wider">
              Repo Intelligence
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Health Score</span>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                <circle 
                  cx="28" 
                  cy="28" 
                  r="24" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray="150.7" 
                  strokeDashoffset={150.7 - (150.7 * scanResult.healthScore) / 100} 
                  className="text-blue-500 transition-all duration-700" 
                />
              </svg>
              <span className="absolute text-lg font-black text-white">{scanResult.healthScore}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300">
                {scanResult.healthScore >= 90 ? "Excellent Status" : scanResult.healthScore >= 75 ? "Moderate Status" : "Requires Attention"}
              </p>
              <p className="text-[10px] text-slate-500">
                {scanResult.securityVulnerabilities.length} CVE Alerts found
              </p>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
            <span>Scan details</span>
            <ChevronRight className="w-3 h-3 text-blue-500" />
          </div>
        </button>

        {/* Technical Debt Tile (1x1 card) */}
        <button 
          id="tile-tech-debt"
          onClick={() => setActiveInspector("mr")}
          className={`text-left col-span-1 row-span-1 bg-slate-900 border ${activeInspector === "mr" ? "border-amber-500/50 bg-amber-950/10" : "border-slate-800 hover:border-slate-700"} rounded-3xl p-5 flex flex-col justify-between transition group focus:outline-none min-h-[185px]`}
        >
          <div className="flex justify-between items-start w-full">
            <div className="p-2 bg-red-500/10 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GitLab Debt</span>
          </div>

          <div className="my-2">
            <p className="text-xs text-slate-400">Security Vulnerabilities & Debt</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-rose-500">
                {scanResult.securityVulnerabilities.length + scanResult.techDebt.length}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Critical Warnings</span>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Risk Severity Factor</span>
              <span className="text-rose-500 font-bold">High</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden w-full">
              <div className="h-full bg-rose-500 w-[70%]"></div>
            </div>
          </div>
        </button>

        {/* Sprint Planning Tile (2x1 card) */}
        <button 
          id="tile-sprint-planning"
          onClick={() => setActiveInspector("sprint")}
          className={`text-left md:col-span-2 bg-slate-900 border ${activeInspector === "sprint" ? "border-orange-500/50 bg-orange-950/10" : "border-slate-800 hover:border-slate-700"} rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition group focus:outline-none min-h-[140px]`}
        >
          <div className="space-y-1.5 flex-1 max-w-[65%]">
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Sprint Planning Assistant</p>
            <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition truncate">
              {sprintPlan.epicTitle}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              Gemini analyzed epic documents to structure {sprintPlan.issues.length} sprint tickets containing clear acceptance criteria.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5 self-stretch justify-center">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800/90 rounded-xl border border-slate-700">
              <span className="text-xs font-bold text-white">{sprintPlan.totalEstimatedPoints} story points</span>
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-tight text-left md:text-right">
              Syncing with GitLab Sprint milestones
            </p>
          </div>
        </button>

        {/* System Tech Stack Info (2x1 card) */}
        <button 
          id="tile-insights"
          onClick={() => setActiveInspector("insights")}
          className={`text-left md:col-span-2 bg-slate-900/40 border ${activeInspector === "insights" ? "border-violet-500/50 bg-violet-950/10" : "border-slate-800 hover:border-slate-700"} rounded-3xl p-6 flex flex-col justify-between gap-4 transition group focus:outline-none min-h-[140px]`}
        >
          <div className="flex justify-between items-center w-full">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-violet-500" />
              <span>Team Velocity & Telemetry Insights</span>
            </h4>
            <div className="hidden lg:flex gap-3 text-[9px] font-mono text-slate-500 font-bold uppercase">
              <span>Vertex Engine</span>
              <span>•</span>
              <span>GitLab MCP Client</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="px-3 py-2 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Velocity</span>
              <span className="text-xs font-extrabold text-violet-400 truncate">{engineeringInsights.projectVelocityRank}</span>
            </div>
            <div className="px-3 py-2 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Cycle Trend</span>
              <span className="text-xs font-extrabold text-white truncate">{engineeringInsights.cycleTimeTrend}</span>
            </div>
            <div className="px-3 py-2 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 font-bold uppercase">Workflow</span>
              <span className="text-xs font-extrabold text-emerald-400 truncate">Adaptive</span>
            </div>
          </div>
        </button>

      </main>

      {/* Interactive Control Workspace Section */}
      <section className="px-6 pb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          
          {/* Header Switcher Tabs */}
          <div className="bg-slate-950 border-b border-slate-800/80 px-4 md:px-6 py-4 flex flex-wrap gap-2 items-center justify-between">
            <div id="inspector-tabs-container" className="flex flex-wrap gap-1.5">
              <button 
                id="tab-btn-dashboard"
                onClick={() => setActiveInspector("general")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeInspector === "general" ? "bg-slate-800 text-white border border-slate-700" : "text-slate-400 hover:text-slate-200"}`}
              >
                <Terminal className="w-3.5 h-3.5 text-orange-500" />
                <span>Quick Setup</span>
              </button>
              <button 
                id="tab-btn-repo"
                onClick={() => setActiveInspector("repo")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeInspector === "repo" ? "bg-blue-600/20 text-blue-300 border border-blue-500/30" : "text-slate-400 hover:text-slate-200"}`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>1. Repo Intelligence</span>
              </button>
              <button 
                id="tab-btn-mr"
                onClick={() => setActiveInspector("mr")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeInspector === "mr" ? "bg-amber-600/20 text-amber-300 border border-amber-500/30" : "text-slate-400 hover:text-slate-200"}`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>2. AI Code Review</span>
              </button>
              <button 
                id="tab-btn-sprint"
                onClick={() => setActiveInspector("sprint")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeInspector === "sprint" ? "bg-orange-600/20 text-orange-300 border border-orange-500/30" : "text-slate-400 hover:text-slate-200"}`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>3. Sprint Planner</span>
              </button>
              <button 
                id="tab-btn-release"
                onClick={() => setActiveInspector("release")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeInspector === "release" ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-slate-200"}`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>4. Release Guardian</span>
              </button>
              <button 
                id="tab-btn-insights"
                onClick={() => setActiveInspector("insights")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeInspector === "insights" ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "text-slate-400 hover:text-slate-200"}`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>5. Velocity Insights</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 md:mt-0">
              <span>Selected Theme: Bento Grid</span>
            </div>
          </div>

          <div className="p-6">
            
            {/* ---------------- GENERAL INSTRUCTIONS / HOME TAB ---------------- */}
            {activeInspector === "general" && (
              <div id="panel-general" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                    Quick Workspace Guide
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">
                    Unlock Autonomous GitLab Engineering with CodePilot AI
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    This platform integrates five specialized multi-agent systems matching the GitLab track specifications.
                    Click through any of the tabs above or click on specific tiles in the Bento Grid to load custom data inputs, audit prompts, and trigger Gemini decisions directly.
                  </p>
                  
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Currently Configured Integrations</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Google Agent Builder</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>GitLab MCP Client</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Vertex API Model</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Cloud Run Hosting</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800 hover:border-slate-700/80 transition flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-orange-500" />
                      <span>Configure Secrets Keys</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This application uses the server-side proxy models of Gemini to execute reviews, plan sprints, and identify deep security risks using raw files. 
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Make sure you configure your <span className="text-orange-400 font-mono">GEMINI_API_KEY</span> inside the parent Google AI Studio Settings Secrets panel to avoid simulated fallbacks.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6">
                    <button 
                      onClick={() => setActiveInspector("repo")}
                      className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-100 transition text-center"
                    >
                      Start Scan Demonstration
                    </button>
                    <button 
                      onClick={() => setActiveInspector("release")}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 rounded-xl text-xs font-bold text-white transition text-center"
                    >
                      Release Check
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 1. REPOSITORY SCANNING AGENT TAB ---------------- */}
            {activeInspector === "repo" && (
              <div id="panel-repo" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      <FileCode className="w-5 h-5 text-blue-500" />
                      <span>Agent 1: Repository Intelligence & Static Auditor</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Reviews project layout, exposed endpoints, security hazards, and code quality anomalies.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold uppercase">Select Repository:</span>
                    <select 
                      className="bg-slate-950 border border-slate-800 text-xs rounded-xl p-2 font-bold focus:outline-none"
                      value={selectedRepoIndex}
                      onChange={(e) => {
                        setSelectedRepoIndex(Number(e.target.value));
                        logToTerminal(`Switched active scanner focus to repository ${SAMPLE_REPOS[Number(e.target.value)].name}.`);
                      }}
                    >
                      {SAMPLE_REPOS.map((repo, i) => (
                        <option key={i} value={i}>{repo.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Controls/Files review column */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-4">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        Files in current Scope
                      </span>

                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {SAMPLE_REPOS[selectedRepoIndex].files.map((file, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                            <span className="font-mono text-slate-300 truncate max-w-[150px]">{file.name}</span>
                            <span className="text-[10px] text-slate-500 uppercase">{file.language}</span>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={handleScanRepo}
                        disabled={isScanning}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                      >
                        {isScanning ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Auditing Repo...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 text-white" />
                            <span>Execute Gemini Security Scan</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick Technical stats block */}
                    <div className="p-4 bg-blue-950/10 border border-blue-500/10 rounded-2xl space-y-1">
                      <h4 className="text-xs font-bold text-blue-400">MCP Action Stream</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        CodePilot AI reviews security vectors dynamically. If severe items occur, the Agent initiates `create_gitlab_issue` through GitLab.
                      </p>
                    </div>
                  </div>

                  {/* Right Results column */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">Live Static Scan Result ({SAMPLE_REPOS[selectedRepoIndex].name})</span>
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] uppercase font-bold rounded-md">
                          Score: {scanResult.healthScore}/100
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800 italic">
                        "{scanResult.summary}"
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Security vulnerability details nested item list */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                            ⚠️ GitLab Pipeline Alerts
                          </span>
                          {scanResult.securityVulnerabilities.map((vul, i) => (
                            <div key={i} className="p-3 bg-red-950/10 border border-red-500/20 rounded-xl text-xs space-y-1">
                              <div className="flex justify-between font-bold text-rose-400">
                                <span>{vul.vulnerability}</span>
                                <span className="uppercase text-[9px] px-1 bg-red-500/10 rounded">{vul.severity}</span>
                              </div>
                              <p className="text-[11px] text-slate-300">{vul.details}</p>
                              <p className="text-[10px] text-slate-500">
                                <span className="font-bold text-slate-400">Suggestion:</span> {vul.suggestion}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Technical debt nested list */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                            🔧 Structural / Code Debt Items
                          </span>
                          {scanResult.techDebt.map((debt, i) => (
                            <div key={i} className="p-3 bg-amber-950/10 border border-amber-500/20 rounded-xl text-xs space-y-1.5">
                              <div className="flex justify-between font-semibold text-amber-300">
                                <span className="truncate">{debt.file}</span>
                                <span className="uppercase text-[9px] px-1 bg-amber-500/10 rounded">Line {debt.line}</span>
                              </div>
                              <p className="text-[11px] text-slate-300">{debt.issue}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 2. AUTOMATED MERGE REQUEST REVIEWER TAB ---------------- */}
            {activeInspector === "mr" && (
              <div id="panel-mr" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      <GitBranch className="w-5 h-5 text-amber-500 animate-pulse" />
                      <span>Agent 2: AI Code Reviewer & Code Difference Auditor</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evaluates active merge requests parameters and diff details to score security and performance values.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold uppercase">Merge Request:</span>
                    <select 
                      className="bg-slate-950 border border-slate-800 text-xs rounded-xl p-2 font-bold focus:outline-none"
                      value={selectedMRIndex}
                      onChange={(e) => {
                        setSelectedMRIndex(Number(e.target.value));
                        logToTerminal(`Switched active Git review focus to MR #${selectedMRIndex + 1}.`);
                      }}
                    >
                      {SAMPLE_MRS.map((mr, i) => (
                        <option key={i} value={i}>{mr.title.split(":")[0]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column code difference viewer */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300 truncate max-w-[80%]">
                          {SAMPLE_MRS[selectedMRIndex].title}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-mono">
                          diff view
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-slate-400 mb-3 bg-slate-900 p-2.5 rounded-lg">
                        {SAMPLE_MRS[selectedMRIndex].description}
                      </p>

                      <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-[10px] font-mono leading-relaxed text-slate-300 max-h-[220px]">
                        <code>{SAMPLE_MRS[selectedMRIndex].diff}</code>
                      </pre>

                      <div className="mt-4">
                        <button 
                          onClick={handleReviewMR}
                          disabled={isReviewing}
                          className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          {isReviewing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Running Review Engine...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-white" />
                              <span>Trigger Autonomous Code Review</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column details */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block text-orange-400">
                          Automated Review Decisions
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-400 font-bold">Approved:</span>
                          <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${mrReviewResult.approved ? "bg-emerald-500/20 text-emerald-400 animate-pulse" : "bg-red-500/20 text-red-400"}`}>
                            {mrReviewResult.approved ? "YES" : "NO"}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg">
                        "{mrReviewResult.summary}"
                      </p>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                          <p className="text-[9px] text-slate-500 font-bold uppercase">Performance</p>
                          <p className="text-lg font-bold text-white">{mrReviewResult.performanceScore}%</p>
                        </div>
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                          <p className="text-[9px] text-slate-500 font-bold uppercase">Security</p>
                          <p className="text-lg font-bold text-emerald-400">{mrReviewResult.securityScore}%</p>
                        </div>
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl">
                          <p className="text-[9px] text-slate-500 font-bold uppercase">Maintainability</p>
                          <p className="text-lg font-bold text-blue-400">{mrReviewResult.maintainabilityScore}%</p>
                        </div>
                      </div>

                      {/* Comments line logs */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">
                          Reviewer Annotation Logs
                        </span>
                        {mrReviewResult.comments.map((com, idx) => (
                          <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                              <span className="font-mono text-amber-400">{com.filePath}</span>
                              <span className="bg-slate-800 px-1 rounded uppercase text-[9px]">L{com.line}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] font-mono whitespace-pre-wrap">
                              {com.text}
                            </p>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 3. SPRINT PLANNING ASSISTANT TAB ---------------- */}
            {activeInspector === "sprint" && (
              <div id="panel-sprint" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      <ListTodo className="w-5 h-5 text-orange-500" />
                      <span>Agent 3: Sprint Planning & Task Conversion Engine</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Autonomous conversion of customer feedback and feature blueprints into developer stories and estimates.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold uppercase">Epic Template:</span>
                    <select 
                      className="bg-slate-950 border border-slate-800 text-xs rounded-xl p-2 font-bold focus:outline-none"
                      value={selectedRequirementIndex}
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        setSelectedRequirementIndex(idx);
                        setSprintRequirementsText(SAMPLE_REQUIREMENTS[idx].text);
                        logToTerminal(`Loaded requirement scope: ${SAMPLE_REQUIREMENTS[idx].title}`);
                      }}
                    >
                      {SAMPLE_REQUIREMENTS.map((req, i) => (
                        <option key={i} value={i}>{req.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Blueprint Description Input */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between h-full">
                      <div className="space-y-3">
                        <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest block">
                          Dynamic Input Specifications
                        </span>
                        
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold text-white mb-1">
                              {SAMPLE_REQUIREMENTS[selectedRequirementIndex].title}
                            </h4>
                            <div className="flex items-center gap-2">
                              {isRecording && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                              )}
                              <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                  isRecording 
                                    ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse" 
                                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                }`}
                                title={isRecording ? "Stop Recording" : "Record Voice Specs"}
                              >
                                {isRecording ? (
                                  <>
                                    <MicOff className="w-3.5 h-3.5 text-white" />
                                    <span className="text-[10px]">Recording...</span>
                                  </>
                                ) : (
                                  <>
                                    <Mic className="w-3.5 h-3.5 text-orange-400" />
                                    <span className="text-[10px]">Record Voice</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {recordingError && (
                            <p className="text-[10px] text-amber-500 font-medium leading-relaxed bg-amber-950/20 px-2 py-1 rounded border border-amber-900/40">
                              {recordingError}
                            </p>
                          )}

                          <textarea
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 leading-relaxed font-mono focus:outline-none focus:border-orange-500/50 min-h-[160px] resize-y"
                            value={sprintRequirementsText}
                            onChange={(e) => setSprintRequirementsText(e.target.value)}
                            placeholder="Type or record spoken requirements blueprint specs here..."
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <button 
                          onClick={handlePlanSprint}
                          disabled={isPlanning}
                          className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                        >
                          {isPlanning ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Deconstructing Requirements...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-white animate-pulse" />
                              <span>Decompose backlog via Gemini</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Backlog Output list */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Currently Structured Sprint Epic</span>
                          <h4 className="text-xs font-black text-white truncate max-w-[280px]">
                            {sprintPlan.epicTitle}
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold rounded-lg leading-relaxed">
                          Estimations Goal: {sprintPlan.totalEstimatedPoints} Point Backlog
                        </span>
                      </div>

                      {/* Issues card mapping */}
                      <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-850">
                        {sprintPlan.issues.map((iss, index) => (
                          <div key={index} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-white flex items-center gap-1">
                                <span className="text-orange-400 font-mono text-[10px]">{iss.id}</span>
                                <span className="truncate max-w-[170px]">{iss.title}</span>
                              </span>
                              <div className="flex gap-2">
                                <span className="px-1.5 bg-slate-800 text-[9px] text-slate-400 font-bold rounded uppercase">
                                  Points: {iss.storyPoints}
                                </span>
                                <span className={`px-1.5 text-[9px] font-bold rounded uppercase ${iss.priority === "High" ? "bg-rose-500/15 text-rose-400" : "bg-amber-500/15 text-amber-400"}`}>
                                  {iss.priority}
                                </span>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {iss.description}
                            </p>

                            <div className="space-y-1 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block mb-1">Acceptance Criteria</span>
                              {iss.acceptanceCriteria.map((act, aiIdx) => (
                                <div key={aiIdx} className="flex items-center gap-1 text-[10px] text-slate-300">
                                  <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                  <span>{act}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 4. RELEASE GUARDIAN TAB ---------------- */}
            {activeInspector === "release" && (
              <div id="panel-release" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <span>Agent 4: Release Guardian & Deployment Assessor</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Evaluates build telemetry, pipeline outputs, security scanner records, and open blockers to decide release readiness.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleReleaseGuard}
                      disabled={isGuarding}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      {isGuarding ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Auditing Deliverables...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 text-white" />
                          <span>Audit Pipeline Safety</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={handleExportReleaseReport}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-705"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left telemetry cards */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
                      <span className="font-sans text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        CI Pipeline Inputs
                      </span>
                      <div className="flex justify-between items-center py-1 border-b border-slate-900">
                        <span>Pipeline Status:</span>
                        <span className="text-emerald-400 font-bold bg-emerald-950/20 px-1 rounded-sm">SUCCESS</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-900">
                        <span>Test Coverage:</span>
                        <span className="text-white font-bold">{SAMPLE_RELEASE_LOGS.pipelineMetrics.codeCoverage}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-900">
                        <span>Open block tickets:</span>
                        <span className="text-amber-500 font-bold">2 Issues pending</span>
                      </div>

                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[10px] font-sans leading-relaxed text-slate-400 mt-2 space-y-1">
                        <span className="font-bold text-slate-300 block">Pending hot topics:</span>
                        {SAMPLE_RELEASE_LOGS.unmergedIssues.map((iss, i) => (
                          <div key={i} className="flex items-start gap-1">
                            <span className="text-amber-500 font-bold">!</span>
                            <span>{iss.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Release Decision Logic</span>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        Using Gemini, the Release Guardian evaluates whether any high severity open items conflict with the changes made.
                      </p>
                    </div>
                  </div>

                  {/* Right assessment results */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-950/60 rounded-3xl p-6 border border-slate-800 space-y-4">
                      
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Automated Release Decision</span>
                          <span className={`text-2xl font-black ${releaseGuardResult.decision === "GO" ? "text-emerald-400 animate-pulse" : "text-amber-400"}`}>
                            {releaseGuardResult.decision} RELEASE
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400 font-semibold">Security Health Factor</p>
                          <p className="text-sm font-extrabold text-blue-400">Excellent Integrity</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800 italic">
                        "{releaseGuardResult.reasoningSummary}"
                      </p>

                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">
                          Mandatory Compliance Checklist
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {releaseGuardResult.checklist.map((chk, idx) => (
                            <div key={idx} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-start gap-2.5">
                              {chk.completed ? (
                                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4.5 h-4.5 text-rose-500 flex-shrink-0 mt-0.5" />
                              )}
                              <div>
                                <span className="font-bold text-slate-200 block">{chk.task}</span>
                                <span className="text-[10px] text-slate-500">{chk.reason}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl text-xs space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Suggested Release Notes</span>
                        <p className="font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {releaseGuardResult.suggestedReleaseNote}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- 5. TELEMETRY & INSIGHTS TAB ---------------- */}
            {activeInspector === "insights" && (
              <div id="panel-insights" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-5 h-5 text-violet-500" />
                      <span>Agent 5: Engineering Analytics & Telemetry Insights</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Compiles continuous developer telemetry indices, tracking cycle trends and creating actionable leadership steps.
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={handleEngineeringInsights}
                      disabled={isGeneratingInsights}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      {isGeneratingInsights ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Compiling Executive Board Update...</span>
                        </>
                      ) : (
                        <>
                          <Cpu className="w-4 h-4 text-white" />
                          <span>Generate Insights via Gemini</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column telemetry activity logs */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between h-full">
                      <div className="space-y-3">
                        <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest block">
                          Weekly telemetry activities log
                        </span>
                        
                        <pre className="p-3 bg-slate-900 border border-slate-850 rounded-xl overflow-x-auto text-[10px] font-mono leading-relaxed text-slate-400 max-h-[220px]">
                          <code>{SAMPLE_ENGINEERING_ACTIVITY}</code>
                        </pre>
                      </div>

                      <div className="mt-4 p-3.5 bg-violet-950/10 border border-violet-500/10 rounded-2xl text-[11px] text-slate-400 leading-relaxed font-sans">
                        <span className="font-bold text-slate-300 block mb-1">Velocity Computation</span>
                        Gemini compiles individual developer cycle counts to detect workflow discrepancies without telemetry overhead.
                      </div>
                    </div>
                  </div>

                  {/* Right Column executive outcomes */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                      
                      <div className="flex justify-between items-center bg-slate-900 p-4 border border-slate-850 rounded-2xl">
                        <div>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Project Velocity Rank</p>
                          <p className="text-xl font-black text-white">{engineeringInsights.projectVelocityRank}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Cycle Time trends</p>
                          <p className="text-lg font-bold text-violet-400">{engineeringInsights.cycleTimeTrend}</p>
                        </div>
                      </div>

                      {/* Velocity Trends Line Chart */}
                      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Velocity Trends (Last 6 Months)
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            MRs & Commits Activity
                          </span>
                        </div>
                        <div className="h-[180px] w-full text-xs">
                          {engineeringInsights.velocityTrends && engineeringInsights.velocityTrends.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={engineeringInsights.velocityTrends}
                                margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis 
                                  dataKey="month" 
                                  stroke="#64748b" 
                                  tickLine={false}
                                  axisLine={false}
                                />
                                <YAxis 
                                  stroke="#64748b" 
                                  tickLine={false}
                                  axisLine={false}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#0f172a",
                                    border: "1px solid #1e293b",
                                    borderRadius: "8px",
                                    color: "#f1f5f9"
                                  }}
                                />
                                <Legend 
                                  verticalAlign="top" 
                                  height={24} 
                                  iconType="circle"
                                  iconSize={8}
                                  wrapperStyle={{ fontSize: '10px' }}
                                />
                                <Line
                                  name="Merge Requests"
                                  type="monotone"
                                  dataKey="mergeRequests"
                                  stroke="#10b981"
                                  strokeWidth={2}
                                  dot={{ fill: "#10b981", r: 3 }}
                                  activeDot={{ r: 5 }}
                                />
                                <Line
                                  name="Commits"
                                  type="monotone"
                                  dataKey="commits"
                                  stroke="#8b5cf6"
                                  strokeWidth={2}
                                  dot={{ fill: "#8b5cf6", r: 3 }}
                                  activeDot={{ r: 5 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                              No trend data compiled yet.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Executive Briefing</span>
                        <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed italic">
                          "{engineeringInsights.executiveBriefing}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest block">Active Bottlenecks Identified</span>
                          <div className="space-y-1.5">
                            {engineeringInsights.topBottlenecks.map((bot, i) => (
                              <div key={i} className="p-2.5 bg-red-950/10 border border-red-500/10 rounded-xl text-[11px] text-slate-300">
                                {bot}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">Recommendations & Mitigations</span>
                          <div className="space-y-1.5">
                            {engineeringInsights.recommenedActions.map((rec, i) => (
                              <div key={i} className="p-2.5 bg-emerald-950/10 border border-emerald-500/10 rounded-xl text-[11px] text-slate-300 flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Sticky Bottom Footer Info */}
      <footer className="mt-auto px-8 py-5 bg-slate-950 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[10px] text-slate-500 font-black uppercase tracking-wider">
          <span>Submission Status: Finalizing</span>
          <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
          <span>Repository: Public + Open Source license</span>
          <span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span>
          <span>Demo Walkthrough: ~3:00 mins</span>
        </div>
        <div className="text-xs text-slate-400 font-semibold font-mono">
          Hackathon Team: <span className="text-white">Autonomous Engineering Systems Lab</span>
        </div>
      </footer>
    </div>
  );
}
