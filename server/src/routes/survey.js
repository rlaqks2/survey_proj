import express from 'express';
import Auth from '../middleware/Auth';
import Survey from '../controller/Survey';
var router = express.Router()

router.post('/save',  Survey.save);
router.post('/get-list', Survey.getAll);
router.post('/get-list-unauth', Survey.getAll);
router.post('/get-by-id', Survey.getOne);
router.post('/update',  Survey.update);
router.post('/share',  Survey.share);
router.post('/delete', Auth.verifyToken, Survey.delete);
router.post('/check-slug',  Survey.checkUniqueSlug);

export default router;