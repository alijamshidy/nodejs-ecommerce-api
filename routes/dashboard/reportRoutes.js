const { authMiddleware } = require("../../middlewares/authMiddleware");
const reportController = require("../../controllers/dashboard/reportController");

const router = require("express").Router();

router.get(
  "/admin/sales-report",
  authMiddleware,
  reportController.admin_sales_report,
);
router.get(
  "/seller/sales-report/:sellerId",
  authMiddleware,
  reportController.seller_sales_report,
);

module.exports = router;
