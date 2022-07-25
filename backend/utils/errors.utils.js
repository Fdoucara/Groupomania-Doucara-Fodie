// Gestion des erreurs lors de la création d'un utilisateur
exports.signUpErrors = (err) => {
  let errors = {
    email: ''
  }

  if(err.errno === 1062 && err.sqlMessage.includes('email'))
    errors.email = "Cet email est déjà utilisé !";

  return errors
}