import { Router } from "express";

const router = Router();

router.post('/', (req, res) => {
    const lead = req.body;

    console.log('New lead received:', lead);

    return res.status(201).json({
        message: 'Lead received successfully',
        data: lead,
    })
})

export default router;