#!/usr/bin/env node
// Database Seeder - populates local MongoDB with demo data for sandbox mode
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const config = require("./config");

const User = require("../api/user/model/User");
const Order = require("../api/order/model/Order");
const Credit = require("../api/credit/model/Credit");
const Package = require("../api/package/model/Package");
const Reservation = require("../api/reservation/model/Reservation");
const Product = require("../api/product/model/Product");
const RetailProduct = require("../api/product/model/RetailProduct");

const usersData = require("./seeds/users.json");
const ordersData = require("./seeds/orders.json");
const creditcardsData = require("./seeds/creditcards.json");
const packagesData = require("./seeds/packages.json");
const reservationsData = require("./seeds/reservations.json");
const breadcrumbMock = require("./mocks/breadcrumb");

async function seed() {
  const uri = config.mongodb.uri;
  console.log("Connecting to:", uri);

  mongoose.set("useCreateIndex", true);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useUnifiedTopology", true);

  await mongoose.connect(uri, { useNewUrlParser: true });
  console.log("Connected to MongoDB");

  // Clear existing data
  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Order.deleteMany({}),
    Credit.deleteMany({}),
    Package.deleteMany({}),
    Reservation.deleteMany({}),
    Product.deleteMany({}),
    RetailProduct.deleteMany({}),
  ]);

  // Seed Users (password hashed by User model pre-save hook)
  console.log("Seeding users...");
  for (const userData of usersData) {
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      deliveryAddress: userData.deliveryAddress,
      billingAddress: userData.billingAddress,
      testimonials: userData.testimonials,
      giftcard: userData.giftcard,
      giftcards: userData.giftcards,
      tokens: [],
    });
    await user.save();
    console.log("  + User:", userData.email);
  }

  // Seed Orders
  console.log("Seeding orders...");
  for (const orderData of ordersData) {
    const order = new Order(orderData);
    await order.save();
    console.log("  + Order:", orderData.orderInfo.confirmation_code, "-", orderData.orderInfo.restaurant);
  }

  // Seed Credit Cards
  console.log("Seeding credit cards...");
  for (const ccData of creditcardsData) {
    const credit = new Credit(ccData);
    await credit.save();
    console.log("  + Card:", ccData.maskedNumber, "for", ccData.email);
  }

  // Seed Packages
  console.log("Seeding packages...");
  for (const pkgData of packagesData) {
    const pkg = new Package(pkgData);
    await pkg.save();
    console.log("  + Package:", pkgData.name);
  }

  // Seed Reservations
  console.log("Seeding reservations...");
  for (const resData of reservationsData) {
    const reservation = new Reservation(resData);
    await reservation.save();
    console.log("  + Reservation:", resData.email, "at", resData.venue);
  }

  // Seed Menus from mock Breadcrumb data
  console.log("Seeding menus...");
  const restaurants = ["mamnoon", "mamnoonstreet", "mbar"];
  for (const name of restaurants) {
    const menu = breadcrumbMock.mockMenuResponse(name);
    await Product.findOneAndUpdate(
      { name: name },
      { $set: { menu: menu } },
      { upsert: true }
    );
    console.log("  + Menu:", name);
  }

  // Seed Retail Products
  console.log("Seeding retail products...");
  const mamnoonMenu = breadcrumbMock.mockMenuResponse("mamnoon");
  const retailSections = mamnoonMenu.sections.filter(
    (s) => s.name === "Spices" || s.name === "Retail"
  );
  const retailItemIds = retailSections.flatMap((s) => s.item_ids);
  const retailItems = mamnoonMenu.items
    .filter((item) => retailItemIds.includes(item.id))
    .map((item) => ({
      ...item,
      shippable: true,
      visible: true,
      lbs: 1,
      oz: 8,
      height: 6,
      width: 4,
      length: 4,
      girth: 16,
      category: retailSections.find((s) => s.item_ids.includes(item.id))?.name || "Retail",
    }));

  await RetailProduct.findOneAndUpdate(
    { name: "mamnoonretail" },
    { $set: { menu: retailItems } },
    { upsert: true }
  );
  console.log("  + Retail products:", retailItems.length, "items");

  console.log("\n========================================");
  console.log("  SEED COMPLETE");
  console.log("========================================");
  console.log("  Users:", usersData.length);
  console.log("  Orders:", ordersData.length);
  console.log("  Credit Cards:", creditcardsData.length);
  console.log("  Packages:", packagesData.length);
  console.log("  Reservations:", reservationsData.length);
  console.log("  Menus:", restaurants.length);
  console.log("  Retail Items:", retailItems.length);
  console.log("\n  Demo login: demo@example.com / password123");
  console.log("========================================\n");

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
