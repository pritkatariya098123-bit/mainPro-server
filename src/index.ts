import express from 'express';
import cors from 'cors';
import router from './Route/Routes';

const app = express();

const VERSAL_HOST = process.env.VERSEL_HOST || 'http://localhost:3000';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Prefix સેટઅપ
app.use('/api', router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Search Backend running on ${VERSAL_HOST}`);
});