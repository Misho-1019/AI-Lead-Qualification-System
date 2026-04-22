import { Router } from "express";
import { createLeadAnalysisController } from "../controllers/lead-analysis.controller";

const router = Router({ mergeParams: true })

router.post('/', createLeadAnalysisController)

export default router;