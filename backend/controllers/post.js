const db = require('../config/db');
const fs = require('fs');
const exp = require('constants');


// POST FUNCTIONS 
exports.createPost = (req, res) => {
  let user_id = req.auth;
  if (req.file) {
    const post = JSON.parse(JSON.stringify(req.body));
    const post_content = post.post_content;
    const post_imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    db.query("INSERT INTO post (post_content, post_imageUrl, user_id) VALUES (?, ?, ?)", [post_content, post_imageUrl, user_id], (error, result) => {
      if (!error) {
        return res.status(201).json({ message: "Post bien ajouté !" });
      }
      res.status(400).json({ error });
    })
  }
  else {
    const post_content = req.body.post_content;
    db.query("INSERT INTO post (post_content, user_id) VALUES (?, ?)", [post_content, user_id], (error, result) => {
      if (!error) {
        return res.status(201).json({ message: "Post bien ajouté !" });
      }
      res.status(400).json({ error });
    })
  }
}

exports.getAllPost = (req, res) => {
  db.query("SELECT post.id, post.post_content, post.post_imageUrl, post.post_likes, post.post_date, comment.comment_content, comment.comment_imageUrl, comment.comment_likes, comment.comment_date FROM post LEFT JOIN comment ON post.id = comment.post_id ORDER BY post.post_date DESC", [], (error, result) => {
    if (!error) {
      return res.status(200).json({ result });
    }
    res.status(400).json({ error });
  })
}

exports.getOnePost = (req, res) => {
  const id = req.params.id;
  db.query("SELECT post.id, post.post_content, post.post_imageUrl, post.post_likes, post.post_date, comment.comment_content, comment.comment_imageUrl, comment.comment_likes, comment.comment_date FROM post LEFT JOIN comment ON post.id = comment.post_id WHERE post.id = ?", [id], (error, result) => {
    if (!error) {
      if (result.length == 0) {
        return res.status(401).json({ message: "Post non trouvé !" });
      } else {
        return res.status(200).json(result);
      }
    } else {
      res.status(400).json({ error });
    }
  })
}

exports.updateOnePost = (req, res) => {
  const id = req.params.id;
  let post = req.body;

  db.query("SELECT * FROM post WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));

      if (req.auth !== resultat[0].user_id) {
        res.status(401).json({ message: 'Requête non autorisée !' });
        return;
      }
      else {
        if (req.file) {
          if (resultat[0].post_imageUrl) {
            const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            const filename = resultat[0].post_imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
              db.query("UPDATE post SET post_content = ?, post_imageUrl = ? WHERE id = ?", [post.post_content, imageUrl, id], (error, result) => {
                if (!error) {
                  if (result.affectedRows == 0) {
                    return res.status(401).json({ message: "Post non trouvé !" });
                  }
                  return res.status(201).json({ message: "Post bien modifié !" });
                } else {
                  res.status(400).json({ error });
                  return;
                }
              })
            })
          } else {
            db.query("UPDATE post SET post_content = ?, post_imageUrl = ? WHERE id = ?", [post.post_content, imageUrl, id], (error, result) => {
              if (!error) {
                if (result.affectedRows == 0) {
                  return res.status(401).json({ message: "Post non trouvé !" });
                }
                return res.status(201).json({ message: "Post bien modifié !" });
              } else {
                res.status(400).json({ error });
                return;
              }
            })
          }
        } else {
          db.query("UPDATE post SET post.content = ? WHERE id = ?", [post.post_content, id], (error, result) => {
            if (!error) {
              if (result.affectedRows == 0) {
                return res.status(401).json({ message: "Post non trouvé !" });
              }
              return res.status(201).json({ message: "Post bien modifié !" });
            } else {
              res.status(400).json({ error });
              return;
            }
          })
        }
      }
    }
    else {
      return res.status(401).json({ message: "Aucun Post trouvé !" });
    }
  })
}

