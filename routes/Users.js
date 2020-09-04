const express = require("express");
const users = express.Router();
const cors = require("cors");
//const jwt = require("jsonwebtoken")
//const bcrypt = require("bcryptjs")

const User = require("../models/User");
users.use(cors());

process.env.SECRET_KEY = "sfmprj88";
const checkAuth = require("../middleware/check-auth");

const UsersController = require("../controllers/Users");

users.post("/register", UsersController.users_register);

users.post("/login", UsersController.users_login);

users.get("/", checkAuth, UsersController.users_get_all);

users.get("/user/:_id", checkAuth, UsersController.users_get_id);

users.delete("/:email", checkAuth, UsersController.users_delete);

users.put("/user/:_id", checkAuth, UsersController.users_update);

users.put("/user/:_id/rank", checkAuth, UsersController.users_promote);

module.exports = users;
