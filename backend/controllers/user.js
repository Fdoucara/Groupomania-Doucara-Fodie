const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config({ path: './config/.env' });

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
          }
          res.status(400).json({ error });
        })
      } else {
        role_id = process.env.USER;
        db.query("INSERT INTO user (nom, prenom, email, user_imageUrl, bio, password, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [user.nom, user.prenom, user.email, user.imageUrl, user.bio, hash, role_id], (error, result) => {
          if (!error) {
            return res.status(201).json({ message: "Utilisateur bien ajouté !" });
          }
          res.status(400).json({ error });
        })
      }
    })
    .catch(err => res.status(500).json({ err }));
}

const maxAge = 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: maxAge })
}

exports.logIn = (req, res) => {
  let user = req.body;

  db.query("SELECT * FROM user WHERE email = ?", [user.email], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));

      if (resultat.length == 0) {
        res.status(401).json({ message: "Cet utilisateur n'existe pas !" });
        return;
      }
      else {
        bcrypt.compare(user.password, resultat[0].password)
          .then(valid => {
            if (!valid) {
              res.status(401).json({ message: 'Mot de passe incorrect, accès non autorisé !' });
            }
            const token = createToken(resultat[0].id);
            res.cookie('jwt', token, { maxAge, httpOnly: true });
            res.status(200).json({
              userId: resultat[0].id,
              roleUser: resultat[0].role_id
            });
          })
      }
    } else {
      return res.status(400).json({ error });
    }
  })
}

exports.logOut = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'Vous êtes deconnecté !'})
}

exports.getAllUser = (req, res) => {
  db.query("SELECT user.id, user.nom, user.prenom, user.email, user.user_imageUrl, user.bio, user.role_id FROM user", [], (error, result) => {
    if (!error) {
      return res.status(200).json({ result });
    }
    res.status(400).json({ error });
  })
}

exports.getOneUser = (req, res) => {
  let id = req.params.id;
  db.query("SELECT user.nom, user.prenom, user.email, user.user_imageUrl, user.bio, post.id, post.post_content, post.post_imageUrl, post.post_likes, post.post_date, post.user_id, comment.comment_content FROM user LEFT JOIN post ON user.id = post.user_id LEFT JOIN comment ON user.id = comment.user_id WHERE user.id = ? GROUP BY post.id", [id], (error, result) => {
    if (!error) {
      if (result.length == 0) {
        return res.status(401).json({ message: "Aucun utilisateur trouvé !" });
      } else {
        return res.status(200).json({ result });
      }
    } else {
      res.status(400).json({ error });
    }
  })
}

exports.updateProfil = (req, res) => {
  const id = req.auth;
  let user = req.body;

  db.query("SELECT * FROM user WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));

      if (id !== resultat[0].id) {
        res.status(401).json({ message: 'Requête non autorisée !' });
        return;
      }
      else {
        if (req.file) {
          if (resultat[0].user_imageUrl) {
            const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            const filename = resultat[0].user_imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
              db.query("UPDATE user SET nom = ?, prenom = ?, email = ?, user_imageUrl = ? WHERE id = ?", [user.nom, user.prenom, user.email, imageUrl, id], (error, result) => {
                if (!error) {
                  if (result.affectedRows == 0) {
                    return res.status(200).json({ message: "Aucunes modifications trouvées !" });
                  }
                  else {
                    return res.status(200).json({ message: "Les données de l'utilisateur ont bien été modifiées !" });
                  }
                }
                else {
                  return res.status(400).json({ error });
                }
              })
            })
          } else {
            db.query("UPDATE user SET nom = ?, prenom = ?, email = ?, user_imageUrl = ? WHERE id = ?", [user.nom, user.prenom, user.email, imageUrl, id], (error, result) => {
              if (!error) {
                if (result.affectedRows == 0) {
                  return res.status(200).json({ message: "Aucunes modifications trouvées !" });
                }
                else {
                  return res.status(200).json({ message: "Les données de l'utilisateur ont bien été modifiées !" });
                }
              }
              else {
                return res.status(400).json({ error });
              }
            })
          }
        } else {
          db.query("UPDATE user SET nom = ?, prenom = ?, email = ? WHERE id = ?", [user.nom, user.prenom, user.email, id], (error, result) => {
            if (!error) {
              if (result.affectedRows == 0) {
                return res.status(200).json({ message: "Aucunes modifications trouvées !" });
              }
              else {
                return res.status(200).json({ message: "Les données de l'utilisateur ont bien été modifiées !" });
              }
            }
            else {
              return res.status(400).json({ error });
            }
          })
        }
      }
    }
    else {
      return res.status(401).json({ message: "Aucun utilisateur trouvé !" });
    }
  })
}

exports.deleteProfil = (req, res) => {
  let id = req.auth;
  db.query("SELECT * FROM user WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));

      if (id !== resultat[0].id) {
        res.status(401).json({ message: 'Requête non autorisée !' });
        return;
      }
      else {
        if (resultat[0].user_imageUrl) {
          const filename = resultat[0].user_imageUrl.split('/images/')[1];
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
    }
    else {
      return res.status(401).json({ message: "Aucun utilisateur trouvé !" });
    }
  })
}

exports.deleteAnyoneProfil = (req, res) => {
  let id = req.auth;
  db.query("SELECT * FROM user WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (resultat[0].user_imageUrl) {
        const filename = resultat[0].user_imageUrl.split('/images/')[1];
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
      return res.status(401).json({ message: "Aucun utilisateur trouvé !" });
    }
  })
}

exports.changeRole = (req, res) => {
  let id = req.params.id;
  db.query("SELECT * FROM user WHERE user.id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (resultat[0].role_id === process.env.MODERATOR) {
        const role_id = process.env.USER;
        db.query("UPDATE user SET role_id = ? WHERE id = ?", [role_id, id], (error, result) => {
          if (!error) {
            return res.status(200).json({ message: "Passage de modérateur à utilisateur normal !" });
          }
          else {
            return res.status(400).json({ error });
          }
        })
      }
      else if (resultat[0].role_id === process.env.USER) {
        const role_id = process.env.MODERATOR;
        db.query("UPDATE user SET role_id = ? WHERE id = ?", [role_id, id], (error, result) => {
          if (!error) {
            return res.status(200).json({ message: "Passage d'utilisateur normal à modérateur !" });
          }
          else {
            return res.status(400).json({ error });
          }
        })
      }
    } else {
      return res.status(400).json({ error });
    }
  })
}