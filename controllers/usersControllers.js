const crypto = require("crypto");

const db = require("../models");
const User = db.User;
const Order = db.Order;

const { imgurAdd } = require("../assets/imgur");
const { imgurDelete } = require("../assets/imgur");
const transporter = require("../config/nodemailer");
const FormData = require("form-data");

exports.userSession = async (req, res) => {
  if (req.session && req.session.user) {
    // User is authenticated
    return res.json({ authenticated: true, user: req.session.user });
  }
  // User is not authenticated
  res.status(401).json({ authenticated: false, message: "Not authenticated" });
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
      const hash = imgurResponse.data.data.deletehash;
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
  } catch (err) {}
};

exports.deleteUserPic = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findOne({ where: { user_id: id } });
    if (user) {
      const hash_pic = user.hash_pic;
      const imgurResponse = await imgurDelete(hash_pic);

      if (imgurResponse.status === 200) {
        user.hash_pic = null;
        user.pic = null;
        user.save();
        res.status(200).json({ message: "Immagine rimossa con successo" });
      }

      // se va bene calcello anche su db
    }
  } catch (err) {
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
  try {
    const user = await User.findOne({ where: { user_id: user_id } });
    if (user) {
      const test = {
        id: user_id,
        userName: user.dataValues.user_name,
        email: user.dataValues.email,
        phone: user.dataValues.phone,
        pic: user.dataValues.pic,
      };
      // const test = user.dataValues.user_name;
      res.status(200).send(test);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  const checkOrders = await Order.findAll({ where: { user_id: id } });
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
      res.status(200).json({ message: "user successfully deleted" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
};
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
exports.sendEmail = async (req, res) => {
  const {
    loggedUserInfo: { email },
    messageBody,
  } = req.body.payload;

  const mailOptions = {
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
