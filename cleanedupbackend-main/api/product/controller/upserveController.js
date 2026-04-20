const Product = require("../model/Product");
const RetailProduct = require("../model/RetailProduct");
const fetch = require("node-fetch");
const axios = require("axios");
const cron = require("node-cron");

// Sandbox services
const sandboxConfig = require("../../../sandbox/config");
const { getServices } = require("../../../sandbox/services");
const svc = getServices();

let newRetailItem = async (req) => {
  try {
    var conditions = { "menu.id": { $ne: req.id } };
    var update = { $addToSet: { menu: req } };
    await RetailProduct.findOneAndUpdate(conditions, update, function (err, doc) {});
  } catch (err) {
    console.log(err);
  }
};

let addMenuData = async (req, nameString, retail) => {
  try {
    if (retail) {
      for (let i in req) {
        newRetailItem(req[i]);
      }
      updateAll();
    } else {
      await Product.findOneAndUpdate(
        { name: nameString },
        { $set: { menu: req } },
        { upsert: true }
      );
      updateAll();
    }
  } catch (err) {}
};

exports.upserveMongo = async (req, res) => {
  try {
    if (req.params.name === "mamnoonretail") {
      let doc = await RetailProduct.find({ name: req.params.name });
      res.status(201).json({ doc });
    } else {
      let doc = await Product.find({ name: req.params.name });
      res.status(201).json({ doc });
    }
  } catch (err) {
    console.log("fail");
  }
};

exports.mamnoonItemsPullMenu = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    const body = svc.breadcrumb.mockMenuResponse("mamnoon");
    res.status(201).json({ body });
    addMenuData(body, "mamnoon");
    return;
  }

  try {
    const request = await fetch(
      "https://hq.breadcrumb.com/ws/v1/menus/online_ordering/",
      {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
          "X-Breadcrumb-Password": "uQM8mseTvnTX",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      }
    );
    if (request.ok) {
      const body = await request.json();
      res.status(201).json({ body });
      addMenuData(body, "mamnoon");
    }
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

let mamnoonItemsPullMenuInit = async () => {
  if (sandboxConfig.isSandbox) {
    const body = svc.breadcrumb.mockMenuResponse("mamnoon");
    addMenuData(body, "mamnoon");
    return;
  }

  try {
    const request = await fetch(
      "https://hq.breadcrumb.com/ws/v1/menus/online_ordering/",
      {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
          "X-Breadcrumb-Password": "uQM8mseTvnTX",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      }
    );
    if (request.ok) {
      const body = await request.json();
      addMenuData(body, "mamnoon");
    }
  } catch (err) {
    console.log("error");
  }
};

exports.mamnoonItemsPullMenuMbar = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    const body = svc.breadcrumb.mockMenuResponse("mbar");
    res.status(201).json({ body });
    addMenuData(body, "mbar");
    return;
  }

  try {
    const request = await fetch(
      "https://hq.breadcrumb.com/ws/v1/menus/online_ordering/",
      {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mbar`,
          "X-Breadcrumb-Password": "2yEULpqH426t",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      }
    );
    if (request.ok) {
      const body = await request.json();
      res.status(201).json({ body });
      addMenuData(body, "mbar");
    }
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.mamnoonItemsPullMenuStreet = async () => {
  if (sandboxConfig.isSandbox) {
    const body = svc.breadcrumb.mockMenuResponse("mamnoonstreet");
    addMenuData(body, "mamnoonstreet");
    return;
  }

  try {
    const request = await fetch(
      "https://hq.breadcrumb.com/ws/v1/menus/online_ordering/",
      {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
          "X-Breadcrumb-Password": "TJzwaP8uguyy",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      }
    );
    if (request.ok) {
      const body = await request.json();
      addMenuData(body, "mamnoonstreet");
    }
  } catch (err) {}
};

let mamnoonItemsPullMenuStreetInit = async () => {
  if (sandboxConfig.isSandbox) {
    const body = svc.breadcrumb.mockMenuResponse("mamnoonstreet");
    addMenuData(body, "mamnoonstreet");
    return;
  }

  try {
    const request = await fetch(
      "https://hq.breadcrumb.com/ws/v1/menus/online_ordering/",
      {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
          "X-Breadcrumb-Password": "TJzwaP8uguyy",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      }
    );
    if (request.ok) {
      const body = await request.json();
      addMenuData(body, "mamnoonstreet");
    }
  } catch (err) {}
};

exports.postOnlineOrder = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    const result = svc.breadcrumb.mockPostOrderResponse(req);
    res.send(result);
    return;
  }

  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
        "X-Breadcrumb-Password": "uQM8mseTvnTX",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (res) { console.log(res); })
    .catch(function (error) { console.log(error); });
};

exports.streetItems = async (req, res) => {
  res.status(201).json({ body: {} });
};

let updateAll = async () => {};

exports.shippableEdit = async (req, res) => {
  try {
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      { $set: { "menu.$.shippable": req.body.tf } },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

exports.updateRetailItemLbs = async (req, res) => {
  try {
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      { $set: { "menu.$.lbs": req.body.number } },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) { console.log(err); res.send("error"); }
};

exports.updateRetailItemOz = async (req, res) => {
  try {
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      { $set: { "menu.$.oz": req.body.number } },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) { console.log(err); res.send("error"); }
};

exports.updateRetailItemHeight = async (req, res) => {
  try {
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      { $set: { "menu.$.height": req.body.number } },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) { console.log(err); res.send("error"); }
};

exports.updateRetailItemWidth = async (req, res) => {
  try {
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      { $set: { "menu.$.width": req.body.number } },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) { console.log(err); res.send("error"); }
};

exports.updateRetailItemLength = async (req, res) => {
  try {
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      { $set: { "menu.$.length": req.body.number } },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) { console.log(err); res.send("error"); }
};

exports.updateRetailItemGirth = async (req, res) => {
  try {
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      { $set: { "menu.$.girth": req.body.number } },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) { console.log(err); res.send("error"); }
};

exports.deleteItem = async (req, res) => {
  try {
    await RetailProduct.updateOne(
      { name: "mamnoonretail" },
      { $pull: { menu: { id: req.body.id } } },
      { safe: true },
      function removeConnectionsCB(err, obj) {
        res.status(200).json({ obj });
      }
    );
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

exports.visibleEdit = async (req, res) => {
  try {
    await RetailProduct.findOneAndUpdate(
      { name: "mamnoonretail", menu: { $elemMatch: { id: req.body.id } } },
      { $set: { "menu.$.visible": req.body.tf } },
      { new: true, safe: true, upsert: true }
    );
    res.send("success");
  } catch (err) { console.log(err); res.send("error"); }
};

// Menu endpoints using Breadcrumb v2 API
exports.menuMamnoon = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    res.status(201).json({ body: svc.breadcrumb.mockItemsResponse("mamnoon") });
    return;
  }

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/items.json?status=active&limit=500`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mamnoon-llc`,
          "X-Breadcrumb-Password": "sbkh_Qgs4HMB",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();
      res.status(201).json({ body });
    }
  } catch (err) { console.log(err); }
};

exports.menuMamnoonCategories = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    res.status(201).json({ body: svc.breadcrumb.mockCategoriesResponse("mamnoon") });
    return;
  }

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/categories.json`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mamnoon-llc`,
          "X-Breadcrumb-Password": "sbkh_Qgs4HMB",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();
      res.status(201).json({ body });
    }
  } catch (err) { console.log(err); }
};

exports.menuMbar = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    res.status(201).json({ body: svc.breadcrumb.mockItemsResponse("mbar") });
    return;
  }

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/items.json?status=active&limit=500`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mbar`,
          "X-Breadcrumb-Password": "1Sovjopb9tZU",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();
      res.status(201).json({ body });
    }
  } catch (err) { console.log(err); }
};

exports.menuMbarCategories = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    res.status(201).json({ body: svc.breadcrumb.mockCategoriesResponse("mbar") });
    return;
  }

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/categories.json`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mbar`,
          "X-Breadcrumb-Password": "1Sovjopb9tZU",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();
      res.status(201).json({ body });
    }
  } catch (err) { console.log(err); }
};

exports.menuMamnoonStreet = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    res.status(201).json({ body: svc.breadcrumb.mockItemsResponse("mamnoonstreet") });
    return;
  }

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/items.json?status=active&limit=500`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mamnoon-street`,
          "X-Breadcrumb-Password": "H227s3CADgg4",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();
      res.status(201).json({ body });
    }
  } catch (err) { console.log(err); }
};

exports.menuMamnoonStreetCategories = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    res.status(201).json({ body: svc.breadcrumb.mockCategoriesResponse("mamnoonstreet") });
    return;
  }

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/categories.json`,
      {
        headers: {
          "X-Breadcrumb-Username": `joe-waine_mamnoon-street`,
          "X-Breadcrumb-Password": "H227s3CADgg4",
          "X-Breadcrumb-API-Key": `6110e294b8984840d2c10472bbed3453`,
        },
      }
    );
    if (request.ok) {
      let body = await request.json();
      res.status(201).json({ body });
    }
  } catch (err) { console.log(err); }
};

