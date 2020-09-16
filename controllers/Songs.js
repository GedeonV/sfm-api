const cors = require("cors");
const Song = require("../models/Song");
const fs = require("fs");
const songs = require("../routes/Songs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "sfm88",
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.songs_get_all = (req, res) => {
  Song.find({})
    .then((song) => {
      if (song) {
        res.status(200).json({
          count: song.length,
          songs: song.map((doc) => {
            return {
              _id: doc._id,
              title: doc.title,
              artist: doc.artist,
              album: doc.album,
              date: doc.date,
              style: doc.style,
              time: doc.time,
              path: doc.path,
              request: {
                type: "GET",
                url: "https://sfm-project.herokuapp.com/songs/song/" + doc._id,
              },
            };
          }),
        });
      } else {
        res.status(204).json({ error: "Aucune donnée" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.songs_get_id = (req, res) => {
  Song.findOne({
    _id: req.params._id,
  })
    .then((song) => {
      if (song) {
        res.status(200).json({
          song: song,
          request: {
            type: "GET",
            url: "https://sfm-project.herokuapp.com/songs/",
          },
        });
      } else {
        res.status(404).json({ error: "Cette musique n'existe pas" });
      }
    })
    .catch((err) => {
      res.status(200).json({ error: err });
    });
};

exports.songs_delete = (req, res) => {
  Song.findOneAndRemove({
    _id: req.params._id,
  })
    .then((song) => {
      if (song) {
        res.status(200).json({
          message: "Musique supprimée",
          request: {
            type: "POST",
            url: "https://sfm-project.herokuapp.com/songs/upload",
          },
        });
      } else {
        res.status(404).json({ error: "Impossible de supprimé" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
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
          },
          (err, song) => {
            if (err) {
              console.log(err);
              res.status(404).json({ error: err });
            } else {
              console.log("file uploaded to Cloudinary");
              console.log(song);
              const songData = {
                title: req.body.title,
                artist: req.body.artist,
                album: req.body.album,
                date: req.body.date,
                style: req.body.style,
                path: song.url,
                created: today,
              };
              Song.create(songData)
                .then((song) => {
                  res.status(201).json({
                    message: song.title + "  enregistré",
                    song: song,
                  });
                })
                .catch((err) => {
                  res.status(404).json({ error: err });
                });
              // remove file from server
              fs.unlinkSync(req.file.path);
            }
          }
        );
      } else {
        res.status(404).json({ error: "Ce son existe déjà" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
