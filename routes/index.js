import express from "express";
import multer from "multer";

import ctrl from "../controllers/csvToJson.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "/files",
});
const app = express();

var upload = multer({ storage: storage });
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

router.post("/csv-to-json", upload.single("file"), ctrl.csvToJson);
router.post("/get-result", ctrl.getResult);

export default router;
