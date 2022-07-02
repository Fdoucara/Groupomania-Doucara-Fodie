const express =  require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const { verifEmailAndPassword, verifToken, isAdmin } = require('../middlewares/auth');
const multer = require('../middlewares/multer');

// AUTH ROUTES
router.post('/register', verifEmailAndPassword, userCtrl.register);
router.post('/login', userCtrl.logIn);
router.post('/change/:id', verifToken, isAdmin, userCtrl.changeRole);
router.get('/logout', verifToken, userCtrl.logOut);

// CRUD -> CREATE READ UPDATE DELETE <- CRUD -> USER
router.get('/', verifToken, userCtrl.getAllUser);
router.get('/:id', verifToken, userCtrl.getOneUser);
router.get('/profile', verifToken, userCtrl.getProfile);
router.patch('/update-profile', verifToken, multer, userCtrl.updateProfile);
router.delete('/delete-profile', verifToken, userCtrl.deleteProfile);
router.delete('/delete-anyone-profile', verifToken, isAdmin, userCtrl.deleteAnyoneProfile);

module.exports = router;