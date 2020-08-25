const express = require("express")
const parties = express.Router()
const cors = require("cors")
//const jwt = require("jsonwebtoken")
//const bcrypt = require("bcrypt")

const Party = require("../models/Party")
parties.use(cors())

process.env.SECRET_KEY = 'sfmprj88'
const checkAuth = require('../middleware/check-auth')

const PartiesController = require("../controllers/Parties")

parties.post("/create", checkAuth,PartiesController.parties_create)

parties.get('/', checkAuth,PartiesController.parties_get_all)

parties.get('/event/:_id', checkAuth,PartiesController.parties_get_id)

parties.delete('/:_id', checkAuth,PartiesController.parties_delete)

parties.put('/event/:_id', checkAuth,PartiesController.parties_update)

parties.put('/event/:_id/state', checkAuth,PartiesController.parties_status)

parties.post('/event/:_id/sign', checkAuth,PartiesController.parties_signup)

parties.delete('/event/:_id/remove', checkAuth,PartiesController.parties_user_remove)

module.exports = parties