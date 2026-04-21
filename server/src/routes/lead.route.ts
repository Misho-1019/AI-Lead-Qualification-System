import { Router } from "express";
import { createLeadController } from "../controlllers/lead.controller";
import { validateCreateLead } from "../middleware/validate-create-lead";

const router = Router();

router.post('/', validateCreateLead, createLeadController);

export default router;