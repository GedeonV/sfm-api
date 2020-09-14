const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.users_register = (req, res) => {
  const today = new Date();
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    location: req.body.location,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
    created: today,
  };
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash;
          User.create(userData)
            .then((user) => {
              res.status(201).json({
                message: "Utilisateur enregistré",
                createdUser: {
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  mobile: user.mobile,
                  _id: user._id,
                  request: {
                    type: "GET",
                    url:
                      "https://sfm-project.herokuapp.com/users/user/" +
                      user._id,
                  },
                },
              });
            })
            .catch((err) => {
              res.status(404).json({ error: err });
            });
        });
      } else {
        res.status(409).json({ error: "Utilisateur existe déjà" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.users_login = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          };
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "4h",
          });
          let data_json = {
            token: token,
            user_id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            mobile: user.mobile,
            rank: user.rank,
            created_at: user.created_at,
          };
          res.status(200).json(data_json);
        } else {
          res.status(404).json({ error: "Mauvais mot de passe" });
        }
      } else {
        res.status(500).json({ error: "User does not exist" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.users_get_all = (req, res) => {
  User.find({})
    .then((user) => {
      if (user) {
        res.status(200).json({
          count: user.length,
          users: user.map((doc) => {
            return {
              _id: doc._id,
              first_name: doc.first_name,
              last_name: doc.last_name,
              email: doc.email,
              mobile: doc.mobile,
              songs: doc.songs,
              parties: doc.parties,
              rank: doc.rank,
              request: {
                type: "GET",
                url: "https://sfm-project.herokuapp.com/users/user/" + doc._id,
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

exports.users_get_id = (req, res) => {
  User.findOne({
    _id: req.params._id,
  })
    .populate("parties")
    .populate("songs")
    .then((user) => {
      if (user) {
        res.status(200).json({
          user: user,
          request: {
            type: "GET",
            url: "https://sfm-project.herokuapp.com/users/",
          },
        });
      } else {
        res.status(404).json({ error: "L'utilisateur n'existe pas" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.users_delete = (req, res) => {
  User.findOneAndRemove({
    email: req.params.email,
  })
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "Utilisateur supprimé",
          request: {
            type: "POST",
            url: "https://sfm-project.herokuapp.com/users/register",
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

exports.users_update = (req, res) => {
  const today = new Date();
  const userUpdatedData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    mobile: req.body.mobile,
    updated_at: today,
  };

  User.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    userUpdatedData
  )
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "Utilisateur est modifié",
          request: {
            type: "GET",
            url: "https://sfm-project.herokuapp.com/users/users/" + user._id,
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

exports.users_promote = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    { rank: req.body.rank }
  )
    .then((user) => {
      if (user) {
        if (user.rank == 0) {
          res.status(200).json({ message: "Utilisateur promu Administrateur" });
        } else {
          res.status(200).json({ message: "Utilisateur rétrogradé" });
        }
      } else {
        res.status(404).json({ error: "Impossible de mettre à jour" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
