export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  tags?: string[]
}

export interface MenuSection {
  name: string
  description?: string
  item_ids: string[]
}

export interface Menu {
  items: MenuItem[]
  sections: MenuSection[]
}

const mamnoon: Menu = {
  items: [
    { id: 'mn-hummus', name: 'Hummus Beiruti', description: 'Stone-ground chickpea, tahini, lemon, parsley, aleppo chili oil.', price: 1400, tags: ['vegetarian'] },
    { id: 'mn-muhammara', name: 'Muhammara', description: 'Roasted red pepper & walnut dip, pomegranate molasses, warm pita.', price: 1500, tags: ['vegetarian'] },
    { id: 'mn-babaganoush', name: 'Baba Ghanoush', description: 'Smoked eggplant, tahini, garlic, olive oil, charred scallion.', price: 1500, tags: ['vegetarian'] },
    { id: 'mn-labneh', name: "Labneh & Za'atar", description: 'Strained yogurt, wild thyme, olive oil, sea salt, house-baked pita.', price: 1300, tags: ['vegetarian'] },
    { id: 'mn-olives', name: 'Marinated Olives & Pickles', description: 'Castelvetrano, Beldi, house-pickled turnips and baby cucumbers.', price: 900, tags: ['vegan'] },
    { id: 'mn-fattoush', name: 'Fattoush', description: 'Little gem, sumac, toasted pita, pomegranate, sumac vinaigrette.', price: 1600, tags: ['vegetarian'] },
    { id: 'mn-manakish', name: "Manakish Za'atar", description: 'Wood-fired flatbread, wild thyme, sesame, Aleppo chili, labneh.', price: 1400, tags: ['vegetarian'] },
    { id: 'mn-lahmbiajeen', name: 'Lahm bil Ajeen', description: 'Open-faced lamb flatbread, pine nuts, tomato, pomegranate.', price: 1800 },
    { id: 'mn-shorba', name: 'Lentil Shorba', description: 'Slow-simmered red lentil soup, cumin, crispy shallot, lemon.', price: 1200, tags: ['vegan'] },
    { id: 'mn-kefta', name: 'Lamb Kefta Kebab', description: 'Hand-ground lamb, parsley, onion, allspice, grilled over binchōtan.', price: 3400 },
    { id: 'mn-tawook', name: 'Chicken Shish Tawook', description: 'Garlic-yogurt-marinated chicken, charred peppers, toum.', price: 3100 },
    { id: 'mn-octopus', name: 'Grilled Octopus', description: 'Slow-braised Mediterranean octopus, fava purée, muhammara oil.', price: 3800, tags: ['gluten-free'] },
    { id: 'mn-mujadara', name: 'Mujadara', description: 'Caramelized onion, lentils, basmati, cucumber yogurt.', price: 2200, tags: ['vegan'] },
    { id: 'mn-knafeh', name: 'Rose Knafeh', description: 'Shredded filo, sweet cheese, orange blossom syrup, crushed pistachio.', price: 1400, tags: ['vegetarian'] },
    { id: 'mn-baklava', name: 'Baklava Platter', description: 'Assorted hand-rolled baklava: walnut, pistachio, cashew.', price: 1600, tags: ['vegetarian'] },
  ],
  sections: [
    { name: 'Mezze', description: 'Shareable dips and market plates to begin.', item_ids: ['mn-hummus', 'mn-muhammara', 'mn-babaganoush', 'mn-labneh', 'mn-olives', 'mn-fattoush'] },
    { name: 'From the Hearth', description: 'Wood-fired flatbreads and soups.', item_ids: ['mn-manakish', 'mn-lahmbiajeen', 'mn-shorba'] },
    { name: 'Mains', description: 'Binchōtan grill and heritage preparations.', item_ids: ['mn-kefta', 'mn-tawook', 'mn-octopus', 'mn-mujadara'] },
    { name: 'Desserts', description: 'Sweet finishes, traditionally rendered.', item_ids: ['mn-knafeh', 'mn-baklava'] },
  ],
}

