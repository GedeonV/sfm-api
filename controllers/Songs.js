const cors = require("cors");
const Song = require("../models/Song");

exports.songs_upload = (req, res) => {
  console.log(req.file);
};
