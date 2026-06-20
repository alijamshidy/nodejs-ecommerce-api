const { authMiddleware } = require("../../middlewares/authMiddleware");
const contentControllers = require("../../controllers/content/contentControllers");

const router = require("express").Router();

router.get("/faq", contentControllers.get_faqs);
router.get("/header", contentControllers.get_headers);
router.get("/slider", contentControllers.get_sliders);
router.get("/contact", contentControllers.get_contact);
router.get("/recommendations", contentControllers.get_recommendations);

router.get("/content/faq", authMiddleware, contentControllers.get_faqs);
router.post("/content/faq", authMiddleware, contentControllers.create_faq);
router.patch("/content/faq/:id", authMiddleware, contentControllers.update_faq);
router.delete("/content/faq/:id", authMiddleware, contentControllers.delete_faq);

router.get("/content/header", authMiddleware, contentControllers.get_headers);
router.post("/content/header", authMiddleware, contentControllers.create_header);
router.patch("/content/header/:id", authMiddleware, contentControllers.update_header);
router.delete("/content/header/:id", authMiddleware, contentControllers.delete_header);
router.post(
  "/content/header/:id/image",
  authMiddleware,
  contentControllers.upload_header_image,
);

router.get("/content/slider", authMiddleware, contentControllers.get_sliders);
router.post("/content/slider", authMiddleware, contentControllers.create_slider);
router.patch("/content/slider/:id", authMiddleware, contentControllers.update_slider);
router.delete("/content/slider/:id", authMiddleware, contentControllers.delete_slider);
router.post(
  "/content/slider/:id/image",
  authMiddleware,
  contentControllers.upload_slider_image,
);

router.get("/content/contact", authMiddleware, contentControllers.list_contacts);
router.post("/content/contact", authMiddleware, contentControllers.create_contact);
router.patch("/content/contact/:id", authMiddleware, contentControllers.update_contact);
router.delete("/content/contact/:id", authMiddleware, contentControllers.delete_contact);

router.get(
  "/content/recommendation",
  authMiddleware,
  contentControllers.get_recommendations,
);
router.post(
  "/content/recommendation",
  authMiddleware,
  contentControllers.create_recommendation,
);
router.patch(
  "/content/recommendation/:id",
  authMiddleware,
  contentControllers.update_recommendation,
);
router.delete(
  "/content/recommendation/:id",
  authMiddleware,
  contentControllers.delete_recommendation,
);
router.post(
  "/content/recommendation/:id/image",
  authMiddleware,
  contentControllers.upload_recommendation_image,
);

module.exports = router;
