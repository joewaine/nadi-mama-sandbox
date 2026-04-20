// Mock Twilio Client - logs SMS messages to console instead of sending

const sentMessages = [];

class MockTwilioClient {
  constructor(sid, authToken) {
    this.sid = sid || "sandbox";
    this.authToken = authToken || "sandbox";
    this.messages = {
      create(opts) {
        const msg = {
          sid: "SM_sandbox_" + Date.now(),
          to: opts.to,
          from: opts.from,
          body: opts.body,
          status: "delivered",
          sentAt: new Date().toISOString(),
        };
        sentMessages.push(msg);

        // Keep only last 50 messages
        if (sentMessages.length > 50) {
          sentMessages.shift();
        }

        console.log("[SANDBOX] SMS sent:");
        console.log("  To:", msg.to);
        console.log("  Body:", msg.body);
        console.log("  ---");

        return Promise.resolve(msg);
      },
    };
  }
}

function getSentMessages() {
  return sentMessages;
}

module.exports = MockTwilioClient;
module.exports.getSentMessages = getSentMessages;
