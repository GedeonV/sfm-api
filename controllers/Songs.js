const cors = require("cors");
const Song = require("../models/Song");

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
  const cloudinary = require("cloudinary").v2;

  cloudinary.config({
    cloud_name: "sfm88",
    api_key: "928328299487922",
    api_secret: "ml3tMM05ePIw8-z8zUYOhEw4nZs",
  });

  cloudinary.uploader.upload(
    req.file.path,
    { resource_type: "raw", public_id: `uploads/${req.file.originalname}` }, // directory and tags are optional
    function (err, song) {
      if (err) {
        console.log(err);
      } else {
        console.log("file uploaded to Cloudinary");
        console.log(song);
        // remove file from server
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      }
    }
  );

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
