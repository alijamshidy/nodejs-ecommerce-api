const { authMiddleware } = require("../../middlewares/authMiddleware");
const collectionController = require("../../controllers/dashboard/collectionController");

const router = require("express").Router();

router.get("/home/collections", collectionController.get_public_collections);
router.get("/home/collection/:slug", collectionController.get_public_collection);

router.get("/collections-get", authMiddleware, collectionController.get_collections);
router.get("/collection-get/:slug", authMiddleware, collectionController.get_collection);
router.post("/collection-add", authMiddleware, collectionController.add_collection);
router.post("/collection-update", authMiddleware, collectionController.update_collection);
router.delete(
  "/collection-delete/:id",
  authMiddleware,
  collectionController.delete_collection,
);

module.exports = router;
