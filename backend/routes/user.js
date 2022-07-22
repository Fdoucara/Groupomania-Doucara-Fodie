const express =  require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const { verifEmailAndPassword, verifToken, isAdmin } = require('../middlewares/auth');
const multer = require('../middlewares/multer');

// AUTH ROUTES
router.post('/register', verifEmailAndPassword, userCtrl.register);
router.post('/login', userCtrl.logIn);
router.post('/change-role/:id', verifToken, isAdmin, userCtrl.changeRole);
router.get('/logout', verifToken, userCtrl.logOut);

// CRUD -> CREATE READ UPDATE DELETE <- CRUD -> USER
router.get('/', verifToken, userCtrl.getAllUser);
router.get('/:id', verifToken, userCtrl.getOneUser);
router.patch('/update-profil', verifToken, multer, userCtrl.updateProfil);
router.delete('/delete-profil', verifToken, userCtrl.deleteProfil);
router.delete('/delete-anyone-profil/:id', verifToken, isAdmin, userCtrl.deleteAnyoneProfil);

module.exports = router;