// Gérer les requêtes HTTP avec envoie de fichier !
const multer = require('multer');

// Dictionnaire MIME_TYPES
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

//DiskStorage == Enregistrement sur le disque.
const storage = multer.diskStorage({
  // Destination stockage du fichier
  destination: (req, file, callback) => {
    //null signifie qu'il n'y a pas eu d'erreur !
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // Créer un nom de fichier unique
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
})

//Exportation du module
module.exports = multer({ storage }).single('image');