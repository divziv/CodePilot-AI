export interface CodeFile {
  name: string;
  content: string;
  language: string;
}

export interface TechDebtItem {
  file: string;
  issue: string;
  severity: "low" | "medium" | "high";
  line: number;
}

export interface SecurityVulnerability {
  file: string;
  vulnerability: string;
  details: string;
  severity: "low" | "medium" | "high";
  suggestion: string;
}

export interface ScanResult {
  healthScore: number;
  summary: string;
  techDebt: TechDebtItem[];
  securityVulnerabilities: SecurityVulnerability[];
  structuralStrengths: string[];
}

export interface CodeReviewComment {
  filePath: string;
  line: number;
  text: string;
  type: "performance" | "security" | "style" | "bug";
  severity: "low" | "medium" | "high";
  originalCode?: string;
  suggestedCode?: string;
}

export interface CodeReviewResult {
  summary: string;
  performanceScore: number;
  securityScore: number;
  maintainabilityScore: number;
  approved: boolean;
  comments: CodeReviewComment[];
}

export interface SprintIssue {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  priority: "High" | "Medium" | "Low";
  acceptanceCriteria: string[];
}

export interface SprintPlan {
  epicTitle: string;
  totalEstimatedPoints: number;
  issues: SprintIssue[];
}

export interface ReleaseChecklistItem {
  task: string;
  completed: boolean;
  reason: string;
}

export interface ReleaseGuardResult {
  decision: "GO" | "NO-GO";
  reasoningSummary: string;
  overallRiskRating: "Low" | "Medium" | "High";
  checklist: ReleaseChecklistItem[];
  suggestedReleaseNote: string;
}

export interface VelocityTrendPoint {
  month: string;
  mergeRequests: number;
  commits: number;
}

export interface EngineeringInsights {
  projectVelocityRank: "Excellent" | "Moderate" | "Needs Attention";
  velocityExplanation: string;
  cycleTimeTrend: "Decreasing" | "Increasing" | "Stable";
  topBottlenecks: string[];
  recommenedActions: string[];
  executiveBriefing: string;
  velocityTrends?: VelocityTrendPoint[];
}

// ==========================================
// PRECONFIGURED SAMPLE DATA FOR USER CONVENIENCE
// ==========================================

export const SAMPLE_REPOS = [
  {
    name: "gitlab.com/acme-corp/phoenix-core",
    description: "Multi-tenant auth and database ingestion middleware.",
    files: [
      {
        name: "lib/auth_middleware.js",
        language: "javascript",
        content: `const jwt = require("jsonwebtoken");
const db = require("../db");

// TODO: Refactor legacy helper
function verifyUserToken(req, res, next) {
  const token = req.headers["authorization"] || req.query.token;

  if (!token) {
    return res.status(401).send("No Auth Token");
  }

  // DEBT: Bad implementation with string splitting
  const rawToken = token.split(" ")[1] || token;

  // SECURITY WARNING: Hardcoded JWT secret
  const SECRET = "superSecretJwtKey123_dont_share!";

  try {
    const decoded = jwt.verify(rawToken, SECRET);
    req.user = decoded;

    // Direct SQL Query interpolation - RISK of SQL injection
    const query = "SELECT * FROM users WHERE id = '" + req.user.id + "'";
    db.query(query, (err, result) => {
      if (err) {
        // Leaking system stack logs
        return res.status(500).send("Database error: " + err.stack);
      }
      req.userInfo = result[0];
      next();
    });
  } catch (err) {
    return res.status(403).send("Invalid Token");
  }
}

// Dead code block
function unusedFunctionToFetchConfig() {
  const configUrl = "http://dev.internal/config_v1.json";
  console.log("Fetching config from dev...");
  // TODO: remove later
}

module.exports = { verifyUserToken };`
      },
      {
        name: "lib/payment_processor.py",
        language: "python",
        content: `import stripe
import logging

# Hardcoded payment options helper
def charge_organization(org_id, amount_cents):
    # TODO: integrate with actual stripe webhook signature checks
    print(f"Charging organization: {org_id} with {amount_cents} cents.")
    stripe.api_key = "sk_test_51Mz..." # Exposing secret test keys
    
    # Missing try/except block for production failure recovery
    charge = stripe.Charge.create(
        amount=amount_cents,
        currency="usd",
        source="tok_visa",
        description=f"Charge for Org {org_id}"
    )
    return charge
`
      }
    ]
  },
  {
    name: "gitlab.com/financeflow/broker-engine",
    description: "High-frequency stock order executor stream.",
    files: [
      {
        name: "src/order_book.cpp",
        language: "cpp",
        content: `#include <iostream>
#include <vector>

// NESTED LOOPS COMPLICATED COMPLEXITY
void matchOrders(std::vector<int> buyOrders, std::vector<int> sellOrders) {
    for (size_t i = 0; i < buyOrders.size(); ++i) {
        for (size_t j = 0; j < sellOrders.size(); ++j) {
            for (size_t k = 0; k < 100; ++k) { // unnecessary loop wasting CPU
                if (buyOrders[i] >= sellOrders[j]) {
                    std::cout << "Matched: " << buyOrders[i] << " and " << sellOrders[j] << std::endl;
                    break;
                }
            }
        }
    }
}
`
      }
    ]
  }
];

