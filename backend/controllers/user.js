const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config({ path: './config/.env' });
const { signUpErrors } = require('../utils/errors.utils');


// ------------- USER FUNCTIONS -------------

// Création d'un utilisateur
exports.register = (req, res) => {
  let user = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    imageUrl: 'http://localhost:3000/images/user.png',
    bio: req.body.bio,
    password: req.body.password,
  }

  let role_id;
  bcrypt.hash(user.password, 10)
    .then(hash => {
      if (req.body.email == process.env.ADMIN_EMAIL) {
        role_id = process.env.ADMIN;
        db.query("INSERT INTO user (nom, prenom, email, user_imageUrl, bio, password, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [user.nom, user.prenom, user.email, user.imageUrl, user.bio, hash, role_id], (error, result) => {
          if (!error) {
            return res.status(201).json({ message: "Utilisateur bien ajouté !" });
          } else {
            const errors = signUpErrors(error);
            return res.status(400).json({ errors });
          }
        })
      } else {
        role_id = process.env.USER;
        db.query("INSERT INTO user (nom, prenom, email, user_imageUrl, bio, password, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [user.nom, user.prenom, user.email, user.imageUrl, user.bio, hash, role_id], (error, result) => {
          if (!error) {
            return res.status(201).json({ message: "Utilisateur bien ajouté !" });
          } else {
            const errors = signUpErrors(error);
            return res.status(400).json({ errors });
          }
        })
      }
    })
    .catch(err => res.status(500).json({ err }));
}

const maxAge = 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: maxAge })
}

// Connexion d'un utilisateur
exports.logIn = (req, res) => {
  let user = req.body;
  db.query("SELECT * FROM user WHERE email = ?", [user.email], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (resultat.length == 0) {
        return res.status(401).json({ message: "Cet email ne correspond a aucun utilisateur !" });
      }
      else {
        bcrypt.compare(user.password, resultat[0].password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ message: 'Mot de passe incorrect, accès non autorisé !' });
            } else {
              const token = createToken(resultat[0].id);
              res.cookie('jwt', token, { maxAge, httpOnly: true });
              return res.status(200).json({
                userId: resultat[0].id,
                roleUser: resultat[0].role_id
              });
            }
          })
      }
    } else {
      return res.status(400).json({ error });
    }
  })
}

// Deconnexion d'un utilisateur
exports.logOut = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  return res.status(200).json({ message: 'Vous êtes deconnecté !' })
}

// Récupération de tout les utilisateurs
exports.getAllUser = (req, res) => {
  db.query("SELECT user.id, user.nom, user.prenom, user.email, user.user_imageUrl, user.bio, user.role_id FROM user", [], (error, result) => {
    if (!error) {
      return res.status(200).json({ result });
    }
    return res.status(400).json({ error });
  })
}

// Récupération d'un seul utilisateur
exports.getOneUser = (req, res) => {
  let id = req.params.id;
  db.query("SELECT user.nom, user.prenom, user.email, user.user_imageUrl, user.bio, post.id, post.post_content, post.post_imageUrl, post.post_likes, post.post_date, post.user_id FROM user LEFT JOIN post ON user.id = post.user_id WHERE user.id = ?", [id], (error, result) => {
    if (!error) {
      return res.status(200).json({ result });
    } else {
      return res.status(400).json({ error });
    }
  })
}

// Modification données d'un utilisateur
exports.updateProfil = (req, res) => {
  const id = req.auth;
  let user = req.body;
  db.query("SELECT * FROM user WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (id !== resultat[0].id) {
        return res.status(401).json({ message: 'Requête non autorisée !' });

      }
      else {
        if (req.file) {
          if (resultat[0].user_imageUrl) {
            const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            const filename = resultat[0].user_imageUrl.split('/images/')[1];
            if (filename == 'user.png') {
              db.query("UPDATE user SET  nom = ?, prenom = ?, bio = ?, email = ?, user_imageUrl = ? WHERE id = ?", [user.nom, user.prenom, user.bio, user.email, imageUrl, id], (error, result) => {
                if (!error) {
                  return res.status(201).json({ message: "Les données de l'utilisateur ont bien été modifiées !" });
                }
                else {
                  return res.status(400).json({ error });
                }
              })
            } else {
              fs.unlink(`images/${filename}`, () => {
                db.query("UPDATE user SET nom = ?, prenom = ?, bio = ?, email = ?, user_imageUrl = ? WHERE id = ?", [user.nom, user.prenom, user.bio, user.email, imageUrl, id], (error, result) => {
                  if (!error) {
                    return res.status(201).json({ message: "Les données de l'utilisateur ont bien été modifiées !" });
                  }
                  else {
                    return res.status(400).json({ error });
                  }
                })
              })
            }
          } else {
            db.query("UPDATE user SET nom = ?, prenom = ?, bio = ?, email = ?, user_imageUrl = ? WHERE id = ?", [user.nom, user.prenom, user.bio, user.email, imageUrl, id], (error, result) => {
              if (!error) {
                return res.status(201).json({ message: "Les données de l'utilisateur ont bien été modifiées !" });
              }
              else {
                return res.status(400).json({ error });
              }
            })
          }
        }
        else {
          db.query("UPDATE user SET nom = ?, prenom = ?, bio = ?, email = ? WHERE id = ?", [user.nom, user.prenom, user.bio, user.email, id], (error, result) => {
            if (!error) {
              return res.status(201).json({ message: "Les données de l'utilisateur ont bien été modifiées !" });
            }
            else {
              return res.status(400).json({ error });
            }
          })
        }
      }
    }
    else {
      return res.status(400).json({ error });
    }
  })
}

