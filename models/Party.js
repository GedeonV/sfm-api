const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PartySchema = new Schema({
	event_name : {
		type: String,
		required: true, 
	},
	date : {
		type: Date,
		required: true
	},
	location : {
		type: Object,
		required: true
	},
	description : {
		type: String,
	},
	event_code: {
		type: String,
		required: true
	},
	theme: {
		type: String,
	},
	state : {
		type: Boolean
	},

	users : [{
		type: mongoose.Schema.Types.ObjectId, ref: 'users'
	}],

	current_song : {
		type: Object
	},
	current_user: {
		type: Object
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date
	}
})

module.exports = Party = mongoose.model('parties', PartySchema)