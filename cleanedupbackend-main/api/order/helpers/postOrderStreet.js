const phoneUtil =
  require("google-libphonenumber").PhoneNumberUtil.getInstance();
const emailTemplateHelpers = require("../../emails/emailTemplateHelpers");
const PNF = require("google-libphonenumber").PhoneNumberFormat;
const m = require('../../../mongoOrderHelpers');

// Use sandbox services
const { getServices } = require('../../../sandbox/services');
const svc = getServices();

const postStreetOrder = (req) => {
    const transporter = svc.transporter;

    const sendMailBasic = function (mailOptions2, transporter) {
        return new Promise(function (resolve, reject) {
          transporter.sendMail(mailOptions2, function (error, info) {
            if (error) {
              console.log("email not sent");
              reject(error);
            } else {
              console.log("email sent");
              resolve(info);
            }
          });
        });
      };

        let htmlBody = `<div style="background-color: #f05d5b;padding: 20px 0 15px;text-align: center;"><h1 style="color: #fff367 !important;font-size: 1.5rem;text-align: center;">`;

        if (req.fulfillment_info.type === "delivery") {
          htmlBody =
            htmlBody +
            `Your Scheduled Mamnoon Street Order Has Been Placed!</h1></div>`;
        } else {
          htmlBody =
            htmlBody +
            `Your Scheduled Mamnoon Street Pickup Order Has Been Placed!</h1></div>`;
        }

        htmlBody =
          htmlBody + emailTemplateHelpers.fNameAndConfirmCode(req.fulfillment_info, req)
        for (let i = 0; i < req.charges.items.length; i++) {
          htmlBody =
            htmlBody +
            '<li style="padding-left: 0 !important;margin-left:0 !important;text-align: center;width: 100%;list-style-type:none !important;">' +
            JSON.stringify(req.charges.items[i].name) +
            "&nbsp;<b>$" +
            JSON.stringify(req.charges.items[i].price) / 100 +
            "</b>&nbsp;x&nbsp;" +
            JSON.stringify(req.charges.items[i].quantity) +
            "</li>";
        }

        let addressToInsert = "";
        let phoneNumber = "";
        if (req.restaurant === "Mamnoon Street") {
          addressToInsert = "2020 6th Ave, Seattle, WA 98121";
          phoneNumber =
            '<br>for questions about your order,<br>please call us at <a href="tel:+12063279121">(206) 327-9121</a>';
        }

        if (req.restaurant === "Mamnoon") {
          addressToInsert = "1508 Melrose Ave, Seattle, WA 98122";
          phoneNumber =
            '<br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a>';
        }

        htmlBody =
          htmlBody +
          `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at Mamnoon Street.<br><br><i>${addressToInsert}</i><br><a href="https://nadimama.com">nadimama.com</a>${phoneNumber}</p>`;

        var mailOptions = {
          from: "orders@mamnoonrestaurant.com",
          to: req.fulfillment_info.customer.email,
          bcc: "jen@mamnoonrestaurant.com, joe@mamnoonrestaurant.com",
          subject: `Your Mamnoon Street Pickup Order Has Been Received! We will notify you when your food is being prepared.`,
          html: htmlBody,
        };

        sendMailBasic(mailOptions, transporter);

        try {
          const number = phoneUtil.parseAndKeepRawInput(
            req.fulfillment_info.customer.phone,
            "US"
          );
          let smsNumber = phoneUtil.format(number, PNF.E164);

          if (req.sms === true) {
            svc.twilioClient.messages.create({
              to: smsNumber,
              from: "+12062087871",
              body: "Your Mamnoon Street Pickup Order Has Been Placed!",
            });
          }
        } catch (err) {
          console.log("[SANDBOX] Phone parse skipped:", err.message);
        }
        m.orderPostedTrue(req.id);
}

module.exports = { postStreetOrder }
