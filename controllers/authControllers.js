const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const con = require("../config/db");
const crypto = require("crypto");
const transporter = require("../config/nodemailer");
const { OAuth2Client } = require("google-auth-library");

// const User = require("../models/User");
const db = require("../models");
const User = db.User;
const Order = db.Order;
const MailerSend = require("mailersend");
const { imgurAdd } = require("../assets/imgur");
const { imgurDelete } = require("../assets/imgur");
const axios = require("axios");
const emailToBeSent = require("../assets/mailOptions");
// const {
//   // sendVerificationEmail,
//   sendPasswordResetEmail,
// } = require("../assets/mailerSend");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPaymentConfirmationEmail,
} = require("../email/resend");
const FormData = require("form-data");

const domainNameClient =
  process.env.NODE_ENV === "test"
    ? process.env.DOMAIN_NAME_TEST_CLIENT
    : process.env.DOMAIN_NAME_CLIENT;
const generateVerificationToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

exports.verificationEmail = async (req, res) => {
  const token = req.query.token;
  try {
    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.is_verified = true;
    user.verification_token = null;
    await user.save();
    return res.status(200).json({ message: "email verificata con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.verificationEmailPasswordReset = async (req, res) => {
  const token = req.query.token;
  try {
    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.is_verified = true;
    // user.verification_token = null;
    await user.save();
    // return res.redirect(
    //   `${domainNameClient}/verification-success-reset/${user.verification_token}`
    // );
    return res.status(200).json({ message: "email verificata con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.checkExistingUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      if (!user.is_verified) {
        return res
          .status(200)
          .json({ message: "User needs to verify email address" });
      } else {
        return res.status(200).json({ message: "User already registered" });
      }
    } else {
      return res.status(200).json({ message: "User not registered" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.sendPaymentConfirmationEmail = async (req, res) => {
  const { email, order_number, created_at } = req.body.payload;
  try {
    sendPaymentConfirmationEmail(email, order_number, created_at);
    res.status(200).json({ message: "email inviata" });
  } catch (error) {
    res.status(500).json({
      message: "c'è stato un errore nell'invio email, email non inviata",
    });
  }
};

exports.registerUser = async (req, res) => {
  const {
    first_name,
    last_name,
    address,
    birthday,
    // fiscal_code,
    email,
    city,
    gender,
    user_password,
    role,
    user_name,
    phone,
    terms,
  } = req.body;

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: "Utente già registrato" });
  }
  try {
    const hashedPassword = await bcrypt.hash(user_password, 10);
    let email_token = generateVerificationToken();
    let date = Date.now();
    const user = await User.create({
      first_name: first_name,
      last_name: last_name,
      city: city,
      gender: gender,
      birthday: birthday,
      // fiscal_code: fiscal_code,
      email: email,
      user_name: user_name,
      phone: phone,
      user_password: hashedPassword,
      verification_token: email_token,
      terms: true,
      terms_v: 1,
      terms_date: date,
    });
    const token = jwt.sign(
      { id: user.id, email: email, role: "user" },
      "your_jwt_secret_key",
      { expiresIn: "10d" }
    );

    // res.status(201).json({
    //   message:
    //     "Controlla la tua casella di posta per completare la registrazione",
    //   token,
    // });
    if (!email) {
      return res.status(400).send("no email address provided");
    }
    try {
      await sendVerificationEmail(email, email, user);
      res.status(201).json({
        message:
          "Controlla la tua casella di posta per completare la registrazione",
        token,
      });
    } catch (error) {
      res.status(500).send("Error: Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Start password reset

exports.passwordLink = async (req, res) => {
  const { email } = req.body.data;
  try {
    const user = await User.findOne({ where: { email } });
    const name = user.first_name;
    if (!user) {
      return res.status(409).send({ message: "Email non registrata" });
    }
    let token = user?.verification_token;
    if (!token) {
      const token = generateVerificationToken();
      user.verification_token = token;

      await user.save();

      const url = `${
        process.env.NODE_ENV === "test"
          ? process.env.DOMAIN_NAME_TEST_CLIENT
          : process.env.DOMAIN_NAME_CLIENT
      }/verify-reset/${user.verification_token}`;
      // sendPasswordResetEmail;

      try {
        await sendPasswordResetEmail(email, name, url);
        res.status(200).send({ message: "email inviata" });
      } catch (error) {
        res.status(500).send({ message: "Errore di invio mail" });
      }
    }
    // to here
    if (token) {
      // const url = `${
      //   process.env.NODE_ENV === "test"
      //     ? process.env.DOMAIN_NAME_TEST_SERVER
      //     : process.env.DOMAIN_NAME_SERVER
      // }/api/auth/reset-password/verify/${user.verification_token}`;
      const url = `${
        process.env.NODE_ENV === "test"
          ? process.env.DOMAIN_NAME_TEST_CLIENT
          : process.env.DOMAIN_NAME_CLIENT
      }/verify-reset/${user.verification_token}`;

      try {
        await sendPasswordResetEmail(email, name, url);
        res.status(200).send({ message: "email inviata" });
      } catch (error) {
        res.status(500).send({ message: "Errore di invio mail" });
      }
    }
  } catch (err) {
    res.status(500).send({ message: "internal server error" });
  }
};

exports.newPassword = async (req, res) => {
  try {
    const { psw } = req.body.payload;
    const { token } = req.body.payload;
    const hashedPassword = await bcrypt.hash(psw, 10);
    const user = await User.findOne({ where: { verification_token: token } });
    user.user_password = hashedPassword;
    user.verification_token = null;
    await user.save();
    res.status(200).send("Password cambiata con successo");
  } catch (err) {
    res.status(400).send("Errore");
  }
};

// End password reset

exports.loginUser = async (req, res) => {
  const { email, user_password } = req.body;

  const user = await User.findOne({ where: { email: email } });
  if (user === null) {
    return res.status(401).json({ message: "Utente non registrato" });
  }
  if (user.is_verified === false) {
    return res.status(401).json({ message: "Email non verificata" });
  }
  if (user.status === 1) {
    return res.status(401).json({ message: "accesso non consentito" });
  }
  if (user.is_deleted === true) {
    return res.status(401).json({
      message:
        "utente disattivato, per riattivazione inviare mail a tipiantoperamore@gmail.com",
    });
  }
  const passwordMatch = await bcrypt.compare(user_password, user.user_password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Password non corretta" });
  } else {
    try {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "600s" }
      );
      const refreshToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.REFRESH_SECRET,
        { expiresIn: "120d" }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        // maxAge: 1000,
        maxAge: 120 * 24 * 60 * 60 * 1000, // 120 days
      });
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: "Lax",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // });

      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      return res.status(200).json({
        message: "Login successful",
        token,
        user: req.session.user,
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  }
};
exports.googleAccess = async (req, res) => {
  const { clientId, credential } = req.body;
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    clientId: clientId,
    idToken: credential,
  });
  const payload = ticket.getPayload();
  // const test = new OAuth2Client({
  //   clientId: clientId,
  //   clientSecret: credential,
  // });

  const { given_name, family_name, email } = payload;
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    const user = await User.create({
      first_name: given_name,
      last_name: family_name,
      // city: city,
      // gender: gender,
      // birthday: birthday,
      email: email,
      user_name: given_name,
      is_verified: true,
      google: 0,
      // phone: phone,
      // user_password: hashedPassword,
      // verification_token: email_token,
    });
    const token = jwt.sign(
      { id: user.id, email: email, role: "user" },
      "your_jwt_secret_key",
      { expiresIn: "10d" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "120d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      // maxAge: 1000,
      maxAge: 120 * 24 * 60 * 60 * 1000, // 120 days
    });
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "Lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return res.status(200).json({
      message: "Login successful",
      token,
      user: req.session.user,
    });
  }
  try {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "600s" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "120d" }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      // maxAge: 1000,
      maxAge: 120 * 24 * 60 * 60 * 1000, // 120 days
    });
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "Lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return res.status(200).json({
      message: "Login successful",
      token,
      user: req.session.user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
exports.googleAccessAndroid = async (req, res) => {
  let { familyName, givenName, email } = req.body;
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    const user = await User.create({
      first_name: givenName,
      last_name: familyName,
      // city: city,
      // gender: gender,
      // birthday: birthday,
      email: email,
      user_name: givenName,
      is_verified: true,
      google: 0,
      // phone: phone,
      // user_password: hashedPassword,
      // verification_token: email_token,
    });
    const token = jwt.sign(
      { id: user.id, email: email, role: "user" },
      "your_jwt_secret_key",
      { expiresIn: "10d" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "120d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      // maxAge: 1000,
      maxAge: 120 * 24 * 60 * 60 * 1000, // 120 days
    });

    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return res.status(200).json({
      message: "Login successful",
      token,
      user: req.session.user,
    });
  }
  try {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "600s" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "120d" }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      // maxAge: 1000,
      maxAge: 120 * 24 * 60 * 60 * 1000, // 120 days
    });

    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return res.status(200).json({
      message: "Login successful",
      token,
      user: req.session.user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }

  // if (!authHeader) {
  //   return res.status(401).json({ message: "nessun header trovato" });
  // }

  // if (authHeader && authHeader.startsWith("Bearer ")) {
  //   authHeader = authHeader.substring(7);
  // }
  // const googleValidationRes = await fetch(
  //   `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${authHeader}`
  // );

  // if (googleValidationRes.status !== 200) {
  //   return res
  //     .status(401)
  //     .json({ error: "google could not verify access token" });
  // }
  // const googleRes = await googleValidationRes.json();
  // return res.text(`hello ${googleRes.email}`);
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    // i set 404 for avoiding infinite loop, it was 401
    return res.status(404).send("Token not found");
  }
  try {
    // JWT_SECRET_KEY needs to be replaced with REFRESH_SECRET, here and also where actually sign the  refresh token
    const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10s" }
    );
    res.status(200).json({
      message: "Login successful",
      token: newAccessToken,
      user: req.session.user,
    });
  } catch (err) {
    res.status(403).send("Error while trying to get the refresh token");
  }
};

