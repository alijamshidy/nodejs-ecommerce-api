const { Schema, model } = require("mongoose");

const collectionSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    products: [{ type: Schema.ObjectId, ref: "products" }],
  },
  { timestamps: true },
);

module.exports = model("collections", collectionSchema);
