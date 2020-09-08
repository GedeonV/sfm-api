const express = require("express");
const parties = express.Router();
const cors = require("cors");

parties.use(cors());

process.env.SECRET_KEY = "sfmprj88";
const checkAuth = require("../middleware/check-auth");
// Middleware pour vérifier si l'utilisateur utilise un token valide

const PartiesController = require("../controllers/Parties");

parties.post("/create", checkAuth, PartiesController.parties_create);
// Route pour créer un évenement
parties.get("/", checkAuth, PartiesController.parties_get_all);
// Route pour récupérer tout les évenements
parties.get("/event/:_id", checkAuth, PartiesController.parties_get_id);
// Route pour un évenement
parties.delete("/:_id", checkAuth, PartiesController.parties_delete);
// Route pour supprimer un évenement
parties.put("/event/:_id", checkAuth, PartiesController.parties_update);
// Route pour modifier un évenement
parties.put("/event/:_id/state", checkAuth, PartiesController.parties_status);
// Route pour modifier l'état de l'évenement
parties.post("/event/:_id/sign", checkAuth, PartiesController.parties_signup);
// Route pour inscrire un utilisateur à un évenement
parties.post(
  "/event/:_id/unsub_user",
  checkAuth,
  PartiesController.parties_unsub_user
);
// Route pour désinscrire un utilisateur à un évenement
parties.post(
  "/event/:_id/song",
  checkAuth,
  PartiesController.parties_add_songs
);
// Route pour enregistrer une chanson à un évenement
parties.post(
  "/event/:_id/remove_song",
  checkAuth,
  PartiesController.parties_remove_songs
);
// Route pour enlever une chanson à un évenement
module.exports = parties;
