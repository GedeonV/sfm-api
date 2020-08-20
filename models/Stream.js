const mongoose = require("mongoose")
const Schema = mongoose.Schema

const StreamSchema = new Schema({
	peer_id : {
		type: String,
		required: true,
		unique : true, 
	},
	id_user : {
		type: String,
		required: true
	},
	title : {
		type: String,
		required: true
	},
	location : {
		type: Object,
	},
	description : {
		type: String,
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date
	}
})


module.exports = Stream = mongoose.model('streams', StreamSchema)