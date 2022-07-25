const db = require('../config/db');
const fs = require('fs');
const exp = require('constants');


// ------------- POST FUNCTIONS -------------

// Création d'un post
exports.createPost = (req, res) => {
  let user_id = req.auth;
  if (req.file) {
    const post = JSON.parse(JSON.stringify(req.body));
    const post_content = post.post_content;
    const post_imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    db.query("INSERT INTO post (post_content, post_imageUrl, user_id) VALUES (?, ?, ?)", [post_content, post_imageUrl, user_id], (error, result) => {
      if (!error) {
        return res.status(201).json({ message: "La publication vient d'être ajoutée !" });
      }
      res.status(400).json({ error });
    })
  }
  else {
    const post_content = req.body.post_content;
    db.query("INSERT INTO post (post_content, user_id) VALUES (?, ?)", [post_content, user_id], (error, result) => {
      if (!error) {
        return res.status(201).json({ message: "La publication vient d'être ajoutée !" });
      }
      res.status(400).json({ error });
    })
  }
}

// Récupération de tout les posts
exports.getAllPost = (req, res) => {
  db.query("SELECT user.nom, user.prenom, post.id, post.post_content, post.post_imageUrl, post.post_likes, post.post_date, post.user_id, COUNT(CASE WHEN comment_content IS NOT NULL AND comment_imageUrl IS NULL THEN 1 END) as totalComment1, COUNT(CASE WHEN comment_content IS NULL AND comment_imageUrl IS NOT NULL THEN 1 END) as totalComment2, COUNT(CASE WHEN comment_content IS NOT NULL AND comment_imageUrl IS NOT NULL THEN 1 END) as totalComment3 FROM post LEFT JOIN user ON post.user_id = user.id LEFT JOIN comment ON post.id = comment.post_id GROUP BY post.id", [], (error, result) => {
    if (!error) {
      if (result.length == 0) {
        return res.status(404).json({ message: "Aucune publication trouvée !" });
      } else {
        return res.status(200).json({ result });
      }
    } else {
      return res.status(400).json({ error });
    }
  })
}

// Récupération d'un seul post
exports.getOnePost = (req, res) => {
  const id = req.params.id;
  db.query("SELECT user.nom, user.prenom, post.id, post.post_content, post.post_imageUrl, post.post_likes, post.post_date, post.user_id, COUNT(CASE WHEN comment_content IS NOT NULL AND comment_imageUrl IS NULL THEN 1 END) as totalComment1, COUNT(CASE WHEN comment_content IS NULL AND comment_imageUrl IS NOT NULL THEN 1 END) as totalComment2, COUNT(CASE WHEN comment_content IS NOT NULL AND comment_imageUrl IS NOT NULL THEN 1 END) as totalComment3 FROM post LEFT JOIN user ON post.user_id = user.id LEFT JOIN comment ON post.id = comment.post_id WHERE post.id = ? GROUP BY post.id", [id], (error, result) => {
    if (!error) {
      if (result.length == 0) {
        return res.status(404).json({ message: "Aucune publication trouvée !" });
      } else {
        return res.status(200).json({ result });
      }
    } else {
      return res.status(400).json({ error });
    }
  })
}

