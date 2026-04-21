import { Router } from "express";
import { createLeadController, getAllLeadsController, getLeadByIdController, updateLeadStatusController } from "../controlllers/lead.controller";
import { validateCreateLead } from "../middleware/validate-create-lead";
import { validateUpdateLeadStatus } from "../middleware/validate-update-lead-status";

const router = Router();

router.get('/', getAllLeadsController)
router.get('/:id', getLeadByIdController)
router.post('/', validateCreateLead, createLeadController);
router.patch('/:id', validateUpdateLeadStatus, updateLeadStatusController)

export default router;