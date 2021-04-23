const controller = require('../controllers/chatroom');
const { Router } = require('express');
const router = Router();

router.post('/room', controller.createChatroom);
router.get('/room', controller.getChatrooms);
router.delete('/room/:id', controller.deleteChatroom);

module.exports = router;