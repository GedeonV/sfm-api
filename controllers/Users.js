const cors = require("cors")
//const jwt = require("jsonwebtoken")
//const bcrypt = require("bcryptjs")
const User = require("../models/User")


exports.users_register = (req,res) => {
	const today = new Date()
	const userData = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		location : req.body.location,
		email: req.body.email,
		mobile: req.body.mobile,
		party: req.body.party,
		songs: req.body.songs,
		created: today
	}
	User.findOne({
		email: req.body.email
	})
	.then(user => {
		if(!user){
			User.create(userData)
				.then(user => {
					res.json({'status': user.email + '  enregistrée'})
				})
				.catch(err => {
					res.json({'erreur': err})
				})
			}
		else{
			res.json({'erreur': 'Utilisateur existe déjà'})
		}
	})
	.catch(err => {
		res.json({'erreur': err})
	})
}

exports.users_get_all = (req,res) => {
	User.find({})
	.then(user => {
		if(user){
			res.send(user)
		}else{
			res.json({'erreur': 'Aucune donnée'})
		}
	})
	.catch(err => {
		res.json({'erreur': err})
	})
}

exports.users_get_id = (req,res) => {
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
						"mobile" : user.mobile,
						"first_name" : user.first_name,
						"last_name" : user.last_name,
						"location" : user.location,
						"party" : user.party,
						"songs" : user.songs,
						"created_at" : user.created_at,
					}
				res.send(data_json)
		}else{
			res.json({'erreur': 'L\'utilisateur n\'existe pas'})
		}
	})
	.catch(err => {
		res.json({'erreur': err})
	})
}

exports.users_delete = (req,res) => {
	User.findOneAndRemove({
		email: req.params.email
	})
	.then(user => {
		if(user){
			res.send({'notification': 'Utilisateur supprimé'})
		}else{
			res.json({'erreur': 'Impossible de supprimé'})
		}
	})
	.catch(err => {
		res.json({'erreur': err})
	})
}


exports.users_update = (req,res) => {
	const today = new Date()
	const userUpdatedData = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		location: req.body.location,
		mobile: req.body.mobile,
		party: req.body.party,
		songs: req.body.songs,
		updated_at: today,
	}

	User.findOneAndUpdate({
		_id : req.params._id
	}, userUpdatedData)
	.then(user => {
		if(user){
			res.send({'notification': 'Utilisateur est modifié'})
		}else{
			res.json({'erreur': 'Impossible de mettre à jour'})
		}
	})
	.catch(err => {
		res.json({'erreur': err})
	})
}