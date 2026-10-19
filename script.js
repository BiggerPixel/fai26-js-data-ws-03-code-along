const cart = {
  user: {
    id: "user-731",
    firstName: "Mira",
    lastName: "Lind",
    avatar: "https://placehold.co/160x160/e0e7ff/3730a3?text=ML",
    membershipLevel: "PREMIUM",
    address: {
      street: "Skolgatan 12",
      zip: "903 22",
      city: "Umeå",
    },
  },
  items: [
    {
      product: {
        id: "prod-124",
        name: "Trådlösa hörlurar",
        brand: {
          name: "North Sound",
          logo: "https://placehold.co/96x96/111827/ffffff?text=NS",
        },
        price: 299,
        currency: "SEK",
        image:
          "https://images.unsplash.com/photo-1545127398-14699f92334b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        weightInGrams: 579,
        stock: 47,
      },
      quantity: 2,
    },
    {
      product: {
        id: "prod-208",
        name: "Mekaniskt tangentbord",
        brand: {
          name: "Key Works",
          logo: "https://placehold.co/96x96/312e81/ffffff?text=KW",
        },
        price: 849,
        currency: "SEK",
        image:
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        weightInGrams: 920,
        stock: 18,
      },
      quantity: 1,
    },
    {
      product: {
        id: "prod-311",
        name: "USB-C-hubb",
        brand: {
          name: "Port Lab",
          logo: "https://placehold.co/96x96/0f766e/ffffff?text=PL",
        },
        price: 399,
        currency: "SEK",
        image:
          "https://plus.unsplash.com/premium_photo-1764113096548-11270b5febed?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        weightInGrams: 180,
        stock: 31,
      },
      quantity: 1,
    },
  ],
};

// Vi skriver funktionerna och anropen för varukorgen här tillsammans.

const calculateLineValue = (item) => {
  const lineValue = item.product.price * item.quantity;
  return lineValue;
};

const calculateLineWeight = (item) => {
  const weight = item.product.weightInGrams * item.quantity;
  return weight;
};

const calculateWeightBasedShipping = (totalWeight) => {
  if (totalWeight <= 1000) return 49;

  if (totalWeight <= 3000) return 89;

  return 149;
};

const calculateShipping = (totalWeight, orderValue, membershipLevel) => {
  const weightBasedShipping = calculateWeightBasedShipping(totalWeight);

  if (membershipLevel === "PREMIUM") {
    return {
      cost: 0,
      explanation: `Fri frakt för premiummedlemmar. Ordinarie vikt-baserad frakt: ${weightBasedShipping} kr`,
    };
  }

  if (orderValue >= 1500) {
    return {
      cost: 0,
      explanation: `Fri frakt eftersom att ordervärdet är minst 1500 kr. Ordinarie vikt-baserad frakt: ${weightBasedShipping} kr`,
    };
  }

  return {
    cost: weightBasedShipping,
    explanation: `Frakten baserat på vikten: ${weightBasedShipping} kr`,
  };
};

const calculateCartSummary = (cartData) => {
  let orderValue = 0;
  let totalWeight = 0;

  cartData.items.forEach((item) => {
    const lineValue = calculateLineValue(item);
    const lineWeight = calculateLineWeight(item);

    orderValue = orderValue + lineValue;
    totalWeight = totalWeight + lineWeight;

    console.log(item.product.name, { lineValue, lineWeight });
  });

  const shipping = calculateShipping(
    totalWeight,
    orderValue,
    cartData.user.membershipLevel,
  );

  return {
    orderValue,
    totalWeight,
    shippingCost: shipping.cost,
    shippingExplanation: shipping.explanation,
    amountToPay: orderValue + shipping.cost,
  };
};

// Färdig hjälpkod för gränssnittet. Vi skriver inte DOM-koden i denna code-along.
const formatCurrency = (value, currency) => {
  return `${value} ${currency === "SEK" ? "kr" : currency}`;
};

const renderCartItem = (item) => {
  const article = document.createElement("article");
  article.className =
    "grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[112px_1fr_auto] sm:items-center";

  article.innerHTML = `
    <img
      class="h-28 w-28 rounded-2xl bg-slate-100 object-cover"
      src="${item.product.image}"
      alt="${item.product.name}"
    />
    <div>
      <p class="text-sm font-medium text-indigo-600">${item.product.brand.name}</p>
      <h2 class="text-lg font-bold">${item.product.name}</h2>
      <p class="mt-1 text-sm text-slate-500">${item.product.weightInGrams} g per styck</p>
      <p class="mt-2 text-sm font-medium">Antal: ${item.quantity}</p>
    </div>
    <p class="text-xl font-bold">${formatCurrency(calculateLineValue(item), item.product.currency)}</p>
  `;

  return article;
};

const renderCheckout = (cartData, summary) => {
  document.querySelector("#customer-avatar").src = cartData.user.avatar;
  document.querySelector("#customer-name").textContent =
    `${cartData.user.firstName} ${cartData.user.lastName}`;
  document.querySelector("#membership-level").textContent =
    cartData.user.membershipLevel === "PREMIUM" ? "Premium-medlem" : "Medlem";

  const cartItemsElement = document.querySelector("#cart-items");
  cartItemsElement.replaceChildren();

  cartData.items.forEach((item) => {
    cartItemsElement.append(renderCartItem(item));
  });

  document.querySelector("#order-value").textContent = formatCurrency(
    summary.orderValue,
    "SEK",
  );
  document.querySelector("#total-weight").textContent =
    `${summary.totalWeight} g`;
  document.querySelector("#shipping-cost").textContent =
    summary.shippingCost === 0
      ? "Fri frakt"
      : formatCurrency(summary.shippingCost, "SEK");
  document.querySelector("#shipping-explanation").textContent =
    summary.shippingExplanation;
  document.querySelector("#amount-to-pay").textContent = formatCurrency(
    summary.amountToPay,
    "SEK",
  );
};

const summary = calculateCartSummary(cart);
console.log("Ordersammanfattning:", summary);
renderCheckout(cart, summary);
