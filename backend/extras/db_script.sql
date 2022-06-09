-- ! Creation table role ! --

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  id INT NOT NULL AUTO_INCREMENT,
  role VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;


-- ! Creation table utilisateur ! --

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  id int NOT NULL AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(250) NOT NULL,
  user_imageUrl VARCHAR(250) DEFAULT NULL,
  bio VARCHAR(450) DEFAULT NULL,
  password VARCHAR(150) NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (email),
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ! Creation table publication ! --

DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
  id int NOT NULL AUTO_INCREMENT,
  post_content TEXT DEFAULT NULL,
  post_imageUrl VARCHAR(100) DEFAULT NULL,
  post_date TIMESTAMP NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ! Creation table commentaire ! --

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  id INT NOT NULL AUTO_INCREMENT,
  comment_content TEXT NOT NULL,
  comment_imageUrl VARCHAR(250) DEFAULT NULL,
  comment_date TIMESTAMP NOT NULL,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ! CRÉATION DES TABLES RÉALISER AVEC SUCCÈS ! --


-- ! AJOUT DES VALUES DANS LA TABLE ROLE ! --

INSERT INTO role (`role`)
VALUES('admin'), ('user');

-- ! Vérifier si tout s'est passé comme prévue ! --

SELECT * FROM role;

-- ! Tout s'est bien réalisé ! --