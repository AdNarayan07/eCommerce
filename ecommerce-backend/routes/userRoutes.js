const express = require('express');
const { me, editDetails, changePassword, deleteAccount, getAllUsers, editUserRole, deleteUser } = require('../controllers/userController');
const authentication = require('../middleware/authentication');
const verifyUser = require('../middleware/verifyUser');
const authorisation = require('../middleware/authorisation');
const router = express.Router();

router.get('/me', authentication, me);
router.delete('/me', authentication, verifyUser, deleteAccount);
router.patch('/me/details', authentication, verifyUser, editDetails);
router.patch('/me/password', authentication, verifyUser, changePassword);

router.get('/', authentication, authorisation(['admin']), getAllUsers);
router.patch('/:username/role', authentication, authorisation(['admin']), editUserRole);
router.delete('/:username', authentication, authorisation(['admin']), deleteUser);

module.exports = router;