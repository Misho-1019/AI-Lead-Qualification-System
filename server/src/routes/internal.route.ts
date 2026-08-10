import { Router } from "express";
import { leadAnalysisCallbackController } from "../controllers/internal.controller";
import { verifyInternalApiKey } from "../middleware/verifyInternalApiKey";
import { validateLeadAnalysisCallback } from "../middleware/validateLeadAnalysisCallback";
import { internalLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post('/lead-analysis-callback', internalLimiter, verifyInternalApiKey, validateLeadAnalysisCallback, leadAnalysisCallbackController)

export default router;