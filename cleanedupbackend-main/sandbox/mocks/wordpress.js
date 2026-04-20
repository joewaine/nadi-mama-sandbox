// Mock WordPress ACF API - returns CMS content for sandbox mode

function mockRestaurantPage() {
  return {
    acf: {
      restaurants: [
        {
          name: "Mamnoon",
          tagline: "Eastern Mediterranean Kitchen",
          description:
            "Mamnoon brings the vibrant flavors of the Eastern Mediterranean to Seattle's Capitol Hill neighborhood. Our menu celebrates the rich culinary traditions of Lebanon, Syria, Turkey, and beyond.",
          address: "1508 Melrose Ave, Seattle, WA 98122",
          phone: "(206) 906-9606",
          hours: "Tue-Sun 5pm-10pm",
          image: "https://picsum.photos/seed/mamnoon/800/500",
          logo: "https://picsum.photos/seed/mamnoon-logo/200/200",
          accepting_orders: true,
          footer: {
            text: "Nadi Mama Restaurant Group",
            instagram: "https://instagram.com/mamnoonrestaurant",
            newsletter_text: "Join our mailing list for updates and specials",
          },
        },
        {
          name: "Mamnoon Street",
          tagline: "Fast-Casual Mediterranean",
          description:
            "Quick, delicious Mediterranean street food in the heart of Belltown. Wraps, bowls, and all your favorites made fresh daily.",
          address: "2020 6th Ave, Seattle, WA 98121",
          phone: "(206) 327-9121",
          hours: "Mon-Sat 11am-9pm",
          image: "https://picsum.photos/seed/street/800/500",
          logo: "https://picsum.photos/seed/street-logo/200/200",
          accepting_orders: true,
        },
        {
          name: "Mbar",
          tagline: "Rooftop Dining & Cocktails",
          description:
            "An elevated dining experience atop South Lake Union. Fine Mediterranean cuisine with craft cocktails and panoramic city views.",
          address: "400 Fairview Ave N 14th Floor, Seattle, WA 98109",
          phone: "(206) 457-8287",
          hours: "Wed-Sun 5pm-11pm",
          image: "https://picsum.photos/seed/mbar/800/500",
          logo: "https://picsum.photos/seed/mbar-logo/200/200",
          accepting_orders: true,
        },
      ],
    },
  };
}

function mockVirtualRestaurantPage() {
  return mockRestaurantPage();
}

module.exports = {
  mockRestaurantPage,
  mockVirtualRestaurantPage,
};
