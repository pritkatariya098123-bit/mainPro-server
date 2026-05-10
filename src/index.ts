import express from 'express';
import cors from 'cors';
import router from './Route/Routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // ઈમેજ માટે લિમિટ વધારી

// Prefix સેટઅપ
app.use('/api', router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Search Backend running on http://localhost:${PORT}`);
});