export const SAMPLE_MRS = [
  {
    title: "MR-302: Implement optimized database user ingestion and fix JWT validation leaks",
    description: "This Merge Request removes the direct user string interpolation inside SQL queries is auth_middleware.js to prevent vulnerability exploits. It also adds proper secret token parsing & loading environment variables.",
    diff: `diff --git a/lib/auth_middleware.js b/lib/auth_middleware.js
--- a/lib/auth_middleware.js
+++ b/lib/auth_middleware.js
@@ -10,13 +10,10 @@
-  // SECURITY WARNING: Hardcoded JWT secret
-  const SECRET = "superSecretJwtKey123_dont_share!";
+  // Load JWT secret securely from variables
+  const SECRET = process.env.JWT_SECRET_KEY;
+  if (!SECRET) {
+    throw new Error("Misconfigured JWT SECRET ENVIRONMENT VARIABLE");
+  }
 
   try {
     const decoded = jwt.verify(rawToken, SECRET);
     req.user = decoded;
 
-    // Direct SQL Query interpolation - RISK of SQL injection
-    const query = "SELECT * FROM users WHERE id = '" + req.user.id + "'";
-    db.query(query, (err, result) => {
+    // Optimized & Safe Parameterized Queries
+    const query = "SELECT * FROM users WHERE id = $1";
+    db.query(query, [req.user.id], (err, result) => {
       if (err) {
-        // Leaking system stack logs
-        return res.status(500).send("Database error: " + err.stack);
+        return res.status(500).send("A secure internal database database error occurred.");
       }
       req.userInfo = result[0];
       next();
     });`
  },
  {
    title: "MR-108: Optimize critical payment billing webhooks to reduce CPU usage",
    description: "Adds error wrappers and replaces the blocking Stripe loading logic with custom promise retry pools during active payment triggers.",
    diff: `diff --git a/lib/payment_processor.py b/lib/payment_processor.py
--- a/lib/payment_processor.py
+++ b/lib/payment_processor.py
@@ -5,11 +5,14 @@
 def charge_organization(org_id, amount_cents):
-    stripe.api_key = "sk_test_51Mz..." # Exposing secret test keys
+    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
+    if not stripe.api_key:
+        raise ValueError("Stripe credential is unset.")
     
-    charge = stripe.Charge.create(
-        amount=amount_cents,
-        currency="usd",
-        source="tok_visa",
-        description=f"Charge for Org {org_id}"
-    )
-    return charge
+    try:
+        charge = stripe.Charge.create(
+            amount=amount_cents,
+            currency="usd",
+            source="tok_visa",
+            description=f"Charge for Org {org_id}"
+        )
+        return charge
+    except stripe.error.StripeError as e:
+        logging.error(f"Failed to charge org safely: {e}")
+        return None`
  }
];

export const SAMPLE_REQUIREMENTS = [
  {
    title: "Feature Epic: Stripe Multi-Tenant Organization Workspace Billing",
    text: `We need to build a workspace billing flow for organizational multi-tenancy.
Key Requirements:
1. When a user creates a workspace, they should enter an organization name. We must persist this workspace in the database.
2. In the organization settings panel, admins should be allowed to upgrade plans (Pro, Enterprise).
3. The server must handle Stripe Subscription and Seat quantity updates automatically using webhook events.
4. If payment fails, set 'is_active' workspace status to false and restrict workspace member access with a grace banner.
5. Create fully localized invoice emails when payment completes.`
  },
  {
    title: "Feature Epic: Real-time collaborative Markdown repository wiki",
    text: `Build a collaborative markdown documentation system integrated directly.
Requirements:
1. Real-time synchronicity of typing using WebSockets with operational transformation sync-locking to prevent edit collision.
2. Revision history sidepanel showing who wrote what line (Git Blame model).
3. Ability to export wiki files to PDF formats.
4. Auto-generated sidebar directories indexing nested files.`
  }
];

export const SAMPLE_RELEASE_LOGS = {
  pipelineMetrics: {
    status: "SUCCESS",
    testPassRate: "98.7%",
    codeCoverage: "84.2%",
    securityWarnings: "1 (Low risk deprecated package warnings)"
  },
  unmergedIssues: [
    { title: "GP-204: Investigate memory leak on Redis cache invalidation hooks.", severity: "Medium" },
    { title: "GP-188: CSS style overflow fix on workspace toggle drop-downs.", severity: "Low" }
  ],
  recentChangelog: `1. Auth module: Switched user database retrieval query to parameterized prepared statements (Fixes high SQLi vulnerability).
2. Payments: Implemented robust try/catch stripe billing callback loops to bypass transient webhook connection drops.
3. Billing: Configured local variables loading for Stripe live production secret keys; securely removed stale mock credentials file.
4. General: Added pre-commit ESLint formatting hooks into active GitLab workflow pipeline.`
};

export const SAMPLE_ENGINEERING_ACTIVITY = `==== WEEKLY TEAM ACTIVITY LOG ====
Active Repository: gitlab.com/acme-corp/phoenix-core
Sprints Status:
- Active Sprint: Sprint #12 "Secure Ingestion Backbone"
- Completed merge requests: 14 MRs merged, total of 4,200 lines added.
- Open merge requests: 3 awaiting reviewer responses, average duration currently open: 53.4 hours.
- Pipeline builds: 28 success builds, 4 failed pipeline runs due to flakiness in DB container setup step.
- Tech Debt backlog count: 18 issues filed, 4 addressed.
- Active members coding contribution logs:
  - Developer-A: merged 6 MRs, average code review comments accepted: 4
  - Developer-B: merged 4 MRs, average MR reviews submitted: 8
  - Developer-C: merged 4 MRs, flagged pipeline instability errors twice.
================================`;
