const cors = require("cors");
const Song = require("../models/Song");
const songs = require("../routes/Songs");

exports.songs_upload = (req, res) => {
  console.log(req.file);
  const today = new Date();
  const songData = {
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    date: req.body.date,
    style: req.body.style,
    time: req.body.time,
    path: req.file.path,
    created: today,
  };
  Song.findOne({
    title: req.body.title,
  })
    .then((song) => {
      if (!song) {
        Song.create(songData)
          .then((song) => {
            res.json({ status: song.title + "  enregistrée" });
          })
          .catch((err) => {
            res.json({ erreur: err });
          });
      } else {
        res.json({ erreur: "Ce son existe déjà" });
      }
    })
    .catch((err) => {
      res.json({ erreur: err });
    });
};
