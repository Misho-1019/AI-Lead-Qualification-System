import { Router } from "express";
import { createLeadController, getAllLeadsController, getLeadByIdController, updateLeadStatusController } from "../controllers/lead.controller";
import { validateCreateLead } from "../middleware/validate-create-lead";
import { validateUpdateLeadStatus } from "../middleware/validate-update-lead-status";
import leadAnalysisRoutes from "./lead-analysis.route";

const router = Router();

router.use('/:id/analysis', leadAnalysisRoutes)

router.get('/', getAllLeadsController)
router.get('/:id', getLeadByIdController)
router.post('/', validateCreateLead, createLeadController);
router.patch('/:id', validateUpdateLeadStatus, updateLeadStatusController)

export default router;