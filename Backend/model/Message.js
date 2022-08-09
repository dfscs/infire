const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
      conversationId: String,
      senderId: String,
      text: String,
  },
  { timestamps: true }
);

const Message= mongoose.model("messageSchema", messageSchema);
module.exports = Message;