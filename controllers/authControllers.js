const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const con = require("../config/db");
const crypto = require("crypto");
const transporter = require("../config/nodemailer");
const User = require("../models/User");

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
    return res.redirect(
      `${process.env.DOMAIN_NAME_CLIENT}/verification-success`
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.registerUser = async (req, res) => {
  const { email, user_password, role } = req.body;

  const validRoles = ["user", "admin"];
  const userRole = validRoles.includes(role) ? role : "user";

  try {
    const hashedPassword = await bcrypt.hash(user_password, 10);
    let email_token = generateVerificationToken();

    const user = await User.create({
      email: email,
      user_password: hashedPassword,
      verification_token: email_token,
    });
    const token = jwt.sign(
      { id: user.id, email: email, role: userRole },
      "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Controlla la tua mailbox per completare la registrazione",
      token,
    });
    if (!email) {
      return res.status(400).send("no email address provided");
    }
    try {
      const mailOptions = {
        from: "franekdev86@gmail.com",
        to: email,
        subject: "Email Verification",
        html: `<p><a href="${process.env.DOMAIN_NAME_SERVER}/api/auth/verify/${user.verification_token}">here</a> to verify your email.</p>`,
      };
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
  console.log("sta qui", email);
  const sql = "SELECT * FROM users WHERE email = $1";
  console.log("sta qua", sql);
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
    console.log("test", result.rows[0].is_verified);
    if (!result.rows[0].is_verified) {
      return res.status(401).json({ message: "email non verificata" });
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

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      "your_jwt_secret_key",
      { expiresIn: "1h" }
    );
    console.log("boh");
    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.user_id, email: user.email, role: user.role },
    });
  });
};

exports.logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

// to be checked if needed
exports.getAllUsers = (req, res) => {
  const sql = "SELECT * FROM users";
  con.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
};
