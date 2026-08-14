import "dotenv/config";

import express from "express";
import cors from "cors";

import healthRoute from "./routes/health.route";
import leadRoute from "./routes/lead.route";
import internalRoutes from "./routes/internal.route";
import analyticsRoutes from "./routes/analytics.route";
import { errorHandler } from "./middleware/errorHandler";
import helmet from "helmet";
import prisma from "./utils/prisma";

const requiredEnvVars = ['DATABASE_URL', 'OPENAI_API_KEY', 'INTERNAL_API_KEY', 'FRONTEND_URL'];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`)
    }
}

const app = express();
const PORT: number = Number(process.env.PORT) || 3030;

const frontendOrigins = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(express.json({ limit: '100kb' }));
app.use(helmet())
app.use(
    cors({
        origin: frontendOrigins,
    })
);

app.use('/', healthRoute);
app.use('/api/leads', leadRoute)
app.use('/api/internal', internalRoutes)
app.use('/api/analytics', analyticsRoutes)

app.use(errorHandler);

const server = app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))

const shutdown = async () => {
    console.log('Shutting down server...');
    
    server.close(async () => {
        console.log('HTTP server closed');

        try {
            await prisma.$disconnect();
            console.log('Database disconnect');
        } catch (error) {
            console.error('Error during Prisma disconnect', error);
        }

        process.exit(0)
    })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)