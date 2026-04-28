import { Router } from "express";
import { leadAnalysisCallbackController } from "../controllers/internal.controller";
import { verifyInternalApiKey } from "../middleware/verifyInternalApiKey";
import { validateLeadAnalysisCallback } from "../middleware/validateLeadAnalysisCallback";

const router = Router();

router.post('/lead-analysis-callback', verifyInternalApiKey, validateLeadAnalysisCallback, leadAnalysisCallbackController)

export default router;