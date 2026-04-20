
// Sandbox services
const sandboxConfig = require("./sandbox/config");
const { getServices } = require("./sandbox/services");
const svc = getServices();
const transporter = svc.transporter;
let shippo = svc.shippo;

////////////// start real function ////////////


// app.post("/oloorderretail", function (req, res) {
//   console.log("oloorder retail");
//   axios
//     .post("https://hq.breadcrumb.com/ws/v1/orders", req.body, {
//       headers: {
//         "X-Breadcrumb-Username": `generic-online-ordering_mamnoon-llc`,
//         "X-Breadcrumb-Password": "uQM8mseTvnTX",
//         "X-Breadcrumb-API-Key": `e2ebc4d1af04b3e5e213085be842acaa`,
//       },
//     })
//     .then(function (response) {
//       let resData = response.data;
//       // console.log(response)
//       if (resData.result === "success") {
//         res.send(req.body);

//         if (req.body.fulfillment_info.delivery_info.address.zip_code === "") {
//           console.log("no zipcode, so its pickup");

//           let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">`;

//           if (req.body.fulfillment_info.type === "delivery") {
//             htmlBody =
//               htmlBody + `Your Retail Order Has Been Received!</h1></div>`;
//           } else {
//             htmlBody =
//               htmlBody + `Your Retail Order Has Been Received!</h1></div>`;
//           }

//           htmlBody = htmlBody + fNameAndConfirmCode(req.body.fulfillment_info, req.body);
//           for (let i = 0; i < req.body.charges.items.length; i++) {
//             htmlBody =
//               htmlBody +
//               '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
//               JSON.stringify(req.body.charges.items[i].name) +
//               "&nbsp;<b>$" +
//               JSON.stringify(req.body.charges.items[i].price) / 100 +
//               "</b>&nbsp;x&nbsp;" +
//               JSON.stringify(req.body.charges.items[i].quantity) +
//               "</li>";
//           }

//           htmlBody = htmlBody + contactInfo;
//           htmlBody = htmlBody + feedbackParagraph;
//           var mailOptions = {
//             from: "orders@mamnoonrestaurant.com",
//             to: req.body.fulfillment_info.customer.email,
//             bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
//             subject: `Your Mamnoon Retail Order Has Been Placed! We will notify you when the order is being prepared.`,
//             html: htmlBody,
//           };



//           const sendMail = function (mailOptions2, transporter) {
//             console.log();
//             return new Promise(function (resolve, reject) {
//               transporter.sendMail(mailOptions2, function (error, info) {
//                 if (error) {
//                   reject(error);
//                 } else {
//                   console.log("email sent");
//                   resolve(info);
//                 }
//               });
//             });
//           };

//           sendMail(mailOptions, transporter);

//           const number = phoneUtil.parseAndKeepRawInput(
//             req.body.fulfillment_info.customer.phone,
//             "US"
//           );
//           let smsNumber = phoneUtil.format(number, PNF.E164);

//           // Send the text message.
//           if (req.body.sms === true) {
//             client.messages.create({
//               to: smsNumber,
//               from: "+12062087871",
//               body: "Your Mamnoon Retail Order Has Been Placed! We will notify you when the order is being prepared. Thank You.",
//             });
//           }
//         } else {
//           let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">`;

//           if (req.body.fulfillment_info.type === "delivery") {
//             htmlBody =
//               htmlBody + `Your Retail Order Has Been Received!</h1></div>`;
//           } else {
//             htmlBody =
//               htmlBody + `Your Retail Order Has Been Received!</h1></div>`;
//           }

//           htmlBody =
//             htmlBody + fullAddressAndName(req.body.fulfillment_info, req.body);
//           for (let i = 0; i < req.body.charges.items.length; i++) {
//             htmlBody =
//               htmlBody +
//               '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
//               JSON.stringify(req.body.charges.items[i].name) +
//               "&nbsp;<b>$" +
//               JSON.stringify(req.body.charges.items[i].price) / 100 +
//               "</b>&nbsp;x&nbsp;" +
//               JSON.stringify(req.body.charges.items[i].quantity) +
//               "</li>";
//           }

//           htmlBody = htmlBody + contactInfo;

//           htmlBody = htmlBody + feedbackParagraph;
//           var mailOptions = {
//             from: "orders@mamnoonrestaurant.com",
//             to: req.body.fulfillment_info.customer.email,
//             bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
//             // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
//             subject: `Your Mamnoon Retail Order Has Been Placed! We will notify you when the order is being prepared.`,
//             html: htmlBody,
//           };



//           const sendMail = function (mailOptions2, transporter) {
//             console.log();
//             return new Promise(function (resolve, reject) {
//               transporter.sendMail(mailOptions2, function (error, info) {
//                 if (error) {
//                   reject(error);
//                 } else {
//                   console.log("email sent");
//                   resolve(info);
//                 }
//               });
//             });
//           };

