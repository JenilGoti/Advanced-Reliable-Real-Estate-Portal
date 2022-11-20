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

router.get("/visit-box/:messId", isAuth, conversationController.getCamVisitBox);

router.post("/message", isAuth, conversationController.postMessage);

router.post("/reqCamVisit", isAuth, conversationController.postCamVisitRequest);

router.post("/shedual-cam-visit", isAuth, conversationController.postShedualCamVisit);

router.post("/send-visit-notofication", isAuth, conversationController.sendVisitNotification);

module.exports = router;