const express = require("express");
const songs = express.Router();
const cors = require("cors");
const multer = require("multer");
process.env.SECRET_KEY = "sfmprj88";
const checkAuth = require("../middleware/check-auth");
const SongsController = require("../controllers/Songs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "audio/mpeg") {
    cb(null, true);
  } else {
    cb(new Error("Format invalide"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilter,
});

const Song = require("../models/Song");
songs.use(cors());

songs.get("/", checkAuth, SongsController.songs_get_all);

songs.get("/song/:_id", checkAuth, SongsController.songs_get_id);

songs.post(
  "/upload",
  checkAuth,
  upload.single("songFile"),
  SongsController.songs_upload
);

module.exports = songs;
