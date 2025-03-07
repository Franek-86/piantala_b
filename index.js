const express = require("express");
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
  })
);
// Allow all OPTIONS requests (preflight)
app.options("*", cors());

app.use("/uploads", express.static("uploads"));

app.use(bodyParser.json());

// const sessionStore = new MySQLStore({}, require("./config/db"));
const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);
// app.use(
//   session({
//     key: "user_sid",
//     secret: `${process.env.MY_SECRET_KEY}`, // Change this to a strong secret
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       expires: 600000, // Set cookie expiration time (in milliseconds)
//     },
//   })
// );

// Create a PostgreSQL client pool (adjust your database connection details)

const sessionStore = new pgSession({
  pool: con, // Use the connection pool
  tableName: "session", // Optional: You can customize the table name
  createTableIfMissing: true, // Ensure the table is created if it doesn't exist
});

app.use(
  session({
    key: "user_sid", // Cookie name for storing the session ID
    secret: process.env.MY_SECRET_KEY, // Secret key for signing the session ID cookie
    store: sessionStore, // Use the PostgreSQL session store
    resave: false, // Don't resave session if unmodified
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      expires: 600000, // Set the session cookie expiration time (in milliseconds)
      httpOnly: true, // Prevent client-side JavaScript from accessing cookies
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/plants", plantsRoutes);

// This is your test secret API key.

// const { exec } = require("child_process");

// exec(
//   'curl -i "http://api.geonames.org/childrenJSON?geonameId=3182350&username=franek"',
//   (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`Stderr: ${stderr}`);
//       return;
//     }
//     console.log(`Curl Response: ${stdout}`);
//   }
// );

const YOUR_DOMAIN =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DOMAIN_NAME_CLIENT
    : process.env.DOMAIN_NAME_CLIENT;

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
