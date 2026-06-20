const { Schema, model } = require("mongoose");

const headerSchema = new Schema(
  {
    text: { type: String, default: "" },
    color: { type: String, default: "" },
    image: { type: String, default: "" },
    related_link: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = model("headers", headerSchema);
