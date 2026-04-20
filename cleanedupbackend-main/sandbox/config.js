const isSandbox = process.env.SANDBOX_MODE === "true";

const config = {
  isSandbox,
  mongodb: {
    uri: isSandbox
      ? process.env.MONGODB_URI || "mongodb://localhost:27017/nadi_sandbox"
      : process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
  },
  emergepay: {
    oid: process.env.EMERGEPAY_OID || "1535166774",
    authToken: process.env.EMERGEPAY_AUTH_TOKEN || "",
    environmentUrl:
      process.env.EMERGEPAY_URL ||
      "https://api.emergepay.chargeitpro.com/virtualterminal/v1",
  },
  breadcrumb: {
    apiKey: process.env.BREADCRUMB_API_KEY || "",
    mamnoon: {
      username: process.env.BREADCRUMB_MAMNOON_USER || "",
      password: process.env.BREADCRUMB_MAMNOON_PASS || "",
    },
    street: {
      username: process.env.BREADCRUMB_STREET_USER || "",
      password: process.env.BREADCRUMB_STREET_PASS || "",
    },
    mbar: {
      username: process.env.BREADCRUMB_MBAR_USER || "",
      password: process.env.BREADCRUMB_MBAR_PASS || "",
    },
    olo: {
      mamnoon: {
        username: process.env.BREADCRUMB_OLO_MAMNOON_USER || "",
        password: process.env.BREADCRUMB_OLO_MAMNOON_PASS || "",
      },
      street: {
        username: process.env.BREADCRUMB_OLO_STREET_USER || "",
        password: process.env.BREADCRUMB_OLO_STREET_PASS || "",
      },
      mbar: {
        username: process.env.BREADCRUMB_OLO_MBAR_USER || "",
        password: process.env.BREADCRUMB_OLO_MBAR_PASS || "",
      },
    },
  },
  twilio: {
    sid: process.env.TWILIO_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    fromNumber: process.env.TWILIO_FROM_NUMBER || "+12062087871",
  },
  email: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
  shippo: {
    apiKey: process.env.SHIPPO_API_KEY || "",
  },
  sevenrooms: {
    token: process.env.SEVENROOMS_TOKEN || "",
    venueGroupId: process.env.SEVENROOMS_VENUE_GROUP_ID || "",
    venueId: process.env.SEVENROOMS_VENUE_ID || "",
  },
};

module.exports = config;
