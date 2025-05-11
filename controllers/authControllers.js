const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const con = require("../config/db");
const crypto = require("crypto");
const transporter = require("../config/nodemailer");
const User = require("../models/User");

const axios = require("axios");
const emailToBeSent = require("../assets/mailOptions");
const domainNameClient =
  process.env.NODE_ENV === "test"
    ? process.env.DOMAIN_NAME_TEST_CLIENT
    : process.env.DOMAIN_NAME_CLIENT;
const generateVerificationToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

exports.verificationEmail = async (req, res) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.is_verified = true;
    user.verification_token = null;
    await user.save();
    return res.redirect(`${domainNameClient}/verification-success`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.verificationEmailPasswordReset = async (req, res) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.is_verified = true;
    // user.verification_token = null;
    await user.save();
    return res.redirect(
      `${domainNameClient}/verification-success-reset/${user.verification_token}`
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.setUserRole = async (req, res) => {
  const { id, role } = req.body.payload.userInfo;
  if (role === "admin") {
    try {
      await User.update(
        { role: "user" },
        {
          where: {
            user_id: id,
          },
        }
      );

      res.status(200).send("diritti amministrativi rimossi");
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  if (role === "user") {
    try {
      await User.update(
        { role: "admin" },
        {
          where: {
            user_id: id,
          },
        }
      );

      res.status(200).send("diritti amministrativi aggiunti");
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
exports.setUserStatus = async (req, res) => {
  const { id, status } = req.body.payload.userInfo;
  if (status === 0) {
    try {
      await User.update(
        { status: 1 },
        {
          where: {
            user_id: id,
          },
        }
      );

      res.status(200).send("User has been blocked");
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  if (status === 1) {
    try {
      await User.update(
        { status: 0 },
        {
          where: {
            user_id: id,
          },
        }
      );

      res.status(200).send("User has been unblocked");
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
exports.getUserInfo = async (req, res) => {
  const user_id = req.params.id;
  try {
    const user = await User.findOne({ where: { user_id: user_id } });
    if (user) {
      const test = {
        userName: user.dataValues.user_name,
        email: user.dataValues.email,
      };
      // const test = user.dataValues.user_name;
      res.status(200).send(test);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.registerUser = async (req, res) => {
  const {
    first_name,
    last_name,
    address,
    birthday,
    fiscal_code,
    email,
    city,
    gender,
    user_password,
    role,
    user_name,
    phone,
  } = req.body;

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: "Utente già registrato" }); // Send a message "User
  }
  try {
    const hashedPassword = await bcrypt.hash(user_password, 10);
    let email_token = generateVerificationToken();

    const user = await User.create({
      first_name: first_name,
      last_name: last_name,
      city: city,
      gender: gender,
      birthday: birthday,
      fiscal_code: fiscal_code,
      email: email,
      user_name: user_name,
      phone: phone,
      user_password: hashedPassword,
      verification_token: email_token,
    });
    const token = jwt.sign(
      { id: user.id, email: email, role: "user" },
      "your_jwt_secret_key",
      { expiresIn: "10d" }
    );

    res.status(201).json({
      message:
        "Controlla la tua casella di posta per completare la registrazione",
      token,
    });
    if (!email) {
      return res.status(400).send("no email address provided");
    }
    try {
      const mailOptions = emailToBeSent(email, user);
      transporter.sendMail(mailOptions, (error, info) => {});
    } catch (error) {
      res.status(500).send("Error: Something went wrong. Please try again.");
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Start password reset

exports.passwordLink = async (req, res) => {
  const { email } = req.body.data;
  try {
    const user = await User.findOne({ where: { email } });
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
          ? process.env.DOMAIN_NAME_TEST_SERVER
          : process.env.DOMAIN_NAME_SERVER
      }/api/auth/reset-password/verify/${user.verification_token}`;

      const mailOptions = {
        from: "franekdev86@gmail.com",
        to: `${user.email}`,
        cc: "franekdev86@gmail.com",
        subject: "password reset",
        html: `<p>${url}</p>`,
      };
      try {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(400).send({
              message: "email non inviata, errore nell'invio della email",
            });
          } else {
            res.status(200).send({ message: "Email inviata" });
          }
        });
      } catch (error) {
        res.status(500).send("Something went wrong. Please try again.");
      }
    }
    if (token) {
      const url = `${
        process.env.NODE_ENV === "test"
          ? process.env.DOMAIN_NAME_TEST_SERVER
          : process.env.DOMAIN_NAME_SERVER
      }/api/auth/reset-password/verify/${user.verification_token}`;

      const mailOptions = {
        from: "franekdev86@gmail.com",
        to: `${user.email}`,
        cc: "franekdev86@gmail.com",
        subject: "password reset",
        html: `<p>${url}</p>`,
      };
      try {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(400).send({
              message: "email non inviata, errore nell'invio della email",
            });
          } else {
            res.status(200).send({ message: "email inviata" });
          }
        });
      } catch (error) {
        res.status(500).send("Error: Something went wrong. Please try again.");
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

exports.sendEmail = async (req, res) => {
  const {
    loggedUserInfo: { email },
    messageBody,
  } = req.body.payload;

  const mailOptions = {
    from: "franekdev86@gmail.com",
    to: "amicidiernestverner@gmail.com",
    cc: "franekdev86@gmail.com",
    subject: `Ti Pianto per Amore - email da ${email}`,
    html: `<p>${messageBody}</p>`,
  };
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(400).send({
          message: "email non inviata, errore nell'invio della email",
        });
      } else {
        res.status(200).send({ message: "email inviata" });
      }
    });
  } catch (error) {
    res.status(500).send("Error: Something went wrong. Please try again.");
  }
};

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
  const passwordMatch = await bcrypt.compare(user_password, user.user_password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Password non corretta" });
  } else {
    try {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "10s" }
      );
      const refreshToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 20 * 24 * 60 * 60 * 1000, // 20 days
      });
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: "Lax",
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // });
      // Set user info in session
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
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).send("Token not found");
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

// to be checked if needed
exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.findAll({ where: { is_verified: true } });
    if (user) {
      let usersToBeSent = user.map((i) => {
        delete i.dataValues.user_password;
        delete i.dataValues.verification_token;
        delete i.dataValues.phone;
        delete i.dataValues.fiscal_code;
        delete i.dataValues.email;
        delete i.dataValues.updated_at;
        delete i._previousDataValues;
        delete i.uniqno;

        return i;
      });

      res.status(200).send({
        usersToBeSent,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
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

exports.userSession = async (req, res) => {
  if (req.session && req.session.user) {
    // User is authenticated
    return res.json({ authenticated: true, user: req.session.user });
  }
  // User is not authenticated
  res.status(401).json({ authenticated: false, message: "Not authenticated" });
};
