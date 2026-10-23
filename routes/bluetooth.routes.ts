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

    console.error("Bluetooth Gateway Error:", error.message);

    return res.status(500).json({
      error: "Bluetooth gateway error",
      message: error.message,
    });
  }
}

// ⭐ Routes
router.post("/bluetooth/events", (req: Request, res: Response) =>
  proxy(req, res, "POST")
);

router.get("/bluetooth/sessions/:id", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

router.get("/bluetooth/events/:sessionId", (req: Request, res: Response) =>
  proxy(req, res, "GET")
);

export default router;
