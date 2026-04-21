import { Router } from "express";
import { createLeadController, getAllLeadsController, getLeadByIdController } from "../controlllers/lead.controller";
import { validateCreateLead } from "../middleware/validate-create-lead";

const router = Router();

router.get('/', getAllLeadsController)
router.get('/:id', getLeadByIdController)
router.post('/', validateCreateLead, createLeadController);

export default router;