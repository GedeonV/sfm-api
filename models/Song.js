const mongoose = require("mongoose")
const Schema = mongoose.Schema

const SongSchema = new Schema({
	title: {
		type: String
	},
	artist: {
		type: String
	},
	album : {
		type: String
	},
	date : {
		type: Date
	},
	style : {
		type: String,
		required: true
	},
	time : {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
	},
})

module.exports = Song = mongoose.model('songs', SongSchema)