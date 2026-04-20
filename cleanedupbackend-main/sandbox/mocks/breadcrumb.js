// Mock Breadcrumb/Upserve API - returns realistic restaurant data for sandbox mode
const moment = require("moment-timezone");

// Simulated order lifecycle state - orders progress through stages
const orderStates = {};

function getOrderState(orderId) {
  if (!orderStates[orderId]) {
    orderStates[orderId] = {
      status: "Open",
      hasEmployee: false,
      createdAt: Date.now(),
    };
  }
  // Auto-progress orders over time for demo purposes
  const elapsed = Date.now() - orderStates[orderId].createdAt;
  if (elapsed > 60000 && !orderStates[orderId].hasEmployee) {
    // After 1 min, order gets "accepted" (employee assigned)
    orderStates[orderId].hasEmployee = true;
  }
  if (elapsed > 120000 && orderStates[orderId].status === "Open") {
    // After 2 min, order gets "closed" (ready)
    orderStates[orderId].status = "Closed";
  }
  return orderStates[orderId];
}

function registerOrder(orderId) {
  orderStates[orderId] = {
    status: "Open",
    hasEmployee: false,
    createdAt: Date.now(),
  };
}

// Mock checks endpoint response (used by cron polling in index.js)
function mockChecksResponse(restaurant) {
  const today = moment().tz("America/Los_Angeles").format("YYYYMMDD");
  const checks = [];

  // Include any sandbox orders that have been placed
  for (const [orderId, state] of Object.entries(orderStates)) {
    const check = {
      id: "check_" + orderId,
      status: state.status,
      online_order: {
        id: orderId,
        source: "Generic Online Ordering",
      },
    };
    if (state.hasEmployee) {
      check.employee_name = "Demo Chef";
      check.employee_role_name = "Kitchen";
      check.employee_id = "emp_sandbox_1";
    }
    checks.push(check);
  }

  return { objects: checks };
}

