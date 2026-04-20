const compression = require("compression");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(compression());

app.use(cors({ credentials: true, origin: true }));
app.options("*", cors());
var DomParser = require("dom-parser");
var parser = new DomParser();

const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const btoa = require("btoa");
const cron = require("node-cron");
require("dotenv").config();
const axios = require("axios");
const parseString = require("xml2js").parseString;
const qs = require("qs");
const mongoose = require("mongoose");
const moment = require("moment");
const tz = require("moment-timezone");
var convert = require("xml-js");

// Sandbox services
const sandboxConfig = require("./sandbox/config");
const { getServices } = require("./sandbox/services");
const svc = getServices();

const Order = require("./api/order/model/Order");
const Package = require("./api/package/model/Package");
const Reservation = require("./api/reservation/model/Reservation");

const pstOrdr = require("./api/order/helpers/postOrder");
const pstOrdrStr = require("./api/order/helpers/postOrderStreet");
const m = require("./mongoOrderHelpers");

// Use sandbox or real transporter/twilio
const transporter = svc.transporter;
const client = svc.twilioClient;

const PNF = require("google-libphonenumber").PhoneNumberFormat;
const phoneUtil =
  require("google-libphonenumber").PhoneNumberUtil.getInstance();

let feedbackParagraph = `<br><div style="background-color:#f05d5b;font-family: helvetica;padding: 10px;"> <h1 style="text-align: center;font-size: 1.3rem;margin-bottom: 0 !important;color: #ffffff;">How was your experience?</h1><table border="0" cellpadding="0" cellspacing="0" width="300" id="templateColumns" style="margin: 0 auto !important;"> <tr> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%98%A1"> &#x1F621; </a> </td> </tr> </table> </td> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent">  <a style="font-size: 40px;text-decoration: none;text-align:center;" style="font-size: 40px;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%99%81">  &#x1F641; </a> </td> </tr> </table> </td> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%98%90"> &#x1F610; </a> </td> </tr> </table> </td> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent" tdalign="center"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%99%82"> &#x1F60A; </a> </td> </tr> </table> </td> <td align="center" valign="top" width="20%" class="templateColumnContainer"> <table border="0" cellpadding="10" cellspacing="0" width="100%"> <tr> <td style="text-align:center;" class="leftColumnContent"> <a style="font-size: 40px;text-decoration: none;text-align:center;" href="https://docs.google.com/forms/d/e/1FAIpQLSe6OZh0ajeB9AmAeaFFYE-2HlvtD7-_iVbvuvIbyu4Vg6TvTA/viewform?usp=pp_url&entry.393006136=%F0%9F%98%8D"> &#x1F60D; </a> </td> </tr> </table> </td> </tr> </table> </div>`;

// Use sandbox or real EmergePay
const emergepay = svc.emergepay;

// Use sandbox or real Shippo
let shippo = svc.shippo;

const { createProxyMiddleware } = require("http-proxy-middleware");

// Configure database
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(sandboxConfig.mongodb.uri, { useNewUrlParser: true })
  .then(() => {
    console.log("Database connected:", sandboxConfig.isSandbox ? "LOCAL SANDBOX" : "PRODUCTION");
  })
  .catch((err) => {
    console.log("Database connection error:", err.message);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send(JSON.stringify({ Hello: "dont give up on me", sandbox: sandboxConfig.isSandbox }));
});

const userRoutes = require("./api/user/route/user");
app.use("/user", userRoutes);

const productRoutes = require("./api/product/route/product");
app.use("/product", productRoutes);

const orderRoutes = require("./api/order/route/order");
app.use("/order", orderRoutes);

const creditRoutes = require("./api/credit/route/credit");
app.use("/credit", creditRoutes);

const e = require("express");

const packageRoutes = require("./api/package/route/package");
app.use("/package", packageRoutes);

const reservationRoutes = require("./api/reservation/route/reservation");
app.use("/reservation", reservationRoutes);

// Sandbox debug routes
if (sandboxConfig.isSandbox) {
  const sandboxRoutes = require("./sandbox/routes");
  app.use("/sandbox", sandboxRoutes);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});