exports.deleteOnePost = (req, res) => {
  let id = req.params.id;
  db.query("SELECT * FROM post WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (resultat.length == 0) {
        res.status(401).json({ message: 'Aucun post trouvé !' });
      }
      else if (req.auth !== resultat[0].user_id) {
        res.status(401).json({ message: 'Requête non autorisée !' });
        return;
      }
      else {
        if (resultat[0].post_imageUrl) {
          const filename = resultat[0].post_imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            db.query("DELETE FROM post WHERE id = ?", [id], (error, result) => {
              if (!error) {
                return res.status(200).json({ message: "Post bien supprimé !" });
              }
              else {
                return res.status(400).json({ error });
              }
            })
          })
        } else {
          db.query("DELETE FROM post WHERE id = ?", [id], (error, result) => {
            if (!error) {
              return res.status(200).json({ message: "Post bien supprimé !" });
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

exports.deleteAnyonePost = (req, res) => {
  let id = req.params.id;
  db.query("SELECT * FROM post WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (resultat[0].post_imageUrl) {
        const filename = resultat[0].post_imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          db.query("DELETE FROM post WHERE id = ?", [id], (error, result) => {
            if (!error) {
              return res.status(200).json({ message: "Post bien supprimé !" });
            }
            else {
              return res.status(400).json({ error });
            }
          })
        })
      } else {
        db.query("DELETE FROM post WHERE id = ?", [id], (error, result) => {
          if (!error) {
            return res.status(200).json({ message: "Post bien supprimé !" });
          }
          else {
            return res.status(400).json({ error });
          }
        })
      }
    }
    else {
      return res.status(401).json({ message: "Aucun Post trouvé !" });
    }
  })
}

exports.likePost = (req, res) => {
  let id = req.params.id;

  db.query("SELECT * FROM post WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if(resultat[0].length == 0){
        res.status(400).json({ message: "Aucun post trouvé !"});
      }
      console.log(resultat[0].post_likes);
      if(req.body.like == 1){
        resultat[0].post_likes += 1; 
        console.log(resultat[0].post_likes);
        db.query("UPDATE post SET post_likes = ? WHERE id = ?", [resultat[0].post_likes, id], (error, result) => {
          if(!error) {
            return res.status(201).json({ message: "Vous aimez ce post !" });
          }
          else {
            return res.status(400).json({ error });
          } 
        })
      }
    } else {
      res.status(400).json({ error });
    }
  })
}

exports.unlikePost = (req, res) => {
  let id = req.params.id;

  db.query("SELECT * FROM post WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      console.log(resultat[0].post_likes);
      if(req.body.like == 0){
        resultat[0].post_likes -= 1; 
        console.log(resultat[0].post_likes);
        db.query("UPDATE post SET post_likes = ? WHERE id = ?", [resultat[0].post_likes, id], (error, result) => {
          if(!error){
            return res.status(201).json({ message: "Vous n'aimez plus ce post !" });
          }
          else {
            return res.status(400).json({ error });
          } 
        })
      }
    } else {
      res.status(400).json({ error });
    }
  })
}


// COMMENT FUNCTIONS 
exports.createComment = (req, res) => {
  let user_id = req.auth;
  let post_id = req.params.id;
  if (req.file) {
    const comment = JSON.parse(JSON.stringify(req.body));
    const comment_content = comment.comment_content;
    const comment_imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    db.query("INSERT INTO comment (comment_content, comment_imageUrl, post_id, user_id) VALUES (?, ?, ?, ?)", [comment_content, comment_imageUrl, post_id, user_id], (error, result) => {
      if (!error) {
        return res.status(201).json({ message: "Commentaire bien ajouté !" });
      } else {
        res.status(400).json({ message: "Post non existant !" });
      }
    })
  }
  else {
    const comment_content = req.body.comment_content;
    db.query("INSERT INTO comment (comment_content, post_id, user_id) VALUES (?, ?, ?)", [comment_content, post_id, user_id], (error, result) => {
      if (!error) {
        return res.status(201).json({ message: "Commentaire bien ajouté !" });
      } else {
        res.status(400).json({ message: "Post non existant !" });
      }
    })
  }
}