const mamnoonstreet: Menu = {
  items: [
    { id: 'ms-bowl-shawarma', name: 'Chicken Shawarma Bowl', description: 'Saffron rice, shawarma chicken, pickled cabbage, toum, garlic crema.', price: 1800 },
    { id: 'ms-bowl-falafel', name: 'Falafel Power Bowl', description: 'Herbed falafel, tabouleh, beet hummus, tahini, pickled turnip.', price: 1700, tags: ['vegetarian'] },
    { id: 'ms-bowl-kafta', name: 'Kafta Beef Bowl', description: 'Grilled beef kafta, sumac onion, freekeh, yogurt, aleppo drizzle.', price: 1900 },
    { id: 'ms-wrap-chicken', name: 'Chicken Shawarma Wrap', description: 'Saj flatbread, shawarma chicken, garlic toum, pickled cucumber.', price: 1400 },
    { id: 'ms-wrap-falafel', name: 'Falafel Wrap', description: 'Crisp falafel, tahini, tomato, parsley, pickled turnip, in saj.', price: 1300, tags: ['vegetarian'] },
    { id: 'ms-wrap-kefta', name: 'Beef Kefta Wrap', description: 'Grilled kefta, sumac onion, harissa yogurt, herbs, saj.', price: 1500 },
    { id: 'ms-hummus', name: 'Hummus & Pita', description: 'Warm hummus, olive oil, Aleppo, house saj.', price: 900, tags: ['vegetarian'] },
    { id: 'ms-tabouleh', name: 'Tabouleh', description: 'Parsley, bulgur, tomato, mint, lemon, olive oil.', price: 1000, tags: ['vegan'] },
    { id: 'ms-fattoush', name: 'Fattoush Side', description: 'Little gem, cucumber, tomato, crispy pita, sumac vinaigrette.', price: 1000, tags: ['vegan'] },
    { id: 'ms-zaatarfries', name: "Za'atar Fries", description: 'Crispy fries tossed in wild thyme, sumac, sea salt, lemon aioli.', price: 800, tags: ['vegetarian'] },
    { id: 'ms-rose-knafeh', name: 'Rose Knafeh Cup', description: 'Grab-and-go knafeh, rose syrup, crushed pistachio.', price: 700, tags: ['vegetarian'] },
    { id: 'ms-pistachio-baklava', name: 'Pistachio Baklava', description: 'Two pieces, hand-rolled, warm honey.', price: 600, tags: ['vegetarian'] },
  ],
  sections: [
    { name: 'Bowls', description: 'Grain bowls built around the grill.', item_ids: ['ms-bowl-shawarma', 'ms-bowl-falafel', 'ms-bowl-kafta'] },
    { name: 'Wraps', description: 'Hand-held saj-wrapped classics.', item_ids: ['ms-wrap-chicken', 'ms-wrap-falafel', 'ms-wrap-kefta'] },
    { name: 'Sides', description: 'Mezze-style sides and staples.', item_ids: ['ms-hummus', 'ms-tabouleh', 'ms-fattoush', 'ms-zaatarfries'] },
    { name: 'Sweets', description: 'Quick sweet finishes.', item_ids: ['ms-rose-knafeh', 'ms-pistachio-baklava'] },
  ],
}

const mbar: Menu = {
  items: [
    { id: 'mb-olives', name: 'Warm Marinated Olives', description: 'Castelvetrano, preserved lemon, bay, Urfa chili, rosemary.', price: 900, tags: ['vegan'] },
    { id: 'mb-padron', name: 'Charred Padron Peppers', description: 'Blistered padrons, smoked sea salt, lemon, whipped labneh.', price: 1100, tags: ['vegetarian'] },
    { id: 'mb-calamari', name: 'Crispy Calamari', description: 'Sumac-dusted calamari, harissa aioli, lemon, crispy capers.', price: 1700 },
    { id: 'mb-hummustrio', name: 'Hummus Trio', description: 'Classic, beet, muhammara — with rotating warm saj.', price: 1800, tags: ['vegetarian'] },
    { id: 'mb-shrimp', name: 'Grilled Shrimp Kebab', description: 'Saffron-garlic shrimp, toum, grilled lemon, sumac onion.', price: 2800, tags: ['gluten-free'] },
    { id: 'mb-branzino', name: 'Branzino Tagine', description: 'Whole-roasted branzino, preserved lemon, olive, saffron broth.', price: 4200, tags: ['gluten-free'] },
    { id: 'mb-kefta', name: 'Lamb Kefta Trio', description: 'Three skewers: classic lamb, spiced beef, merguez — harissa yogurt.', price: 3600 },
    { id: 'mb-bosphorus', name: 'Bosphorus Spritz', description: 'Arak, grapefruit cordial, cava, rosemary.', price: 1600, tags: ['cocktail'] },
    { id: 'mb-negroni', name: 'Levantine Negroni', description: 'Gin, Campari, sumac-infused vermouth, orange bitters.', price: 1700, tags: ['cocktail'] },
    { id: 'mb-arakmartini', name: 'Arak Martini', description: 'House arak, dry vermouth, lemon twist, anise air.', price: 1800, tags: ['cocktail'] },
    { id: 'mb-paloma', name: 'Sumac Paloma', description: 'Blanco tequila, grapefruit, sumac-lime, pink salt rim.', price: 1600, tags: ['cocktail'] },
    { id: 'mb-espressomartini', name: 'Espresso Martini', description: 'Cardamom-spiked cold brew, vodka, coffee liqueur, tonka foam.', price: 1700, tags: ['cocktail'] },
    { id: 'mb-knafeh', name: 'Pistachio Knafeh', description: 'Warm knafeh, pistachio cream, orange blossom, clotted cream.', price: 1400, tags: ['vegetarian'] },
  ],
  sections: [
    { name: 'Bites', description: 'Small plates made for the bar.', item_ids: ['mb-olives', 'mb-padron', 'mb-calamari', 'mb-hummustrio'] },
    { name: 'Large Plates', description: 'From the hearth and the sea.', item_ids: ['mb-shrimp', 'mb-branzino', 'mb-kefta'] },
    { name: 'Cocktails', description: 'Levantine spirits in modern form.', item_ids: ['mb-bosphorus', 'mb-negroni', 'mb-arakmartini', 'mb-paloma'] },
    { name: 'After Dinner', description: 'Nightcap sips and a sweet.', item_ids: ['mb-espressomartini', 'mb-knafeh'] },
  ],
}

export const menus: Record<string, Menu> = {
  mamnoon,
  mamnoonstreet,
  mbar,
}
