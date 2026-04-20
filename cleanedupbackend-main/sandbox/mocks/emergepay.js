// Mock EmergePay SDK - simulates payment processing for sandbox mode
const { v4: uuidv4 } = require("uuid");

function generateTransId() {
  return (
    uuidv4().replace(/-/g, "") + "-" + uuidv4().replace(/-/g, "").slice(0, 32)
  );
}

function generateExternalTransId() {
  return uuidv4();
}

class MockEmergepaySdk {
  constructor(opts) {
    this.oid = opts.oid || "sandbox";
    this.authToken = opts.authToken || "sandbox";
    this.environmentUrl = opts.environmentUrl || "sandbox";
  }

  getExternalTransactionId() {
    return generateExternalTransId();
  }

  startTransaction(config) {
    console.log("[SANDBOX] EmergePay startTransaction:", config.transactionType);
    const token = "sandbox_txn_" + uuidv4();
    return Promise.resolve(token);
  }

  retrieveTransaction(externalTransactionId) {
    console.log(
      "[SANDBOX] EmergePay retrieveTransaction:",
      externalTransactionId
    );
    return Promise.resolve({
      data: {
        transactionStatus: "Approved",
        resultMessage: "Approved",
        resultStatus: "true",
        uniqueTransId: generateTransId(),
        externalTransactionId: externalTransactionId,
        amount: "25.00",
        approvedAmount: "25.00",
        maskedAccount: "XXXXXXXXXXXX4242",
        cardHolderName: "Demo User",
        accountExpiryDate: "12/28",
        cashierId: "",
        transactionReference: "Sandbox",
      },
    });
  }

  tokenizedPaymentTransaction(opts) {
    console.log(
      "[SANDBOX] EmergePay tokenizedPayment: $" + opts.amount,
      "transRef:",
      opts.transactionReference
    );
    return Promise.resolve({
      data: {
        resultMessage: "Approved",
        resultStatus: "true",
        uniqueTransId: opts.uniqueTransId,
        amount: opts.amount,
        approvedAmount: opts.amount,
      },
    });
  }

  tokenizedRefundTransaction(opts) {
    console.log("[SANDBOX] EmergePay tokenizedRefund: $" + opts.amount);
    return Promise.resolve({
      data: {
        resultMessage: "Approved",
        resultStatus: "true",
        uniqueTransId: opts.uniqueTransId,
        amount: opts.amount,
        transactionType: "Refund",
      },
    });
  }

  voidTransaction(opts) {
    console.log("[SANDBOX] EmergePay void:", opts.uniqueTransId);
    return Promise.resolve({
      data: {
        resultMessage: "Approved",
        resultStatus: "true",
        uniqueTransId: opts.uniqueTransId,
        transactionType: "Void",
      },
    });
  }

  forceTransaction(opts) {
    console.log("[SANDBOX] EmergePay forceTransaction: $" + opts.amount);
    return Promise.resolve({
      data: {
        resultMessage: "Approved",
        resultStatus: "true",
        uniqueTransId: opts.uniqueTransId,
        amount: opts.amount,
      },
    });
  }
}

// Mock TransactionType enum
const TransactionType = {
  CreditSale: "CreditSale",
  CreditAuth: "CreditAuth",
  CreditSaveCard: "CreditSaveCard",
  CreditReturn: "CreditReturn",
};

module.exports = {
  emergepaySdk: MockEmergepaySdk,
  TransactionType,
};
