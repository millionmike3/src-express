import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

// ⭐ Fully typed + safe proxy function
async function proxy(
  req: Request,
  res: Response,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET"
) {
  try {
    const url = `${BACKEND_URL}${req.originalUrl}`;
    const token = req.headers.authorization;

    const response = await axios({
      url,
      method,
      data: req.body,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    return res.status(response.status).json(response.data);

  } catch (err) {
    // ⭐ TS18046 fix: narrow unknown → Error
    const error = err instanceof Error ? err : new Error(String(err));

    console.error("Underwriting Gateway Error:", error.message);

    return res.status(500).json({
      error: "Underwriting gateway error",
      message: error.message,
    });
  }
}

/* -----------------------------
   Underwriting Pipeline
------------------------------ */
router.get("/underwriting/pipeline", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

/* -----------------------------
   Application Detail
------------------------------ */
router.get("/underwriting/applications/:id", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

/* -----------------------------
   Fraud Score
------------------------------ */
router.get("/underwriting/applications/:id/fraud", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

/* -----------------------------
   Risk Score (includes Behavioral Intelligence)
------------------------------ */
router.get("/underwriting/applications/:id/risk", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

/* -----------------------------
   Pricing Results
------------------------------ */
router.get("/underwriting/applications/:id/pricing", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

/* -----------------------------
   Underwriting Conditions
------------------------------ */
router.get("/underwriting/applications/:id/conditions", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

/* -----------------------------
   Notes
------------------------------ */
router.get("/underwriting/applications/:id/notes", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

router.post("/underwriting/applications/:id/notes", (req: Request, res: Response) =>
  proxy(req, res, "POST")
);

/* -----------------------------
   Documents
------------------------------ */
router.get("/underwriting/applications/:id/documents", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

/* -----------------------------
   Audit Log
------------------------------ */
router.get("/underwriting/applications/:id/audit", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

export default router;