app.post("/sendbugstate", function (req, res) {
  console.log(req.body);
  var mailOptions = {
    from: "orders@mamnoonrestaurant.com",
    to: "joe.waine@gmail.com",
    subject: `new bug`,
    html: JSON.stringify(req.body),
  };
  const sendMailBug = function (mailOptions2, transporter) {
    return new Promise(function (resolve, reject) {
      transporter.sendMail(mailOptions2, function (error, info) {
        if (error) {
          reject(error);
        } else {
          res.send("email sent");
          console.log("email sent");
          resolve(info);
        }
      });
    });
  };
  sendMailBug(mailOptions, transporter);
});



// ####################################################################################################
// ############# EMAIL FUNCTIONS BELOW ################################################################
// ####################################################################################################



const sendMailBasic = function (mailOptions2, transporter) {
  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions2, function (error, info) {
      if (error) {
        console.log('email not sent')
        reject(error);
      } else {
        console.log('email sent')
        resolve(info);
      }
    });
  });
};



app.post("/confirmationemail", function (req, res) {
  res.send(req.body);

  let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">`;

  if (req.body.fulfillment_info.type === "delivery") {
    htmlBody = htmlBody + `Your Order Has Been Scheduled!</h1></div>`;
  } else {
    htmlBody = htmlBody + `Your Order Has Been Scheduled!</h1></div>`;
  }

  htmlBody =
    htmlBody +
    `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>Thanks for your order!<br>name: ${
      req.body.fulfillment_info.customer.first_name
    }<br>
        <br><span style="font-size: 20px !important;">confirmation code: <b>${
          req.body.confirmation_code
        }</b></span><br/><br/>It will be ready on ${moment(
      String(req.body.scheduled_time)
    )
      .tz("America/Los_Angeles")
      .format("llll")
      .replace(
        ", 2020",
        ", at"
      )}</p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;"">`;
  for (let i = 0; i < req.body.charges.items.length; i++) {
    htmlBody =
      htmlBody +
      '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
      JSON.stringify(req.body.charges.items[i].name) +
      "&nbsp;<b>$" +
      JSON.stringify(req.body.charges.items[i].price) / 100 +
      "</b>&nbsp;x&nbsp;" +
      JSON.stringify(req.body.charges.items[i].quantity) +
      "</li>";
  }

  let addressToInsert = "";

  if (req.body.restaurant === "Mamnoon Street") {
    addressToInsert = "2020 6th Ave, Seattle, WA 98121";
    phoneNumber =
      '<br>for questions about your order,<br>please call us at <a href="tel:+12063279121">(206) 327-9121</a>';
  }

  if (req.body.restaurant === "Mamnoon") {
    addressToInsert = "1508 Melrose Ave, Seattle, WA 98122";
    phoneNumber =
      '<br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a>';
  }

  if (req.body.restaurant === "Mbar") {
    addressToInsert = "400 Fairview Ave N 14th Floor, Seattle, WA 98109";
    phoneNumber =
      '<br>for questions about your order,<br>please call us at <a href="tel:+12064578287">(206) 457-8287</a>';
  }

  htmlBody =
    htmlBody +
    `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at ${req.body.restaurant}<br><br><i>${addressToInsert}</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

  htmlBody = htmlBody + feedbackParagraph;
  var mailOptions = {
    from: "orders@mamnoonrestaurant.com",
    to: req.body.fulfillment_info.customer.email,
    bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
    subject: `Your Order Has Been Scheduled! We will notify you when your food is being prepared.`,
    html: htmlBody,
  };
  sendMailBasic(mailOptions, transporter);

  try {
    const number = phoneUtil.parseAndKeepRawInput(
      req.body.fulfillment_info.customer.phone,
      "US"
    );
    let smsNumber = phoneUtil.format(number, PNF.E164);
    if (req.body.sms === true) {
      client.messages.create({
        to: smsNumber,
        from: "+12062087871",
        body: `Your Order Has Been Scheduled! it will be ready on ${moment(
          String(req.body.scheduled_time)
        )
          .tz("America/Los_Angeles")
          .format("llll")
          .replace(", 2020", ", at")}`,
      });
    }
  } catch (err) {
    console.log("[SANDBOX] Phone parse skipped:", err.message);
  }
});


// ####################################################################################################


async function sendAcceptanceEmail(upserveId) {
  try {
    let doc = await Order.find({
      upserveId: upserveId,
      acceptanceEmailSent: false,
    });

    if (!doc || doc.length === 0) return;

    let htmlBody = `<div style="background-color: #000099;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">`;

    if (doc[0].orderInfo.fulfillment_info.type === "delivery") {
      htmlBody = htmlBody + `Your Order Has Been Accepted.</h1></div>`;
    } else {
      htmlBody = htmlBody + `Your Order Has Been Accepted.</h1></div>`;
    }

    htmlBody =
      htmlBody +
      `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>Your ticket has been opened and your food is being prepared.<br>name: ${doc[0].orderInfo.fulfillment_info.customer.first_name}<br>
    <br><span style="font-size: 20px !important;">confirmation code: <b>${doc[0].orderInfo.confirmation_code}</b></span><br/><br/></p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;"">`;
    for (let i = 0; i < doc[0].orderInfo.charges.items.length; i++) {
      htmlBody =
        htmlBody +
        '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
        JSON.stringify(doc[0].orderInfo.charges.items[i].name) +
        "&nbsp;<b>$" +
        JSON.stringify(doc[0].orderInfo.charges.items[i].price) / 100 +
        "</b>&nbsp;x&nbsp;" +
        JSON.stringify(doc[0].orderInfo.charges.items[i].quantity) +
        "</li>";
    }

    let addressToInsert = "";
    let phoneNumber = "";
    if (doc[0].orderInfo.restaurant === "Mamnoon Street") {
      addressToInsert = "2020 6th Ave, Seattle, WA 98121";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12063279121">(206) 327-9121</a>';
    }

    if (doc[0].orderInfo.restaurant === "Mamnoon") {
      addressToInsert = "1508 Melrose Ave, Seattle, WA 98122";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a>';
    }

    htmlBody =
      htmlBody +
      `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at ${doc[0].orderInfo.restaurant}<br><br><i>${addressToInsert}</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

    htmlBody = htmlBody + feedbackParagraph;

    var mailOptions = {
      from: "orders@mamnoonrestaurant.com",
      to: doc[0].orderInfo.fulfillment_info.customer.email,
      bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
      subject: `Your order has been accepted.`,
      html: htmlBody,
    };

    const sendMail = function (mailOptions2, transporter) {
      return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions2, function (error, info) {
          if (error) {
            reject(error);
          } else {
            m.acceptanceEmailSentTrue(upserveId);
            resolve(info);
          }
        });
      });
    };

    sendMail(mailOptions, transporter);

    try {
      const number = phoneUtil.parseAndKeepRawInput(
        doc[0].orderInfo.fulfillment_info.customer.phone,
        "US"
      );
      let smsNumber = phoneUtil.format(number, PNF.E164);
      if (doc[0].orderInfo.sms === true) {
        client.messages.create({
          to: smsNumber,
          from: "+12062087871",
          body: `Your order has been accepted and is now being prepared.`,
        });
      }
    } catch (err) {
      console.log("[SANDBOX] Phone parse skipped:", err.message);
    }
  } catch (err) {
      console.log(err)
  }
}


