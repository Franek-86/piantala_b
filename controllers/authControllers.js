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
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.is_verified = true;
    user.verification_token = null;
    await user.save();
    return res.redirect(`${domainNameClient}/verification-success`);
  } catch (error) {
    console.error(error);
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
      console.log("135", user);
      const test = {
        userName: user.dataValues.user_name,
        email: user.dataValues.email,
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
      { expiresIn: "1h" }
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
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    } catch (error) {
      console.log("Error sending email: ", error);
      res.status(500).send("Error: Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.loginUser = (req, res) => {
  // console.log(process.env.STATIC_DIR);
  const { email, user_password } = req.body;
  const sql = "SELECT * FROM users WHERE email = $1";
  con.query(sql, [email], async (err, result) => {
    console.log("result", result);
    if (err) {
      console.log("err", err);
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Utente non registrato" });
    }
    if (!result.rows[0]?.is_verified) {
      return res.status(401).json({ message: "Email non verificata" });
    }

    console.log("aaa", result.rows[0].status);
    if (result.rows[0].status === 1) {
      console.log("abb", result.rows[0].status);
      return res.status(401).json({ message: "accesso non consentito" });
    }
    console.log("this", user);
    const passwordMatch = await bcrypt.compare(
      user_password,
      user.user_password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Set user info in session
    req.session.user = { id: user.user_id, email: user.email, role: user.role };

    req.session.save((err) => {
      if (err) {
        console.log("bbb", err);
        return res.status(500).json({ message: "login error" });
      }
      res.cookie("user_id", req.sessionID, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      // res.setHeader(
      //   "Set-Cookie",
      //   "test_cookie=hello; Path=/; HttpOnly; Secure; SameSite=None"
      // );
      const token = jwt.sign(
        { id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: req.session.user,
      });
    });
  });
};

exports.logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("user_sid", { path: "/" });
    res.status(200).json({ message: "Logged out successfully" });
  });
};

// to be checked if needed
exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.findAll({ where: { is_verified: true } });
    if (user) {
      console.log("user123", user);
      let usersToBeSent = user.map((i) => {
        console.log("aaa", i.dataValues.user_password);
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
      console.log("user to be sent", usersToBeSent);

      res.status(200).send({
        usersToBeSent,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchRegions = async (req, res) => {
  try {
    const response = await axios.get(
      "http://api.geonames.org/childrenJSON?geonameId=3175395&username=franek"
    );

    // console.log("test", response.data.status.value);
    if (response.data.status?.value == 19) {
      console.log("test1");
      res.json({
        message: "Abbiamo finito le prove gratuite, riprova fra un'oretta",
        status: 503,
      });

      return;
    }
    if (response.data.totalResultsCount) {
      console.log("this", response.data.totalResultsCount);
      res.json(response.data.geonames);
    }
  } catch (err) {
    res.status(500).json({
      message: "Qualcosa è andato storto facendo il fetching delle regioni",
    });
  }
};
exports.fetchDistricts = async (req, res) => {
  console.log("aaa", req.query.regionCode);
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
  console.log("qua", req.body.payload);
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
    console.log("quaa", response);
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
  console.log("session", req.session);

  if (req.session && req.session.user) {
    // User is authenticated
    return res.json({ authenticated: true, user: req.session.user });
  }
  // User is not authenticated
  res.status(401).json({ authenticated: false, message: "Not authenticated" });
};
