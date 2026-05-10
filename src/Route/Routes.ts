import { Router } from 'express';
import multer from 'multer';
import * as SearchController from '../Controller/Search-controller';

const router = Router();

// મેમરી સ્ટોરેજ (ઈમેજ માટે)
const upload = multer({ storage: multer.memoryStorage() });

// --- SEARCH ROUTES ---

// ૧. લાઈવ સર્ચબાર માટે: GET /api/search?query=...
router.get('/search', SearchController.searchData);

// ૨. બધા આઈટમ્સ લોડ કરવા: GET /api/search/upload/Alldata
router.get('/search/upload/Alldata', SearchController.getAllData);

// ૩. નવો ડેટા સેવ કરવા: POST /api/search/upload
router.post('/search/upload', upload.single('image'), SearchController.uploadData);

export default router;