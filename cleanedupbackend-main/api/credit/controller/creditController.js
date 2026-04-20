const Credit = require("../model/Credit");
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

exports.creditSaveMongo = async (req, res) => {
  try {
    const credit = new Credit({
      email: req.body.email,
      approvalData: req.body.approvalData,
      primary: false,
      maskedNumber: req.body.approvalData.maskedAccount,
    });

    let data = await credit.save();
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.getCreditCards = async (req, res) => {
  try {
    const credit = await Credit.findByCreditEmail(req.params.email);
    const usercreditcards = credit;
    res.status(201).json({ usercreditcards });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.checkCreditCard = async (req, res) => {
  try {
    console.log("check credit cards");
    const credit = await Credit.find(
      {
        email: req.body.email,
        maskedNumber: req.body.approvalData.maskedAccount,
      },
      function (err, user) {
        if (err) {
          res.send(err);
        }
        res.status(201).json({ user });
      }
    );
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.getCreditAuth = async (req, res) => {
  let order = req.body.currentOrder;
  let amount = Number(order.charges.total) - Number(order.charges.tip.amount);
  let tipAmount = Number(order.charges.tip.amount);
  let toFixed = tipAmount / 100;
  let formattedTipAmount = toFixed.toFixed(2);
  let finalAmount = amount;
  let finalCash = finalAmount / 100;

  var config = {
    transactionType: sdk.TransactionType.CreditAuth,
    method: "modal",
    fields: [
      { id: "base_amount", value: finalCash.toString() },
      { id: "external_tran_id", value: emergepay.getExternalTransactionId() },
      { id: "tip_amount", value: formattedTipAmount.toString() },
      { id: "billing_name", value: order.billing.billing_name },
      { id: "billing_address", value: order.billing.billing_address },
      { id: "billing_postal_code", value: order.billing.billing_postal_code },
    ],
  };
  emergepay
    .startTransaction(config)
    .then(function (transactionToken) {
      res.send({ transactionToken: transactionToken });
    })
    .catch(function (err) {
      res.send(err.message);
    });
};

exports.deleteCreditCard = async (req, res) => {
  const creditCardDelete = await Credit.findOneAndDelete(
    { _id: req.body.creditCardId },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted Card : ", docs);
      }
    }
  );
  res.status(201).json({ creditCardDelete });
};

exports.primaryCreditCardFalse = async (req, res) => {
  try {
    console.log(req.body.email);
    let doc = await Credit.updateMany(
      { email: req.body.email },
      { $set: { primary: false } },
      function (err, doc) {}
    );
    console.log("primary giftcard updated");
    res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};

exports.primaryCreditCardTrue = async (req, res) => {
  try {
    let doc = await Credit.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { primary: true } },
      function (err, doc) {}
    );
    console.log("primary giftcard updated to true id");
    res.status(201).json({ doc });
  } catch (err) {
    console.log(err);
  }
};

let primaryCreditCardTrue = async (email) => {
  try {
    let doc = await Credit.findOneAndUpdate(
      { email: email },
      { $set: { primary: true } },
      function (err, doc) {}
    );
    console.log("primary giftcard updated to true id");
  } catch (err) {
    console.log(err);
  }
};

exports.setPrimaryIfOnlyOne = async (req, res) => {
  try {
    console.log("set primary if only one");
    const credit = await Credit.findByCreditEmail(req.body.email);
    const usercreditcards = credit;
    res.status(201).json({ usercreditcards });
    if (credit.length === 1) {
      primaryCreditCardTrue(req.body.email);
    }
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.doTokenizedTransaction = async (req, res) => {
  let orderDivided = req.body.orderTotal / 100;
  let stringAmount = orderDivided.toFixed(2).toString();

  emergepay
    .tokenizedPaymentTransaction({
      uniqueTransId: req.body.transId,
      externalTransactionId: emergepay.getExternalTransactionId(),
      amount: stringAmount,
    })
    .then(function (response) {
      var data = response.data;
      res.send({ data });
      console.log(data);
    })
    .catch(function (error) {
      throw error;
    });
};
