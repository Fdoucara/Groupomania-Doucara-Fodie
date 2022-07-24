const validator = require('validator');

exports.verifEmailAndPassword = (req, res, next) => {
  const email = req.body.email;
  const passwordRegex = /^(?=.*?[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ])(?=.*?[a-zàâæçéèêëîïôœùûüÿ])(?=.*?[0-9])(?=.*?[#.+?!@$%,:;^&*_-]).{6,}$/;
  let textPassword = passwordRegex.test(req.body.password);
  if (validator.isEmail(email) && textPassword) {
    next();
  }
  else {
    if(!validator.isEmail(email) && !textPassword) {
      return res.status(400).json(
        { message: "Format email et mot de passe non valide ! Le mot de passe doit contenir au moins 1 majuscule, 1 chiffre, 1 caractère spécial et avoir une longueur minimale de 6 caractères." }
      );
    }
    else if(!textPassword) {
      return res.status(400).json(
        { message: "Mot de passe non valide ! Le mot de passe doit contenir au moins 1 majuscule, 1 chiffre, 1 caractère spécial et avoir une longueur minimale de 6 caractères." }
      );
    }
    else if(!validator.isEmail(email)) {
      return res.status(400).json(
        { message: "Format email non valide !" }
      );
    }
  }
};

exports.verifNomPrenom = (req, res, next) => {
  nom = req.body.nom;
  prenom = req.body.prenom;
  if(nom == '' && prenom == '') {
    return res.status(400).json(
      { message: "Le nom et le prenom de l'utilisateur ne peuvent pas être vide." }
    );
  }
  else if(nom != '' && prenom == '') {
    return res.status(400).json(
      { message: "Le prenom de l'utilisateur ne peut pas être vide." }
    );
  }
  else if(nom == '' && prenom != '') {
    return res.status(400).json(
      { message: "Le nom de l'utilisateur ne peut pas être vide." }
    );
  }
  else {
    next();
  }
}