//           sendMail(mailOptions, transporter);

//           const number = phoneUtil.parseAndKeepRawInput(
//             req.body.fulfillment_info.customer.phone,
//             "US"
//           );
//           let smsNumber = phoneUtil.format(number, PNF.E164);

//           // Send the text message.
//           if (req.body.sms === true) {
//             client.messages.create({
//               to: smsNumber,
//               from: "+12062087871",
//               body: "Your Mamnoon Retail Order Has Been Placed! Thank You.",
//             });
//           }

//           shippoSend(req);
//         }
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });
/////////////// end real function ///////////////



////////////// testing function for sending mail /////////////////
app.post("/oloorderretail", function (req, res) {
    console.log("oloorder retail");
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
        // console.log(response)
        if (resData.result === "success") {
          res.send(req.body);
  
          if (req.body.fulfillment_info.delivery_info.address.zip_code === "") {
            console.log("no zipcode, so its pickup");
  
            let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">`;
  
            if (req.body.fulfillment_info.type === "delivery") {
              htmlBody =
                htmlBody + `Your Retail Order Has Been Received!</h1></div>`;
            } else {
              htmlBody =
                htmlBody + `Your Retail Order Has Been Received!</h1></div>`;
            }
  
            htmlBody = htmlBody + fNameAndConfirmCode(req.body.fulfillment_info, req.body);
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
  
            htmlBody = htmlBody + contactInfo;
            htmlBody = htmlBody + feedbackParagraph;
            var mailOptions = {
              from: "orders@mamnoonrestaurant.com",
              to: req.body.fulfillment_info.customer.email,
              bcc: "joe@mamnoonrestaurant.com",
              subject: `Your Mamnoon Retail Order Has Been Placed! We will notify you when the order is being prepared.`,
              html: htmlBody,
            };
  
     
  
            const sendMail = function (mailOptions2, transporter) {
              console.log();
              return new Promise(function (resolve, reject) {
                transporter.sendMail(mailOptions2, function (error, info) {
                  if (error) {
                    reject(error);
                  } else {
                    console.log("email sent");
                    resolve(info);
                  }
                });
              });
            };
  
            sendMail(mailOptions, transporter);
  
            const number = phoneUtil.parseAndKeepRawInput(
              req.body.fulfillment_info.customer.phone,
              "US"
            );
            let smsNumber = phoneUtil.format(number, PNF.E164);
  
            // Send the text message.
            if (req.body.sms === true) {
              client.messages.create({
                to: smsNumber,
                from: "+12062087871",
                body: "Your Mamnoon Retail Order Has Been Placed! We will notify you when the order is being prepared. Thank You.",
              });
            }
          } else {
            let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">`;
  
            if (req.body.fulfillment_info.type === "delivery") {
              htmlBody =
                htmlBody + `Your Retail Order Has Been Received!</h1></div>`;
            } else {
              htmlBody =
                htmlBody + `Your Retail Order Has Been Received!</h1></div>`;
            }
  
            htmlBody =
              htmlBody + fullAddressAndName(req.body.fulfillment_info, req.body);
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
  
            htmlBody = htmlBody + contactInfo;
  
            htmlBody = htmlBody + feedbackParagraph;
            var mailOptions = {
              from: "orders@mamnoonrestaurant.com",
              to: req.body.fulfillment_info.customer.email,
              bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
              // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
              subject: `Your Mamnoon Retail Order Has Been Placed! We will notify you when the order is being prepared.`,
              html: htmlBody,
            };
  
  
  
            const sendMail = function (mailOptions2, transporter) {
              console.log();
              return new Promise(function (resolve, reject) {
                transporter.sendMail(mailOptions2, function (error, info) {
                  if (error) {
                    reject(error);
                  } else {
                    console.log("email sent");
                    resolve(info);
                  }
                });
              });
            };
  
            sendMail(mailOptions, transporter);
  
            const number = phoneUtil.parseAndKeepRawInput(
              req.body.fulfillment_info.customer.phone,
              "US"
            );
            let smsNumber = phoneUtil.format(number, PNF.E164);
  
            // Send the text message.
            if (req.body.sms === true) {
              client.messages.create({
                to: smsNumber,
                from: "+12062087871",
                body: "Your Mamnoon Retail Order Has Been Placed! Thank You.",
              });
            }
  
            shippoSend(req);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
  
  ////////////// end testing function ////////////




// module.exports = { add }




async function shippoSend(req) {
    // console.log(JSON.parse(req.query.orderInfo).fulfillment_info.delivery_info.address))
  
    var addressFrom = {
      name: "Nadi mama",
      street1: "1508 Melrose Ave",
      city: "Seattle",
      state: "WA",
      zip: "98122",
      country: "US",
    };
  
    var addressTo = {
      name: req.body.fulfillment_info.customer.first_name,
      street1: req.body.fulfillment_info.delivery_info.address.address_line1,
      city: req.body.fulfillment_info.delivery_info.address.city,
      state: req.body.fulfillment_info.delivery_info.address.state,
      zip: req.body.fulfillment_info.delivery_info.address.zip_code,
      country: "US",
    };
  
    let ounces = req.body.fulfillment_info.weight.oz;
    let convertedToPounds = ounces / 16;
  
    let totalItems = req.body.fulfillment_info.weight.lbs + convertedToPounds;
  
    var parcel = {
      length: "5",
      width: "5",
      height: "5",
      distance_unit: "in",
      weight: totalItems,
      mass_unit: "lb",
    };
  
    var shipment = {
      address_from: addressFrom,
      address_to: addressTo,
      parcels: [parcel],
    };
  
    // console.log(shipment)
  
    let htmlBody2 = `<div style="background-color: #ffffff;padding: 20px 0 15px;text-align: center;"><h1 style="color: #000000 !important;font-size: 1.5rem;text-align: center;">`;
  
    htmlBody2 = htmlBody2 + `RETAIL ORDER RECEIVED</h1></div>`;
  
    htmlBody2 =
      htmlBody2 +
      `<p style="text-align: center;margin: 0 auto;width: 100%;"><span style="font-size: 20px !important;">confirmation code: <b>${req.body.confirmation_code}</b></span><br/><br/>${req.body.fulfillment_info.delivery_info.address.address_line1}, ${req.body.fulfillment_info.delivery_info.address.address_line2}, ${req.body.fulfillment_info.delivery_info.address.city}, ${req.body.fulfillment_info.delivery_info.address.state}, ${req.body.fulfillment_info.delivery_info.address.zip_code}</p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;"">`;
    for (let i = 0; i < req.body.charges.items.length; i++) {
      htmlBody2 =
        htmlBody2 +
        '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
        JSON.stringify(req.body.charges.items[i].name) +
        "&nbsp;<b>$" +
        JSON.stringify(req.body.charges.items[i].price) / 100 +
        "</b>&nbsp;x&nbsp;" +
        JSON.stringify(req.body.charges.items[i].quantity) +
        "</li>";
    }
  
    htmlBody2 = htmlBody2 + "</ul>";
  
    let transactionEmail = "";
    shippo.transaction.create(
      {
        shipment: shipment,
        carrier_account: "decbd7bf0e6e471b9184f2fe29a4076f",
        servicelevel_token: "usps_priority",
      },
      function (err, transaction) {
        // asynchronously called
        //  return transaction
  
        // console.log('log transaction')
        // console.log(transaction)
        //  htmlBody2 = htmlBody2 + transaction
        addShippingInfoToOrder(req.body.id, transaction);
  
        let transactionEmail = `tracking number: ${JSON.stringify(
          transaction.tracking_number
        )}<br>tracking information: ${JSON.stringify(
          transaction.tracking_url_provider
        )}<br>label: ${JSON.stringify(transaction.label_url)} <br>`;
  
        var mailOptions4 = {
          from: "orders@mamnoonrestaurant.com",
          to: "joe@mamnoonrestaurant.com",
          // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
          subject: `label info.`,
          html: transactionEmail,
        };
  
        //  transporter.sendMail(mailOptions4, function(error, info){
        //    if (error) {
        //      console.log(error);
        //    } else {
        //      console.log('Email sent: ' + info.response);
        //    }
        //  });
  
        const sendMail = function (mailOptions2, transporter) {
          console.log();
          return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions2, function (error, info) {
              if (error) {
                reject(error);
              } else {
                console.log("email sent");
                resolve(info);
              }
            });
          });
        };
  
        sendMail(mailOptions4, transporter);
  
        transactionEmail =
          transactionEmail +
          `tracking number: ${JSON.stringify(
            transaction.tracking_number
          )}<br>tracking information: ${JSON.stringify(
            transaction.tracking_url_provider
          )}<br>label: ${JSON.stringify(transaction.label_url)} <br>`;
      }
    );
  
    var mailOptions2 = {
      from: "orders@mamnoonrestaurant.com",
      to: "joe@mamnoonrestaurant.com",
      // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
      subject: `Retail Order Received SHIPPING REQUIRED`,
      html: transactionEmail,
    };
  
    const sendMail2 = function (mailOptions2, transporter) {
      console.log();
      return new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions2, function (error, info) {
          if (error) {
            reject(error);
          } else {
            console.log("email sent");
            resolve(info);
          }
        });
      });
    };
  
    sendMail2(mailOptions2, transporter);
  }





  async function retrieveCreatedLabel() {
    var addressFrom = {
      name: "sof elm",
      company: "Mamnoon",
      street1: "1508 Melrose Ave",
      city: "Seattle",
      state: "WA",
      zip: "98112",
      country: "US",
      phone: "+1 425 442 9989",
      email: "sofien@mamnoonrestaurant.com",
    };
  
    var addressTo = {
      name: "joe waine",
      company: "",
      street1: "116 30th Ave",
      street2: "",
      city: "Seattle",
      state: "WA",
      zip: "98144",
      country: "US",
      phone: "+1 425 442 9308",
      email: "joe@mamnoonrestaurant.com",
      metadata: "Hippos dont lie",
    };
  
    var parcel = {
      length: "5",
      width: "5",
      height: "5",
      distance_unit: "in",
      weight: "2",
      mass_unit: "lb",
    };
  
    var shipment = {
      address_from: addressFrom,
      address_to: addressTo,
      parcels: [parcel],
    };
  
    shippo.transaction.create(
      {
        shipment: shipment,
        carrier_account: "decbd7bf0e6e471b9184f2fe29a4076f",
        servicelevel_token: "usps_priority",
      },
      function (err, transaction) {
        // asynchronously called
        //  console.log(transaction)
  
        let transactionEmail = `tracking number: ${JSON.stringify(
          transaction.tracking_number
        )}<br>tracking information: ${JSON.stringify(
          transaction.tracking_url_provider
        )}<br>label: ${JSON.stringify(transaction.label_url)} <br>`;
  
        var mailOptions4 = {
          from: "orders@mamnoonrestaurant.com",
          to: "joe@mamnoonrestaurant.com",
          // to: 'wassef@mamnoonrestaurant.com, sofien@mamnoonrestaurant.com, joe.waine@gmail.com',
          subject: `label info.`,
          html: transactionEmail,
        };
  
        // transporter.sendMail(mailOptions4, function(error, info){
        //   if (error) {
        //     console.log(error);
        //   } else {
        //     console.log('Email sent: ' + info.response);
        //   }
        // });
  
        const sendMail = function (mailOptions2, transporter) {
          console.log();
          return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions2, function (error, info) {
              if (error) {
                reject(error);
              } else {
                console.log("email sent");
                resolve(info);
              }
            });
          });
        };
  
        sendMail(mailOptions4, transporter);
      }
    );
  }
  
  // retrieveCreatedLabel()


  async function addShippingInfoToOrder(req, shippingInfoJSON) {
    // console.log(req)
    // console.log(shippingInfoJSON)
  
    try {
      await Order.updateOne(
        { upserveId: req },
        { $set: { shippingInfo: shippingInfoJSON } },
        { multi: true }
      );
    } catch (err) {
      // console.log(err)
    }
  }


  app.get(`/shippingcalculation`, async function (req, res) {
    var addressFrom = {
      name: "Nadi mama",
      street1: "1508 Melrose Ave",
      city: "Seattle",
      state: "WA",
      zip: "98122",
      country: "US",
    };
  
    var addressTo = {
      name: JSON.parse(req.query.orderInfo).fulfillment_info.customer.first_name,
      street1: JSON.parse(req.query.orderInfo).fulfillment_info.delivery_info
        .address.address_line1,
      city: JSON.parse(req.query.orderInfo).fulfillment_info.delivery_info.address
        .city,
      state: JSON.parse(req.query.orderInfo).fulfillment_info.delivery_info
        .address.state,
      //  "zip": "98112",
      zip: JSON.parse(req.query.orderInfo).fulfillment_info.delivery_info.address
        .zip_code,
      country: "US",
    };
  
    JSON.parse(req.query.Pounds);
    let ounces = JSON.parse(req.query.Ounces);
    let convertedToPounds = ounces / 16;
  
    let totalItems = JSON.parse(req.query.Pounds) + convertedToPounds;
  
    var parcel = {
      length: "8.75",
      width: "11.25",
      height: "6",
      distance_unit: "in",
      weight: Number(totalItems).toFixed(2),
      // "weight": 2.125,
      mass_unit: "lb",
    };
  
    // console.log(addressFrom)
    // console.log(addressTo)
    // console.log(parcel)
  
    shippo.shipment.create(
      {
        address_from: addressFrom,
        address_to: addressTo,
        parcels: [parcel],
        async: false,
      },
      function (err, shipment) {
        // console.log(shipment)
        res.send(JSON.stringify(shipment));
      }
    );
  });
  
  async function viewUnacceptedOrders() {
    console.log('unndac')
    Order.find({ status: "Open", orderAccepted: false }, (err, orders) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (orders !== null) {
          console.log('11')
          console.log(orders.upserveId);
          console.log('33')
          // updateToStatusAccepted(orders.upserveId)
        }
      }
    });
  }