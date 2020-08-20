const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	nickname: {
		type: String,
		unique: true
	},
	age : {
		type: Number
	},
	location : {
		type: Object
	},
	birth_date : {
		type: Date
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
	onAir: {
		type: Boolean,
	},
	peer_id : {
		type: String,
		unique : true, 
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
	},
})


module.exports = User = mongoose.model('users', UserSchema)