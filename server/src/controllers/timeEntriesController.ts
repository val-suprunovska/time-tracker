import { Request, Response, NextFunction } from "express";
import * as service from "../services/timeEntriesService";
import { validateTimeEntry } from "../validators/timeEntryValidator";

export const getAllEntries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dateFilter = req.query.date as string | undefined;
    const entries = await service.getAllEntries(dateFilter);
    res.json({ success: true, data: entries });
  } catch (err) {
    next(err);
  }
};

export const createEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = validateTimeEntry(req.body);
    const entry = await service.createEntry(data);
    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
};

export const updateEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const data = validateTimeEntry(req.body);
    const entry = await service.updateEntry(id, data);
    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
};

export const deleteEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    await service.deleteEntry(id);
    res.json({ success: true, message: "Entry deleted" });
  } catch (err) {
    next(err);
  }
};
