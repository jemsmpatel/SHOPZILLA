import express from 'express';

//controllers
import { uploadMedia } from '../controllers/mediaController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// POST /api/media/upload
router.post("/upload", upload.single("image"), uploadMedia);

export default router;