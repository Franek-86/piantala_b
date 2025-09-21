const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const con = require("../config/db");
const crypto = require("crypto");
const transporter = require("../config/nodemailer");
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
    console.log(user);
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
    console.log("t3", user);
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

exports.sendPaymentConfirmationEmail = async (req, res) => {
  console.log("aabbdd", req.body);
  const { email, order_number, created_at } = req.body.payload;
  try {
    sendPaymentConfirmationEmail(email, order_number, created_at);
    res.status(200).json({ message: "email inviata" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "c'è stato un errore nell'invio email, email non inviata",
    });
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
      console.error(error);
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
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
exports.setUserPic = async (req, res) => {
  try {
    const id = req.body.id;

    // const name = req.files[0].originalname;
    // const type = req.files[0].mimetype;
    const buffer = req.file.buffer;

    const formData = new FormData();
    formData.append("image", buffer);

    const imgurResponse = await imgurAdd(formData);
    if (imgurResponse.status === 200) {
      console.log("aaas", imgurResponse);

      const hash = imgurResponse.data.data.deletehash;
      console.log("aaas", hash);
      const pic = imgurResponse.data.data.link;
      try {
        const user = await User.findOne({ where: { user_id: id } });
        if (user) {
          user.pic = pic;
          user.hash_pic = hash;
          user.save();
          res.status(200).json({ message: "Profile pic added", url: pic });
        }
      } catch (err) {
        res.status(500).json({ message: err });
      }
    }
  } catch (err) {
    console.log("error from set pic", err);
  }
};
exports.deleteUserPic = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findOne({ where: { user_id: id } });
    if (user) {
      console.log(user);
      const hash_pic = user.hash_pic;
      console.log(hash_pic);
      const imgurResponse = await imgurDelete(hash_pic);

      if (imgurResponse.status === 200) {
        console.log("here the imgur response from delete pic", imgurResponse);
        user.hash_pic = null;
        user.pic = null;
        user.save();
        res.status(200).json({ message: "Immagine rimossa con successo" });
      }

      // console.log(imgurResponse);
      // se va bene calcello anche su db
    }
  } catch (err) {
    console.log("error from remove pic", err);
    res
      .status(500)
      .json({ message: "Errore nell'eliminazione dell'immagine profilo" });
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
      console.error(error);
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
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
exports.getUserInfo = async (req, res) => {
  const user_id = req.params.id;
  console.log("asaa", user_id);
  try {
    const user = await User.findOne({ where: { user_id: user_id } });
    if (user) {
      console.log("135", user.user_name);
      const test = {
        id: user_id,
        userName: user.dataValues.user_name,
        email: user.dataValues.email,
        phone: user.dataValues.phone,
        pic: user.dataValues.pic,
      };
      // const test = user.dataValues.user_name;
      console.log("test1", test);
      res.status(200).send(test);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
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
  console.log(
    "user_name and phone",
    first_name,
    last_name,
    city,
    birthday,
    fiscal_code,
    user_name,
    phone
  );

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
      // return res
      //   .status(200)
      //   .json({ message: "User registered and email sent" });
      // const mailOptions = emailToBeSent(email, user);
      // transporter.sendMail(mailOptions, (error, info) => {
      //   if (error) {
      //     console.error(error);
      //   } else {
      //     console.log("Email sent: " + info.response);
      //   }
      // });
    } catch (error) {
      console.log("Error sending email: ", error);
      res.status(500).send("Error: Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};
exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  const checkOrders = await Order.findAll({ where: { user_id: id } });
  console.log("check orders", checkOrders.length);
  if (checkOrders.length === 0) {
    try {
      await User.destroy({ where: { user_id: id } });
      res.status(200).json({ message: "user successfully deleted" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    try {
      const user = await User.findOne({ where: { user_id: id } });

      user.is_deleted = true;
      await user.save();
      console.log("check user", user);
      res.status(200).json({ message: "user successfully deleted" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
};

// Start password reset

exports.passwordLink = async (req, res) => {
  console.log("tutaj", req.body);
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
      console.log("I need to create a token?", token);
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
        console.log("error:", error);
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

exports.sendEmail = async (req, res) => {
  const {
    loggedUserInfo: { email },
    messageBody,
  } = req.body.payload;
  console.log("here", email, messageBody);

  const mailOptions = {
    // from: email,
    to: "tipiantoperamore@gmail.com",
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
      console.log("test11", user.id);
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
      console.log("this", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
};
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log("test1234", refreshToken);
  if (!refreshToken) {
    console.log("no refresh token found");
    // i set 404 for avoiding infinite loop, it was 401
    return res.status(404).send("Token not found");
  }
  try {
    // JWT_SECRET_KEY needs to be replaced with REFRESH_SECRET, here and also where actually sign the  refresh token
    console.log("sta facendo il try");
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
  } catch (error) {
    console.log(error);
  }
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
