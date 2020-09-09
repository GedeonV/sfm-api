const express = require("express");
const users = express.Router();
const cors = require("cors");

users.use(cors());

const checkAuth = require("../middleware/check-auth");
// Middleware pour vérifier si l'utilisateur utilise un token valide

const UsersController = require("../controllers/Users");

users.post("/register", UsersController.users_register);
// Route pour enregistrer un utilisateur
users.post("/login", UsersController.users_login);
// Route pour se connecter, associe un token
users.get("/", checkAuth, UsersController.users_get_all);
// Route pour récupérer tout les utilisateurs
users.get("/user/:_id", checkAuth, UsersController.users_get_id);
// Route pour récupérer un utilisateur
users.delete("/:email", checkAuth, UsersController.users_delete);
// Route pour supprimer un utilisateur
users.put("/user/:_id", checkAuth, UsersController.users_update);
// Route pour modifier un utilisateur
users.put("/user/:_id/rank", checkAuth, UsersController.users_promote);
// Route pour promouvoir ou rétrograder un utilisateur
module.exports = users;
