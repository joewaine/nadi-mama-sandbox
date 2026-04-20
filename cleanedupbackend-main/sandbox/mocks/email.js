// Mock Email Transporter - logs emails to console instead of sending
// Stores sent emails in memory so they can be viewed via a sandbox API endpoint

const sentEmails = [];

const mockTransporter = {
  sendMail(mailOptions, callback) {
    const email = {
      id: "email_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      from: mailOptions.from,
      to: mailOptions.to,
      bcc: mailOptions.bcc || null,
      subject: mailOptions.subject,
      html: mailOptions.html,
      sentAt: new Date().toISOString(),
    };

    sentEmails.push(email);

    // Keep only last 50 emails in memory
    if (sentEmails.length > 50) {
      sentEmails.shift();
    }

    console.log("[SANDBOX] Email sent:");
    console.log("  To:", email.to);
    console.log("  Subject:", email.subject);
    console.log("  ---");

    if (callback) {
      callback(null, {
        messageId: email.id,
        response: "250 OK sandbox",
      });
    }
  },
};

function getSentEmails() {
  return sentEmails;
}

function clearSentEmails() {
  sentEmails.length = 0;
}

module.exports = {
  mockTransporter,
  getSentEmails,
  clearSentEmails,
};
