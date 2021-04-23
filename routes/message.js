const controller = require('../controllers/message');
const { Router } = require('express');
const router = Router();

router.post('/send/:id', controller.sendMessage);
router.get('/get/:id', controller.getMessagesByChatroomId);

module.exports = router;