const cors = require("cors");
const Song = require("../models/Song");
const fs = require("fs");
const songs = require("../routes/Songs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "sfm88",
  api_key: "928328299487922",
  api_secret: "ml3tMM05ePIw8-z8zUYOhEw4nZs",
});

exports.songs_get_all = (req, res) => {
  Song.find({})
    .then((song) => {
      if (song) {
        res.json(song);
      } else {
        res.json({ error: "Aucune donnée" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.songs_get_id = (req, res) => {
  Song.findOne({
    _id: req.params._id,
  })
    .then((song) => {
      if (song) {
        let data_json = {
          song_id: song._id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          date: song.date,
          style: song.style,
          time: song.time,
          path: song.path,
          created_at: song.created_at,
        };
        res.json(data_json);
      } else {
        res.json({ error: "Cette musique n'existe pas" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.songs_upload = (req, res) => {
  console.log(req.file);
  const today = new Date();
  Song.findOne({
    title: req.body.title,
  })
    .then((song) => {
      if (!song) {
        cloudinary.uploader.upload(
          req.file.path,
          {
            resource_type: "raw",
            public_id: `uploads/${req.file.originalname}`,
          }, // directory and tags are optional
          (err, song) => {
            if (err) {
              console.log(err);
              res.json({ error: err });
            } else {
              console.log("file uploaded to Cloudinary");
              console.log(song);
              const songData = {
                title: req.body.title,
                artist: req.body.artist,
                album: req.body.album,
                date: req.body.date,
                style: req.body.style,
                time: req.body.time,
                path: song.url,
                created: today,
              };
              Song.create(songData)
                .then((song) => {
                  res.json({ status: song.title + "  enregistrée" });
                })
                .catch((err) => {
                  res.json({ error: err });
                });
              // remove file from server
              fs.unlinkSync(req.file.path);
            }
          }
        );
      } else {
        res.json({ error: "Ce son existe déjà" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};
