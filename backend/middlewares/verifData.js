const validator = require('validator');

// Verifier que le format de l'adresse email de l'utilisateur est valide
exports.verifEmail = (req, res, next) => {
  const email = req.body.email;
  if (validator.isEmail(email)) {
    next();
  }
  else {
    return res.status(400).json(
      { message: "Format email non valide ! Verifier celui-ci." }
    );
  }
};

// Verifier que le format du mot de passe est valide
// 6 caractères min
// 1 MAJ min
// 1 caractère spécial min
exports.verifPassword = (req, res, next) => {
  const passwordRegex = /^(?=.*?[A-ZÀÂÇÉÈÊËÎÏÔÙÛÜŸÆŒ])(?=.*?[a-zàâæçéèêëîïôœùûüÿ])(?=.*?[0-9])(?=.*?[#.+?!@$%,:;^&*_-]).{6,}$/;
  let textPassword = passwordRegex.test(req.body.password);
  if (textPassword) {
    next();
  }
  else {
    return res.status(400).json(
      { message: "Format mot de passe non valide ! Le mot de passe doit contenir au moins 1 majuscule, 1 chiffre, 1 caractère spécial et avoir une longueur minimale de 6 caractères." }
    );
  }
};

// Verifier le nom et le prenom de l'utilisateur et s'assurer qu'ils ne sont pas vides !
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