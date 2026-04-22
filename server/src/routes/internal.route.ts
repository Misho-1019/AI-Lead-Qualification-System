import { Router } from "express";
import { leadAnalysisCallbackController } from "../controllers/internal.controller";

const router = Router();

router.post('/lead-analysis-callback', leadAnalysisCallbackController)

export default router;