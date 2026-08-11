import { Router } from "express";
import { createLeadController, getAllLeadsController, getLeadByIdController, getLeadStatsController, reanalyzeLeadController, sendLeadEmailController, updateLeadStatusController } from "../controllers/lead.controller";
import { validateCreateLead } from "../middleware/validate-create-lead";
import { validateUpdateLeadStatus } from "../middleware/validate-update-lead-status";
import leadAnalysisRoutes from "./lead-analysis.route";
import { validateUuidParam } from "../middleware/validateUuidParam";
import { publicLimiter } from "../middleware/rateLimiter";

const router = Router();

router.use('/:id/analysis', validateUuidParam, leadAnalysisRoutes)

router.get('/', getAllLeadsController)
router.get('/stats', getLeadStatsController)
router.get('/:id', validateUuidParam, getLeadByIdController)
router.post('/', publicLimiter, validateCreateLead, createLeadController);
router.patch('/:id', validateUpdateLeadStatus, updateLeadStatusController)
router.post('/:id/reanalyze', publicLimiter, validateUuidParam, reanalyzeLeadController)
router.post('/:id/send-email', publicLimiter, validateUuidParam, sendLeadEmailController)

export default router;