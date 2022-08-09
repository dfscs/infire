const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: Array,
  },
  { timestamps: true }
);

const Conversaton = mongoose.model("conversationSchema", conversationSchema);
module.exports = Conversaton;