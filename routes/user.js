const userControllers = require('../controllers/user');
const { Router } = require('express');
const router = Router();

router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);

module.exports = router;