// Mock online ordering menu response
function mockMenuResponse(restaurant) {
  const menus = {
    mamnoon: {
      sections: [
        {
          name: "Appetizers",
          item_ids: ["item_1", "item_2", "item_3", "item_4"],
        },
        {
          name: "Entrees",
          item_ids: ["item_5", "item_6", "item_7", "item_8"],
        },
        {
          name: "Desserts",
          item_ids: ["item_9", "item_10"],
        },
        {
          name: "Beverages",
          item_ids: ["item_11", "item_12"],
        },
        {
          name: "Spices",
          item_ids: ["retail_1", "retail_2", "retail_3"],
        },
        {
          name: "Retail",
          item_ids: ["retail_4", "retail_5"],
        },
      ],
      items: [
        {
          id: "item_1",
          name: "Hummus",
          description:
            "Classic chickpea hummus with tahini, lemon, and olive oil",
          price: 1200,
          modifiers: [],
          status: "active",
        },
        {
          id: "item_2",
          name: "Baba Ganoush",
          description: "Smoky roasted eggplant dip with tahini and pomegranate",
          price: 1300,
          modifiers: [],
          status: "active",
        },
        {
          id: "item_3",
          name: "Falafel",
          description:
            "Crispy chickpea fritters with herb salad and tahini sauce",
          price: 1400,
          modifiers: [
            {
              id: "mod_1",
              name: "Add Halloumi",
              price: 400,
            },
          ],
          status: "active",
        },
        {
          id: "item_4",
          name: "Fattoush Salad",
          description:
            "Fresh greens, radish, cucumber, sumac dressing, crispy pita",
          price: 1500,
          modifiers: [
            {
              id: "mod_2",
              name: "Add Chicken",
              price: 600,
            },
          ],
          status: "active",
        },
        {
          id: "item_5",
          name: "Lamb Kebab",
          description: "Grilled lamb skewers with saffron rice and grilled vegetables",
          price: 2800,
          modifiers: [
            {
              id: "mod_3",
              name: "Extra Skewer",
              price: 800,
            },
          ],
          status: "active",
        },
        {
          id: "item_6",
          name: "Chicken Shawarma",
          description:
            "Slow-roasted chicken, garlic sauce, pickled turnips, fresh herbs",
          price: 2200,
          modifiers: [],
          status: "active",
        },
        {
          id: "item_7",
          name: "Grilled Salmon",
          description: "Atlantic salmon with chermoula, couscous, and harissa",
          price: 3200,
          modifiers: [],
          status: "active",
        },
        {
          id: "item_8",
          name: "Vegetable Tagine",
          description:
            "Seasonal vegetables slow-cooked with preserved lemon and olives",
          price: 2000,
          modifiers: [],
          status: "active",
          vegetarian: true,
        },
        {
          id: "item_9",
          name: "Baklava",
          description: "Layers of phyllo, pistachios, and rose water syrup",
          price: 1000,
          modifiers: [],
          status: "active",
        },
        {
          id: "item_10",
          name: "Kunafa",
          description:
            "Warm shredded phyllo pastry with sweet cheese and orange blossom",
          price: 1200,
          modifiers: [],
          status: "active",
        },
        {
          id: "item_11",
          name: "Turkish Coffee",
          description: "Traditional cardamom-spiced coffee",
          price: 500,
          modifiers: [],
          status: "active",
        },
        {
          id: "item_12",
          name: "Mint Lemonade",
          description: "Fresh-squeezed lemon with mint and orange blossom water",
          price: 600,
          modifiers: [],
          status: "active",
        },
        {
          id: "retail_1",
          name: "Za'atar Spice Blend",
          description: "House-made za'atar with sumac, thyme, and sesame",
          price: 1200,
          modifiers: [],
          status: "active",
        },
        {
          id: "retail_2",
          name: "Baharat Spice Blend",
          description:
            "Warm seven-spice blend for stews and grilled meats",
          price: 1200,
          modifiers: [],
          status: "active",
        },
        {
          id: "retail_3",
          name: "Sumac",
          description: "Tangy ground sumac berry, perfect for salads",
          price: 1000,
          modifiers: [],
          status: "active",
        },
        {
          id: "retail_4",
          name: "Mamnoon Olive Oil",
          description: "Premium extra-virgin olive oil, 500ml",
          price: 2400,
          modifiers: [],
          status: "active",
        },
        {
          id: "retail_5",
          name: "Preserved Lemons",
          description: "House-preserved Meyer lemons, 12oz jar",
          price: 1400,
          modifiers: [],
          status: "active",
        },
      ],
      modifiers: [
        { id: "mod_1", name: "Add Halloumi", price: 400 },
        { id: "mod_2", name: "Add Chicken", price: 600 },
        { id: "mod_3", name: "Extra Skewer", price: 800 },
      ],
    },
    mamnoonstreet: {
      sections: [
        {
          name: "Street Bites",
          item_ids: ["st_1", "st_2", "st_3"],
        },
        {
          name: "Wraps & Sandwiches",
          item_ids: ["st_4", "st_5", "st_6"],
        },
        {
          name: "Bowls",
          item_ids: ["st_7", "st_8"],
        },
        {
          name: "Drinks",
          item_ids: ["st_9", "st_10"],
        },
      ],
      items: [
        {
          id: "st_1",
          name: "Fries with Za'atar",
          description: "Hand-cut fries with za'atar salt and garlic aioli",
          price: 800,
          modifiers: [],
          status: "active",
        },
        {
          id: "st_2",
          name: "Cauliflower Bites",
          description:
            "Crispy fried cauliflower with tahini and pomegranate seeds",
          price: 1000,
          modifiers: [],
          status: "active",
          vegetarian: true,
        },
        {
          id: "st_3",
          name: "Lamb Meatballs",
          description: "Spiced lamb meatballs with tomato sauce and pine nuts",
          price: 1200,
          modifiers: [],
          status: "active",
        },
        {
          id: "st_4",
          name: "Chicken Shawarma Wrap",
          description:
            "Rotisserie chicken, pickles, garlic sauce in house bread",
          price: 1400,
          modifiers: [
            { id: "st_mod_1", name: "Make it Spicy", price: 0 },
          ],
          status: "active",
        },
        {
          id: "st_5",
          name: "Falafel Wrap",
          description: "Crispy falafel, hummus, fresh vegetables, tahini",
          price: 1200,
          modifiers: [],
          status: "active",
          vegetarian: true,
        },
        {
          id: "st_6",
          name: "Lamb Burger",
          description:
            "Spiced lamb patty, feta, pickled onion, harissa mayo",
          price: 1600,
          modifiers: [],
          status: "active",
        },
        {
          id: "st_7",
          name: "Shawarma Bowl",
          description: "Chicken shawarma over rice with all the fixings",
          price: 1500,
          modifiers: [],
          status: "active",
        },
        {
          id: "st_8",
          name: "Falafel Bowl",
          description: "Falafel over greens with hummus, pickles, and tahini",
          price: 1300,
          modifiers: [],
          status: "active",
          vegetarian: true,
        },
        {
          id: "st_9",
          name: "Fresh Lemonade",
          description: "House-squeezed lemonade with mint",
          price: 500,
          modifiers: [],
          status: "active",
        },
        {
          id: "st_10",
          name: "Ayran",
          description: "Traditional yogurt drink with salt and mint",
          price: 400,
          modifiers: [],
          status: "active",
        },
      ],
      modifiers: [{ id: "st_mod_1", name: "Make it Spicy", price: 0 }],
    },
    mbar: {
      sections: [
        {
          name: "Small Plates",
          item_ids: ["mb_1", "mb_2", "mb_3"],
        },
        {
          name: "Mains",
          item_ids: ["mb_4", "mb_5", "mb_6"],
        },
        {
          name: "Cocktails",
          item_ids: ["mb_7", "mb_8"],
        },
      ],
      items: [
        {
          id: "mb_1",
          name: "Muhammara",
          description: "Roasted red pepper and walnut spread with pomegranate molasses",
          price: 1400,
          modifiers: [],
          status: "active",
        },
        {
          id: "mb_2",
          name: "Kibbeh Nayyeh",
          description: "Lebanese-style lamb tartare with bulgur and spices",
          price: 1800,
          modifiers: [],
          status: "active",
        },
        {
          id: "mb_3",
          name: "Grilled Halloumi",
          description:
            "Pan-seared halloumi with fig jam and toasted pistachios",
          price: 1600,
          modifiers: [],
          status: "active",
          vegetarian: true,
        },
        {
          id: "mb_4",
          name: "Wagyu Kebab",
          description:
            "Premium wagyu beef skewers with saffron butter and grilled peppers",
          price: 4200,
          modifiers: [],
          status: "active",
        },
        {
          id: "mb_5",
          name: "Whole Roasted Branzino",
          description: "Mediterranean sea bass with chermoula and citrus",
          price: 3800,
          modifiers: [],
          status: "active",
        },
        {
          id: "mb_6",
          name: "Rack of Lamb",
          description:
            "New Zealand lamb rack with pistachio crust and rose harissa",
          price: 4800,
          modifiers: [],
          status: "active",
        },
        {
          id: "mb_7",
          name: "Damascus Rose",
          description: "Gin, rose water, lemon, pomegranate",
          price: 1600,
          modifiers: [],
          status: "active",
        },
        {
          id: "mb_8",
          name: "Cedars Old Fashioned",
          description: "Bourbon, cedar syrup, orange, Angostura",
          price: 1800,
          modifiers: [],
          status: "active",
        },
      ],
      modifiers: [],
    },
  };

  return menus[restaurant] || menus.mamnoon;
}

// Mock items.json response (v2 API)
function mockItemsResponse(restaurant) {
  const menu = mockMenuResponse(restaurant);
  return {
    objects: menu.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price / 100,
      status: "active",
      category_id: "cat_1",
    })),
  };
}

// Mock categories.json response
function mockCategoriesResponse(restaurant) {
  const menu = mockMenuResponse(restaurant);
  return {
    objects: menu.sections.map((section, i) => ({
      id: "cat_" + (i + 1),
      name: section.name,
      status: "active",
    })),
  };
}

// Mock order post response
function mockPostOrderResponse(orderBody) {
  const orderId = orderBody.id || "sandbox_" + Date.now();
  registerOrder(orderId);
  console.log("[SANDBOX] Breadcrumb order posted:", orderId);
  return {
    result: "success",
    order_id: orderId,
    message: "Order received",
  };
}

module.exports = {
  mockChecksResponse,
  mockMenuResponse,
  mockItemsResponse,
  mockCategoriesResponse,
  mockPostOrderResponse,
  registerOrder,
  getOrderState,
};
