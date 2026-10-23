import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

// ⭐ FIXED: Properly typed proxy function
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
    // ⭐ FIXED: TS18046 — err is unknown, so we narrow it
    const error = err instanceof Error ? err : new Error(String(err));

    console.error("Behavioral Gateway Error:", error.message);

    return res.status(500).json({
      error: "Behavioral gateway error",
      message: error.message,
    });
  }
}

// ⭐ Routes
router.get("/behavioral/score", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

router.get("/behavioral/profile/:userId", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

router.get("/behavioral/sessions/:userId", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

export default router;
