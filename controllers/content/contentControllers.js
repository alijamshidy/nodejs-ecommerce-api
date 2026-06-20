const faqModel = require("../../models/content/faqModel");
const headerModel = require("../../models/content/headerModel");
const sliderModel = require("../../models/content/sliderModel");
const contactModel = require("../../models/content/contactModel");
const recommendationModel = require("../../models/content/recommendationModel");
const { responseReturn } = require("../../utils/response");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure: true,
  });
}

async function uploadImage(file, folder) {
  configureCloudinary();
  const result = await cloudinary.uploader.upload(file.filepath, { folder });
  return result.url;
}

function mapDoc(doc) {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: String(obj._id) };
}

class contentControllers {
  get_faqs = async (_req, res) => {
    try {
      const faqs = await faqModel.find({}).sort({ order: 1, createdAt: -1 });
      responseReturn(res, 200, { faqs: faqs.map(mapDoc) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  create_faq = async (req, res) => {
    try {
      const { question, answer } = req.body;
      const faq = await faqModel.create({ question, answer });
      responseReturn(res, 201, { faq: mapDoc(faq) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  update_faq = async (req, res) => {
    try {
      const faq = await faqModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!faq) return responseReturn(res, 404, { error: "FAQ not found" });
      responseReturn(res, 200, { faq: mapDoc(faq) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  delete_faq = async (req, res) => {
    try {
      await faqModel.findByIdAndDelete(req.params.id);
      responseReturn(res, 200, { message: "FAQ deleted" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_headers = async (_req, res) => {
    try {
      const headers = await headerModel.find({}).sort({ createdAt: -1 });
      responseReturn(res, 200, { headers: headers.map(mapDoc) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  create_header = async (req, res) => {
    try {
      const header = await headerModel.create(req.body);
      responseReturn(res, 201, { header: mapDoc(header) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  update_header = async (req, res) => {
    try {
      const header = await headerModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!header) return responseReturn(res, 404, { error: "Header not found" });
      responseReturn(res, 200, { header: mapDoc(header) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  delete_header = async (req, res) => {
    try {
      await headerModel.findByIdAndDelete(req.params.id);
      responseReturn(res, 200, { message: "Header deleted" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  upload_header_image = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 400, { error: "Invalid form data" });
      try {
        const imageUrl = await uploadImage(files.image, "headers");
        const header = await headerModel.findByIdAndUpdate(
          req.params.id,
          {
            image: imageUrl,
            related_link: fields.related_link ?? "",
          },
          { new: true },
        );
        if (!header) return responseReturn(res, 404, { error: "Header not found" });
        responseReturn(res, 200, { header: mapDoc(header) });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  get_sliders = async (_req, res) => {
    try {
      const sliders = await sliderModel.find({}).sort({ position: 1, createdAt: -1 });
      responseReturn(res, 200, { sliders: sliders.map(mapDoc) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  create_slider = async (req, res) => {
    try {
      const slider = await sliderModel.create(req.body);
      responseReturn(res, 201, { slider: mapDoc(slider) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  update_slider = async (req, res) => {
    try {
      const slider = await sliderModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!slider) return responseReturn(res, 404, { error: "Slider not found" });
      responseReturn(res, 200, { slider: mapDoc(slider) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  delete_slider = async (req, res) => {
    try {
      await sliderModel.findByIdAndDelete(req.params.id);
      responseReturn(res, 200, { message: "Slider deleted" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  upload_slider_image = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 400, { error: "Invalid form data" });
      try {
        const imageUrl = await uploadImage(files.image, "sliders");
        const slider = await sliderModel.findById(req.params.id);
        if (!slider) return responseReturn(res, 404, { error: "Slider not found" });

        slider.images.push({
          image: imageUrl,
          text: fields.text ?? "",
          color: fields.color ?? "",
          related_link: fields.related_link ?? "",
        });
        await slider.save();
        responseReturn(res, 200, { slider: mapDoc(slider) });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  get_contact = async (_req, res) => {
    try {
      const contact = await contactModel.findOne({}).sort({ createdAt: -1 });
      responseReturn(res, 200, { contact: contact ? mapDoc(contact) : null });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  list_contacts = async (_req, res) => {
    try {
      const contacts = await contactModel.find({}).sort({ createdAt: -1 });
      responseReturn(res, 200, { contacts: contacts.map(mapDoc) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  create_contact = async (req, res) => {
    try {
      const contact = await contactModel.create(req.body);
      responseReturn(res, 201, { contact: mapDoc(contact) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  update_contact = async (req, res) => {
    try {
      const contact = await contactModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!contact) return responseReturn(res, 404, { error: "Contact not found" });
      responseReturn(res, 200, { contact: mapDoc(contact) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  delete_contact = async (req, res) => {
    try {
      await contactModel.findByIdAndDelete(req.params.id);
      responseReturn(res, 200, { message: "Contact deleted" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_recommendations = async (_req, res) => {
    try {
      const recommendations = await recommendationModel
        .find({})
        .sort({ createdAt: -1 });
      responseReturn(res, 200, { recommendations: recommendations.map(mapDoc) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  create_recommendation = async (req, res) => {
    try {
      const recommendation = await recommendationModel.create(req.body);
      responseReturn(res, 201, { recommendation: mapDoc(recommendation) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  update_recommendation = async (req, res) => {
    try {
      const recommendation = await recommendationModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!recommendation) {
        return responseReturn(res, 404, { error: "Recommendation not found" });
      }
      responseReturn(res, 200, { recommendation: mapDoc(recommendation) });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  delete_recommendation = async (req, res) => {
    try {
      await recommendationModel.findByIdAndDelete(req.params.id);
      responseReturn(res, 200, { message: "Recommendation deleted" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  upload_recommendation_image = async (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 400, { error: "Invalid form data" });
      try {
        const imageUrl = await uploadImage(files.image, "recommendations");
        const recommendation = await recommendationModel.findByIdAndUpdate(
          req.params.id,
          {
            image: imageUrl,
            related_link: fields.related_link ?? "",
          },
          { new: true },
        );
        if (!recommendation) {
          return responseReturn(res, 404, { error: "Recommendation not found" });
        }
        responseReturn(res, 200, { recommendation: mapDoc(recommendation) });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };
}

module.exports = new contentControllers();
