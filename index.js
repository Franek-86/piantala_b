const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("node:crypto");
const con = require("./config/db");
const path = require("path");
const app = express();
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
// const MySQLStore = require("express-mysql-session")(session);
require("@dotenvx/dotenvx").config();
const cors = require("cors"); // Import CORS
const bodyParser = require("body-parser"); // Import body-parser
const plantsRoutes = require("./routes/plantsRoutes");
const authRoutes = require("./routes/authRoutes");
const ordersRoutes = require("./routes/ordersRoutes");

const PORT = process.env.PORT || 3001;
const HOST =
  process.env.NODE_ENV === "test" ? process.env.TEST_HOST : process.env.HOST;
// Option 1: Passing a connection URI
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://piantala-a.onrender.com",
      "http://api.geonames.org",
      "http://api.miocodicefiscale.com",
    ], // or '*' to allow all origins (not recommended for production)
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Allow all OPTIONS requests (preflight)
app.options("*", cors());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(bodyParser.json());
// STRIPE_TEST_SECRET_KEY;
// const sessionStore = new MySQLStore({}, require("./config/db"));
// Stripe da ripristinare, oltre a questo devi anche andare nella stessa pagina a ripristinare il "product" che sta nel post della "create-checkout-session"

const MY_STRIPE_SECRET_KEY =
  process.env.NODE_ENV === "test"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;
const MY_STRIPE_PUBLISHABLE_KEY =
  process.env.NODE_ENV === "test"
    ? process.env.STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.STRIPE_PUBLISHABLE_KEY;

// When testing in production use wht below
// const MY_STRIPE_SECRET_KEY = process.env.STRIPE_TEST_SECRET_KEY;
// const MY_STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_TEST_PUBLISHABLE_KEY;

const stripe = require("stripe")(MY_STRIPE_SECRET_KEY);

const sessionStore = new pgSession({
  pool: con, // Use the connection pool
  tableName: "session", // Optional: You can customize the table name
  createTableIfMissing: true, // Ensure the table is created if it doesn't exist
});

// test crypto
let first = "ORD";
let second = new Date().toISOString().replace(/-/g, "").slice(0, 11);

let third = crypto.randomBytes(2).toString("hex");

const order_number = `${first}-${second}-${third}`;
console.log("jjj2", order_number);

app.use(
  session({
    key: "user_sid", // Cookie name for storing the session ID
    secret: process.env.MY_SECRET_KEY, // Secret key for signing the session ID cookie
    store: sessionStore, // Use the PostgreSQL session store
    resave: false, // Don't resave session if unmodified
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      maxAge: 600000, // Set the session cookie expiration time (in milliseconds)
      httpOnly: true, // Prevent client-side JavaScript from accessing cookies
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none",
      maxAge: 600000,
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/plants", plantsRoutes);
app.use("/api/orders", ordersRoutes);

const MY_DOMAIN =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DOMAIN_NAME_CLIENT
    : process.env.DOMAIN_NAME_CLIENT;

app.post("/create-checkout-session", async (req, res) => {
  // const testProduct = await stripe.products.create({
  //   name: "Piantina",
  // });
  // console.log("aaaa", testProduct);

  const product =
    process.env.NODE_ENV === "test"
      ? "prod_SXbLBcm0aD8vtG"
      : "prod_SXbqGGnyIScuVZ";

  // When testing in production use the product below

  // const product = "prod_SXbLBcm0aD8vtG";

  console.log("this is the cl of the product", product);
  const price = await stripe.prices.create({
    product: product,
    unit_amount: 100,
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
    return_url: `${MY_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
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
    publishableKey: MY_STRIPE_PUBLISHABLE_KEY,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
