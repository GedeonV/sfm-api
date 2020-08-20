const express = require("express")
const songs = express.Router()
const cors = require("cors")
//const jwt = require("jsonwebtoken")
//const bcrypt = require("bcryptjs")

const Song = require("../models/Song")
songs.use(cors())

const SongsController = require("../controllers/Songs")

module.exports = songs