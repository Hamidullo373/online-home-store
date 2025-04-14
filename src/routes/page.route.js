import { Router } from "express";
import orderModel from "../models/order.model.js";
import categoryModel from "../models/category.model.js";
import homesModel from "../models/homes.model.js";
import Order from "../models/order.model.js";
import Home from "../models/homes.model.js";

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

  const properties = [
    { category: "apartment", name: "Luxury Apartment", price: 500000 },
    { category: "house", name: "Family House", price: 250000 },
    { category: "condo", name: "City Condo", price: 150000 },
  ];

  // propertyDetails va properties'ni bitta ob'ektga birlashtirib yuboring
  res.render("properties", { ...propertyDetails, properties });
});

pageRouter.get("/property-details", (req, res) => {
  // Villa obyektining misol ma'lumotlari
  const villa = {
    title: "Luxury Villa in Sunny Isles Beach", // Title qiymatini qo‘shish
    category: "Residential",
    address: "123 Sunny Isles Blvd, FL 33160",
    description: "A beautiful villa with all modern amenities.",
    totalFlatSpace: 350,
    contractStatus: "Active",
    paymentStatus: "Paid",
    safety: "High",
    accordions: [
      {
        title: "About the Villa",
        content: "This villa has everything you need for a comfortable living.",
      },
      {
        title: "Neighborhood",
        content:
          "Located in a safe and friendly area with excellent amenities.",
      },
      {
        title: "Additional Features",
        content: "Private pool, gym, and a beautiful garden.",
      },
    ],
  };

  // `villa` obyektini va boshqa zarur ma'lumotlarni EJS shabloniga yuborish
  res.render("property-details", { villa: villa, title: villa.title });
});

pageRouter.get("/users/login", (req, res) => {
  res.render("auth/login", { error: null });
});

pageRouter.get("/users/register", (req, res) => {
  res.render("auth/register", { error: null });
});

pageRouter.get("/users/forgot-password", (req, res) => {
  res.render("auth/forgot-password", { error: null, message: null });
});

pageRouter.get("/users/reset-password", (req, res) => {
  const token = req.query.token;
  if (!token) {
    res.redirect("/users/login");
  }
  res.render("auth/reset-password", {
    error: null,
    message: null,
    token,
  });
});

pageRouter.get("/categories", (req, res) => {
  res.render("categories/index");
});

pageRouter.get("/categories/show", (req, res) => {
  res.render("categories/show");
});

pageRouter.get("/categories/create", (req, res) => {
  res.render("categories/create");
});

pageRouter.get("/categories/edit", (req, res) => {
  res.render("categories/edit");
});

pageRouter.get("/orders", async (req, res, next) => {
  try {
    const orders = await Order.find(); // MongoDB'dan barcha buyurtmalarni olish
    res.render("orders/index", { orders });
  } catch (error) {
    next(error); // Xatolik bo‘lsa error handler'ga beriladi
  }
});

// pageRouter.get("/orders/create", async (req, res, next) => {
//   res.render("orders/create", { homes });
// });

pageRouter.get("/orders/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const order = await orderModel.findById(id).populate("items.product");
    if (!order) {
      return res.status(404).render("orders/show", {
        order: null,
        error: "Buyurtma topilmadi",
        success: null,
      });
    }

    res.render("orders/show", {
      order,
      error: null,
      success: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("orders/show", {
      order: null,
      error: "Xatolik yuz berdi",
      success: null,
    });
  }
});

export default pageRouter;
