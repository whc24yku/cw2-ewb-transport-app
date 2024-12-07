// src/pages/Customer/Marketplace.jsx

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faList, faTh } from "@fortawesome/free-solid-svg-icons";
import placeholderImage from "../../assets/images/placeholder.jpg";
import beefstickImage from "../../assets/images/beefstick.jpg";
import handcraftedbasketImage from "../../assets/images/handcraftedbasket.jpg";
import organichoneyImage from "../../assets/images/organichoney.jpg";
import tourImage from "../../assets/images/tour.jpg";
import organicvegetablesImage from "../../assets/images/organicvegetables.jpg";

const translations = {
  en: {
    marketplace: "Marketplace",
    searchPlaceholder: "Search for items or services...",
    categoryAll: "All",
    buyNow: "Buy Now",
    seller: "Seller",
    products: [
      {
        id: 1,
        name: "Handcrafted Basket",
        price: "$25",
        category: "Artisanal Goods",
        image: handcraftedbasketImage,
        seller: "Local Artisans Co.",
      },
      {
        id: 2,
        name: "Organic Honey",
        price: "$10",
        category: "Food",
        image: organichoneyImage,
        seller: "Honey Hive Farms",
      },
      {
        id: 3,
        name: "Guided City Tour",
        price: "$50",
        category: "Tours",
        image: tourImage,
        seller: "City Tours LLC",
      },
      {
        id: 4,
        name: "Fresh Salmon Fish",
        price: "$30",
        category: "Fishes",
        image: placeholderImage,
        seller: "Seafood Market",
      },
      {
        id: 5,
        name: "Grass-fed Beef Steak",
        price: "$40",
        category: "Meats",
        image: beefstickImage,
        seller: "Farm Fresh Meats",
      },
      {
        id: 6,
        name: "Organic Vegetables",
        price: "$15",
        category: "Groceries",
        image: organicvegetablesImage,
        seller: "Green Grocer",
      },
    ],
  },
  es: {
    marketplace: "Mercado",
    searchPlaceholder: "Buscar artículos o servicios...",
    categoryAll: "Todo",
    buyNow: "Comprar ahora",
    seller: "Vendedor",
    products: [
      {
        id: 1,
        name: "Cesta hecha a mano",
        price: "$25",
        category: "Productos artesanales",
        image: handcraftedbasketImage,
        seller: "Artesanos locales",
      },
      {
        id: 2,
        name: "Miel orgánica",
        price: "$10",
        category: "Alimentos",
        image: organichoneyImage,
        seller: "Granja de Miel Hive",
      },
      {
        id: 3,
        name: "Tour guiado por la ciudad",
        price: "$50",
        category: "Tours",
        image: tourImage,
        seller: "City Tours LLC",
      },
      {
        id: 4,
        name: "Pescado fresco de salmón",
        price: "$30",
        category: "Peces",
        image: placeholderImage,
        seller: "Mercado de Mariscos",
      },
      {
        id: 5,
        name: "Filete de res alimentado con pasto",
        price: "$40",
        category: "Carnes",
        image: beefstickImage,
        seller: "Carnes Frescas de Granja",
      },
      {
        id: 6,
        name: "Vegetales orgánicos",
        price: "$15",
        category: "Verduras",
        image: organicvegetablesImage,
        seller: "Verduras Verdes",
      },
    ],
  },
};

const CustomerMarketplace = () => {
  const [viewType, setViewType] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [language, setLanguage] = useState("en");

  const t = translations[language];

  // Categories for filter options
  const categories = [
    t.categoryAll,
    ...new Set(t.products.map((product) => product.category)),
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col m-0 p-0 overflow-hidden">
      {/* Header with Search and Logo */}
      <header className="flex justify-between items-center mb-6 px-4 py-2 w-full">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-xl">
            Go
          </div>
          <h1 className="text-2xl font-semibold text-white ml-3">
            {t.marketplace}
          </h1>
        </div>

        {/* Language Toggle */}
        <div className="flex space-x-3">
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-2 rounded-full ${
              language === "en" ? "bg-yellow-300 text-[#027f86]" : "bg-gray-200 text-gray-700"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("es")}
            className={`px-4 py-2 rounded-full ${
              language === "es" ? "bg-yellow-300 text-[#027f86]" : "bg-gray-200 text-gray-700"
            }`}
          >
            Español
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative text-gray-600 w-1/2">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg focus:outline-none bg-gray-100 text-gray-700"
          />
          <FontAwesomeIcon icon={faSearch} className="absolute right-3 top-3 text-gray-500" />
        </div>
      </header>

      {/* Filter & View Options */}
      <div className="flex items-center justify-between mb-4 px-4 py-2">
        {/* Category Filter */}
        <div className="flex space-x-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category.toLowerCase())}
              className={`px-4 py-2 rounded-full ${
                categoryFilter === category.toLowerCase()
                  ? "bg-yellow-300 text-[#027f86]"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Toggle View */}
        <div className="flex space-x-3">
          <button onClick={() => setViewType("grid")}>
            <FontAwesomeIcon
              icon={faTh}
              className={`text-2xl ${
                viewType === "grid" ? "text-yellow-300" : "text-gray-300"
              }`}
            />
          </button>
          <button onClick={() => setViewType("list")}>
            <FontAwesomeIcon
              icon={faList}
              className={`text-2xl ${
                viewType === "list" ? "text-yellow-300" : "text-gray-300"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Items Section */}
      <div
        className={`${
          viewType === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-2"
            : "flex flex-col space-y-4 px-4 py-2"
        }`}
      >
        {t.products
          .filter(
            (item) =>
              (categoryFilter === "all" ||
                item.category.toLowerCase() === categoryFilter) &&
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <div
              key={item.id}
              className="bg-white text-[#027f86] rounded-lg shadow-lg p-4 flex items-start space-x-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-md object-cover"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.category}</p>
                  <p className="text-lg font-bold mt-2">{item.price}</p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {t.seller}: {item.seller}
                  </p>
                  <button className="mt-2 bg-yellow-300 text-[#027f86] px-4 py-2 rounded-md font-semibold">
                    {t.buyNow}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CustomerMarketplace;
