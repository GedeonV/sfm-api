const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},

	location : {
		type: Object
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		unique: true
	},

	rank: {
		type: Number,
		default: 0
	},
	
	mobile : {
		type: String,
		required: true
	},

	parties : [{
		type: mongoose.Schema.Types.ObjectId, ref: 'parties'
	}],

	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
	},
})

module.exports = User = mongoose.model('users', UserSchema)