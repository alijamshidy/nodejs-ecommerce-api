// init-data/init.js
db = db.getSiblingDB("myapp_db");

db.admins.insertMany([
  {
    _id: {
      ObjectId: "6a2be0635041be13d395fd69",
    },
    email: "a@admin.com",
    name: "a",
    password: "$2b$10$Cy6cvh1EHEr9TDoeEWnNsOmuI0YkeDUGAGG4F2wV.NPJRlFDN72o2",
    image: "",
    role: "admin",
  },
]);
print("دیتای آزمایشی با موفقیت اضافه شد!");
