const Order = require("../model/Order");
const fetch = require("node-fetch");
const btoa = require("btoa");
const axios = require("axios");
const e = require("express");

// Sandbox services
const sandboxConfig = require("../../../sandbox/config");
const { getServices } = require("../../../sandbox/services");
const svc = getServices();

const emergepay = svc.emergepay;
const sdk = svc.emergepaySdk;

const oloOrder = require('../helpers/oloOrder')
const oloOrderMbar = require('../helpers/oloOrderMbar')
const oloOrderStreet = require('../helpers/oloOrderStreet')
const postOrder = require('../helpers/postOrder')
const postOrderStreet = require('../helpers/postOrderStreet')

const parseString = require("xml2js").parseString;

exports.tokenizedReturn = function (req, res) {
  emergepay
    .tokenizedRefundTransaction({
      uniqueTransId: req.body.uniqueTransId,
      externalTransactionId: emergepay.getExternalTransactionId(),
      amount: req.body.amount,
    })
    .then(function (response) {
      var data = response.data;
      console.log(data);
      res.send({ data });
    })
    .catch(function (error) {
      throw error;
    });
};

exports.issueVoid = function (req, res) {
  console.log("issueVoid");
  console.log(req.body.uniqueTransId);
  emergepay
    .voidTransaction({
      uniqueTransId: req.body.uniqueTransId,
      externalTransactionId: emergepay.getExternalTransactionId(),
    })
    .then(function (response) {
      var transactionResponse = response.data;
      console.log(transactionResponse);
      res.send({ transactionResponse });
    })
    .catch(function (error) {
      throw error;
    });
};

exports.lookUpOrderConfirmationCode = async (req, res) => {
  try {
    Order.findOne(
      { "orderInfo.confirmation_code": req.body.orderInfo.confirmation_code },
      (err, confirmationCode) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (confirmationCode === null) {
            addOrderConfirmed(req);
            res
              .status(200)
              .json({ confirmationCode: req.body.orderInfo.confirmation_code });
          } else {
            console.log("this confirmation already exists");
          }
        }
      }
    );
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

let addOrderConfirmed = async (req) => {
  console.log("add order confirmed");
  try {
    let uniqueTrans = "";
    if (req.body.orderInfo.uniqueTransId) {
      uniqueTrans = req.body.payInfo.uniqueTransId;
    } else {
      uniqueTrans = "giftcard";
    }

    let externalTrans = "";
    if (req.body.orderInfo.externalTransId) {
      externalTrans = req.body.payInfo.externalTransactionId;
    } else {
      externalTrans = "giftcard";
    }

    const order = new Order({
      email: req.body.orderInfo.fulfillment_info.customer.email,
      payInfo: req.body.payInfo,
      orderInfo: req.body.orderInfo,
      void: false,
      uniqueTransId: uniqueTrans,
      upserveId: req.body.orderInfo.id,
      status: "Open",
      orderPosted: false,
      orderAccepted: false,
      shippingOrder:
        req.body.orderInfo.fulfillment_info.type === "delivery" ? true : false,
      shipped: false,
      shippingInfo: { order: "empty" },
      acceptanceEmailSent: false,
      readyEmailSent: false,
    });

    await order.save();
  } catch (err) {
    console.log("error");
  }
};

exports.retrieveOrders = async (req, res) => {
  console.log(req.params.email);
  try {
    const user = await Order.findByOrderEmail(req.params.email);
    res.status(201).json({ user });
  } catch (err) {}
};

exports.allOrders = async (req, res) => {
  try {
    const user = await Order.find();
    res.status(201).json({ user });
  } catch (err) {}
};

