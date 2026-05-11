import { Router } from 'express';
import multer from 'multer';
import * as SearchController from '../Controller/Search-controller';
import * as AuthController from '../Controller/Auth-controller'; // Auth Controller import karyu

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post('/auth/signup', AuthController.signup);

router.post('/auth/login', AuthController.login);



router.get('/search', SearchController.searchData);

router.get('/search/upload/Alldata', SearchController.getAllData);

router.post('/search/upload', upload.single('image'), SearchController.uploadData);

export default router;