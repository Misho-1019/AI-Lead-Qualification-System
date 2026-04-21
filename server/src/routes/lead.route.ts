import { Router } from "express";
import { createLeadController, getAllLeadsController } from "../controlllers/lead.controller";
import { validateCreateLead } from "../middleware/validate-create-lead";

const router = Router();

router.get('/', getAllLeadsController)
router.post('/', validateCreateLead, createLeadController);

export default router;