// ####################################################################################################


async function sendUnableToProcessEmail(upserveId) {
  try {
    let doc = await Order.find({
      upserveId: upserveId,
      acceptanceEmailSent: false,
    });

    if (!doc || doc.length === 0) return;

    let htmlBody = `<div style="background-color: #000099;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">`;

    htmlBody =
      htmlBody +
      `We were unable to process your payment. Please check your payment method and try placing your order again.</h1></div>`;

    htmlBody =
      htmlBody +
      `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>We were unable to process your payment.<br>name: ${doc[0].orderInfo.fulfillment_info.customer.first_name}<br>
      <br><span style="font-size: 20px !important;">confirmation code: <b>${doc[0].orderInfo.confirmation_code}</b></span><br/><br/></p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;"">`;
    for (let i = 0; i < doc[0].orderInfo.charges.items.length; i++) {
      htmlBody =
        htmlBody +
        '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
        JSON.stringify(doc[0].orderInfo.charges.items[i].name) +
        "&nbsp;<b>$" +
        JSON.stringify(doc[0].orderInfo.charges.items[i].price) / 100 +
        "</b>&nbsp;x&nbsp;" +
        JSON.stringify(doc[0].orderInfo.charges.items[i].quantity) +
        "</li>";
    }

    let addressToInsert = "";
    let phoneNumber = "";
    if (doc[0].orderInfo.restaurant === "Mamnoon Street") {
      addressToInsert = "2020 6th Ave, Seattle, WA 98121";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12063279121">(206) 327-9121</a>';
    }

    if (doc[0].orderInfo.restaurant === "Mamnoon") {
      addressToInsert = "1508 Melrose Ave, Seattle, WA 98122";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a>';
    }

    htmlBody =
      htmlBody +
      `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at ${doc[0].orderInfo.restaurant}<br><br><i>${addressToInsert}</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

    htmlBody = htmlBody + feedbackParagraph;

    var mailOptions = {
      from: "orders@mamnoonrestaurant.com",
      to: doc[0].orderInfo.fulfillment_info.customer.email,
      bcc: "joe@mamnoonrestaurant.com",
      subject: `We were unable to process your payment.`,
      html: htmlBody,
    };
    const sendMail = function (mailOptions2, transporter) {
      return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions2, function (error, info) {
          if (error) {
            reject(error);
          } else {
            m.acceptanceEmailSentTrue(upserveId);
            resolve(info);
          }
        });
      });
    };

    sendMail(mailOptions, transporter);

    try {
      const number = phoneUtil.parseAndKeepRawInput(
        doc[0].orderInfo.fulfillment_info.customer.phone,
        "US"
      );
      let smsNumber = phoneUtil.format(number, PNF.E164);
      if (doc[0].orderInfo.sms === true) {
        client.messages.create({
          to: smsNumber,
          from: "+12062087871",
          body: `Your order has been accepted and is now being prepared.`,
        });
      }
    } catch (err) {
      console.log("[SANDBOX] Phone parse skipped:", err.message);
    }
  } catch (err) {}
}


// ####################################################################################################


async function sendReadyEmail(upserveId) {
  try {
    let doc = await Order.find({ upserveId: upserveId });

    if (!doc || doc.length === 0) return;

    let htmlBody = `<div style="background-color: #009900;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">`;

    htmlBody =
      htmlBody +
      `Your ${doc[0].orderInfo.restaurant} Order Is Ready!</h1></div>`;

    htmlBody =
      htmlBody +
      `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>Thanks for your order!<br>customer name: ${doc[0].orderInfo.fulfillment_info.customer.first_name}<br>
    <br><span style="font-size: 20px !important;">confirmation code: <b>${doc[0].orderInfo.confirmation_code}</b></span><br/><br/></p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;"">`;
    for (let i = 0; i < doc[0].orderInfo.charges.items.length; i++) {
      htmlBody =
        htmlBody +
        '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
        JSON.stringify(doc[0].orderInfo.charges.items[i].name) +
        "&nbsp;<b>$" +
        JSON.stringify(doc[0].orderInfo.charges.items[i].price) / 100 +
        "</b>&nbsp;x&nbsp;" +
        JSON.stringify(doc[0].orderInfo.charges.items[i].quantity) +
        "</li>";
    }

    let addressToInsert = "";
    let phoneNumber = "";

    if (doc[0].orderInfo.restaurant === "Mamnoon Street") {
      addressToInsert = "2020 6th Ave, Seattle, WA 98121";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12063279121">(206) 327-9121</a>';
    }

    if (doc[0].orderInfo.restaurant === "Mamnoon") {
      addressToInsert = "1508 Melrose Ave, Seattle, WA 98122";
      phoneNumber =
        '<br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a>';
    }

    htmlBody =
      htmlBody +
      `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at ${doc[0].orderInfo.restaurant}<br><br><i>${addressToInsert}</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

    htmlBody = htmlBody + feedbackParagraph;

    var mailOptions = {
      from: "orders@mamnoonrestaurant.com",
      to: doc[0].orderInfo.fulfillment_info.customer.email,
      bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
      subject: `Your ${doc[0].orderInfo.restaurant} Order Is Ready!`,
      html: htmlBody,
    };
    const sendMail = function (mailOptions2, transporter) {
      return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions2, function (error, info) {
          if (error) {
            reject(error);
          } else {
            m.readyEmailSentTrue(upserveId);
            m.updateToStatusClosed(upserveId);
            resolve(info);
          }
        });
      });
    };

    sendMail(mailOptions, transporter);

    try {
      const number = phoneUtil.parseAndKeepRawInput(
        doc[0].orderInfo.fulfillment_info.customer.phone,
        "US"
      );
      let smsNumber = phoneUtil.format(number, PNF.E164);
      if (doc[0].orderInfo.sms === true) {
        client.messages.create({
          to: smsNumber,
          from: "+12062087871",
          body: `Your ${doc[0].orderInfo.restaurant} Pickup Order Is Ready!`,
        });
      }
    } catch (err) {
      console.log("[SANDBOX] Phone parse skipped:", err.message);
    }
  } catch (err) {}
}


