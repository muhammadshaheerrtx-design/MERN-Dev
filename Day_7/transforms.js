export const createTracker = () => {
  let count = 0;
  return (title) => {
    count++;
    return `\n=== [INSIGHT #${count}] ${title.toUpperCase()} ===`;
  };
};

export const searchProducts = (dataset, query = {}) => {
  const {
    keyword = "",
    category = "All",
    minPrice = 0,
    maxPrice = Infinity,
  } = query;
  const term = keyword.toLowerCase().trim();

  return dataset.filter((product) => {
    const matchesCategory =
      category === "All" ||
      product.category.toLowerCase() === category.toLowerCase();
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    const matchesKeyword =
      !term ||
      product.name.toLowerCase().includes(term) ||
      (product.tags &&
        product.tags.some((tag) => tag.toLowerCase().includes(term)));

    return matchesCategory && matchesPrice && matchesKeyword;
  });
};

export const sortProductsBy = (dataset, key = "price", isAscending = true) => {
  const direction = isAscending ? 1 : -1;

  return [...dataset].sort((a, b) => {
    const valA = a[key] ?? "";
    const valB = b[key] ?? "";

    if (typeof valA === "string") {
      return valA.localeCompare(valB) * direction;
    }
    return (valA - valB) * direction;
  });
};

export const getInventorySummary = (dataset) => {
  const initialStats = { totalValue: 0, totalUnits: 0 };

  const { totalValue, totalUnits } = dataset.reduce(
    (acc, { price, stock }) => ({
      totalValue: acc.totalValue + price * stock,
      totalUnits: acc.totalUnits + stock,
    }),
    initialStats,
  );

  const averagePrice =
    dataset.reduce((sum, { price }) => sum + price, 0) / (dataset.length || 1);

  return {
    totalProducts: dataset.length,
    totalUnits,
    averagePrice: `$${averagePrice.toFixed(2)}`,
    totalValuation: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };
};

export const groupByCategory = (dataset) => {
  return dataset.reduce((acc, { category, price, stock }) => {
    const current = acc[category] ?? { count: 0, totalStock: 0, valuation: 0 };

    return {
      ...acc,
      [category]: {
        count: current.count + 1,
        totalStock: current.totalStock + stock,
        valuation: Number((current.valuation + price * stock).toFixed(2)),
      },
    };
  }, {});
};

export const simulateCategoryDiscount = (dataset, targetCategory, percentage) => {
  const factor = 1 - percentage / 100;

  const updatedProducts = dataset.map((product) => {
    if (product.category.toLowerCase() !== targetCategory.toLowerCase()) {
      return product;
    }

    return {
      ...product,
      originalPrice: product.price,
      price: Number((product.price * factor).toFixed(2)),
    };
  });

  const totalSavings = dataset.reduce((acc, { category, price, stock }) => {
    if (category.toLowerCase() === targetCategory.toLowerCase()) {
      return acc + price * (percentage / 100) * stock;
    }
    return acc;
  }, 0);

  return {
    updatedProducts,
    totalSavingsFormatted: `$${totalSavings.toFixed(2)}`,
  };
};

export const getSupplierAudit = (dataset) => {
  return dataset.map(({ name, supplier }) => ({
    productName: name,
    supplier: supplier?.name ?? "Direct Manufacturer",
    country: supplier?.country ?? "N/A",
  }));
};
