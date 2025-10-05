const db = require("../models");
const express = require("express");
const app = express();
exports.message = async (req, res) => {
  const { sender_id, sender_username, receiver_id, content, pic } = req.body;
  const newMessage = await db.Message.create({
    sender_id,
    receiver_id,
    content,
    sender_username,
    pic,
  });
  const data = newMessage.dataValues;
  if (newMessage) {
    res.status(200).send("message successfully posted");

    req.app.get("io").emit("message", data);

    // app.get.emit("test", "test");
  } else {
    res.status(500).send("something went wrong");
  }
};

exports.messages = async (req, res) => {
  const messages = await db.Message.findAll();
  // const io = req.app.get("io");
  // io.emit("messages", messages);
  if (messages) {
    res.status(200).json({ messages });
  }
};
