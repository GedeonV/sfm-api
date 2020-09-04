const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

process.env.SECRET_KEY = "sfmprj88";
const checkAuth = require("../middleware/check-auth");

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
              res.json({ status: user.email + "  enregistrée" });
            })
            .catch((err) => {
              res.json({ error: err });
            });
        });
      } else {
        res.json({ error: "Utilisateur existe déjà" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
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
            expiresIn: 3600,
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
          res.json(data_json);
        } else {
          res.json({ error: "Mauvais mot de passe" });
        }
      } else {
        res.json({ error: "User does not exist" });
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
        res.json(user);
      } else {
        res.json({ error: "Aucune donnée" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
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
        let data_json = {
          token: user.token,
          user_id: user._id,
          email: user.email,
          mobile: user.mobile,
          first_name: user.first_name,
          last_name: user.last_name,
          location: user.location,
          parties: user.parties,
          created_at: user.created_at,
        };
        res.json(data_json);
      } else {
        res.json({ error: "L'utilisateur n'existe pas" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.users_delete = (req, res) => {
  User.findOneAndRemove({
    email: req.params.email,
  })
    .then((user) => {
      if (user) {
        res.json({ notification: "Utilisateur supprimé" });
      } else {
        res.json({ error: "Impossible de supprimé" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
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
        res.json({ notification: "Utilisateur est modifié" });
      } else {
        res.json({ error: "Impossible de mettre à jour" });
      }
    })
    .catch((err) => {
      res.json({ error: err });
    });
};

exports.users_promote = (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    { rank: req.body.state }
  ).then((user) => {
    if (user) {
      if (user.rank == 1) {
        res.json({ notification: "Utilisateur promu Administrateur" });
      } else {
        res.json({ notification: "Utilisateur rétrogradé" });
      }
    } else {
      res.json({ error: "Impossible de mettre à jour" });
    }
  });
};
