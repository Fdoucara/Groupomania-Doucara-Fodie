const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../config/.env' });
const db = require('../config/db');
const validator = require('validator');

exports.verifEmailAndPassword = (req, res, next) => {
  const email = req.body.email;
  const passwordRegex = /^(?=.*?[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ])(?=.*?[a-zàâæçéèêëîïôœùûüÿ])(?=.*?[0-9])(?=.*?[#.+?!@$%,:;^&*_-]).{6,}$/;
  let textPassword = passwordRegex.test(req.body.password);
  if (validator.isEmail(email) && textPassword) {
    next();
  }
  else {
    return res.status(400).json(
      { message: "Format email ou mot de passe non valide ! Le mot de passe doit contenir au moins 1 majuscule, 1 chiffre, 1 caractère spécial et avoir une longueur minimale de 6 caractères." }
    );
  }
};

exports.verifToken = (req, res, next) => {
  // Recuperer le token dans le headers de la requete 
  // Decoder le token a l'aide de la SECRET_KEY 
  // Recuperer la propriete userId de l'objet obtenu lors du decodage
  // Ajouter une propriete auth == userId a la requete 

  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        const id = decodedToken.id;
        db.query("SELECT user.nom, user.prenom, user.email, user.user_imageUrl, user.bio, role.role FROM user JOIN role ON user.role_id = role.id WHERE user.id = ?", [id], (error, result) => {
          if (!error) {
            if (result.length == 0) {
              res.cookie('jwt', '', { maxAge: 1 });
              return res.status(401).json({ message: "TOKEN plus valable !" });
            } else {
              req.auth = decodedToken.id;
              next();
              return;
            }
          } else {
            res.status(400).json({ error });
          }
        })
      }
    });
  } else {
    return res.status(401).json({ message: "Pas de token !" });
  }
};

exports.isAdmin = (req, res, next) => {
  let id = req.auth;
  db.query("SELECT user.role_id FROM user WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (resultat[0].role_id == 1) {
        next();
      } else {
        return res.status(401).json({ message: "Seul l'admin peut realiser cette action !" });
      }
    } else {
      res.status(400).json({ error });
    }
  })
};

exports.isModerator = (req, res, next) => {
  let id = req.auth;
  db.query("SELECT user.role_id FROM user WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (resultat[0].role_id == 4 || resultat[0].role_id == 1) {
        next();
      } else {
        return res.status(401).json({ message: "Seul l'admin et le moderateur peuvent réaliser cette action !" });
      }
    } else {
      res.status(400).json({ error });
    }
  })
};