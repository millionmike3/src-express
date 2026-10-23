import express from "express";
import axios from "axios";
import bluetoothRoutes from "./routes/bluetooth.routes";
import behavioralRoutes from "./routes/behavioral.routes";
import underwritingRoutes from "./routes/underwriting.routes";

const app = express();
app.use(express.json());
app.use(bluetoothRoutes);
app.use(behavioralRoutes);

const NEST_URL = process.env.NEST_URL || "http://localhost:4000";

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "express-gateway" });
});

/**
 * FRAUD MODULE GATEWAY ROUTES
 */

// Trigger fraud alerts for an owner
app.post("/fraud/alerts/owner/:id", async (req, res) => {
  try {
    const response = await axios.post(
      `${NEST_URL}/alerts/owner/${req.params.id}`,
      req.body
    );
    res.json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get fraud summary for an owner
app.get("/fraud/summary/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${NEST_URL}/alerts/summary/${req.params.id}`
    );
    res.json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get fraud timeline
app.get("/fraud/timeline/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${NEST_URL}/alerts/timeline/${req.params.id}`
    );
    res.json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get fraud clusters
app.get("/fraud/clusters/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${NEST_URL}/alerts/clusters/${req.params.id}`
    );
    res.json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
// Admin proxy routes
app.get('/admin/users', async (req, res) => {
  try {
    const response = await axios.get(`${NEST_URL}/admin/users`, {
      headers: { authorization: req.headers.authorization || '' },
    });
    res.json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/admin/stats', async (req, res) => {
  try {
    const response = await axios.get(`${NEST_URL}/admin/stats`, {
      headers: { authorization: req.headers.authorization || '' },
    });
    res.json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
app.use(underwritingRoutes);