exports.logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    // res.clearCookie("user_sid", { path: "/" });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  });
};

exports.fetchRegions = async (req, res) => {
  try {
    const response = await axios.get(
      "http://api.geonames.org/childrenJSON?geonameId=3175395&username=franek"
    );

    if (response.data.status?.value == 19) {
      res.json({
        message: "Abbiamo finito le prove gratuite, riprova fra un'oretta",
        status: 503,
      });

      return;
    }
    if (response.data.totalResultsCount) {
      res.json(response.data.geonames);
    }
  } catch (err) {
    res.status(500).json({
      message: "Qualcosa è andato storto facendo il fetching delle regioni",
    });
  }
};
exports.fetchDistricts = async (req, res) => {
  let geonameId = req.query.regionCode;
  try {
    const response = await axios.get(
      `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=franek`
    );

    res.json(response.data.geonames);
  } catch (error) {
    res.status(500).json({ error: "qualcosa è andato storto" });
  }
};
exports.fetchCities = async (req, res) => {
  let geonameId = req.query.cityCode;
  try {
    const response = await axios.get(
      `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=franek`
    );

    res.json(response.data.geonames);
  } catch (error) {
    res.status(500).json({ error: "qualcosa è andato storto" });
  }
};

// };

exports.generateFiscalCode = async (req, res) => {
  const { name, lastName, gender, city, year, month, day } = req.body.payload;
  try {
    const response = await axios.get(
      `http://api.miocodicefiscale.com/calculate?lname=${lastName}&fname=${name}&gender=${gender}&city=${city}&state=BA&day=${day}&month=${month}&year=${year}&access_token=${process.env.CF_KEY}`
    );
    const fiscalCode = response.data.data.cf;
    res.json(fiscalCode);
  } catch (error) {}
};
exports.validateFiscalCode = async (req, res) => {
  const fiscalCode = req.body.payload;
  try {
    const response = await axios.get(
      `${process.env.CF_URL}?cf=${fiscalCode}&access_token=${process.env.CF_KEY}`
    );

    // if (response.data.status) {
    res.status(200).json(response.data);
    // } else {
    //   res.json("codice non valido");
    // }
  } catch (error) {
    res.status(500).json({ error: "qualcosa è andato storto" });
  }
};

// to be moved
exports.userSession = async (req, res) => {
  if (req.session && req.session.user) {
    // User is authenticated
    return res.json({ authenticated: true, user: req.session.user });
  }
  // User is not authenticated
  res.status(401).json({ authenticated: false, message: "Not authenticated" });
};
