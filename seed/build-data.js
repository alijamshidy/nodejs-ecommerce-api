const COUNT = 120;

const PASSWORD_HASH =
  "$2b$10$DZjoHxtv6oP9VLBvnMK1aOZaaQc4edPMg03OpnFa2.mSj2/s8igma";

const FIXED_IDS = {
  admin: "6a2be0635041be13d395fd69",
  seller1: "6a2be0635041be13d395fd70",
  seller2: "6a2be0635041be13d395fd71",
  customer1: "6a2be0635041be13d395fd72",
  customer2: "6a2be0635041be13d395fd73",
};

function oid(n) {
  return `6a2be0635041be13${n.toString(16).padStart(8, "0")}`;
}

const CATEGORY_NAMES = [
  "Electronics",
  "Clothing",
  "Home",
  "Sports",
  "Books",
  "Beauty",
  "Toys",
  "Automotive",
  "Garden",
  "Health",
  "Jewelry",
  "Shoes",
  "Bags",
  "Furniture",
  "Kitchen",
  "Pet Supplies",
  "Office",
  "Music",
  "Art",
  "Baby",
];

const BRANDS = [
  "TechBrand",
  "StyleCo",
  "HomeLight",
  "SportMax",
  "FreshLine",
  "UrbanWear",
  "ProGear",
  "EcoHome",
  "NovaTech",
  "ClassicCo",
];

const DIVISIONS = [
  "Tehran",
  "Isfahan",
  "Shiraz",
  "Mashhad",
  "Tabriz",
  "Karaj",
  "Ahvaz",
  "Qom",
];

const REVIEW_TEXTS = [
  "Great product, fast delivery!",
  "Good quality for the price.",
  "Exactly as described, very happy.",
  "Could be better, but acceptable.",
  "Excellent build quality.",
  "Soft fabric, fits well.",
  "Battery life exceeded expectations.",
  "Nice design, recommended.",
  "Average experience overall.",
  "Will buy again for sure.",
];

const PAYMENT_STATUSES = ["paid", "pending", "failed"];
const DELIVERY_STATUSES = ["pending", "processing", "delivered", "cancelled"];

function pick(arr, index) {
  return arr[index % arr.length];
}

function slugify(text) {
  return text.replace(/\s+/g, "-");
}

