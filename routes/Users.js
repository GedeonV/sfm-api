const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY = 'scrtrqsr54'
const checkAuth = require('../middleware/check-auth')

users.post("/register", (req,res) => {
	const today = new Date()
	console.log(req.body.location)
	const userData = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		nickname: req.body.nickname,
		age: req.body.age,
		location : req.body.location,
		birth_date: req.body.birth_date,
		email: req.body.email,
		password: req.body.password,
		onAir : false,
		peer_id : "",
		created: today
	}

	User.findOne({
		email: req.body.email
	})
	.then(user => {
		if(!user){
			bcrypt.hash(req.body.password, 10, (err,hash) => {
				userData.password = hash
				User.create(userData)
				.then(user => {
					res.json({status: user.email + '  registered'})
				})
				.catch(err => {
					res.json({error: err})
				})
			})
		}else{
			res.json({error: 'User already exists'})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
})

users.post('/login', (req,res) => {
	User.findOne({
		email: req.body.email
	})
	.then(user => {
		if(user){
			if(bcrypt.compareSync(req.body.password, user.password)){
				const payload = {
					_id: user._id,
					first_name: user.first_name,
					last_name: user.last_name,
					email: user.email,
				}
				let token = jwt.sign(payload, process.env.SECRET_KEY, {
					expiresIn: 3600
				})
				let data_json = 
					{
						"token" : token,
						"user_id": user._id,
						"email" : user.email,
						"first_name" : user.first_name,
						"last_name" : user.last_name,
						"nickname" : user.nickname,
						"birth_date" : user.birth_date,
						"age" : user.age,
						"created_at" : user.created_at,
					}
				res.send(data_json)
			}else{
				res.json({error: 'Mauvais mot de passe'})
			}
		}else{
			res.json({error: 'User does not exist'})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
})

users.get('/', checkAuth, (req,res) => {
	User.find({})
	.then(user => {
		if(user){
			res.send(user)
		}else{
			res.json({error: 'Users does not exist'})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
})

users.get('/user/:_id', checkAuth, (req,res) => {
	User.findOne({
		_id : req.params._id
	})
	.then(user => {
		if(user){
				let data_json = 
					{
						"token" : user.token,
						"user_id": user._id,
						"email" : user.email,
						"first_name" : user.first_name,
						"last_name" : user.last_name,
						"nickname" : user.nickname,
						"birth_date" : user.birth_date,
						"age" : user.age,
						"location" : user.location,
						"onAir" : user.onAir,
						"created_at" : user.created_at,
						"peer_id" : user.peer_id
					}
				res.send(data_json)
		}else{
			res.json({error: 'User does not exist'})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
})

users.delete('/:email', checkAuth, (req,res) => {
	User.findOneAndRemove({
		email: req.params.email
	})
	.then(user => {
		if(user){
			res.send({notification: 'User deleted'})
		}else{
			res.json({error: 'Can\'t Delete'})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
})

users.put('/user/:_id', checkAuth, (req,res) => {
	const today = new Date()
	const userUpdatedData = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		nickname: req.body.nickname,
		age: req.body.age,
		birth_date: req.body.birth_date,
		email: req.body.email,
		location: req.body.location,
		updated_at: today,
	}
	
	//let hash = bcrypt.hashSync(req.body.password, 10);
	//userUpdatedData.password = hash 

	User.findOneAndUpdate({
		_id : req.params._id
	}, userUpdatedData)
	.then(user => {
		if(user){
			res.send({notification: 'Utilisateur est modifié'})
		}else{
			res.json({error: 'Can\'t Update'})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
})

users.put('/user/:_id/location', checkAuth, (req,res) => {
	const userLocation = {
		location: req.body.location
	}
	User.findOneAndUpdate({
		_id : req.params._id
	},userLocation)
	.then(user => {
		if(user){
			res.send({notification: 'La position de  l\'utilisateur est mise à jour'})
		}else{
			res.json({'error': err})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
})


users.put('/user/:_id/peer', checkAuth, (req,res) => {
	const userPeerID = {
		peer_id: req.body.peer_id
	}
	User.findOneAndUpdate({
		_id : req.params._id
	},userPeerID)
	.then(user => {
		if(user){
			res.send({notification: 'Peer ID modifié'})
		}else{
			res.json({'error': err})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
})

users.put('/user/:_id/stream', checkAuth, (req,res) => {
	const userState = {
		onAir: req.body.onAir
	}
	User.findOneAndUpdate({
		_id : req.params._id
	},userState)
	.then(user => {
		if(user){
			res.send({notification: 'Status du stream changé'})
		}else{
			res.json({'error': err})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
})

module.exports = users