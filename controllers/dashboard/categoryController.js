const { responseReturn } = require("../../utils/response");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");

class categoryController {
  add_category = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        responseReturn(res, 404, { error: "something went wrong" });
      } else {
        let { name } = fields;
        let { image } = files;
        name = name.trim();
        const slug = name.split(" ").join("-");

        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });

        try {
          const result = await cloudinary.uploader.upload(image.filepath, {
            folder: "categorys",
          });
          if (result) {
            const category = await categoryModel.create({
              name,
              slug,
              image: result.url,
            });
            responseReturn(res, 201, {
              category,
              message: "Category Added Successfully",
            });
          } else {
            responseReturn(res, 404, { error: "Image Upload File" });
          }
        } catch (error) {
          responseReturn(res, 500, { error: "Internal Server Error" });
        }
      }
    });
  };

  get_category = async (req, res) => {
    const { parPage, page, searchValue } = req.query;
    try {
      let skipPage = "";
      if (parPage && page) {
        skipPage = parseInt(parPage) * (parseInt(page) - 1);
      }
      if (searchValue && page && parPage) {
        const categorys = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel
          .find({
            $text: { $search: searchValue },
          })
          .countDocuments();
        responseReturn(res, 200, { categorys, totalCategory });
      } else if (searchValue === "" && parPage && page) {
        const categorys = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { categorys, totalCategory });
      } else {
        const categorys = await categoryModel.find({}).sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();
        responseReturn(res, 200, { categorys, totalCategory });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  update_category = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseReturn(res, 404, { error: "something went wrong" });
      }

      const categoryId = fields.categoryId?.trim();
      const slug = fields.slug?.trim();
      let name = fields.name?.trim();

      try {
        const query = categoryId
          ? { _id: categoryId }
          : slug
            ? { slug }
            : null;

        if (!query) {
          return responseReturn(res, 400, { error: "categoryId or slug is required" });
        }

        const existing = await categoryModel.findOne(query);
        if (!existing) {
          return responseReturn(res, 404, { error: "Category not found" });
        }

        const update = {};
        if (name) {
          update.name = name;
          update.slug = name.split(" ").join("-");
        }

        if (files.image) {
          cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true,
          });
          const result = await cloudinary.uploader.upload(files.image.filepath, {
            folder: "categorys",
          });
          if (result) {
            update.image = result.url;
          }
        }

        const category = await categoryModel.findByIdAndUpdate(
          existing._id,
          update,
          { new: true },
        );

        responseReturn(res, 200, {
          category,
          message: "Category Updated Successfully",
        });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  delete_category = async (req, res) => {
    const { categoryId } = req.params;

    try {
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        return responseReturn(res, 404, { error: "Category not found" });
      }

      const productCount = await productModel.countDocuments({
        category: category.name,
      });

      if (productCount > 0) {
        return responseReturn(res, 400, {
          error: "Cannot delete category with existing products",
        });
      }

      await categoryModel.findByIdAndDelete(categoryId);
      responseReturn(res, 200, { message: "Category Deleted Successfully" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new categoryController();
