import express from 'express';
import Auth from '../middleware/Auth';
import Responses from '../controller/Responses';
var router = express.Router()

router.post('/save',  Responses.save);
router.post('/get-by-id', Responses.getOne);
router.post('/get-list', Responses.getAll);
router.post('/update',  Responses.update);

export default router;