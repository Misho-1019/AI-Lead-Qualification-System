import { Router } from "express";
import { createLeadController } from "../controlllers/lead.controller";

const router = Router();

router.post('/', createLeadController);

export default router;