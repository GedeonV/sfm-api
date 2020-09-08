const express = require("express");
const songs = express.Router();
const cors = require("cors");
const multer = require("multer");
process.env.SECRET_KEY = "sfmprj88";
const checkAuth = require("../middleware/check-auth");
// Middleware pour vérifier si l'utilisateur utilise un token valide
const SongsController = require("../controllers/Songs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Destination du fichier
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nom du fichier
  },
});
// Configuration de stockage de multer

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "audio/mpeg") {
    cb(null, true);
  } else {
    cb(new Error("Format invalide"), false);
  }
};
// Type de fichiers acceptés

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limite de taille de fichier (10 MB)
  fileFilter: fileFilter,
});
// Initialisation de multer avec tout les paramètres de configuration

songs.use(cors());

songs.get("/", checkAuth, SongsController.songs_get_all);
// Route pour récupérer toute les chansons du catalogue
songs.get("/song/:_id", checkAuth, SongsController.songs_get_id);
// Route pour récupérer une chanson du catalogue
songs.delete("/:_id", checkAuth, SongsController.songs_delete);
// Route pour supprimer une chanson du catalogue
songs.post(
  "/upload",
  checkAuth,
  upload.single("songFile"),
  SongsController.songs_upload
);
// Route pour uploader une chanson sur cloudnary

module.exports = songs;
