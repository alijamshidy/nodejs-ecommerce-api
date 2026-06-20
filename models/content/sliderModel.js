const { Schema, model } = require("mongoose");

const sliderImageSchema = new Schema(
  {
    image: { type: String, default: "" },
    text: { type: String, default: "" },
    color: { type: String, default: "" },
    related_link: { type: String, default: "" },
  },
  { _id: true },
);

const sliderSchema = new Schema(
  {
    text: { type: String, default: "" },
    color: { type: String, default: "" },
    position: { type: Number, default: 0 },
    images: [sliderImageSchema],
  },
  { timestamps: true },
);

module.exports = model("sliders", sliderSchema);
