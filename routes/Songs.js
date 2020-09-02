const express = require("express");
const songs = express.Router();
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "sfm88",
  api_key: "928328299487922",
  api_secret: "ml3tMM05ePIw8-z8zUYOhEw4nZs",
});

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
