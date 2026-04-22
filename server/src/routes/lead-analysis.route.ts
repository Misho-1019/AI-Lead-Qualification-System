import { Router } from "express";
import { createLeadAnalysisController, updateLeadAnalysisController } from "../controllers/lead-analysis.controller";
import { validateLeadAnalysis } from "../middleware/validate-lead-analysis";

const router = Router({ mergeParams: true })

router.post('/', validateLeadAnalysis, createLeadAnalysisController)
router.patch('/', validateLeadAnalysis, updateLeadAnalysisController)

export default router;