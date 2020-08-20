const jwt = require("jsonwebtoken")


module.exports = (req, res, next) => {
	try {
		const decoded = jwt.verify(req.header('Authorization').split(" ")[1], process.env.SECRET_KEY)
		req.userJWT = decoded; 
	} catch (error) {
		return res.status(401).json({
			notification: 'Problème lors de la connexion, Token invalide ou expiré'
		})
	}
	next()
}