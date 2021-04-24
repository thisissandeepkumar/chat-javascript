const userControllers = require('../controllers/user');
const { Router } = require('express');
const router = Router();
const auth = require('../middlewares/auth');

router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);
router.get('/verify', auth, userControllers.getUserByToken);

module.exports = router;