exports.acceptingOrdersBoolean = async (req, res) => {
  // In sandbox mode, always return success
  if (sandboxConfig.isSandbox) {
    console.log("[SANDBOX] acceptingOrdersBoolean for", req.params.restaurant);
    res.send({ result: "success", accepting: true });
    return;
  }

  if (req.params.restaurant === "MamnoonStreet") {
    let reqBody = {
      timeStamp: Date.now(),
      tipSelected: 0,
      currentAmountToAddCustom: 0,
      sms: false,
      restaurant: "Mamnoon Street",
      billing: {
        billing_name: "test nadi mama",
        billing_address: "116 30th Ave S 1",
        billing_postal_code: "98122",
      },
      id: "test_" + Date.now(),
      preorder: false,
      scheduled_time: null,
      time_placed: new Date().toISOString(),
      confirmation_code: "test-" + Math.random().toString(36).substr(2, 11),
      charges: { total: 0, preTotal: 0, fees: 0, taxes: 0, tip: { amountOptions: [0, 0, 0, 0, 0], amount: 0, payment_type: "Nadi Mama" }, items: [] },
      fulfillment_info: {
        type: "pickup",
        estimated_fulfillment_time: new Date().toISOString(),
        customer: { email: "info@mamnoonrestaurant.com", phone: "3914429308", first_name: "test" },
        instructions: "",
        no_tableware: false,
        delivery_info: { is_managed_delivery: false, address: { city: "seattle", state: "WA", zip_code: "98144", address_line1: "1745 12th Avenue South", address_line2: "#2" } },
      },
      payments: { payments: [{ payment_type: "Nadi Mama", amount: 0 }] },
    };

    axios
      .post("https://hq.breadcrumb.com/ws/v1/orders", reqBody, {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
          "X-Breadcrumb-Password": "TJzwaP8uguyy",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      })
      .then(function (response) {
        res.send(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  if (req.params.restaurant === "Mamnoon") {
    let reqBody = {
      timeStamp: Date.now(),
      tipSelected: 0,
      currentAmountToAddCustom: 0,
      sms: false,
      restaurant: "Mamnoon",
      billing: {
        billing_name: "test nadi mama",
        billing_address: "116 30th Ave N 1",
        billing_postal_code: "98122",
      },
      id: "test_" + Date.now(),
      preorder: false,
      scheduled_time: null,
      time_placed: new Date().toISOString(),
      confirmation_code: "test-" + Math.random().toString(36).substr(2, 11),
      charges: { total: 0, preTotal: 0, fees: 0, taxes: 0, tip: { amountOptions: [0, 18, 22, 25, 0], amount: 0, payment_type: "Nadi Mama" }, items: [] },
      fulfillment_info: {
        type: "pickup",
        estimated_fulfillment_time: new Date().toISOString(),
        customer: { email: "info@mamnoonrestaurant.com", phone: "3914429308", first_name: "test" },
        instructions: "",
        no_tableware: false,
        delivery_info: { is_managed_delivery: false, address: { city: "seattle", state: "WA", zip_code: "98144", address_line1: "1745 12th Avenue South", address_line2: "#2" } },
      },
      payments: { payments: [{ payment_type: "Nadi Mama", amount: 0 }] },
    };

    axios
      .post("https://hq.breadcrumb.com/ws/v1/orders", reqBody, {
        headers: {
          "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
          "X-Breadcrumb-Password": "uQM8mseTvnTX",
          "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
        },
      })
      .then(function (response) {
        res.send(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};

exports.pollingRequest = function (req, res) {
  emergepay
    .retrieveTransaction(req.query.externalTransactionId)
    .then(function (response) {
      var transactionResponse = response.data;
      res.send({ transactionResponse });
    })
    .catch(function (error) {
      throw error;
    });
};

exports.startTransactionRetail = function (req, res) {
  console.log("START TRANSACTION RETAIL");

  let shipping;
  if (req.body.charges.shipping) {
    shipping = Number(req.body.charges.shipping) * 100;
  } else {
    shipping = 0;
  }

  let amount = Number(req.body.charges.total) + Number(shipping);
  let finalAmount = amount;
  let finalCash = finalAmount / 100;

  let config = {
    transactionType: sdk.TransactionType.CreditSale,
    method: "modal",
    fields: [
      { id: "base_amount", value: finalCash.toString() },
      { id: "billing_name", value: req.body.billing.billing_name },
      { id: "billing_address", value: req.body.billing.billing_address },
      { id: "billing_postal_code", value: req.body.billing.billing_postal_code },
      { id: "external_tran_id", value: emergepay.getExternalTransactionId() },
      { id: "tip_amount", value: "0" },
    ],
  };

  emergepay
    .startTransaction(config)
    .then(function (transactionToken) {
      console.log(transactionToken);
      res.send({ transactionToken: transactionToken });
    })
    .catch(function (err) {
      console.log("error");
      res.send(err.message);
    });
};

exports.startTransaction = function (req, res) {
  console.log(req.body);

  let shipping;
  if (req.body.charges.shipping) {
    shipping = Number(req.body.charges.shipping) * 100;
  } else {
    shipping = 0;
  }

  let amount = Number(req.body.charges.total) - Number(req.body.charges.tip.amount);
  let tipAmount = Number(req.body.charges.tip.amount);
  let toFixed = tipAmount / 100;
  let formattedTipAmount = toFixed.toFixed(2);
  let finalAmount = amount;
  let finalCash = finalAmount / 100;

  let config = {
    transactionType: sdk.TransactionType.CreditSale,
    method: "modal",
    fields: [
      { id: "base_amount", value: finalCash.toString() },
      { id: "billing_name", value: req.body.billing.billing_name },
      { id: "billing_address", value: req.body.billing.billing_address },
      { id: "billing_postal_code", value: req.body.billing.billing_postal_code },
      { id: "external_tran_id", value: emergepay.getExternalTransactionId() },
      { id: "tip_amount", value: formattedTipAmount.toString() },
    ],
  };

  emergepay
    .startTransaction(config)
    .then(function (transactionToken) {
      console.log(transactionToken);
      res.send({ transactionToken: transactionToken });
    })
    .catch(function (err) {
      console.log("error");
      res.send(err.message);
    });
};

exports.startAuth = function (req, res) {
  console.log("start auth");
  console.log(req.body);

  let shipping;
  if (req.body.charges.shipping) {
    shipping = Number(req.body.charges.shipping) * 100;
  } else {
    shipping = 0;
  }

  let amount = Number(req.body.charges.total) - Number(req.body.charges.tip.amount);
  let tipAmount = Number(req.body.charges.tip.amount);
  let toFixed = tipAmount / 100;
  let formattedTipAmount = toFixed.toFixed(2);
  let finalAmount = amount;
  let finalCash = finalAmount / 100;

  let config = {
    transactionType: sdk.TransactionType.CreditAuth,
    method: "modal",
    fields: [
      { id: "base_amount", value: finalCash.toString() },
      { id: "billing_name", value: req.body.billing.billing_name },
      { id: "billing_address", value: req.body.billing.billing_address },
      { id: "billing_postal_code", value: req.body.billing.billing_postal_code },
      { id: "external_tran_id", value: emergepay.getExternalTransactionId() },
      { id: "tip_amount", value: formattedTipAmount.toString() },
    ],
  };

  emergepay
    .startTransaction(config)
    .then(function (transactionToken) {
      console.log(transactionToken);
      res.send({ transactionToken: transactionToken });
    })
    .catch(function (err) {
      console.log(err);
      console.log("error");
      res.send(err.message);
    });
};

exports.voidByTransID = async (req, res) => {
  console.log("void by trans id");
  console.log(req.body.uniqueTransId);

  try {
    let filter;
    if (req.body.data === true) {
      filter = { "payInfo.data.uniqueTransId": req.body.uniqueTransId };
    } else {
      filter = { "payInfo.data.uniqueTransId": req.body.uniqueTransId };
    }
    const update = { void: true };
    let doc = await Order.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
    res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};

exports.lookUpGiftCard = async (req, res) => {
  console.log("look up giftcard");

  if (sandboxConfig.isSandbox) {
    const result = svc.giftcard.lookupGiftCard(req.body.cardNumber);
    res.status(201).json({ resSendData: result.Trans });
    return;
  }

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  today = mm + "/" + dd + "/" + yyyy;

  let currentTime = new Date().toLocaleTimeString("en-US", { hour: "numeric", hour12: true, minute: "numeric" });
  let currentTimeSliced = currentTime.replace(" ", "");

  var xmlBodyStr = `request=<?xml version="1.0"?>
      <Trans><Header><FmtType>ClientWeb</FmtType><FmtVer>1.0.0</FmtVer><Uid>A7FEDD8B-BF2C-4D63-917D-4C1130ABFE4E</Uid><Client>1047</Client><ClientCode>B5C7A5CD-CAFB-4BE7-90F5-1A5ACB29292A</ClientCode><Location>99992</Location><Server>123</Server><TransDate>${today}</TransDate><TransTime>${currentTimeSliced}</TransTime><POSSerial>12345</POSSerial></Header><Requests><SvInquiry><CardNbr>${req.body.cardNumber}</CardNbr></SvInquiry></Requests></Trans>`;

  var config = { headers: { "Content-Type": "application/x-www-form-urlencoded" } };
  axios
    .post("https://portal2.custcon.com/Partner/ProcessXml", xmlBodyStr, config)
    .then((response) => {
      let resData = response.data;
      let resSendData = null;
      parseString(resData, function (err, result) { resSendData = result["Trans"]; });
      res.status(201).json({ resSendData });
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};

exports.useGiftCard = async (req, res) => {
  console.log("use giftcard");

  if (sandboxConfig.isSandbox) {
    const result = svc.giftcard.useGiftCard(req.body.cardNumber, req.body.useAmount);
    res.status(201).json({ resSendData: result.Trans });
    return;
  }

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  today = mm + "/" + dd + "/" + yyyy;

  let currentTime = new Date().toLocaleTimeString("en-US", { hour: "numeric", hour12: true, minute: "numeric" });
  let currentTimeSliced = currentTime.replace(" ", "");
  var xmlBodyStr = `request=<?xml version="1.0"?>
        <Trans><Header><FmtType>ClientWeb</FmtType><FmtVer>1.0.0</FmtVer><Uid>A7FEDD8B-BF2C-4D63-917D-4C1130ABFE4E</Uid><Client>1047</Client><ClientCode>B5C7A5CD-CAFB-4BE7-90F5-1A5ACB29292A</ClientCode><Location>99992</Location><Server>123</Server><TransDate>${today}</TransDate><TransTime>${currentTimeSliced}</TransTime><POSSerial>12345</POSSerial></Header><Requests><SvUse><CardNbr>${req.body.cardNumber}</CardNbr><Amount>${req.body.useAmount}</Amount></SvUse></Requests></Trans>`;

  var config = { headers: { "Content-Type": "application/x-www-form-urlencoded" } };
  axios
    .post("https://portal2.custcon.com/Partner/ProcessXml", xmlBodyStr, config)
    .then((response) => {
      let resData = response.data;
      let resSendData = null;
      parseString(resData, function (err, result) { resSendData = result["Trans"]; });
      res.status(201).json({ resSendData });
    })
    .catch((err) => {
      res.status(400).json({ err: err });
    });
};

exports.updateRefundItems = async (req, res) => {
  console.log(req.body.cartId);
  try {
    let doc = await Order.findOneAndUpdate(
      { _id: req.body.orderId, "orderInfo.charges.items.cartId": req.body.cartId },
      { $set: { "orderInfo.charges.items.$.returned": true } },
      function (err, doc) {}
    );
    console.log("you just got one");
    res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};

exports.markAsShipped = async (req, res) => {
  console.log(req.body.uniqueId);
  console.log("set to shipped");
  try {
    const filter = { _id: req.body.uniqueId };
    const update = { shipped: true };
    let doc = await Order.findOneAndUpdate(filter, update, { returnOriginal: false });
    res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};

exports.startCreditSave = async (req, res) => {
  console.log('req.body');
  console.log(req.body);

  var config = {
    transactionType: sdk.TransactionType.CreditSaveCard,
    method: "modal",
    fields: [{ id: "external_tran_id", value: emergepay.getExternalTransactionId() }]
  };

  emergepay.startTransaction(config)
    .then(function (transactionToken) {
      console.log(transactionToken);
      res.send({ transactionToken: transactionToken });
    })
    .catch(function (err) {
      res.send(err.message);
    });
};

// OLO order endpoints - use sandbox mocks when in sandbox mode
exports.oloOrder = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    const resData = svc.breadcrumb.mockPostOrderResponse(req.body);
    oloOrder.postOrder(req, resData, res);
    return;
  }

  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req.body, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
        "X-Breadcrumb-Password": "uQM8mseTvnTX",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
      let resData = response.data;
      oloOrder.postOrder(req, resData, res);
    }).catch(function (error) {});
};

exports.oloOrderStreet = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    const resData = svc.breadcrumb.mockPostOrderResponse(req.body);
    oloOrderStreet.postOloOrderSteer(req, resData, res);
    return;
  }

  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req.body, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
        "X-Breadcrumb-Password": "TJzwaP8uguyy",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
      let resData = response.data;
      oloOrderStreet.postOloOrderSteer(req, resData, res);
    }).catch(function(error){ console.error(error); })
}

exports.oloOrderMbar = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    const resData = svc.breadcrumb.mockPostOrderResponse(req.body);
    oloOrderMbar.postOrder(req, resData, res);
    return;
  }

  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req.body, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mbar`,
        "X-Breadcrumb-Password": "2yEULpqH426t",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
      let resData = response.data;
      oloOrderMbar.postOrder(req, resData, res);
    }).catch(function(error){ console.error(error); })
}

exports.postOrder = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    const resData = svc.breadcrumb.mockPostOrderResponse(req);
    postOrder.postOrder(req, resData, res);
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
    .then(function (response) {
      let resData = response.data;
      postOrder.postOrder(req, resData, res);
    }).catch(function(error){ console.error(error); })
}

exports.postOrderStreet = async (req, res) => {
  if (sandboxConfig.isSandbox) {
    const resData = svc.breadcrumb.mockPostOrderResponse(req);
    postOrderStreet.postOrderStreet(req, resData, res);
    return;
  }

  axios
    .post("https://hq.breadcrumb.com/ws/v1/orders", req, {
      headers: {
        "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-street`,
        "X-Breadcrumb-Password": "TJzwaP8uguyy",
        "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
      },
    })
    .then(function (response) {
      let resData = response.data;
      postOrderStreet.postOrderStreet(req, resData, res)
    }).catch(function(error){ console.error(error); })
}
