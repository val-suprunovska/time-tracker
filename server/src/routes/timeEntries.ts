import { Router } from "express";
import * as controller from "../controllers/timeEntriesController";

const router = Router();

router.get("/", controller.getAllEntries);
router.post("/", controller.createEntry);
router.put("/:id", controller.updateEntry);
router.delete("/:id", controller.deleteEntry);

export default router;
