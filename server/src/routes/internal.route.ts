import { Router } from "express";
import { leadAnalysisCallbackController } from "../controllers/internal.controller";
import { verifyInternalApiKey } from "../middleware/verifyInternalApiKey";

const router = Router();

router.post('/lead-analysis-callback', verifyInternalApiKey, leadAnalysisCallbackController)

export default router;