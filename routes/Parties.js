const express = require("express")
const parties = express.Router()
const cors = require("cors")
//const jwt = require("jsonwebtoken")
//const bcrypt = require("bcrypt")

const Party = require("../models/Party")
parties.use(cors())

const PartiesController = require("../controllers/Parties")

module.exports = parties