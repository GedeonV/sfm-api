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
    event_code: req.body.event_code,
    theme: req.body.theme,
    current_song: req.body.current_song,
    current_user: req.body.current_user,
    created: today,
  };
  Party.findOne({
    event_name: req.body.event_name,
  })
    .then((party) => {
      if (!party) {
        Party.create(partyData)
          .then((party) => {
            res.json({ status: party.event_name + "  enregistré" });
          })
          .catch((err) => {
            res.json({ error: err });
          });
      } else {
        res.json({ error: "Un évènement porte déjà ce nom" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.parties_get_all = (req, res) => {
  Party.find({})
    .then((party) => {
      if (party) {
        res.send(party);
      } else {
        res.json({ error: "Aucune donnée" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.parties_get_id = (req, res) => {
  Party.findOne({
    _id: req.params._id,
  })
    .populate("users")
    .populate("songs")
    .then((party) => {
      if (party) {
        let data_json = {
          party_id: party._id,
          event_name: party.event_name,
          description: party.description,
          location: party.location,
          date: party.date,
          state: party.state,
          event_code: party.event_code,
          theme: party.theme,
          users: party.users,
          songs: party.songs,
          current_song: party.current_song,
          current_user: party.current_user,
          created_at: party.created_at,
        };
        res.send(data_json);
      } else {
        res.json({ error: "L'événement n'existe pas" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.parties_delete = (req, res) => {
  Party.findOneAndRemove({
    _id: req.params._id,
  })
    .then((party) => {
      if (party) {
        res.send({ notification: "Evénèment supprimé" });
      } else {
        res.json({ error: "Impossible de supprimé" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
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
    event_code: req.body.event_code,
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
        res.send({ notification: "Evènement modifié" });
      } else {
        res.json({ error: "Impossible de mettre à jour" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.parties_status = (req, res) => {
  Party.findOneAndUpdate({ _id: req.params._id }, { state: req.body.state })
    .then((party) => {
      if (party) {
        if (req.body.state == 1) {
          res.json({ notification: "Evènement démarré" });
        } else if (req.body.state == 2) {
          res.json({ notification: "Evènement terminé" });
        } else if (req.body.state == 0) {
          res.json({ notification: "Evènement non commencé" });
        } else if (req.body.state > 2) {
          res.json({ notification: "Etat inconnu" });
        }
      } else {
        res.json({ error: "Impossible de changer l'état" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
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
      User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { parties: req.params._id } }
      ).then((party) => {
        if (party) {
          res.json({ notification: "Utilisateur inscrit" });
        } else {
          res.json({ error: "Impossible d'inscrire l'utilisateur" });
        }
      });
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.parties_remove_user = (req, res) => {
  Party.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    { $pull: { users: req.body.userId } }
  )
    .then((party) => {
      User.findOneAndUpdate(
        { _id: req.body.userId },
        { $pull: { parties: req.params._id } }
      ).then((party) => {
        if (party) {
          res.send({ notification: "Utilisateur enlevé" });
        } else {
          res.json({ error: "Impossible d'enlever l'utilisateur" });
        }
      });
    })
    .catch((err) => {
      res.json({ error: err });
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
        res.json({ notification: "Musique ajouté" });
      } else {
        res.json({ error: "Impossible d'ajouter une musique" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
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
        res.json({ notification: "Musique enlevée" });
      } else {
        res.json({ error: "Impossible d'enlevé la musique" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};
