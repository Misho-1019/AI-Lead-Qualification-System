import { Router } from "express";
import { createLeadAnalysisController, updateLeadAnalysisController } from "../controllers/lead-analysis.controller";

const router = Router({ mergeParams: true })

router.post('/', createLeadAnalysisController)
router.patch('/', updateLeadAnalysisController)

export default router;