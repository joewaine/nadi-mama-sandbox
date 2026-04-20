// Mock Shippo - returns realistic shipping data for sandbox mode

function createMockShippo(apiKey) {
  return {
    shipment: {
      create(shipmentData, callback) {
        console.log("[SANDBOX] Shippo shipment created");
        const rates = [
          {
            object_id: "rate_sandbox_priority",
            amount: "12.50",
            currency: "USD",
            provider: "USPS",
            servicelevel: { name: "Priority Mail", token: "usps_priority" },
            estimated_days: 3,
            duration_terms: "Delivery in 1 to 3 business days.",
          },
          {
            object_id: "rate_sandbox_express",
            amount: "24.99",
            currency: "USD",
            provider: "USPS",
            servicelevel: {
              name: "Priority Mail Express",
              token: "usps_priority_express",
            },
            estimated_days: 1,
            duration_terms: "Overnight delivery.",
          },
          {
            object_id: "rate_sandbox_ground",
            amount: "7.99",
            currency: "USD",
            provider: "USPS",
            servicelevel: {
              name: "Parcel Select",
              token: "usps_parcel_select",
            },
            estimated_days: 7,
            duration_terms: "Delivery in 2 to 8 business days.",
          },
        ];

        const result = {
          object_id: "shipment_sandbox_" + Date.now(),
          status: "SUCCESS",
          address_from: shipmentData.address_from,
          address_to: shipmentData.address_to,
          parcels: shipmentData.parcels,
          rates: rates,
        };

        if (callback) {
          callback(null, result);
        }
        return Promise.resolve(result);
      },
    },
    transaction: {
      create(transactionData, callback) {
        console.log("[SANDBOX] Shippo label created");
        const result = {
          object_id: "txn_sandbox_" + Date.now(),
          status: "SUCCESS",
          tracking_number: "SANDBOX" + Math.floor(Math.random() * 9000000 + 1000000),
          tracking_url_provider:
            "https://tools.usps.com/go/TrackConfirmAction?tLabels=SANDBOX0000000",
          label_url: "https://placekitten.com/400/600",
          rate: {
            amount: "12.50",
            currency: "USD",
            provider: "USPS",
          },
        };

        if (callback) {
          callback(null, result);
        }
        return Promise.resolve(result);
      },
    },
  };
}

module.exports = createMockShippo;