// Modification d'un post
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
          const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          if (resultat[0].post_imageUrl) {
            const filename = resultat[0].post_imageUrl.split('/images/')[1];
            if (!post.post_content) {
              fs.unlink(`images/${filename}`, () => {
                db.query("UPDATE post SET post_imageUrl = ? WHERE id = ?", [imageUrl, id], (error, result) => {
                  if (!error) {
                    return res.status(201).json({ message: "Publication bien modifiée !" });
                  } else {
                    return res.status(400).json({ error });
                  }
                })
              })
            }
            else {
              fs.unlink(`images/${filename}`, () => {
                db.query("UPDATE post SET post_content = ?, post_imageUrl = ? WHERE id = ?", [post.post_content, imageUrl, id], (error, result) => {
                  if (!error) {
                    return res.status(201).json({ message: "Publication bien modifiée !" });
                  } else {
                    return res.status(400).json({ error });
                  }
                })
              })
            }
          }
          else if (!resultat[0].post_imageUrl && !post.post_content) {
            db.query("UPDATE post SET post_imageUrl = ? WHERE id = ?", [imageUrl, id], (error, result) => {
              if (!error) {
                return res.status(201).json({ message: "Publication bien modifiée !" });
              } else {
                return res.status(400).json({ error });
              }
            })
          }
          else {
            db.query("UPDATE post SET post_content = ?, post_imageUrl = ? WHERE id = ?", [post.post_content, imageUrl, id], (error, result) => {
              if (!error) {
                return res.status(201).json({ message: "Publication bien modifiée !" });
              } else {
                res.status(400).json({ error });
                return;
              }
            })
          }
        } else {
          db.query("UPDATE post SET post_content = ? WHERE id = ?", [post.post_content, id], (error, result) => {
            if (!error) {
              return res.status(201).json({ message: "Publication bien modifiée !" });
            } else {
              res.status(400).json({ error });
              return;
            }
          })
        }
      }
    }
    else {
      return res.status(404).json({ message: "Aucune publication trouvée !" });
    }
  })
}