function buildSeedData() {
  const now = new Date();

  const admins = [
    {
      _id: FIXED_IDS.admin,
      name: "Admin",
      email: "a@admin.com",
      password: PASSWORD_HASH,
      image: "",
      role: "admin",
    },
  ];

  const sellers = [];
  const sellerIds = [];

  sellers.push({
    _id: FIXED_IDS.seller1,
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
  });
  sellerIds.push(FIXED_IDS.seller1);

  sellers.push({
    _id: FIXED_IDS.seller2,
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
  });
  sellerIds.push(FIXED_IDS.seller2);

  for (let i = 3; i <= COUNT; i++) {
    const id = oid(1000 + i);
    sellerIds.push(id);
    sellers.push({
      _id: id,
      name: `Seller ${i}`,
      email: `seller${i}@test.com`,
      password: PASSWORD_HASH,
      role: "seller",
      status: i % 5 === 0 ? "pending" : "active",
      payment: i % 7 === 0 ? "active" : "inactive",
      method: "menualy",
      image: "",
      shopInfo: {
        shopName: `Shop ${i}`,
        division: pick(DIVISIONS, i),
        district: `District ${(i % 10) + 1}`,
        sub_district: `Area ${i}`,
      },
      createdAt: now,
      updatedAt: now,
    });
  }

  const sellerCustomers = sellerIds.map((sellerId) => ({
    myId: sellerId,
    myFriends: [],
    createdAt: now,
    updatedAt: now,
  }));

  const customers = [];
  const customerIds = [];

  customers.push({
    _id: FIXED_IDS.customer1,
    name: "John Customer",
    email: "customer1@test.com",
    password: PASSWORD_HASH,
    method: "menualy",
    createdAt: now,
    updatedAt: now,
  });
  customerIds.push(FIXED_IDS.customer1);

  customers.push({
    _id: FIXED_IDS.customer2,
    name: "Mary Customer",
    email: "customer2@test.com",
    password: PASSWORD_HASH,
    method: "menualy",
    createdAt: now,
    updatedAt: now,
  });
  customerIds.push(FIXED_IDS.customer2);

  for (let i = 3; i <= COUNT; i++) {
    const id = oid(2000 + i);
    customerIds.push(id);
    customers.push({
      _id: id,
      name: `Customer ${i}`,
      email: `customer${i}@test.com`,
      password: PASSWORD_HASH,
      method: "menualy",
      createdAt: now,
      updatedAt: now,
    });
  }

  const categorys = [];
  const categoryNames = [];

  for (let i = 1; i <= COUNT; i++) {
    const baseName = pick(CATEGORY_NAMES, i);
    const name = i <= CATEGORY_NAMES.length ? baseName : `${baseName} ${i}`;
    categoryNames.push(name);
    categorys.push({
      _id: oid(3000 + i),
      name,
      slug: slugify(name),
      image: `https://placehold.co/400x400/png?text=${encodeURIComponent(name)}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  const products = [];
  const productIds = [];
  const productCount = COUNT + 30;

  for (let i = 1; i <= productCount; i++) {
    const id = oid(4000 + i);
    productIds.push(id);
    const category = pick(categoryNames, i);
    const sellerIndex = i % sellerIds.length;
    const sellerId = sellerIds[sellerIndex];
    const shopName = sellers[sellerIndex].shopInfo.shopName;
    const name = `${pick(BRANDS, i)} ${category} Item ${i}`;
    const price = 10 + (i % 990);
    const discount = i % 6 === 0 ? 0 : (i % 25) + 5;

    products.push({
      _id: id,
      sellerId,
      name,
      slug: slugify(name),
      category,
      brand: pick(BRANDS, i),
      price,
      discount,
      stock: 5 + (i % 200),
      images: [
        `https://placehold.co/600x600/png?text=${encodeURIComponent(`Product-${i}`)}`,
      ],
      description: `Sample product ${i} in ${category}. High quality item for testing.`,
      shopName,
      rating: Number((3 + (i % 20) / 10).toFixed(1)),
      createdAt: now,
      updatedAt: now,
    });
  }

  const reviews = [];
  for (let i = 1; i <= COUNT; i++) {
    const product = products[i % products.length];
    const customer = customers[i % customers.length];
    reviews.push({
      productId: product._id,
      name: customer.name,
      rating: (i % 5) + 1,
      review: pick(REVIEW_TEXTS, i),
      date: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  const cardProducts = [];
  for (let i = 1; i <= COUNT; i++) {
    cardProducts.push({
      userId: customerIds[i % customerIds.length],
      productId: productIds[i % productIds.length],
      quantity: (i % 3) + 1,
      createdAt: now,
      updatedAt: now,
    });
  }

  const wishlists = [];
  for (let i = 1; i <= COUNT; i++) {
    const product = products[i % products.length];
    wishlists.push({
      userId: customerIds[i % customerIds.length],
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      discount: product.discount,
      rating: product.rating,
      slug: product.slug,
      createdAt: now,
      updatedAt: now,
    });
  }

  const customerOrders = [];
  const authorOrders = [];

  for (let i = 1; i <= COUNT; i++) {
    const orderId = oid(5000 + i);
    const customerId = customerIds[i % customerIds.length];
    const product = products[i % products.length];
    const quantity = (i % 3) + 1;
    const lineItem = {
      name: product.name,
      price: product.price,
      quantity,
      sellerId: product.sellerId,
      image: product.images[0],
    };
    const price = product.price * quantity;
    const date = `June ${(i % 28) + 1}, 2026 ${(i % 12) + 8}:${String(i % 60).padStart(2, "0")} AM`;

    customerOrders.push({
      _id: orderId,
      customerId,
      products: [lineItem],
      price,
      payment_status: pick(PAYMENT_STATUSES, i),
      shippingInfo: {
        name: customers.find((c) => c._id === customerId).name,
        address: `${pick(DIVISIONS, i)}, Street ${i}`,
        phone: `0912${String(1000000 + i).slice(-7)}`,
      },
      delivery_status: pick(DELIVERY_STATUSES, i),
      date,
      createdAt: now,
      updatedAt: now,
    });

    authorOrders.push({
      _id: oid(6000 + i),
      orderId,
      sellerId: product.sellerId,
      products: [lineItem],
      price,
      payment_status: pick(PAYMENT_STATUSES, i),
      shippingInfo: "Easy Main Warehouse",
      delivery_status: pick(DELIVERY_STATUSES, i),
      date,
      createdAt: now,
      updatedAt: now,
    });
  }

  const collections = [];
  for (let i = 1; i <= COUNT; i++) {
    const productSlice = productIds.slice(i, i + 5);
    collections.push({
      _id: oid(7000 + i),
      name: `Collection ${i}`,
      slug: `collection-${i}`,
      description: `Curated collection number ${i} for storefront testing.`,
      image: `https://placehold.co/800x400/png?text=Collection-${i}`,
      products: productSlice,
      createdAt: now,
      updatedAt: now,
    });
  }

  const faqs = [];
  for (let i = 1; i <= COUNT; i++) {
    faqs.push({
      _id: oid(8000 + i),
      question: `FAQ question ${i}?`,
      answer: `This is the answer for FAQ item ${i}. Useful for testing pagination and search.`,
      order: i,
      createdAt: now,
      updatedAt: now,
    });
  }

  const headers = [];
  for (let i = 1; i <= COUNT; i++) {
    headers.push({
      _id: oid(9000 + i),
      text: `Header banner ${i}`,
      color: pick(["#111827", "#1d4ed8", "#059669", "#b45309", "#7c3aed"], i),
      image: `https://placehold.co/1200x300/png?text=Header-${i}`,
      related_link: `/shop?banner=${i}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  const recommendations = [];
  for (let i = 1; i <= COUNT; i++) {
    recommendations.push({
      _id: oid(10000 + i),
      text: `Recommended pick ${i}`,
      color: pick(["#ef4444", "#3b82f6", "#10b981", "#f59e0b"], i),
      image: `https://placehold.co/400x400/png?text=Rec-${i}`,
      related_link: `/product/${products[i % products.length].slug}`,
      createdAt: now,
      updatedAt: now,
    });
  }

  const sliders = [];
  for (let i = 1; i <= COUNT; i++) {
    sliders.push({
      _id: oid(11000 + i),
      text: `Slider ${i}`,
      color: pick(["#ffffff", "#f3f4f6", "#fef3c7"], i),
      position: i,
      images: [
        {
          image: `https://placehold.co/1400x500/png?text=Slide-${i}-A`,
          text: `Slide A for slider ${i}`,
          color: "#000000",
          related_link: `/shop?slide=${i}a`,
        },
        {
          image: `https://placehold.co/1400x500/png?text=Slide-${i}-B`,
          text: `Slide B for slider ${i}`,
          color: "#ffffff",
          related_link: `/shop?slide=${i}b`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    });
  }

  const contacts = [
    {
      _id: oid(12000),
      instagram_channel: "https://instagram.com/demo_store",
      telegram_channel: "https://t.me/demo_store",
      contact_number: "02112345678",
      contact_number_2: "09120000000",
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    admins,
    sellers,
    seller_customers: sellerCustomers,
    customers,
    categorys,
    products,
    reviews,
    cardProducts,
    wishlists,
    customerorders: customerOrders,
    authororders: authorOrders,
    collections,
    faqs,
    headers,
    recommendations,
    sliders,
    contacts,
  };
}

module.exports = { buildSeedData, COUNT, PASSWORD_HASH };
