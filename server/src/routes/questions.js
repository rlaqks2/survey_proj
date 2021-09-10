import express from 'express';
import Auth from '../middleware/Auth';
import Questions from '../controller/Questions';
var router = express.Router()

router.post('/save', Questions.save);
router.post('/get-by-id', Questions.getOne);
router.post('/update', Questions.update);

export default router;