// Cron - sync menus every 30s
cron.schedule("*/30 * * * * *", () => {
  mamnoonItemsPullMenuStreetInit();
  mamnoonItemsPullMenuInit();
});

exports.upserveMongoRetail = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    const menu = svc.breadcrumb.mockMenuResponse("mamnoon");
    let retail = menu.sections.filter(x => x.name === "Spices" || x.name === "Retail");
    let betterArray = [];
    retail.forEach(x => {
      betterArray.push(x.item_ids.map(y => ({ category: x.name, id: y })));
    });
    let betterArrayFlat = betterArray.flat();
    let retailObjects = menu.items.filter(x =>
      retail.map(s => s.item_ids).flat().includes(x.id)
    );
    let withCategory = retailObjects.map((x, i) => {
      x.category = betterArrayFlat[i] ? betterArrayFlat[i].category : "Retail";
      return x;
    });
    addMenuData(withCategory, "mamnoonretail", true);
    res.status(201).json({ withCategory });
    return;
  }

  try {
    const request = await fetch(
      "https://hq.breadcrumb.com/ws/v1/menus/online_ordering/",
      {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
          "X-Breadcrumb-Password": "uQM8mseTvnTX",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      }
    );
    if (request.ok) {
      const body = await request.json();
      let retail = body.sections.filter(x => x.name === "Spices" || x.name === "Retail");
      let betterArray = [];
      retail.forEach(x => {
        betterArray.push(x.item_ids.map(y => ({ category: x.name, id: y })));
      });
      let betterArrayFlat = betterArray.flat();
      let retailObjects = body.items.filter(x =>
        retail.map(s => s.item_ids).flat().includes(x.id)
      );
      let withCategory = retailObjects.map((x, i) => {
        x.category = betterArrayFlat[i].category;
        return x;
      });
      addMenuData(withCategory, "mamnoonretail", true);
      res.status(201).json({ withCategory });
    }
  } catch (err) {
    res.status(400).json({ err: err });
  }
};