// Suppression d'un utilisateur
exports.deleteProfil = (req, res) => {
  let id = req.auth;
  db.query("SELECT * FROM user WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (id !== resultat[0].id) {
        return res.status(401).json({ message: 'Requête non autorisée !' });
      }
      else {
        if (resultat[0].user_imageUrl) {
          const filename = resultat[0].user_imageUrl.split('/images/')[1];
          if (filename == 'user.png') {
            db.query("DELETE FROM user WHERE id = ?", [id], (error, result) => {
              if (!error) {
                res.cookie('jwt', '', { maxAge: 1 });
                return res.status(200).json({ message: 'Utilisateur bien supprimé !' });
              }
              else {
                return res.status(400).json({ error });
              }
            })
          } else {
            fs.unlink(`images/${filename}`, () => {
              db.query("DELETE FROM user WHERE id = ?", [id], (error, result) => {
                if (!error) {
                  res.cookie('jwt', '', { maxAge: 1 });
                  return res.status(200).json({ message: 'Utilisateur bien supprimé !' });
                }
                else {
                  return res.status(400).json({ error });
                }
              })
            })
          }
        } else {
          db.query("DELETE FROM user WHERE id = ?", [id], (error, result) => {
            if (!error) {
              res.cookie('jwt', '', { maxAge: 1 });
              return res.status(200).json({ message: 'Utilisateur bien supprimé !' });
            }
            else {
              return res.status(400).json({ error });
            }
          })
        }
      }
    }
    else {
      return res.status(400).json({ error });
    }
  })
}

// Suppression d'un utilisateur par l'Admin et le Modérateur
exports.deleteAnyoneProfil = (req, res) => {
  let id = req.params.id;
  db.query("SELECT * FROM user WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (resultat[0].user_imageUrl) {
        const filename = resultat[0].user_imageUrl.split('/images/')[1];
        if (filename == 'user.png') {
          db.query("DELETE FROM user WHERE id = ?", [id], (error, result) => {
            if (!error) {
              return res.status(200).json({ message: "Utilisateur bien supprimé !" });
            }
            else {
              return res.status(400).json({ error });
            }
          })
        }
        else {
          fs.unlink(`images/${filename}`, () => {
            db.query("DELETE FROM user WHERE id = ?", [id], (error, result) => {
              if (!error) {
                return res.status(200).json({ message: "Utilisateur bien supprimé !" });
              }
              else {
                return res.status(400).json({ error });
              }
            })
          })
        }
      } else {
        db.query("DELETE FROM user WHERE id = ?", [id], (error, result) => {
          if (!error) {
            return res.status(200).json({ message: "Utilisateur bien supprimé !" });
          }
          else {
            return res.status(400).json({ error });
          }
        })
      }
    }
    else {
      return res.status(400).json({ error });
    }
  })
}

// Changement de rôle d'un utilisateur par l'Admin
exports.changeRole = (req, res) => {
  let user_id = req.params.id;
  db.query("SELECT * FROM user WHERE user.id = ?", [user_id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (resultat[0].role_id == process.env.MODERATOR) {
        const role_id = process.env.USER;
        db.query("UPDATE user SET role_id = ? WHERE id = ?", [role_id, user_id], (error, result) => {
          if (!error) {
            return res.status(201).json({ message: "Passage de modérateur à utilisateur normal !" });
          }
          else {
            return res.status(400).json({ error });
          }
        })
      }
      else if (resultat[0].role_id == process.env.USER) {
        const role_id = process.env.MODERATOR;
        db.query("UPDATE user SET role_id = ? WHERE id = ?", [role_id, user_id], (error, result) => {
          if (!error) {
            return res.status(201).json({ message: "Passage d'utilisateur normal à modérateur !" });
          }
          else {
            return res.status(400).json({ error });
          }
        })
      }
    } else {
      return res.status(404).json({ message: "Aucun utilisateur trouvé !" });
    }
  })
}