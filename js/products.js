// products.js
// This is our "fake database" — a single array of product objects.
// Both shop.js (product grid) and product.js (product detail page) import from here,
// so there's only ONE place to update prices, stock, or add new products.

// We use an array because order matters (display order) and we need to loop over it
// (.map, .filter, .find). Each product is an object because it has several named
// properties that belong together — using separate arrays for names/prices/etc.
// would make it easy to accidentally mismatch data between them.

export const products = [
  {
    id: 1,
    name: "Brazilian Straight Bundle",
    category: "extensions",
    price: 65,
    image:
      "https://i.pinimg.com/1200x/05/b8/f3/05b8f354b691013e10ff6f88b1d5f200.jpg",
    description:
      "100% virgin Brazilian hair, silky straight texture. Tangle-free and holds curls beautifully. 12-30 inches available.",
    inStock: true,
  },
  {
    id: 2,
    name: "Deep Wave Bundle",
    category: "extensions",
    price: 68,
    image:
      "https://i.pinimg.com/1200x/39/6e/d4/396ed4c7a8ce4961e043fc088973b127.jpg",
    description:
      "Luxurious deep wave pattern that keeps its bounce wash after wash. Perfect for a full, voluminous look.",
    inStock: true,
  },
  {
    id: 3,
    name: "HD Lace Closure 4x4",
    category: "closures",
    price: 140,
    image:
      "https://i.pinimg.com/1200x/3d/da/e3/3ddae3b23e9d81d27a45d774e2ee83bb.jpg",
    description:
      "Undetectable HD lace that melts into any skin tone. Pre-plucked hairline for a natural finish.",
    inStock: true,
  },
  {
    id: 4,
    name: "13x4 Frontal Lace Wig",
    category: "wigs",
    price: 62,
    image:
      "https://i.pinimg.com/1200x/ea/bc/be/eabcbef96b2da74e3145de1468fe2d78.jpg",
    description:
      "Ready-to-wear glueless frontal wig with baby hairs pre-plucked. 180% density for a full, natural look.",
    inStock: true,
  },
  {
    id: 5,
    name: "Bob Cut Wig",
    category: "wigs",
    price: 85,
    image:
      "https://i.pinimg.com/736x/2e/5d/e9/2e5de97411c78a18ba323010fb694c59.jpg",
    description:
      "Chic shoulder-length bob, pre-styled and ready to wear straight out of the box.",
    inStock: false,
  },
  {
    id: 6,
    name: "Kinky Curly Bundle",
    category: "extensions",
    price: 62,
    image:
      "https://i.pinimg.com/1200x/d8/ce/ce/d8cece7fb6650c1ac790f89804dbc7dc.jpg",
    description:
      "Natural-looking kinky curl pattern that blends seamlessly with 4C natural hair.",
    inStock: true,
  },
  {
    id: 7,
    name: "Argan Oil Hair Serum",
    category: "care",
    price: 14,
    image:
      "https://i.pinimg.com/1200x/9e/d4/27/9ed4274da16401d90c38179205d81d8a.jpg",
    description:
      "Lightweight serum that tames frizz and adds shine without weighing hair down. 100ml bottle.",
    inStock: true,
  },
  {
    id: 8,
    name: "Sulfate-Free Shampoo",
    category: "care",
    price: 11,
    image:
      "https://i.pinimg.com/1200x/25/9f/d5/259fd5b880333c90e7aefccb81325b3d.jpg",
    description:
      "Gentle, sulfate-free formula safe for color-treated and extension-friendly hair.",
    inStock: true,
  },
  {
    id: 9,
    name: "Deep Conditioning Mask",
    category: "care",
    price: 15,
    image:
      "https://i.pinimg.com/1200x/97/ab/f8/97abf88a101868cb0309d37c7040e4b0.jpg",
    description:
      "Intense weekly treatment that restores moisture and elasticity to dry or damaged hair.",
    inStock: true,
  },
  {
    id: 10,
    name: "Satin Bonnet",
    category: "accessories",
    price: 9,
    image:
      "https://i.pinimg.com/1200x/9e/d7/12/9ed712a95ee72b503e8b03fc4bb61687.jpg",
    description:
      "Adjustable satin bonnet that protects hair and wigs while you sleep. Reduces frizz and breakage.",
    inStock: true,
  },
  {
    id: 11,
    name: "Edge Control Gel",
    category: "care",
    price: 8,
    image:
      "https://i.pinimg.com/1200x/c7/e9/bc/c7e9bcffb83599a149ba1a2ac3723c80.jpg",
    description:
      "Strong-hold, non-flaking edge control for sleek baby hairs that last all day.",
    inStock: true,
  },
  {
    id: 12,
    name: "Wig Stand & Travel Case",
    category: "accessories",
    price: 22,
    image:
      "https://i.pinimg.com/1200x/5a/a3/be/5aa3be07011313354d4b98c5c9637fc2.jpg",
    description:
      "Collapsible wig stand with matching travel case — keeps wigs styled and dust-free.",
    inStock: true,
  },
];
