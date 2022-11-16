const express = require("express");
const conversationController = require("../controllers/conversations");
const {
    isAuth
} = require("../middleware/is-auth");

const router = express.Router();

router.get("/", isAuth, conversationController.getConversation);

router.get("/property/:propId", isAuth, conversationController.getConversationForProp);

router.get("/messages/", isAuth, conversationController.getMessages);

router.get("/chat-box/:userId", isAuth, conversationController.getChatBox);

router.post("/message", isAuth, conversationController.postMessage);

router.post("/reqCamVisit", isAuth, conversationController.postCamVisitRequest);

router.post("/shedual-cam-visit", isAuth, conversationController.postShedualCamVisit);

module.exports = router;