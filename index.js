const express = require("express");

const path = require("path");
const app = express();
const session = require("express-session");
require("@dotenvx/dotenvx").config();
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors"); // Import CORS
const bodyParser = require("body-parser"); // Import body-parser
const plantsRoutes = require("./routes/plantsRoutes");
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";
// Option 1: Passing a connection URI
app.use(
  cors({
    origin: "http://localhost:3000", // or '*' to allow all origins (not recommended for production)
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Allow all OPTIONS requests (preflight)
app.options("*", cors());

app.use("/uploads", express.static("uploads"));

app.use(bodyParser.json());

const sessionStore = new MySQLStore({}, require("./config/db"));
const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);
app.use(
  session({
    key: "user_sid",
    secret: `${process.env.MY_SECRET_KEY}`, // Change this to a strong secret
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000, // Set cookie expiration time (in milliseconds)
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/plants", plantsRoutes);

// This is your test secret API key.

const YOUR_DOMAIN = process.env.DOMAIN_NAME_CLIENT;

app.post("/create-checkout-session", async (req, res) => {
  const product = await stripe.products.create({
    name: "Piantina2",
  });
  console.log(product);
  const price = await stripe.prices.create({
    product: "prod_RBhoAtdt0PFZRI",
    unit_amount: 1000,
    currency: "eur",
  });

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({ clientSecret: session.client_secret });
});

app.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
