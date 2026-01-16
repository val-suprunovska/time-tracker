import express from "express";
import cors from "cors";
import timeEntriesRouter from "./routes/timeEntries";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/entries", timeEntriesRouter);

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

export default app;
