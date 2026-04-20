// Mock Gift Card API (CustCon/Portal2) - returns realistic gift card data

const mockCards = {
  "4111111111111111": { balance: 5000, status: "Active" },
  "4222222222222222": { balance: 10000, status: "Active" },
  "4333333333333333": { balance: 2500, status: "Active" },
  "2104780246650418": { balance: 7500, status: "Active" },
};

function lookupGiftCard(cardNumber) {
  const trimmed = cardNumber.trim();
  const card = mockCards[trimmed] || {
    balance: 0,
    status: "Card Not Found",
  };

  console.log(
    "[SANDBOX] Gift card lookup:",
    trimmed.slice(-4),
    "Balance: $" + (card.balance / 100).toFixed(2)
  );

  // Return XML-like parsed response matching the real API structure
  return {
    Trans: {
      Responses: [
        {
          SvInquiry: [
            {
              Balance: [String((card.balance / 100).toFixed(2))],
              Status: [card.status],
              CardNbr: [trimmed],
            },
          ],
        },
      ],
    },
  };
}

function useGiftCard(cardNumber, amount) {
  const trimmed = cardNumber.trim();
  const card = mockCards[trimmed];

  if (!card) {
    return {
      Trans: {
        Responses: [
          {
            SvUse: [
              {
                Status: ["Card Not Found"],
                Balance: ["0.00"],
              },
            ],
          },
        ],
      },
    };
  }

  const amountCents = Math.round(parseFloat(amount) * 100);
  const deducted = Math.min(amountCents, card.balance);
  card.balance -= deducted;

  console.log(
    "[SANDBOX] Gift card used:",
    trimmed.slice(-4),
    "Deducted: $" + (deducted / 100).toFixed(2),
    "Remaining: $" + (card.balance / 100).toFixed(2)
  );

  return {
    Trans: {
      Responses: [
        {
          SvUse: [
            {
              Status: ["Approved"],
              Balance: [String((card.balance / 100).toFixed(2))],
              AmountUsed: [String((deducted / 100).toFixed(2))],
            },
          ],
        },
      ],
    },
  };
}

module.exports = {
  lookupGiftCard,
  useGiftCard,
};
