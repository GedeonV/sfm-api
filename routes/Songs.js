const express = require("express");
const songs = express.Router();
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const Song = require("../models/Song");
songs.use(cors());

process.env.SECRET_KEY = "sfmprj88";
const checkAuth = require("../middleware/check-auth");

const SongsController = require("../controllers/Songs");

songs.post(
  "/upload",
  checkAuth,
  upload.single("songFile"),
  SongsController.songs_upload
);

module.exports = songs;
