// Sandbox Services Provider
// Returns either real or mock services depending on SANDBOX_MODE
const sandboxConfig = require("./config");

let services = null;

function getServices() {
  if (services) return services;

  if (sandboxConfig.isSandbox) {
    console.log("========================================");
    console.log("  SANDBOX MODE ENABLED");
    console.log("  All external services are mocked.");
    console.log("========================================");

    const mockEmergepay = require("./mocks/emergepay");
    const mockEmail = require("./mocks/email");
    const MockTwilio = require("./mocks/twilio");
    const createMockShippo = require("./mocks/shippo");
    const breadcrumb = require("./mocks/breadcrumb");
    const sevenrooms = require("./mocks/sevenrooms");
    const giftcard = require("./mocks/giftcard");
    const wordpress = require("./mocks/wordpress");

    const emergepay = new mockEmergepay.emergepaySdk({
      oid: "sandbox",
      authToken: "sandbox",
      environmentUrl: "sandbox",
    });

    services = {
      emergepay,
      emergepaySdk: mockEmergepay,
      transporter: mockEmail.mockTransporter,
      getSentEmails: mockEmail.getSentEmails,
      clearSentEmails: mockEmail.clearSentEmails,
      twilioClient: new MockTwilio("sandbox", "sandbox"),
      getSentSms: MockTwilio.getSentMessages,
      shippo: createMockShippo("sandbox"),
      breadcrumb,
      sevenrooms,
      giftcard,
      wordpress,
    };
  } else {
    // Real services - use actual SDKs
    const sdk = require("emergepay-sdk");
    const nodemailer = require("nodemailer");
    const twilio = require("twilio");

    const emergepay = new sdk.emergepaySdk({
      oid: sandboxConfig.emergepay.oid,
      authToken: sandboxConfig.emergepay.authToken,
      environmentUrl: sandboxConfig.emergepay.environmentUrl,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sandboxConfig.email.user,
        pass: sandboxConfig.email.pass,
      },
    });

    const twilioClient = new twilio(
      sandboxConfig.twilio.sid,
      sandboxConfig.twilio.authToken
    );

    const shippo = require("shippo")(sandboxConfig.shippo.apiKey);

    services = {
      emergepay,
      emergepaySdk: sdk,
      transporter,
      twilioClient,
      shippo,
      breadcrumb: null,
      sevenrooms: null,
      giftcard: null,
      wordpress: null,
    };
  }

  return services;
}

module.exports = { getServices };
