import express from 'express';
import multer from 'multer';

import csvToJson from '../controllers/csvToJson.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: '/files',
});
const app = express();

var upload = multer({ storage: storage });
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

router.post('/csv-to-json',upload.single('file'), csvToJson)

export default router;