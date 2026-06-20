const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    instagram_channel: { type: String, default: "" },
    telegram_channel: { type: String, default: "" },
    contact_number: { type: String, default: "" },
    contact_number_2: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = model("contacts", contactSchema);
