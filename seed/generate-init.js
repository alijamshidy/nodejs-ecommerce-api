const fs = require("fs");
const path = require("path");
const { buildSeedData, COUNT } = require("./build-data");

function toMongoLiteral(value, indent = 0) {
  const pad = "  ".repeat(indent);
  const padInner = "  ".repeat(indent + 1);

  if (value === null) return "null";
  if (value instanceof Date) return `ISODate("${value.toISOString()}")`;
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((item) => `${padInner}${toMongoLiteral(item, indent + 1)}`);
    return `[\n${items.join(",\n")}\n${pad}]`;
  }

  const entries = Object.entries(value).map(
    ([key, val]) => `${padInner}${key}: ${toMongoLiteral(val, indent + 1)}`,
  );
  return `{\n${entries.join(",\n")}\n${pad}}`;
}

function objectIdRefs(doc) {
  const json = JSON.stringify(doc, (_key, value) => {
    if (value instanceof Date) {
      return `__DATE__${value.toISOString()}__DATE__`;
    }
    if (typeof value === "string" && /^6a2be0635041be13[0-9a-f]{8}$/.test(value)) {
      return `__OID__${value}__OID__`;
    }
    return value;
  });

  return json
    .replace(/"__OID__([0-9a-f]{24})__OID__"/g, 'ObjectId("$1")')
    .replace(/"__DATE__([^"]+)__DATE__"/g, 'ISODate("$1")');
}

function buildInitScript(data) {
  const header = `// MongoDB seed — auto-generated (${COUNT}+ records per collection)
// Generate: npm run seed:generate
// Docker: mounted at init_data/init.js (runs on first MongoDB volume init)
//
// Test accounts (password for all: 123456):
//   admin     -> a@admin.com
//   seller    -> seller1@test.com, seller2@test.com, seller3@test.com ...
//   customer  -> customer1@test.com, customer2@test.com, customer3@test.com ...

db = db.getSiblingDB("myapp_db");

const now = new Date();

`;

  const inserts = Object.entries(data)
    .map(([collection, docs]) => {
      const literalDocs = docs.map((doc) => objectIdRefs(doc));
      const body = literalDocs.map((doc) => `  ${doc}`).join(",\n");
      return `db.${collection}.insertMany([\n${body}\n]);`;
    })
    .join("\n\n");

  const footer = `

print("Seed data loaded successfully!");
print("Records per main collection: ${COUNT}+");
print("Password for all accounts: 123456");
`;

  return header + inserts + footer;
}

const data = buildSeedData();
const script = buildInitScript(data);

const targets = [
  path.join(__dirname, "..", "init_data", "init.js"),
  path.join(__dirname, "init.js"),
];

for (const target of targets) {
  fs.writeFileSync(target, script, "utf8");
  console.log(`Wrote ${target}`);
}
