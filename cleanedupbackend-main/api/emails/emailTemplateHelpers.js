const fNameAndConfirmCode = (fulfill, body) => {
  return `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>Thanks for your order!<br>name: ${fulfill.customer.first_name}<br>
  <br><span style="font-size: 20px !important;">confirmation code: <b>${body.confirmation_code}</b></span><br/><br/>Estimated pickup time is 20 minutes.</p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;">`;
};

const contactInfo = () => {
  return `</ul><br><p style="text-align: center;margin: 0 auto;width: 100%;">Thank you, Your friends at Mamnoon.<br><br><i>1508 Melrose Ave, Seattle WA 98122</i><br><a href="https://nadimama.com">nadimama.com</a><br>for questions about your order,<br>please call us at <a href="tel:+12069069606">(206) 906-9606</a></p>`;
};

const fullAddressAndName = (fulfill, body) => {
    return `<p style="text-align: center;margin: 0 auto;width: 100%;"><br>Thanks for your order!<br><br><span style="font-size: 20px !important;"><br>name: ${fulfill.customer.first_name}<br>confirmation code: <b>${body.confirmation_code}</b></span><br/><br/>We are getting your order ready to ship!<br>Your shipment will be sent to ${fulfill.delivery_info.address.address_line1}, ${fulfill.delivery_info.address.address_line2}, ${fulfill.delivery_info.address.city}, ${fulfill.delivery_info.address.state}, ${fulfill.delivery_info.address.zip_code}</p><br/><ul style="padding-left: 0 !important;margin-left:0 !important;list-style-type:none !important;">`;
  };


module.exports = { fNameAndConfirmCode, contactInfo, fullAddressAndName }