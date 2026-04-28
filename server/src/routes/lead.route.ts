import { Router } from "express";
import { createLeadController, getAllLeadsController, getLeadByIdController, reanalyzeLeadController, updateLeadStatusController } from "../controllers/lead.controller";
import { validateCreateLead } from "../middleware/validate-create-lead";
import { validateUpdateLeadStatus } from "../middleware/validate-update-lead-status";
import leadAnalysisRoutes from "./lead-analysis.route";
import { validateUuidParam } from "../middleware/validateUuidParam";

const router = Router();

router.use('/:id/analysis', validateUuidParam, leadAnalysisRoutes)

router.get('/', getAllLeadsController)
router.get('/:id', validateUuidParam, getLeadByIdController)
router.post('/', validateCreateLead, createLeadController);
router.patch('/:id', validateUpdateLeadStatus, updateLeadStatusController)
router.post('/:id/reanalyze', validateUuidParam, reanalyzeLeadController)

export default router;