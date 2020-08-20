const express = require("express")
const streams = express.Router()
const cors = require("cors")
//const jwt = require("jsonwebtoken")
//const bcrypt = require("bcrypt")

const Stream = require("../models/Stream")
streams.use(cors())

//process.env.SECRET_KEY = 'secret'

streams.post("/stream", (req,res) => {
	const today = new Date()
	const streamData = {
		peer_id : req.body.peer_id,
		id_user : req.body.id_user,
		title : req.body.title,
		description : req.body.description,
		location : req.body.location,
		created: today,
		updated_at: today
	}
	
	Stream.findOne({
		peer_id : req.body.peer_id
	})
	.then(stream => {
		if(!stream){
				Stream.create(streamData)
				.then(stream => {
					res.json({status: stream.peer_id + '  registered'})
				})
				.catch(err => {
					res.send('error: ' + err)
				})
		}else{
			res.json({error: 'Stream already exists'})
		}
	})
	.catch(err => {
		res.send('error:' + err)
	})
})

streams.get('/stream/:id_user', (req,res) => {
	Stream.findOne({
		id_user: req.params.id_user
	})
	.then(stream => {
		if(stream){
				let data_json = 
					{
						"peer_id" : stream.peer_id,
						"id_user" : stream.id_user,
						"title" : stream.title,
						"description" : stream.description,
						"created_at" : stream.created_at,
						"updated_at" : stream.updated_at
					}
				res.send(data_json)
		}else{
			res.json({error: 'Stream does not exist'})
		}
	})
	.catch(err => {
		res.send('error: ' + err)
	})
})

streams.get('/', (req,res) => {
	Stream.find({})
	.then(stream => {
		if(stream){
			res.send(stream)
		}else{
			res.json({error: 'Auncune diffusion en cours'})
		}
	})
	.catch(err => {
		res.send('error: ' + err)
	})
})

streams.delete('/stream/:peer_id', (req,res) => {
	Stream.findOneAndRemove({
		peer_id: req.params.peer_id
	})
	.then(stream => {
		if(stream){
			res.send({notification: 'Stream deleted'})
		}else{
			res.json({error: 'Can\'t Delete'})
		}
	})
	.catch(err => {
		res.send('error: ' + err)
	})
})

streams.put('/stream',(req,res) => {
	const today = new Date()
	const streamUpdatedData = {
		title : req.body.title,
		description : req.body.description,
		updated_at: today
	}
	Stream.findOneAndUpdate({
		peer_id : req.body.peer_id
	}, streamUpdatedData)
	.then(stream => {
		if(stream){
			res.send({notification: 'Stream updated'})
		}else{
			res.json({error: 'Can\'t Update'})
		}
	})
	.catch(err => {
		res.send('error: ' + err)
	})
})

module.exports = streams