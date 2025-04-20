import { Router } from "express";
import orderModel from "../models/order.model.js";
import Category from "../models/category.model.js";
import { ValidationMiddleware } from "../middleware/validation.middleware.js";
import { createHomesSchema } from "../schema/homes.schema.js";
import homesController from "../controllers/homes.controler.js";
import Order from "../models/order.model.js";
const pageRouter = Router();

pageRouter.get("/", (req, res) => {
  const villa = {
    totalFlatSpace: 250,
    floorNumber: 3,
    numberOfRooms: 5,
    parkingAvailable: "Yes",
    paymentProcess: "Bank Transfer",
    image: "/path/to/villa-image.jpg",
    detailInfo: "Beautiful villa with a spacious garden.",
    detailsLink: "/villa-details",
  };

  const penthouse = {
    totalFlatSpace: 300,
    floorNumber: 10,
    numberOfRooms: 7,
    parkingAvailable: "Yes",
    paymentProcess: "Cash",
    image: "/path/to/penthouse-image.jpg",
    detailInfo: "Luxurious penthouse with a sea view.",
    detailsLink: "/penthouse-details",
  };

  const properties = [
    {
      image: "/path/to/property1.jpg",
      category: "Villa",
      price: "$500,000",
      address: "123 Sunset Blvd, Miami",
      bedrooms: 4,
      bathrooms: 3,
      area: 200,
      floor: 2,
      parking: 2,
      detailsLink: "/property1-details",
    },
    {
      image: "/path/to/property2.jpg",
      category: "Apartment",
      price: "$300,000",
      address: "456 Beach Road, Toronto",
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      floor: 5,
      parking: 1,
      detailsLink: "/property2-details",
    },
  ];

  const contact = {
    mapLink: "https://www.google.com/maps/embed?pb=...",
    phone: "+1234567890",
    email: "info@company.com",
  };

  res.render("home", {
    title: "Villa Agency",
    villa: villa,
    penthouse: penthouse,
    properties: properties,
    contact: contact,
  });
});

pageRouter.get("/properties", (req, res) => {
  const propertyDetails = {
    email: "example@email.com", // emailni o'zgartiring
    location: "Toshkent, O‘zbekiston", // locationni o'zgartiring
    facebook: "https://facebook.com/yourprofile",
    twitter: "https://twitter.com/yourprofile",
    linkedin: "https://linkedin.com/in/yourprofile",
    instagram: "https://instagram.com/yourprofile",
  };

  // Properties array
  const properties = [
    {
      title: "Nice Apartment",
      category: "Apartment",
      categoryClass: "adv", // bu filtering uchun ishlatiladi
      price: 1200,
    },
    {
      title: "Cozy Villa",
      category: "Villa House",
      categoryClass: "str",
      price: 2500,
    },
    {
      title: "Luxury Penthouse",
      category: "Penthouse",
      categoryClass: "rac",
      price: 4000,
    },
    // "Luxury Villa" har doim mavjud bo'lsin
    {
      title: "Luxury Villa",
      category: "Luxury Villa",
      categoryClass: "lux",
      price: 10000,
    },
  ];

  // Filter qo'llanishi
  const filter = req.query.filter || ""; // Filtrovka bo'sh bo'lsa, barcha ko'rsatiladi
  let filteredProperties = properties;

  if (filter) {
    filteredProperties = properties.filter(
      (property) => property.category.toLowerCase() === filter.toLowerCase()
    );
  }

  // propertyDetails va filteredProperties'ni bitta ob'ektga birlashtirib yuboring
  res.render("properties", {
    ...propertyDetails,
    properties: filteredProperties,
    filter,
  });
});

pageRouter.get("/property-details", async (req, res) => {
  // Hozircha test uchun qo‘lda property yozamiz, keyin DB'dan dinamik olamiz
  const property = {
    title: "Luxury Villa",
    price: "$1,200,000",
    description: "This is a beautiful luxury villa located in Miami.",
    image: "/assets/images/property-01.jpg",
  };

  res.render("property-details", { property });
});

pageRouter.get("/contact", (req, res) => {
  res.render("contact", {
    email: "info@company.com",
    address: "1234 Elm Street, Sunny Isles Beach, FL 33160",
    twitter_url: "https://twitter.com/yourcompany",
    phone: "+998 90 123 45 67", // 👈 bu yangi qo‘shilgan
  });
});

pageRouter.get("/users/login", (req, res) => {
  res.render("auth/login", { error: null, message: null });
});

pageRouter.get("/users/register", (req, res) => {
  res.render("auth/register", { error: null, message: null });
});

pageRouter.get("/users/forgot-password", (req, res) => {
  res.render("auth/forgot-password", { error: null, message: null });
});

pageRouter.get("/users/reset-password", (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.redirect("/users/login");
  }
  res.render("auth/reset-password", {
    error: null,
    message: null,
    token,
  });
});

pageRouter.get("/orders/show", async (req, res) => {
  try {
    // Foydalanuvchi buyurtmalarini olish
    const orders = await orderModel
      .find({ user: req.user._id })
      .populate("home");

    if (!orders || orders.length === 0) {
      return res.render("orders/show", {
        orders: [],
        message: "Savatda hech qanday buyurtma yo'q.",
      });
    }

    // Savatdagi buyurtmalarni ko'rsatish
    res.render("orders/show", {
      orders,
      message: null,
    });
  } catch (error) {
    console.error("Buyurtmalarni olishda xato:", error);
    res.status(500).render("orders/show", {
      orders: [],
      message:
        "Buyurtmalarni olishda muammo yuz berdi. Iltimos, keyinroq qaytib keling.",
    });
  }
});

pageRouter.get("/categories", (req, res) => {
  res.render("categories/index", { error: null, message: null });
});

pageRouter.get("/categories/created", (req, res) => {
  res.render("categories/create", { error: null, message: null });
});

pageRouter.get("/categories/show", (req, res) => {
  res.render("categories/show", { error: null, message: null });
});

pageRouter.get("/orders", async (req, res, next) => {
  try {
    const orders = await Order.find(); // MongoDB'dan barcha buyurtmalarni olish
    res.render("orders/index", { orders });
  } catch (error) {
    next(error); // Xatolik bo‘lsa error handler'ga beriladi
  }
});

export default pageRouter;
