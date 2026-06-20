require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const { buildSeedData, COUNT } = require("./build-data");

const COLLECTIONS = [
  "admins",
  "sellers",
  "seller_customers",
  "customers",
  "categorys",
  "products",
  "reviews",
  "cardProducts",
  "wishlists",
  "customerorders",
  "authororders",
  "collections",
  "faqs",
  "headers",
  "recommendations",
  "sliders",
  "contacts",
];

async function seed() {
  const force = process.argv.includes("--force");
  const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/myapp_db";

  await mongoose.connect(dbUrl);
  console.log(`Connected to ${dbUrl}`);

  if (force) {
    console.log("Clearing existing seed collections...");
    await Promise.all(
      COLLECTIONS.map((name) => mongoose.connection.db.dropCollection(name).catch(() => {})),
    );
  }

  const data = buildSeedData();

  for (const collection of COLLECTIONS) {
    const docs = data[collection];
    if (!docs?.length) continue;

    const existing = await mongoose.connection.db.collection(collection).countDocuments();
    if (existing > 0 && !force) {
      console.log(`Skip ${collection} (${existing} docs already exist, use --force to replace)`);
      continue;
    }

    await mongoose.connection.db.collection(collection).insertMany(docs);
    console.log(`Inserted ${docs.length} documents into ${collection}`);
  }

  console.log(`Seed complete (${COUNT}+ records per main collection). Password: 123456`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
