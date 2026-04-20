// Sandbox Debug Routes - view sent emails, SMS, and control sandbox state
const express = require("express");
const router = express.Router();
const { getServices } = require("./services");

// GET /sandbox/emails - view all emails sent in sandbox mode
router.get("/emails", (req, res) => {
  const svc = getServices();
  if (svc.getSentEmails) {
    res.json({ emails: svc.getSentEmails() });
  } else {
    res.json({ error: "Not in sandbox mode" });
  }
});

// DELETE /sandbox/emails - clear email log
router.delete("/emails", (req, res) => {
  const svc = getServices();
  if (svc.clearSentEmails) {
    svc.clearSentEmails();
    res.json({ cleared: true });
  } else {
    res.json({ error: "Not in sandbox mode" });
  }
});

// GET /sandbox/sms - view all SMS sent in sandbox mode
router.get("/sms", (req, res) => {
  const svc = getServices();
  if (svc.getSentSms) {
    res.json({ messages: svc.getSentSms() });
  } else {
    res.json({ error: "Not in sandbox mode" });
  }
});

// GET /sandbox/status - check sandbox status
router.get("/status", (req, res) => {
  const sandboxConfig = require("./config");
  res.json({
    sandbox: sandboxConfig.isSandbox,
    services: {
      payments: sandboxConfig.isSandbox ? "mocked" : "live",
      email: sandboxConfig.isSandbox ? "mocked (logged)" : "live",
      sms: sandboxConfig.isSandbox ? "mocked (logged)" : "live",
      pos: sandboxConfig.isSandbox ? "mocked" : "live",
      shipping: sandboxConfig.isSandbox ? "mocked" : "live",
      reservations: sandboxConfig.isSandbox ? "mocked" : "live",
    },
  });
});

// GET /sandbox/wp/restaurant - mock WordPress ACF endpoint
router.get("/wp/restaurant", (req, res) => {
  const svc = getServices();
  if (svc.wordpress) {
    res.json(svc.wordpress.mockRestaurantPage());
  } else {
    res.status(404).json({ error: "Not in sandbox mode" });
  }
});

// GET /sandbox/wp/virtual_restaurant - mock WordPress ACF endpoint
router.get("/wp/virtual_restaurant", (req, res) => {
  const svc = getServices();
  if (svc.wordpress) {
    res.json(svc.wordpress.mockVirtualRestaurantPage());
  } else {
    res.status(404).json({ error: "Not in sandbox mode" });
  }
});

module.exports = router;