exports.updateComment = (req, res) => {
  let id = req.params.id;
  let comment = req.body;

  db.query("SELECT * FROM comment WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (req.auth !== resultat[0].user_id) {
        res.status(401).json({ message: 'Requête non autorisée !' });
        return;
      }
      else {
        if (req.file) {
          if (resultat[0].comment_imageUrl) {
            const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            const filename = resultat[0].comment_imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
              db.query("UPDATE comment SET comment_content = ?, comment_imageUrl = ? WHERE id = ?", [comment.comment_content, imageUrl, id], (error, result) => {
                if (!error) {
                  if (result.affectedRows == 0) {
                    return res.status(401).json({ message: "Commentaire non trouvé !" });
                  }
                  return res.status(201).json({ message: "Commentaire bien modifié !" });
                } else {
                  res.status(400).json({ error });
                  return;
                }
              })
            })
          } else {
            db.query("UPDATE comment SET comment_content = ?, comment_imageUrl = ? WHERE id = ?", [comment.comment_content, imageUrl, id], (error, result) => {
              if (!error) {
                if (result.affectedRows == 0) {
                  return res.status(401).json({ message: "Post non trouvé !" });
                }
                return res.status(201).json({ message: "Post bien modifié !" });
              } else {
                res.status(400).json({ error });
                return;
              }
            })
          }
        } else {
          db.query("UPDATE comment SET comment_content = ? WHERE id = ?", [comment.comment_content, id], (error, result) => {
            if (!error) {
              if (result.affectedRows == 0) {
                return res.status(401).json({ message: "Commentaire non trouvé !" });
              }
              return res.status(201).json({ message: "Commentaire bien modifié !" });
            } else {
              res.status(400).json({ error });
              return;
            }
          })
        }
      }
    }
    else {
      return res.status(401).json({ message: "Aucun Commentaire trouvé !" });
    }
  })
}

exports.deleteComment = (req, res) => {
  let id = req.params.id;
  db.query("SELECT * FROM comment WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      console.log(resultat[0].user_id);

      if (req.auth !== resultat[0].user_id) {
        res.status(401).json({ message: 'Requête non autorisée !' });
        return;
      }
      else {
        if (resultat[0].comment_imageUrl) {
          const filename = resultat[0].comment_imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            db.query("DELETE FROM comment WHERE id = ?", [id], (error, result) => {
              if (!error) {
                return res.status(200).json({ message: "Commentaire bien supprimé !" });
              }
              else {
                return res.status(400).json({ error });
              }
            })
          })
        } else {
          db.query("DELETE FROM comment WHERE id = ?", [id], (error, result) => {
            if (!error) {
              return res.status(200).json({ message: "Commentaire bien supprimé !" });
            }
            else {
              return res.status(400).json({ error });
            }
          })
        }
      }
    }
    else {
      return res.status(401).json({ message: "Aucun Commentaire trouvé !" });
    }
  })
}

exports.deleteAnyoneComment = (req, res) => {
  let id = req.params.id;

  db.query("SELECT * FROM comment WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (resultat[0].comment_imageUrl) {
        const filename = resultat[0].comment_imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          db.query("DELETE FROM comment WHERE id = ?", [id], (error, result) => {
            if (!error) {
              return res.status(200).json({ message: "Commentaire bien supprimé !" });
            }
            else {
              return res.status(400).json({ error });
            }
          })
        })
      } else {
        db.query("DELETE FROM comment WHERE id = ?", [id], (error, result) => {
          if (!error) {
            return res.status(200).json({ message: "Commentaire bien supprimé !" });
          }
          else {
            return res.status(400).json({ error });
          }
        })
      }
    }
    else {
      return res.status(401).json({ message: "Aucun Commentaire trouvé !" });
    }
  })
}

exports.likeComment = (req, res) => {
  let id = req.params.id;

  db.query("SELECT * FROM comment WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      console.log(resultat[0].comment_likes);
      if(req.body.like == 1){
        resultat[0].comment_likes += 1; 
        console.log(resultat[0].comment_likes);
        db.query("UPDATE post SET post_likes = ? WHERE id = ?", [resultat[0].comment_likes, id], (error, result) => {
          if(!error){
            
          }
          else {

          } 
        })
      }
    } else {
      res.status(400).json({ error });
    }
  })
}

exports.unlikeComment = (req, res) => {
  let id = req.params.id;

  db.query("SELECT * FROM comment WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      console.log(resultat[0].comment_likes);
      if(req.body.like == 1){
        resultat[0].comment_likes += 1; 
        console.log(resultat[0].comment_likes);
        db.query("UPDATE post SET post_likes = ? WHERE id = ?", [resultat[0].comment_likes, id], (error, result) => {
          if(!error){
            
          }
          else {

          } 
        })
      }
    } else {
      res.status(400).json({ error });
    }
  })
}