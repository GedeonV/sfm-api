const cors = require("cors")
const Party = require("../models/Party");

exports.parties_create = (req,res) => {
	const today = new Date()
	const partyData = {
		event_name: req.body.event_name,
		date: req.body.date,
		location: req.body.location,
		description: req.body.description,
		state: req.body.state,
		event_code: req.body.event_code,
		theme: req.body.theme,
		current_song: req.body.current_song,
		current_user: req.body.current_user,
		created: today
	}
	Party.findOne({
		event_name: req.body.event_name
	})
	.then(party => {
		if(!party){
			Party.create(partyData)
				.then(party => {
					res.json({status: party.event_name + '  enregistré'})
				})
				.catch(err => {
					res.json({error: err})
				})
			}
		else{
			res.json({error: 'Un évènement porte déjà ce nom'})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
}

exports.parties_get_all = (req,res) => {
	Party.find({})
	.then(party => {
		if(party){
			res.send(party)
		}else{
			res.json({error: 'Aucune donnée'})
		}
	})
	.catch(err => {
		res.json({'error': err})
	})
}

exports.parties_get_id = (req,res) => {
	Party.findOne({
		_id : req.params._id
	})
	.then(party => {
		if(party){
				let data_json = 
					{
						"party_id": party._id,
						"event_name" : party.event_name,
						"description": party.description,
						"location" : party.location,
						"date": party.date,
						"state": party.state,
						"event_code": party.event_code,
						"theme": party.theme,
						"current_song" : party.current_song,
						"current_user" : party.current_user,
						"created_at" : party.created_at,
					}
				res.send(data_json)
		}else{
			res.json({'erreur': 'L\'événement n\'existe pas'})
		}
	})
	.catch(err => {
		res.json({'erreur': err})
	})
}

exports.parties_delete = (req,res) => {
	Party.findOneAndRemove({
		_id: req.params._id
	})
	.then(party => {
		if(party){
			res.send({'notification': 'Evénèment supprimé'})
		}else{
			res.json({'erreur': 'Impossible de supprimé'})
		}
	})
	.catch(err => {
		res.json({'erreur': err})
	})
}

exports.parties_update = (req,res) => {
	const today = new Date()
	const partyUpdatedData = {
		event_name: req.body.event_name,
		date: req.body.date,
		location: req.body.location,
		description: req.body.description,
		state: req.body.state,
		event_code: req.body.event_code,
		theme: req.body.theme,
		updated_at: today,
	}
	Party.findOneAndUpdate({
		_id : req.params._id
	}, partyUpdatedData)
	.then(party => {
		if(party){
			res.send({'notification': 'Evènement modifié'})
		}else{
			res.json({'erreur': 'Impossible de mettre à jour'})
		}
	})
	.catch(err => {
		res.json({'erreur': err})
	})
}

exports.parties_signup = (req,res) => {
	const usersData = {
		users: req.body.userId,
	}
	Party.findOneAndUpdate({
		_id : req.params._id
	}, usersData)
	.then(party => {
		if(party){
			res.send({'notification': 'Inscription éffectué'})
		}else{
			res.json({'erreur': 'Impossible de s\'inscrire'})
		}
	})
	.catch(err => {
		res.json({'erreur': err})
	})

}