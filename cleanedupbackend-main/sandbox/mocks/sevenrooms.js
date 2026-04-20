// Mock SevenRooms API - returns realistic reservation data for sandbox mode

function mockReservationsResponse(date) {
  console.log("[SANDBOX] SevenRooms reservations for:", date);
  return {
    data: {
      results: [
        {
          first_name: "Sarah",
          last_name: "Johnson",
          email: "demo.sarah@example.com",
          phone_number: "+12065551234",
          date: date,
          party_size: 4,
          status: "CONFIRMED",
          shift_category: "DINNER",
          time: "7:00 PM",
          rating: 5,
          total_net_payment: 18500,
          external_user_id: "ext_1",
          notes: "Anniversary dinner - please prepare something special",
        },
        {
          first_name: "Michael",
          last_name: "Chen",
          email: "demo.michael@example.com",
          phone_number: "+12065555678",
          date: date,
          party_size: 2,
          status: "CONFIRMED",
          shift_category: "DINNER",
          time: "8:00 PM",
          rating: null,
          total_net_payment: 12000,
          external_user_id: "ext_2",
          notes: "",
        },
        {
          first_name: "Aisha",
          last_name: "Patel",
          email: "demo.aisha@example.com",
          phone_number: "+12065559999",
          date: date,
          party_size: 6,
          status: "CONFIRMED",
          shift_category: "DINNER",
          time: "6:30 PM",
          rating: 4,
          total_net_payment: 32000,
          external_user_id: "ext_3",
          notes: "Vegetarian guest, nut allergy",
        },
      ],
    },
  };
}

module.exports = {
  mockReservationsResponse,
};