// Suppression d'un post
exports.deleteOnePost = (req, res) => {
  let id = req.params.id;
  db.query("SELECT * FROM post WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (req.auth !== resultat[0].user_id) {
        return res.status(401).json({ message: 'Requête non autorisée !' });
      }
      else {
        if (resultat[0].post_imageUrl) {
          const filename = resultat[0].post_imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            db.query("DELETE FROM post WHERE id = ?", [id], (error, result) => {
              if (!error) {
                return res.status(200).json({ message: "Publication bien supprimée !" });
              }
              else {
                return res.status(400).json({ error });
              }
            })
          })
        } else {
          db.query("DELETE FROM post WHERE id = ?", [id], (error, result) => {
            if (!error) {
              return res.status(200).json({ message: "Publication bien supprimée !" });
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

// Suppresion d'un post par l'Admin et le Modérateur
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
              return res.status(200).json({ message: "Publication bien supprimée !" });
            }
            else {
              return res.status(400).json({ error });
            }
          })
        })
      } else {
        db.query("DELETE FROM post WHERE id = ?", [id], (error, result) => {
          if (!error) {
            return res.status(200).json({ message: "Publication bien supprimée !" });
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

// Like ou Dislike post
exports.likePost = (req, res) => {
  let post_id = req.params.id;
  let user_id = req.auth;

  db.query("SELECT * FROM post WHERE id = ?", [post_id], (error, result) => {
    if (!error) {
      db.query("SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?", [user_id, post_id], (error, result) => {
        if (!error) {
          if (result.length == 0) {
            db.query("INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)", [user_id, post_id], (error, result) => {
              if (!error) {
                db.query("SELECT COUNT(*) AS likes FROM post_likes WHERE post_id = ?", [post_id], (error, result) => {
                  if (!error) {
                    let resultat = JSON.parse(JSON.stringify(result));
                    let totalLike = resultat[0].likes;
                    db.query("UPDATE post SET post_likes = ? WHERE id = ?", [totalLike, post_id], (error, result) => {
                      if (!error) {
                        return res.status(200).json({ message: "Vous aimez cette publication." });
                      }
                      else {
                        return res.status(400).json({ error });
                      }
                    })
                  }
                  else {
                    return res.status(400).json({ error });
                  }
                })
              }
              else {
                return res.status(400).json({ error });
              }
            })
          } else {
            db.query("DELETE FROM post_likes WHERE user_id = ? AND post_id = ?", [user_id, post_id], (error, result) => {
              if (!error) {
                db.query("SELECT COUNT(*) AS likes FROM post_likes WHERE post_id = ?", [post_id], (error, result) => {
                  if (!error) {
                    let resultat = JSON.parse(JSON.stringify(result));
                    let totalLike = resultat[0].likes;
                    db.query("UPDATE post SET post_likes = ? WHERE id = ?", [totalLike, post_id], (error, result) => {
                      if (!error) {
                        return res.status(200).json({ message: "Vous n'aimez plus cette publication." });
                      }
                      else {
                        return res.status(400).json({ error });
                      }
                    })
                  }
                  else {
                    return res.status(400).json({ error });
                  }
                })
              }
              else {
                return res.status(400).json({ error });
              }
            })
          }
        }
      })
    }
    else {
      return res.status(400).json({ error });
    }
  })
}

// ------------- COMMENT FUNCTIONS -------------

// Création d'un commentaire
exports.createComment = (req, res) => {
  let user_id = req.auth;
  let post_id = req.params.id;
  if (req.file) {
    const comment = JSON.parse(JSON.stringify(req.body));
    const comment_content = comment.comment_content;
    const comment_imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    if (comment_content == '') {
      db.query("INSERT INTO comment (comment_imageUrl, post_id, user_id) VALUES (?, ?, ?)", [comment_imageUrl, post_id, user_id], (error, result) => {
        if (!error) {
          return res.status(201).json({ message: "Commentaire bien ajouté !" });
        } else {
          res.status(400).json({ error });
        }
      })
    } else {
      db.query("INSERT INTO comment (comment_content, comment_imageUrl, post_id, user_id) VALUES (?, ?, ?, ?)", [comment_content, comment_imageUrl, post_id, user_id], (error, result) => {
        if (!error) {
          return res.status(201).json({ message: "Commentaire bien ajouté !" });
        } else {
          res.status(400).json({ error });
        }
      })
    }
  }
  else {
    const comment_content = req.body.comment_content;
    if (comment_content != '') {
      db.query("INSERT INTO comment (comment_content, post_id, user_id) VALUES (?, ?, ?)", [comment_content, post_id, user_id], (error, result) => {
        if (!error) {
          return res.status(201).json({ message: "Commentaire bien ajouté !" });
        } else {
          res.status(400).json({ error });
        }
      })
    } else {
      res.status(400).json({ message: "Vous ne pouvez pas réaliser un commentaire vide !" });
    }
  }
}

// Modification d'un commentaire
exports.updateComment = (req, res) => {
  let id = req.params.id;
  let comment = req.body;
  db.query("SELECT * FROM comment WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (req.auth !== resultat[0].user_id) {
        return res.status(401).json({ message: 'Requête non autorisée !' });
      }
      else {
        if (req.file) {
          const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          if (resultat[0].comment_imageUrl) {
            const filename = resultat[0].comment_imageUrl.split('/images/')[1];
            if (!comment.comment_content) {
              fs.unlink(`images/${filename}`, () => {
                db.query("UPDATE comment SET comment_imageUrl = ? WHERE id = ?", [imageUrl, id], (error, result) => {
                  if (!error) {
                    return res.status(201).json({ message: "Commentaire bien modifié !" });
                  } else {
                    return res.status(400).json({ error });
                  }
                })
              })
            }
            else {
              fs.unlink(`images/${filename}`, () => {
                db.query("UPDATE comment SET comment_content = ?, comment_imageUrl = ? WHERE id = ?", [comment.comment_content, imageUrl, id], (error, result) => {
                  if (!error) {
                    return res.status(201).json({ message: "Commentaire bien modifié !" });
                  } else {
                    return res.status(400).json({ error });
                  }
                })
              })
            }
          }
          else if (!resultat[0].comment_imageUrl && !comment.comment_content) {
            db.query("UPDATE comment SET comment_imageUrl = ? WHERE id = ?", [imageUrl, id], (error, result) => {
              if (!error) {
                return res.status(201).json({ message: "Commentaire bien modifié !" });
              } else {
                return res.status(400).json({ error });

              }
            })
          }
          else {
            db.query("UPDATE comment SET comment_content = ?, comment_imageUrl = ? WHERE id = ?", [comment.comment_content, imageUrl, id], (error, result) => {
              if (!error) {
                return res.status(201).json({ message: "Commentaire bien modifié !" });
              } else {
                return res.status(400).json({ error });
              }
            })
          }
        } else {
          db.query("UPDATE comment SET comment_content = ? WHERE id = ?", [comment.comment_content, id], (error, result) => {
            if (!error) {
              return res.status(201).json({ message: "Commentaire bien modifié !" });
            } else {
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

// Suppression d'un commentaire
exports.deleteComment = (req, res) => {
  let id = req.params.id;
  db.query("SELECT * FROM comment WHERE id = ?", [id], (error, result) => {
    if (!error) {
      let resultat = JSON.parse(JSON.stringify(result));
      if (req.auth !== resultat[0].user_id) {
        return res.status(401).json({ message: 'Requête non autorisée !' });
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
      return res.status(400).json({ error });
    }
  })
}

// Suppresion d'un commentaire par l'Admin et le Modérateur
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
      return res.status(400).json({ error });
    }
  })
}

// Like ou Dislike d'un commentaire
exports.likeComment = (req, res) => {
  let comment_id = req.params.id;
  let user_id = req.auth;
  db.query("SELECT * FROM comment WHERE id = ?", [comment_id], (error, result) => {
    if (!error) {
      db.query("SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?", [user_id, comment_id], (error, result) => {
        if (!error) {
          if (result.length == 0) {
            db.query("INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)", [user_id, comment_id], (error, result) => {
              if (!error) {
                db.query("SELECT COUNT(*) AS likes FROM comment_likes WHERE comment_id = ?", [comment_id], (error, result) => {
                  if (!error) {
                    let resultat = JSON.parse(JSON.stringify(result));
                    let totalLike = resultat[0].likes;
                    db.query("UPDATE comment SET comment_likes = ? WHERE id = ?", [totalLike, comment_id], (error, result) => {
                      if (!error) {
                        return res.status(200).json({ message: "Vous aimez ce commentaire." });
                      }
                      else {
                        return res.status(400).json({ error });
                      }
                    })
                  }
                  else {
                    return res.status(400).json({ error });
                  }
                })
              }
              else {
                return res.status(400).json({ error });
              }
            })
          } else {
            db.query("DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?", [user_id, comment_id], (error, result) => {
              if (!error) {
                db.query("SELECT COUNT(*) AS likes FROM comment_likes WHERE comment_id = ?", [comment_id], (error, result) => {
                  if (!error) {
                    let resultat = JSON.parse(JSON.stringify(result));
                    let totalLike = resultat[0].likes;
                    db.query("UPDATE comment SET comment_likes = ? WHERE id = ?", [totalLike, comment_id], (error, result) => {
                      if (!error) {
                        return res.status(200).json({ message: "Vous n'aimez plus ce commentaire." });
                      }
                      else {
                        return res.status(400).json({ error });
                      }
                    })
                  }
                  else {
                    return res.status(400).json({ error });
                  }
                })
              }
              else {
                return res.status(400).json({ error });
              }
            })
          }
        }
      })
    }
    else {
      return res.status(400).json({ error });
    }
  })
}

// Récupération d'un seul commentaire
exports.getOneComment = (req, res) => {
  let comment_id = req.params.id;
  db.query("SELECT user.nom, user.prenom, comment.id, comment.comment_content, comment.comment_imageUrl, comment.comment_date, comment.comment_likes, comment.user_id FROM comment LEFT JOIN user ON comment.user_id = user.id WHERE comment.id = ?", [comment_id], (error, result) => {
    if (!error) {
      return res.status(200).json({ result });
    }
    else {
      return res.status(400).json({ error });
    }
  })
}

// Récupération de tout les commentaires d'un post
exports.getAllCommentFromOnePost = (req, res) => {
  let post_id = req.params.id;
  db.query("SELECT user.nom, user.prenom, comment.id, comment.comment_content, comment.comment_imageUrl, comment.comment_date, comment.comment_likes, comment.user_id FROM comment LEFT JOIN user ON comment.user_id = user.id WHERE comment.post_id = ?", [post_id], (error, result) => {
    if (!error) {
      return res.status(200).json({ result });
    }
    else {
      return res.status(400).json({ error });
    }
  })
}