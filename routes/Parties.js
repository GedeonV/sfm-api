const express = require("express")
const parties = express.Router()
const cors = require("cors")
//const jwt = require("jsonwebtoken")
//const bcrypt = require("bcrypt")

const Party = require("../models/Party")
parties.use(cors())

const PartiesController = require("../controllers/Parties")

parties.post("/create", PartiesController.parties_create)

parties.get('/', PartiesController.parties_get_all)

parties.get('/event/:_id', PartiesController.parties_get_id)

parties.delete('/:_id', PartiesController.parties_delete)

parties.put('/event/:_id', PartiesController.)

module.exports = parties