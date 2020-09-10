const cors = require("cors");
const Party = require("../models/Party");
const User = require("../models/User");
const Songs = require("../models/Song");

exports.parties_create = (req, res) => {
  const today = new Date();
  const partyData = {
    event_name: req.body.event_name,
    date: req.body.date,
    location: req.body.location,
    description: req.body.description,
    state: req.body.state,
    theme: req.body.theme,
    created: today,
  };
  Party.findOne({
    event_name: req.body.event_name,
  })
    .then((party) => {
      if (!party) {
        Party.create(partyData)
          .then((party) => {
            res.status(201).json({
              message: "Événement créé avec succès",
              createdEvent: {
                event_name: party.event_name,
                date: party.date,
                location: party.location,
                description: party.description,
                state: party.state,
                theme: party.theme,
                _id: party._id,
                request: {
                  type: "GET",
                  url:
                    "https://sfm-project.herokuapp.com/parties/event/" +
                    party._id,
                },
              },
            });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
            console.log(err);
          });
      } else {
        res.status(409).json({ error: "Un évènement porte déjà ce nom" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.log(err);
    });
};

exports.parties_get_all = (req, res) => {
  Party.find({})
    .then((party) => {
      if (party) {
        res.status(200).json({
          count: party.length,
          events: party.map((doc) => {
            return {
              _id: doc._id,
              event_name: doc.event_name,
              date: doc.date,
              location: doc.location,
              description: doc.description,
              state: doc.state,
              theme: doc.theme,
              songs: doc.songs,
              users: doc.users,
              request: {
                type: "GET",
                url:
                  "https://sfm-project.herokuapp.com/parties/event/" + doc._id,
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

exports.parties_get_id = (req, res) => {
  Party.findOne({
    _id: req.params._id,
  })
    .populate({
      path: "users",
      populate: { path: "songs" },
    })
    .populate("songs")
    .then((party) => {
      if (party) {
        res.status(200).json({
          event: party,
          request: {
            type: "GET",
            url: "https://sfm-project.herokuapp.com/parties/",
          },
        });
      } else {
        res.status(404).json({ error: "L'événement n'existe pas" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.parties_delete = (req, res) => {
  Party.findOneAndRemove({
    _id: req.params._id,
  })
    .then((party) => {
      if (party) {
        res.status(200).json({
          message: "Evénèment supprimé",
          request: {
            type: "POST",
            url: "https://sfm-project.herokuapp.com/parties/create",
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

exports.parties_update = (req, res) => {
  const today = new Date();
  const partyUpdatedData = {
    event_name: req.body.event_name,
    date: req.body.date,
    location: req.body.location,
    description: req.body.description,
    state: req.body.state,
    theme: req.body.theme,
    updated_at: today,
  };
  Party.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    partyUpdatedData
  )
    .then((party) => {
      if (party) {
        res.status(200).json({
          message: "Evènement modifié",
          request: {
            type: "GET",
            url: "https://sfm-project.herokuapp.com/parties/event/" + party._id,
          },
        });
      } else {
        res.status(404).json({ error: "Impossible de mettre à jour" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.parties_status = (req, res) => {
  Party.findOneAndUpdate({ _id: req.params._id }, { state: req.body.state })
    .then((party) => {
      if (party) {
        if (req.body.state == 1) {
          res.status(200).json({ message: "Evènement démarré" });
        } else if (req.body.state == 2) {
          res.status(200).json({ message: "Evènement terminé" });
        } else if (req.body.state == 0) {
          res.status(200).json({ message: "Evènement non commencé" });
        } else if (req.body.state > 2) {
          res.status(200).json({ message: "Etat inconnu" });
        }
      } else {
        res.status(404).json({ error: "Impossible de changer l'état" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.parties_signup = (req, res) => {
  Party.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    { $addToSet: { users: req.body.userId } }
  )
    .then((party) => {
      // Ajout de l'évenement dans la table users ainsi que les chansons dans la table songs
      console.log(req.body.songId);
      User.findOneAndUpdate(
        { _id: req.body.userId },
        {
          $addToSet: {
            parties: req.params._id,
            songs: {
              _id: req.params._id,
              song: { $each: req.body.songId },
            },
          },
        }
      ).then((party) => {
        if (party) {
          res.status(200).json({
            message: "Utilisateur inscrit",
            request: {
              type: "GET",
              url: "https://sfm-project.herokuapp.com/users/user/" + party._id,
            },
          });
        } else {
          res
            .status(404)
            .json({ error: "Impossible d'inscrire l'utilisateur" });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.parties_unsub_user = (req, res) => {
  Party.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    { $pull: { users: req.body.userId } }
  )
    .then(() => {
      User.findOneAndUpdate(
        { _id: req.body.userId },
        {
          $pull: { parties: req.params._id },
        }
      ).then((party) => {
        if (party) {
          res.status(200).json({
            message: "Utilisateur désinscrit de l'évenement",
            request: {
              type: "GET",
              url: "https://sfm-project.herokuapp.com/users/user/" + party._id,
            },
          });
        } else {
          res
            .status(404)
            .json({ error: "Impossible de désinscrire l'utilisateur" });
        }
        User.findOneAndUpdate(
          { _id: req.body.userId },
          { $pull: { songs: { _id: req.params._id } } }
        ).then((party) => {
          if (party) {
            res.status(200).json({
              message: "Musiques associé à l'utilisateur enlevées",
            });
          } else {
            res.status(404).json({
              error: "Impossible d'enlever les musiques de l'utilisateur",
            });
          }
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.parties_add_songs = (req, res) => {
  Party.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    { $addToSet: { songs: req.body.songId } }
  )
    .then((party) => {
      if (party) {
        res.status(200).json({
          message: "Musique ajouté",
          request: {
            type: "GET",
            url: "https://sfm-project.herokuapp.com/songs/",
          },
        });
      } else {
        res.status(404).json({ error: "Impossible d'ajouter une musique" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.parties_remove_songs = (req, res) => {
  Party.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    { $pull: { songs: req.body.songId } }
  )
    .then((party) => {
      if (party) {
        res.status(200).json({
          message: "Musique enlevée",
          request: {
            type: "GET",
            url: "https://sfm-project.herokuapp.com/songs/",
          },
        });
      } else {
        res.status(404).json({ error: "Impossible d'enlevé la musique" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
