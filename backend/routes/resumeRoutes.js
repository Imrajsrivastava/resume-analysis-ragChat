const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("resume"), resumeController.uploadResume);
router.post("/chat", resumeController.chatWithResume);

module.exports = router;
