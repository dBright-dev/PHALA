export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Kota' | 'Burgers' | 'Boerewors' | 'Chips & Wings' | 'Sides & Desserts';
  description: string;
  ingredients?: string[];
  variants?: { name: string; price: number }[];
  availability?: string; // e.g., "Wednesday Only"
}

export const THABIS_MENU: MenuItem[] = [
  // --- KOTA CATEGORY (From image_b4a3b6.jpg) ---
  {
    id: 'phala-1',
    name: 'Phala 1',
    price: 40,
    category: 'Kota',
    description: 'Classic quarter loaf loaded with chips, polony, vienna, and tangy atchar.',
    ingredients: ['Chips', 'Polony', 'Atchar', 'Vienna']
  },
  {
    id: 'phala-2',
    name: 'Phala 2',
    price: 45,
    category: 'Kota',
    description: 'Premium quarter loaf elevated with a half Russian sausage.',
    ingredients: ['Chips', 'Polony', 'Atchar', 'Vienna', '1/2 Russian']
  },
  {
    id: 'phala-3',
    name: 'Phala 3',
    price: 55,
    category: 'Kota',
    description: 'The loaded favorite featuring a half Russian, fried egg, and melted half cheese.',
    ingredients: ['Chips', 'Polony', 'Atchar', 'Vienna', '1/2 Russian', 'Egg', '1/2 Cheese']
  },
  {
    id: 'phala-ment',
    name: "Phala'ment",
    price: 65,
    category: 'Kota',
    description: 'The ultimate parliament powerhouse stuffed with a beef patty, full cheese, egg, and the standard loaded fillings.',
    ingredients: ['Chips', 'Polony', 'Atchar', 'Vienna', '1/2 Russian', 'Egg', 'Full Cheese', 'Beef Patty']
  },

  // --- BURGERS & DAGWOODS (From image_b4a374.jpg) ---
  {
    id: 'dagwood-plain',
    name: 'Dagwood',
    price: 55,
    category: 'Burgers',
    description: 'Stacked triple-decker with a grilled beef patty, cheese, crisp lettuce, fresh tomatoes, a French Toast egg layer, and premium Hellmann\'s mayonnaise.',
    ingredients: ['Beef patty', 'Egg (French Toast)', 'Cheese', 'Lettuce', 'Tomatoes', "Hellmann's mayonnaise"]
  },
  {
    id: 'dagwood-chips',
    name: 'Dagwood and Chips',
    price: 70,
    category: 'Burgers',
    description: 'Our signature stacked Dagwood sandwich served alongside a hearty portion of golden slaptjips.',
    ingredients: ['Beef patty', 'Egg (French Toast)', 'Cheese', 'Lettuce', 'Tomatoes', "Hellmann's mayonnaise", 'Chips']
  },
  {
    id: 'cheese-burger-chips',
    name: 'Cheese Burger and Chips',
    price: 50,
    category: 'Burgers',
    description: 'Juicy beef patty topped with cheese, fresh salad layers, rich Hellmann\'s mayo, and our signature secret Special Thabi Sauce. Served with chips.',
    ingredients: ['Beef patty', 'Egg', 'Cheese', 'Lettuce', 'Tomatoes', "Hellmann's mayonnaise", 'Special Thabi Sauce', 'Chips']
  },

  // --- TRADITIONAL BOEREWORS ROLLS (From image_b4a338.png) ---
  {
    id: 'boerewors-roll-onions',
    name: 'Traditional Boerewors Roll with Onions',
    price: 40,
    category: 'Boerewors',
    description: 'Authentic local flame-grilled boerewors served in a fresh roll with sweet braaied onions.',
    ingredients: ['Boerewors', 'Roll', 'Braaied Onions']
  },
  {
    id: 'boerewors-roll-chips',
    name: 'Traditional Boerewors Roll with Chips',
    price: 55,
    category: 'Boerewors',
    description: 'Authentic local flame-grilled boerewors roll with sweet onions, served with a generous side of golden chips.',
    ingredients: ['Boerewors', 'Roll', 'Braaied Onions', 'Chips']
  },

  // --- CHIPS & WINGS (From image_b4a315.jpg) ---
  {
    id: 'chips-only',
    name: 'Chips (Only)',
    price: 30,
    category: 'Chips & Wings',
    description: 'A box of hot, freshly fried golden slaptjips salted to perfection.',
    ingredients: ['Chips']
  },
  {
    id: 'chips-russian',
    name: 'Chips + Russian',
    price: 50,
    category: 'Chips & Wings',
    description: 'A classic pairing of golden chips served with a full deep-fried Russian sausage.',
    ingredients: ['Chips', 'Full Russian']
  },
  {
    id: 'sticky-wings-chips',
    name: '4 Hot/Full Sticky Wings & Chips',
    price: 75,
    category: 'Chips & Wings',
    description: 'Four extra succulent chicken wings tossed in a sweet, fiery sticky glaze, paired with fresh fries.',
    ingredients: ['4 Sticky Wings', 'Chips'],
    availability: 'Wednesday Only' // Custom operational parameter
  },

  // --- SIDES & DESSERTS (From image_b4a397.png & image_b4a357.png) ---
  {
    id: 'magwinya',
    name: 'Magwinya',
    price: 3,
    category: 'Sides & Desserts',
    description: 'Freshly fried, golden traditional vetkoek. Warm and crispy on the outside, fluffy on the inside.',
    variants: [
      { name: '1x Magwinya', price: 3 },
      { name: '2x Magwinya', price: 5 }
    ]
  },
  {
    id: 'pancake-pack',
    name: 'Pancakes (Pack of 4)',
    price: 15,
    category: 'Sides & Desserts',
    description: 'Four sweet, light traditional pan-fried crepes lightly dusted with cinnamon sugar.',
    ingredients: ['4x Pancakes', 'Cinnamon Sugar']
  }
];