// ######################################################################################################################################################
// ############## END EMAIL FUNCTIONS ###################################################################################################################
// ######################################################################################################################################################



async function updateToStatusAccepted(idToAccept) {
  try {
    const doc = await Order.updateOne(
      { upserveId: idToAccept, orderAccepted: false },
      { $set: { orderAccepted: true } },
      { multi: true },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          if(idToAccept){
            sendAcceptanceEmail(idToAccept);
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function queryAndCloseOrders(closedOrders) {
  console.log('query AND CLOSE orders')
  try {
    let docs = await Order.find({
      upserveId: { $in: closedOrders },
      status: "Open",
      readyEmailSent: false,
    });

    if(docs.length > 0){
      for (let i = 0; i < docs.length; i++) {
        sendReadyEmail(docs[i].upserveId);
        doTokenizedTransaction(docs[i].payInfo.uniqueTransId,docs[i].orderInfo.charges.total,docs[i]);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function doTokenizedTransaction(transId, amountProcessed, docs) {
  console.log("do tokenized transaction");

  let orderDivided = amountProcessed / 100;
  let stringAmount = orderDivided.toFixed(2).toString();
  emergepay
    .tokenizedPaymentTransaction({
      uniqueTransId: transId,
      externalTransactionId: emergepay.getExternalTransactionId(),
      amount: stringAmount,
      transactionReference: docs.orderInfo.restaurant + " Upserve",
    })
    .then(function (response) {
      var data = response.data;

      if (data.resultMessage === "Approved") {
        console.log("tokenized transaction successful.");
      } else {
        console.log("tokenized transaction NOT successful.");
        sendUnableToProcessEmail(docs.upserveId);
      }
    })
    .catch(function (error) {
      console.log("not found");
    });
}

async function queryOrdersToAccept(ordersToAccept) {
  for (var acceptee in ordersToAccept) {
    Order.findOne(
      {
        upserveId: ordersToAccept[acceptee],
        status: "Open",
        orderAccepted: false,
      },
      (err, order) => {
        if (err) {
          console.log(err);
        } else {
          if (order !== null) {
            console.log("here is an unaccepted order:");
            attemptToRunChargeAndAccept(order);
          }
        }
      }
    );
  }
}



// ####################################################################################################
// ############# STATUS FUNCTIONS BELOW ###############################################################
// ####################################################################################################



async function checkCheckStatus() {
  if (sandboxConfig.isSandbox) {
    // In sandbox mode, use mock breadcrumb data
    const body = svc.breadcrumb.mockChecksResponse("mamnoon");
    const closedOnlineOrders = body.objects
      .filter(x => x.online_order && x.online_order.source === "Generic Online Ordering")
      .filter(x => x.status === "Closed")
      .map(x => x.online_order.id);

    if (closedOnlineOrders.length > 0) {
      queryAndCloseOrders(closedOnlineOrders);
    }
    return;
  }

  let order = moment().tz("America/Los_Angeles").format("YYYYMMDD");

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/checks.json?date=${order}`,
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

      let closedOnlineOrders = body.objects
        .filter(function (x) { return x.hasOwnProperty("online_order"); })
        .filter(function (x) { return x.online_order.source === "Generic Online Ordering"; })
        .filter(function (x) { return x.status === "Closed"; })
        .map(function (x) { return x.online_order.id; });

      let notAcceptedOrders = body.objects
        .filter(function (x) { return x.hasOwnProperty("online_order"); })
        .filter(function (x) { return x.online_order.source === "Generic Online Ordering"; })
        .filter(function (x) { return !x.hasOwnProperty("employee_name"); })
        .filter(function (x) { return !x.hasOwnProperty("employee_role_name"); })
        .filter(function (x) { return !x.hasOwnProperty("employee_id"); })
        .filter(function (x) { return x.status === "Open"; })
        .map(function (x) { return x.online_order.id; });

      queryAndCloseOrders(closedOnlineOrders);
    }
  } catch (err) {
    console.log(err);
  }
}

// ####################################################################################################

async function checkCheckStatusStreet() {
  if (sandboxConfig.isSandbox) {
    const body = svc.breadcrumb.mockChecksResponse("mamnoonstreet");
    const closedOnlineOrders = body.objects
      .filter(x => x.online_order && x.online_order.source === "Generic Online Ordering")
      .filter(x => x.status === "Closed")
      .map(x => x.online_order.id);
    const notAcceptedOrders = body.objects
      .filter(x => x.online_order && x.online_order.source === "Generic Online Ordering")
      .filter(x => !x.employee_name && x.status === "Open")
      .map(x => x.online_order.id);

    if (closedOnlineOrders.length > 0) queryAndCloseOrders(closedOnlineOrders);
    if (notAcceptedOrders.length > 0) queryOrdersToAccept(notAcceptedOrders);
    return;
  }

  let order = moment().tz("America/Los_Angeles").format("YYYYMMDD");
  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/checks.json?date=${order}`,
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
      let closedOnlineOrders = body.objects
        .filter(function (x) { return x.hasOwnProperty("online_order"); })
        .filter(function (x) { return x.online_order.source === "Generic Online Ordering"; })
        .filter(function (x) { return x.status === "Closed"; })
        .map(function (x) { return x.online_order.id; });

      let notAcceptedOrders = body.objects
        .filter(function (x) { return x.hasOwnProperty("online_order"); })
        .filter(function (x) { return x.online_order.source === "Generic Online Ordering"; })
        .filter(function (x) { return !x.hasOwnProperty("employee_name"); })
        .filter(function (x) { return !x.hasOwnProperty("employee_role_name"); })
        .filter(function (x) { return !x.hasOwnProperty("employee_id"); })
        .filter(function (x) { return x.status === "Open"; })
        .map(function (x) { return x.online_order.id; });

      queryAndCloseOrders(closedOnlineOrders);
      queryOrdersToAccept(notAcceptedOrders);
    }
  } catch (err) {
     console.log(err)
    }
}

// ####################################################################################################

async function checkCheckStatusMbar(date, reservationsList) {
  if (sandboxConfig.isSandbox) {
    // Return mock matched data
    return [];
  }

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/checks.json?date=${date}`,
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

      let creditCards = body.objects
        .map(function (x) { return x.payments; })
        .filter((x) => x !== undefined)
        .flat()
        .map(function (x) {
          var n;
          if (x.cc_name !== null) {
            let j = x.cc_name;
            n = j.split(" ");
            return { upserve: n[n.length - 1].toLowerCase() };
          }
        })
        .filter((x) => x !== undefined);

      let emparr = [];
      for (let i in body.objects) {
        for (let j in body.objects[i].payments) {
          let upserveInfo = body.objects[i].payments[j];
          upserveInfo.items = body.objects[i].items;
          emparr.push({
            upserveInfo,
            items: body.objects[i].items.map(function (x) { return x.name; }),
          });
        }
      }
      let builtArr = [];
      for (let i in reservationsList) {
        for (let j in emparr) {
          if (emparr[j].upserveInfo.cc_name !== null) {
            let n = emparr[j].upserveInfo.cc_name.split(" ");
            if (n[n.length - 1].toLowerCase() === reservationsList[i].sevenrooms) {
              builtArr.push({
                email: reservationsList[i].roomsinfo.allInfo.email,
                date: reservationsList[i].roomsinfo.allInfo.date,
                reservationsList: reservationsList[i],
                upserveInfo: emparr[j],
              });
            }
          }
        }
      }
      return builtArr;
    }
  } catch (err) {
    console.log(err);
  }
}



// ####################################################################################################
// ############# ORDER FUNCTIONS BELOW ################################################################
// ####################################################################################################


async function placeScheduledOrders() {
  try {
    let docs = await Order.find({
      "orderInfo.preorder": true,
      orderPosted: false,
    });
    let outcome = docs.map(function (x) {
      return {
        id: x.orderInfo.id,
        preorder: x.orderInfo.preorder,
        scheduled_time: x.orderInfo.scheduled_time,
      };
    });

    for (let i = 0; i < outcome.length; i++) {
      let date = new Date(outcome[i].scheduled_time);
      let milliseconds = date.getTime();
      let arrival = milliseconds - Date.now() - 2700000;

      if (arrival < 0) {
        if (docs[i].orderPosted === false) {
          if (docs[i].orderInfo.restaurant === "Mamnoon") {
            pstOrdr.postOrder(docs[i].orderInfo);
          } else {
            pstOrdrStr.postStreetOrder(docs[i].orderInfo);
          }
        }
      }
    }
  } catch (err) {
      console.log(err)
  }
}


async function lookUpScheduledOrders() {
  try {
    let docs = await Order.find({
      "orderInfo.preorder": true,
      orderPosted: false,
    });

    let outcome = docs.map(function (x) {
      return {
        id: x.orderInfo.id,
        preorder: x.orderInfo.preorder,
        scheduled_time: x.orderInfo.scheduled_time,
      };
    });
    if (outcome.length > 0) {
      console.log('scheduled orders:', outcome.length);
    }
  } catch (err) {
      console.log(err)
  }
}


// Cron: poll every 10 seconds (in sandbox, polls mock data)
cron.schedule("*/10 * * * * *", () => {
  checkCheckStatus();
  checkCheckStatusStreet();
  placeScheduledOrders();
  lookUpScheduledOrders();
});



// ####################################################################################################
// ############# END ORDERS FUNCTIONS #################################################################
// ####################################################################################################

let reservations;

async function sevenRoomsMbar(date) {
  if (sandboxConfig.isSandbox) {
    const body = svc.sevenrooms.mockReservationsResponse(date);
    reservations = body.data.results
      .map(function (x) {
        if (x.last_name !== null) {
          return {
            sevenrooms: x.last_name.toLowerCase(),
            roomsinfo: { phone: x.phone_number, last: x.last_name, allInfo: x },
          };
        }
      })
      .filter((x) => x !== undefined);
    checkCheckStatusMbar(date, reservations);
    return;
  }

  try {
    let request = await fetch(
      `https://api.sevenrooms.com/2_4/reservations/export?venue_group_id=ahNzfnNldmVucm9vbXMtc2VjdXJlciELEhRuaWdodGxvb3BfVmVudWVHcm91cBiAgPC5uamvCAw&limit=400&from_date=${date}&to_date=${date}&venue_id=ahNzfnNldmVucm9vbXMtc2VjdXJlchwLEg9uaWdodGxvb3BfVmVudWUYgIDwuezGlwoM`,
      {
        headers: {
          Authorization: process.env.SEVENROOMS_TOKEN || "",
        },
      }
    );
    if (request.ok) {
      let body = await request.json();
      reservations = body.data.results
        .map(function (x) {
          if (x.last_name !== null) {
            return {
              sevenrooms: x.last_name.toLowerCase(),
              roomsinfo: { phone: x.phone_number, last: x.last_name, allInfo: x },
            };
          }
        })
        .filter((x) => x !== undefined);
      checkCheckStatusMbar(date, reservations);
    }
  } catch (err) {
      console.log(err)
  }
}

app.get("/part2", async function (req, res) {
  if (sandboxConfig.isSandbox) {
    res.send([]);
    return;
  }

  let date = req.body.date;
  let reservationsList = req.body.reservations;

  try {
    let request = await fetch(
      `https://api.breadcrumb.com/ws/v2/checks.json?date=${date}`,
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
      let emparr = [];
      for (let i in body.objects) {
        for (let j in body.objects[i].payments) {
          let upserveInfo = body.objects[i].payments[j];
          upserveInfo.items = body.objects[i].items;
          emparr.push({
            upserveInfo,
            items: body.objects[i].items.map(function (x) { return x.name; }),
          });
        }
      }
      let builtArr = [];
      for (let i in reservationsList) {
        for (let j in emparr) {
          if (emparr[j].upserveInfo.cc_name !== null) {
            let n = emparr[j].upserveInfo.cc_name.split(" ");
            if (n[n.length - 1].toLowerCase() === reservationsList[i].sevenrooms) {
              builtArr.push({
                email: reservationsList[i].roomsinfo.allInfo.email,
                date: reservationsList[i].roomsinfo.allInfo.date,
                reservationsList: reservationsList[i],
                upserveInfo: emparr[j],
              });
            }
          }
        }
      }
      res.send(builtArr);
    }
  } catch (err) {
    console.log(err);
  }
});

async function mamnoonItemsPullMenu() {
  if (sandboxConfig.isSandbox) return; // Menu comes from seed data in sandbox

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
    }
  } catch (err) {
    console.log("error");
  }
}
mamnoonItemsPullMenu();
