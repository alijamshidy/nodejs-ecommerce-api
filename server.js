const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { dbConnect } = require("./utils/db");

const socket = require("socket.io");
const http = require("http");
const { userInfo } = require("os");
const server = http.createServer(app);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001","*"],
    credentials: true,
  }),
);

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

var allCustomer = [];
var allSeller = [];
var admin = {};

const addUser = (customerId, socketId, userInfo) => {
  const id = String(customerId);
  const existing = allCustomer.find(u => u.customerId === id);
  if (existing) {
    existing.socketId = socketId;
    existing.userInfo = userInfo;
  } else {
    allCustomer.push({
      customerId: id,
      socketId,
      userInfo,
    });
  }
};

const addSeller = (sellerId, socketId, userInfo) => {
  const id = String(sellerId);
  const existing = allSeller.find(u => u.sellerId === id);
  if (existing) {
    existing.socketId = socketId;
    existing.userInfo = userInfo;
  } else {
    allSeller.push({
      sellerId: id,
      socketId,
      userInfo,
    });
  }
};

const findCustomer = customerId => {
  return allCustomer.find(c => c.customerId === String(customerId));
};

const findSeller = sellerId => {
  return allSeller.find(c => c.sellerId === String(sellerId));
};

const remove = socketId => {
  allCustomer = allCustomer.filter(c => c.socketId !== socketId);
  allSeller = allSeller.filter(c => c.socketId !== socketId);
  if (admin.socketId === socketId) {
    admin.socketId = null;
  }
};

io.on("connection", soc => {
  console.log("socket server running...");
  soc.on("add_user", (customerId, userInfo) => {
    addUser(customerId, soc.id, userInfo);
    io.emit("activeSeller", allSeller);
  });
  soc.on("add_seller", (sellerId, userInfo) => {
    addSeller(sellerId, soc.id, userInfo);
    io.emit("activeSeller", allSeller);
  });

  soc.on("send_seller_message", msg => {
    const customer = findCustomer(msg.receverId);
    if (customer) {
      io.to(customer.socketId).emit("seller_message", msg);
    }
  });

  soc.on("send_customer_message", msg => {
    const seller = findSeller(msg.receverId);
    if (seller) {
      io.to(seller.socketId).emit("customer_message", msg);
    }
  });

  soc.on("send_message_admin_to_seller", msg => {
    const seller = findSeller(msg.receverId);
    if (seller) {
      io.to(seller.socketId).emit("receved_admin_message", msg);
    }
  });

  soc.on("send_message_seller_to_admin", msg => {
    if (admin.socketId) {
      io.to(admin.socketId).emit("receved_seller_message", msg);
    }
  });

  soc.on("send_message_admin_to_customer", msg => {
    const customer = findCustomer(msg.receverId);
    if (customer) {
      io.to(customer.socketId).emit("admin_support_message", msg);
    }
  });

  soc.on("send_message_customer_to_admin", msg => {
    if (admin.socketId) {
      io.to(admin.socketId).emit("receved_customer_message", msg);
    }
  });

  soc.on("add_admin", adminInfo => {
    delete adminInfo.email;
    delete adminInfo.password;
    admin = adminInfo;
    admin.socketId = soc.id;
    io.emit("activeSeller", allSeller);
  });

  soc.on("disconnect", () => {
    console.log("user disconnected");
    remove(soc.id);
    io.emit("activeSeller", allSeller);
  });
});

app.use(bodyParser.json());
app.use(cookieParser());

const { setupSwagger } = require("./docs/swagger");
setupSwagger(app);

app.use("/api", require("./routes/dashboard/categoryRoutes"));
app.use("/api", require("./routes/dashboard/productRoutes"));
app.use("/api", require("./routes/dashboard/reportRoutes"));
app.use("/api", require("./routes/dashboard/collectionRoutes"));
app.use("/api", require("./routes/home/cardRoutes"));
app.use("/api", require("./routes/order/orderRoutes"));
app.use("/api", require("./routes/dashboard/sellerRoutes"));
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/home/customerAuthRoutes"));
app.use("/api/home", require("./routes/home/homeRoutes"));
app.use("/api/home", require("./routes/content/contentRoutes"));
app.use("/api", require("./routes/content/contentRoutes"));
app.use("/api", require("./routes/chatRoutes"));
app.use("/api", require("./routes/paymentRoutes"));

const port = process.env.PORT;
dbConnect();
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API docs available at http://localhost:${port}/api-docs`);
});
