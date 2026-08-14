import { Request, Response } from "express";
import { getLeadAnalytics } from "../services/analytics.service";

export const getAnalyticsController = async (req: Request, res: Response) => {
    const data = await getLeadAnalytics();

    return res.status(200).json({
        message: 'Analytics fetched successfully',
        data,
    });
};
