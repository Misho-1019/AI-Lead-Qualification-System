import { Request, Response } from "express";
import { createLead, deleteLeads, exportLeadsByIds, exportLeadsToSheet, getAllLeads, getLeadById, getLeadStats, reanalyzeLead, updateLeadStatus, updateLeadsStatus } from "../services/lead.service";
import { sendLeadEmail } from "../services/email.service";
import { isSheetsConfigured } from "../services/sheets.service";
import { CreateLeadInput, UpdateLeadStatusInput } from "../types/lead.types";

export const createLeadController = async (req: Request, res: Response) => {
    const leadData = req.body as CreateLeadInput;

    const newLead = await createLead(leadData);

    return res.status(201).json({
        message: 'Lead received',
        data: newLead,
    })
}

const VALID_STATUSES = ['all', 'new', 'contacted', 'qualified', 'rejected'];
const VALID_SORTS = ['newest', 'oldest', 'highest_score', 'lowest_score'];

export const getAllLeadsController = async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const status = typeof req.query.status === 'string' && VALID_STATUSES.includes(req.query.status)
        ? req.query.status
        : 'all';
    const sortBy = typeof req.query.sortBy === 'string' && VALID_SORTS.includes(req.query.sortBy)
        ? req.query.sortBy
        : 'newest';

    const { leads, total } = await getAllLeads({ page, limit, search, status, sortBy });

    return res.status(200).json({
        message: 'Leads fetched successfully',
        data: { leads, total },
        page,
        limit,
        total
    })
}

export const getLeadStatsController = async (req: Request, res: Response) => {
    const stats = await getLeadStats();

    return res.status(200).json({
        message: 'Lead stats fetched successfully',
        data: stats,
    })
}

export const getLeadByIdController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const lead = await getLeadById(id);

    if (!lead) {
        return res.status(404).json({
            message: 'Lead not found',
        })
    }

    return res.status(200).json({
        message: 'Lead fetched successfully',
        data: lead,
    })
}

export const updateLeadStatusController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body as UpdateLeadStatusInput;

    const updatedLead = await updateLeadStatus(id, status);

    if (!updatedLead) {
        return res.status(404).json({
            message: 'Lead not found',
        })
    }

    return res.status(200).json({
        message: 'Lead status updated successfully',
        data: updatedLead,
    })
}

export const reanalyzeLeadController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const lead = await reanalyzeLead(id);

    if (!lead) {
        return res.status(404).json({
            message: 'Lead not found'
        });
    }

    return res.status(200).json({ message: 'Lead reanalysis triggered successfully' })
}

export const sendLeadEmailController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const lead = await getLeadById(id);

    if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
    }

    if (!lead.analysis) {
        return res.status(409).json({ message: 'No AI analysis available for this lead yet' });
    }

    try {
        const result = await sendLeadEmail(lead, lead.analysis);

        return res.status(200).json({ message: 'Email sent successfully', data: result });
    } catch (error) {
        console.error('Failed to send email:', error);

        return res.status(502).json({ message: 'Failed to send email' });
    }
}

export const exportLeadsToSheetsController = async (req: Request, res: Response) => {
    if (!isSheetsConfigured()) {
        return res.status(200).json({
            message: 'Google Sheets is not configured. Add GOOGLE_SHEETS_SPREADSHEET_ID and GOOGLE_SERVICE_ACCOUNT_JSON to enable export.'
        });
    }

    try {
        await exportLeadsToSheet();

        return res.status(200).json({ message: 'Leads exported to Google Sheets successfully' });
    } catch (error) {
        console.error('Failed to export leads to Google Sheets:', error);

        return res.status(502).json({ message: 'Failed to export leads to Google Sheets' });
    }
}

export const bulkUpdateStatusController = async (req: Request, res: Response) => {
    const { ids, status } = req.body as { ids: string[]; status: string };

    const count = await updateLeadsStatus(ids, status);

    return res.status(200).json({ message: 'Leads updated successfully', data: { count } });
}

export const bulkDeleteController = async (req: Request, res: Response) => {
    const { ids } = req.body as { ids: string[] };

    const count = await deleteLeads(ids);

    return res.status(200).json({ message: 'Leads deleted successfully', data: { count } });
}

export const bulkExportController = async (req: Request, res: Response) => {
    const { ids } = req.body as { ids: string[] };

    if (!isSheetsConfigured()) {
        return res.status(200).json({
            message: 'Google Sheets is not configured. Add GOOGLE_SHEETS_SPREADSHEET_ID and GOOGLE_SERVICE_ACCOUNT_JSON to enable export.'
        });
    }

    try {
        const count = await exportLeadsByIds(ids);

        return res.status(200).json({ message: `${count} leads exported to Google Sheets successfully` });
    } catch (error) {
        console.error('Failed to export leads to Google Sheets:', error);

        return res.status(502).json({ message: 'Failed to export leads to Google Sheets' });
    }
}