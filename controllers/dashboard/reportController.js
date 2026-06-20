const customerOrder = require("../../models/customerOrder");
const authOrderModel = require("../../models/authOrder");
const productModel = require("../../models/productModel");
const { responseReturn } = require("../../utils/response");
const {
  mongo: { ObjectId },
} = require("mongoose");

function parsePagination(query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const parPage = Math.max(1, Math.min(100, parseInt(query.parPage, 10) || 10));
  return { page, parPage, skip: parPage * (page - 1) };
}

function aggregateProductSales(orders) {
  const salesMap = new Map();

  for (const order of orders) {
    const products = order.products ?? [];
    for (const product of products) {
      const productId = String(product._id ?? product.productId ?? product.id ?? "");
      if (!productId) continue;

      const quantity = Number(product.quantity ?? 1);
      const price = Number(product.price ?? 0);
      const lineTotal = price * quantity;

      const existing = salesMap.get(productId) ?? {
        _id: productId,
        name: product.name ?? "Unknown",
        price,
        numOrders: 0,
        totalSale: 0,
      };

      existing.numOrders += 1;
      existing.totalSale += lineTotal;
      if (product.name) existing.name = product.name;
      if (product.price) existing.price = Number(product.price);

      salesMap.set(productId, existing);
    }
  }

  return Array.from(salesMap.values()).sort((a, b) => b.totalSale - a.totalSale);
}

class reportController {
  admin_sales_report = async (req, res) => {
    const { page, parPage, skip } = parsePagination(req.query);

    try {
      const orders = await customerOrder.find({
        delivery_status: { $ne: "cancelled" },
      });
      const allSales = aggregateProductSales(orders);
      const sales = allSales.slice(skip, skip + parPage);

      responseReturn(res, 200, {
        sales,
        totalSales: allSales.length,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  seller_sales_report = async (req, res) => {
    const { sellerId } = req.params;
    const { skip, parPage } = parsePagination(req.query);

    try {
      const sellerOrders = await authOrderModel.find({
        sellerId: new ObjectId(sellerId),
        delivery_status: { $ne: "cancelled" },
      });

      const allSales = aggregateProductSales(sellerOrders);
      const sales = allSales.slice(skip, skip + parPage);

      const enriched = await Promise.all(
        sales.map(async item => {
          const product = await productModel.findById(item._id);
          return {
            ...item,
            name: product?.name ?? item.name,
            price: product?.price ?? item.price,
          };
        }),
      );

      responseReturn(res, 200, {
        sales: enriched,
        totalSales: allSales.length,
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new reportController();
