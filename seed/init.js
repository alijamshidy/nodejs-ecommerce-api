// MongoDB seed — اجرا با: mongosh < seed/init.js
// یا به‌صورت خودکار در Docker از طریق init_data/init.js
//
// حساب‌های تست (رمز همه: 123456):
//   admin     → a@admin.com
//   seller    → seller1@test.com  (فعال)
//   seller    → seller2@test.com  (در انتظار تأیید)
//   customer  → customer1@test.com
//   customer  → customer2@test.com

db = db.getSiblingDB("myapp_db");

const PASSWORD_HASH =
  "$2b$10$DZjoHxtv6oP9VLBvnMK1aOZaaQc4edPMg03OpnFa2.mSj2/s8igma";

const IDS = {
  admin: ObjectId("6a2be0635041be13d395fd69"),
  seller1: ObjectId("6a2be0635041be13d395fd70"),
  seller2: ObjectId("6a2be0635041be13d395fd71"),
  customer1: ObjectId("6a2be0635041be13d395fd72"),
  customer2: ObjectId("6a2be0635041be13d395fd73"),
  catElectronics: ObjectId("6a2be0635041be13d395fd80"),
  catClothing: ObjectId("6a2be0635041be13d395fd81"),
  catHome: ObjectId("6a2be0635041be13d395fd82"),
  prodPhone: ObjectId("6a2be0635041be13d395fd90"),
  prodLaptop: ObjectId("6a2be0635041be13d395fd91"),
  prodShirt: ObjectId("6a2be0635041be13d395fd92"),
  prodLamp: ObjectId("6a2be0635041be13d395fd93"),
};

const now = new Date();

db.admins.insertMany([
  {
    _id: IDS.admin,
    name: "Admin",
    email: "a@admin.com",
    password: PASSWORD_HASH,
    image: "",
    role: "admin",
  },
]);

db.sellers.insertMany([
  {
    _id: IDS.seller1,
    name: "Ali Seller",
    email: "seller1@test.com",
    password: PASSWORD_HASH,
    role: "seller",
    status: "active",
    payment: "inactive",
    method: "menualy",
    image: "",
    shopInfo: {
      shopName: "Tech Store",
      division: "Tehran",
      district: "District 1",
      sub_district: "Valiasr",
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: IDS.seller2,
    name: "Sara Seller",
    email: "seller2@test.com",
    password: PASSWORD_HASH,
    role: "seller",
    status: "pending",
    payment: "inactive",
    method: "menualy",
    image: "",
    shopInfo: {
      shopName: "Fashion Hub",
      division: "Isfahan",
      district: "District 2",
      sub_district: "Chaharbagh",
    },
    createdAt: now,
    updatedAt: now,
  },
]);

db.seller_customers.insertMany([
  { myId: IDS.seller1.toString(), myFriends: [], createdAt: now, updatedAt: now },
  { myId: IDS.seller2.toString(), myFriends: [], createdAt: now, updatedAt: now },
]);

db.customers.insertMany([
  {
    _id: IDS.customer1,
    name: "John Customer",
    email: "customer1@test.com",
    password: PASSWORD_HASH,
    method: "menualy",
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: IDS.customer2,
    name: "Mary Customer",
    email: "customer2@test.com",
    password: PASSWORD_HASH,
    method: "menualy",
    createdAt: now,
    updatedAt: now,
  },
]);

db.categorys.insertMany([
  {
    _id: IDS.catElectronics,
    name: "Electronics",
    slug: "Electronics",
    image: "https://placehold.co/400x400/png?text=Electronics",
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: IDS.catClothing,
    name: "Clothing",
    slug: "Clothing",
    image: "https://placehold.co/400x400/png?text=Clothing",
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: IDS.catHome,
    name: "Home",
    slug: "Home",
    image: "https://placehold.co/400x400/png?text=Home",
    createdAt: now,
    updatedAt: now,
  },
]);

db.products.insertMany([
  {
    _id: IDS.prodPhone,
    sellerId: IDS.seller1,
    name: "Smartphone X",
    slug: "Smartphone-X",
    category: "Electronics",
    brand: "TechBrand",
    price: 499,
    discount: 10,
    stock: 50,
    images: ["https://placehold.co/600x600/png?text=Smartphone"],
    description: "A fast smartphone with great camera and battery life.",
    shopName: "Tech Store",
    rating: 4.5,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: IDS.prodLaptop,
    sellerId: IDS.seller1,
    name: "Laptop Pro 15",
    slug: "Laptop-Pro-15",
    category: "Electronics",
    brand: "TechBrand",
    price: 999,
    discount: 5,
    stock: 20,
    images: ["https://placehold.co/600x600/png?text=Laptop"],
    description: "Lightweight laptop for work and study.",
    shopName: "Tech Store",
    rating: 4.2,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: IDS.prodShirt,
    sellerId: IDS.seller2,
    name: "Cotton T-Shirt",
    slug: "Cotton-T-Shirt",
    category: "Clothing",
    brand: "StyleCo",
    price: 29,
    discount: 0,
    stock: 100,
    images: ["https://placehold.co/600x600/png?text=T-Shirt"],
    description: "Comfortable cotton t-shirt in multiple colors.",
    shopName: "Fashion Hub",
    rating: 4.0,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: IDS.prodLamp,
    sellerId: IDS.seller2,
    name: "Desk Lamp LED",
    slug: "Desk-Lamp-LED",
    category: "Home",
    brand: "HomeLight",
    price: 45,
    discount: 15,
    stock: 35,
    images: ["https://placehold.co/600x600/png?text=Lamp"],
    description: "Adjustable LED desk lamp with warm light.",
    shopName: "Fashion Hub",
    rating: 4.8,
    createdAt: now,
    updatedAt: now,
  },
]);

db.reviews.insertMany([
  {
    productId: IDS.prodPhone,
    name: "John Customer",
    rating: 5,
    review: "Great phone, fast delivery!",
    date: "2025-01-15",
    createdAt: now,
    updatedAt: now,
  },
  {
    productId: IDS.prodLaptop,
    name: "Mary Customer",
    rating: 4,
    review: "Good performance, battery could be better.",
    date: "2025-02-20",
    createdAt: now,
    updatedAt: now,
  },
  {
    productId: IDS.prodShirt,
    name: "John Customer",
    rating: 4,
    review: "Soft fabric, fits well.",
    date: "2025-03-10",
    createdAt: now,
    updatedAt: now,
  },
]);

db.cardProducts.insertMany([
  {
    userId: IDS.customer1,
    productId: IDS.prodPhone,
    quantity: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: IDS.customer1,
    productId: IDS.prodLaptop,
    quantity: 2,
    createdAt: now,
    updatedAt: now,
  },
]);

db.wishlists.insertMany([
  {
    userId: IDS.customer2.toString(),
    productId: IDS.prodPhone.toString(),
    name: "Smartphone X",
    price: 499,
    image: "https://placehold.co/600x600/png?text=Smartphone",
    discount: 10,
    rating: 4.5,
    slug: "Smartphone-X",
    createdAt: now,
    updatedAt: now,
  },
  {
    userId: IDS.customer2.toString(),
    productId: IDS.prodLamp.toString(),
    name: "Desk Lamp LED",
    price: 45,
    image: "https://placehold.co/600x600/png?text=Lamp",
    discount: 15,
    rating: 4.8,
    slug: "Desk-Lamp-LED",
    createdAt: now,
    updatedAt: now,
  },
]);

print("دیتای آزمایشی با موفقیت اضافه شد!");
print("رمز همه حساب‌ها: 123456");
