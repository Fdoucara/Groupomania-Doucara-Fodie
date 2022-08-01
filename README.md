# Groupomania-Doucara-Fodie

Afin d'avoir accès à ce projet il y a certaines étapes que je vais décrire ci-dessous à suivre :

1 - Il est important d'installer MySql sur votre machine.
2 - Tout d'abord cloner le projet sur votre machine.

Niveau Backend :

	- Réaliser un npm install afin d'installer toutes les dépendances du projet.

	- Dans le fichier db.js connecter votre Base de donnée.

	- Assurer vous de créer un fichier .env à la racine dans lequelle vous vous assurerez de bien ajouter les éléments suivants :
		- Numéro de Port
		- Nom de la Base de donnée
		- Clé secrète
		- admin@gmail.com Mail de l'admin (par défaut)
		- Nom de l'admin de la Base de donnée
		- Mot de passe de la Base de donnée
		- Client de l'url

	- Assurer vous de créer un dossier images à la racine. Les images upload seront stockées a l'intérieur.

	- Créer un fichier .gitignore dans lequel vous allez y placer les fichiers/dossiers suivants :
		- /.env
		- /node_modules
		- /images

	- Lancer l'API a l'aide de nodemon server.js

Niveau Frontend :

	- Réaliser un npm install afin d'installer toutes les dépendances du projet.

	- Lancer l'application a l'aide de npm run serve.
