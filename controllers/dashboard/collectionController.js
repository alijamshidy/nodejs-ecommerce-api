const collectionModel = require("../../models/collectionModel");
const productModel = require("../../models/productModel");
const { responseReturn } = require("../../utils/response");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;

function parsePagination(query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const parPage = Math.max(1, Math.min(100, parseInt(query.parPage, 10) || 10));
  const skip = parPage * (page - 1);
  return { page, parPage, skip };
}

function mapCollection(doc) {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: String(obj._id) };
}

class collectionController {
  get_public_collections = async (_req, res) => {
    try {
      const collections = await collectionModel.find({}).sort({ createdAt: -1 });
      responseReturn(res, 200, { collections: collections.map(mapCollection) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_public_collection = async (req, res) => {
    try {
      const collection = await collectionModel
        .findOne({ slug: req.params.slug })
        .populate("products");
      if (!collection) {
        return responseReturn(res, 404, { error: "Collection not found" });
      }
      responseReturn(res, 200, {
        collection: mapCollection(collection),
        products: collection.products ?? [],
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_collections = async (req, res) => {
    const { skip, parPage } = parsePagination(req.query);
    const searchValue = req.query.searchValue?.trim();

    try {
      const filter = searchValue
        ? { name: { $regex: searchValue, $options: "i" } }
        : {};

      const collections = await collectionModel
        .find(filter)
        .skip(skip)
        .limit(parPage)
        .sort({ createdAt: -1 });
      const totalCollection = await collectionModel.countDocuments(filter);

      responseReturn(res, 200, {
        collections: collections.map(mapCollection),
        totalCollection,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_collection = async (req, res) => {
    try {
      const collection = await collectionModel
        .findOne({ slug: req.params.slug })
        .populate("products");
      if (!collection) {
        return responseReturn(res, 404, { error: "Collection not found" });
      }
      responseReturn(res, 200, {
        collection: mapCollection(collection),
        products: collection.products ?? [],
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  add_collection = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 400, { error: "Invalid form data" });

      try {
        const name = fields.name?.trim();
        if (!name) return responseReturn(res, 400, { error: "Name is required" });

        const slug = name.split(" ").join("-").toLowerCase();
        const products = fields.product
          ? (Array.isArray(fields.product) ? fields.product : [fields.product])
          : [];

        let image = "";
        if (files.image) {
          cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true,
          });
          const result = await cloudinary.uploader.upload(files.image.filepath, {
            folder: "collections",
          });
          image = result.url;
        }

        const collection = await collectionModel.create({
          name,
          slug,
          description: fields.description?.trim() ?? "",
          image,
          products,
        });

        responseReturn(res, 201, {
          collection: mapCollection(collection),
          message: "Collection Added Successfully",
        });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  update_collection = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 400, { error: "Invalid form data" });

      try {
        const collectionId = fields.collectionId?.trim();
        const slug = fields.slug?.trim();
        const query = collectionId ? { _id: collectionId } : slug ? { slug } : null;

        if (!query) {
          return responseReturn(res, 400, { error: "collectionId or slug is required" });
        }

        const existing = await collectionModel.findOne(query);
        if (!existing) {
          return responseReturn(res, 404, { error: "Collection not found" });
        }

        const update = {};
        if (fields.name?.trim()) {
          update.name = fields.name.trim();
          update.slug = fields.name.trim().split(" ").join("-").toLowerCase();
        }
        if (fields.description !== undefined) {
          update.description = fields.description?.trim() ?? "";
        }
        if (fields.product) {
          update.products = Array.isArray(fields.product)
            ? fields.product
            : [fields.product];
        }
        if (files.image) {
          cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true,
          });
          const result = await cloudinary.uploader.upload(files.image.filepath, {
            folder: "collections",
          });
          update.image = result.url;
        }

        const collection = await collectionModel.findByIdAndUpdate(
          existing._id,
          update,
          { new: true },
        ).populate("products");

        responseReturn(res, 200, {
          collection: mapCollection(collection),
          products: collection?.products ?? [],
          message: "Collection Updated Successfully",
        });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  delete_collection = async (req, res) => {
    try {
      const collection = await collectionModel.findByIdAndDelete(req.params.id);
      if (!collection) {
        return responseReturn(res, 404, { error: "Collection not found" });
      }
      responseReturn(res, 200, { message: "Collection Deleted Successfully" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new collectionController();
