"use client";

export const useProductCategories = (products) => {
  const categories = {
    ip: [],
    cable: [],
    nvr: [],
    kits: [],
    install: [],
    misc: [],
  };

  products.forEach((product) => {
    const name = product.name.toLowerCase();

    if (name.startsWith("ip")) {
      categories.ip.push(product);
    } else if (name.startsWith("cable")) {
      categories.cable.push(product);
    } else if (name.startsWith("nvr")) {
      categories.nvr.push(product);
    } else if (name.startsWith("install")) {
      categories.install.push(product);
    } else if (name.startsWith("kit")) {
      categories.kits.push(product);
    } else {
      categories.misc.push(product);
    }
  });

  return Object.entries(categories)
    .filter(([_, items]) => items.length > 0)
    .map(([category, items]) => ({
      category,
      items,
      title: getCategoryTitle(category),
    }));
};

const getCategoryTitle = (category) => {
  const titles = {
    ip: "IP Cameras & Accessories",
    cable: "Cables",
    nvr: "NVR Systems",
    kits: "NVR Kits",
    install: "Installation Services",
    misc: "Other Products",
  };
  return titles[category] || category;
};
