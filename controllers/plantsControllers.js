const con = require("../config/db");
const FormData = require("form-data");
const axios = require("axios");
const User = require("../models/User");
const Plant = require("../models/Plant");

exports.addPlate = async (req, res) => {
  const file = req.file;
  let { id } = req.params;
  id = parseInt(id);
  console.log("this", id);

  if (!file) {
    res.status(400).send("no file uploaded");
  }
  try {
    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: req.file.originalname, // Ensure correct filename is passed
      contentType: req.file.mimetype, // Ensure correct MIME type is passed
    });

    const formHeaders = formData.getHeaders();
    let accessToken = process.env.IMGUR_INTIAL_ACCESS_TOKEN;
    async function refreshToken() {
      const response = await axios.post("https://api.imgur.com/oauth2/token", {
        refresh_token: process.env.IMGUR_REFRESH_TOKEN, // Replace with your refresh token
        client_id: process.env.IMGUR_CLIENT_ID,
        client_secret: process.env.IMGUR_CLIENT_SECRET,
        grant_type: "refresh_token",
      });
      console.log("here1", response.data.access_token);
      accessToken = response.data.access_token; // Store new token
    }
    await refreshToken();
    // Add the Authorization header for Imgur API
    const headers = {
      ...formHeaders,
      Authorization: `Bearer ${accessToken}`, // Ensure the Client-ID is set properly
    };
    console.log("Request Headers:", headers);
    // Log the final headers

    const imgurResponse = await axios.post(
      "https://api.imgur.com/3/image",
      formData,
      {
        headers: headers,
      }
    );

    if (imgurResponse && imgurResponse.data && imgurResponse.data.success) {
      const imageUrl = imgurResponse.data.data.link;
      const plateHash = imgurResponse.data.data.deletehash;
      console.log("this2", imageUrl);
      try {
        const updatedPlate = await Plant.update(
          { plate: imageUrl, plate_hash: plateHash },
          {
            where: {
              id: id,
            },
          }
        );
        res.status(201).json({
          message: "Item added successfully!",
          id: updatedPlate.insertId,
          image_url: imageUrl,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      console.error("Error uploading image:", imgurResponse.data);
      return res
        .status(500)
        .json({ message: "Error uploading image to Imgur" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addPlant = async (req, res) => {
  const {
    lat,
    lang,
    user_id,
    city,
    suburb,
    road,
    residential,
    shop,
    house_number,
  } = req.body; // Extract lat, lang, user_id from the form

  // Handle file upload
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const formData = new FormData();
    formData.append("image", req.file.buffer, {
      filename: req.file.originalname, // Ensure correct filename is passed
      contentType: req.file.mimetype, // Ensure correct MIME type is passed
    });
    // Get headers for the form data
    const formHeaders = formData.getHeaders();

    // Log the headers to make sure everything looks correct
    console.log("FormData Headers:", formHeaders);

    // Add the Authorization header for Imgur API

    // Log the final headers

    let accessToken = process.env.IMGUR_INTIAL_ACCESS_TOKEN;
    async function refreshToken() {
      const response = await axios.post("https://api.imgur.com/oauth2/token", {
        refresh_token: process.env.IMGUR_REFRESH_TOKEN, // Replace with your refresh token
        client_id: process.env.IMGUR_CLIENT_ID,
        client_secret: process.env.IMGUR_CLIENT_SECRET,
        grant_type: "refresh_token",
      });
      console.log("here1", response.data.access_token);
      accessToken = response.data.access_token; // Store new token
      console.log("New Access Token:", accessToken);
    }
    await refreshToken();
    const headers = {
      ...formHeaders,
      Authorization: `Bearer ${accessToken}`, // Ensure the Client-ID is set properly
    };
    console.log("Request Headers:", headers);
    const imgurResponse = await axios.post(
      "https://api.imgur.com/3/image",
      formData,
      {
        headers: headers,
      }
    );
    if (imgurResponse && imgurResponse.data && imgurResponse.data.success) {
      const imageUrl = imgurResponse.data.data.link;
      const deleteHash = imgurResponse.data.data.deletehash;
      const newPlant = await Plant.create({
        lat,
        lang,
        image_url: imageUrl,
        delete_hash: deleteHash,
        user_id,
        city,
        suburb,
        road,
        residential,
        shop,
        house_number,
      });
      console.log("1111", newPlant);
      res.status(201).json({
        message: "Item added successfully!",
        id: newPlant.id,
        // id: result.insertId,
        image_url: imageUrl,
      });
    } else {
      console.error("Error uploading image:", imgurResponse.data);
      return res
        .status(500)
        .json({ message: "Error uploading image to Imgur" });
    }
  } catch (err) {
    console.error("Error uploading file to Imgur or inserting record:", err);
    res.status(500).send("Error uploading file or inserting record.");
  }
};

exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.findAll();
    res.status(200).json(plants);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateOwner = async (req, res) => {
  const { id, owner_id, comment, plantType, status, purchase_date } = req.body; // Get the new status from the request body
  console.log(
    "test345",
    id,
    owner_id,
    comment,
    plantType,
    status,
    purchase_date
  );
  // qui
  // Change everyone without a last name to "Doe"
  try {
    const updateOwner = await Plant.update(
      {
        owner_id: owner_id,
        plant_type: plantType,
        user_comment: comment,
        status_piantina: status,
        purchase_date: purchase_date,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (!updateOwner) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json({
      message: `Plant ${id} ownership updated successfully, owner id is ${owner_id}`,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
exports.updateStatus = async (req, res) => {
  const { id } = req.params; // Get the plant ID from the URL
  const { status, rejection_comment } = req.body; // Get the new status and rejection comment from the request body
  console.log("comment1113", req);
  console.log("comment 111", rejection_comment);
  console.log("comment 1112", status);

  // Validate the status
  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    if (rejection_comment !== undefined) {
      try {
        await Plant.update(
          { status_piantina: status, rejection_comment: rejection_comment },
          {
            where: {
              id: id,
            },
          }
        );

        return res
          .status(200)
          .json({ message: `Plant ${id} updated to ${status} successfully!` });
      } catch (err) {
        return res
          .status(500)
          .json(`rejection update failed due to: ${err.message}`);
      }
    } else {
      try {
        await Plant.update(
          { status_piantina: status },
          {
            where: {
              id: id,
            },
          }
        );

        return res.status(200).json({
          message: `Plant ${id} updated to ${status} successfully!`,
        });
      } catch (err) {
        return res
          .status(500)
          .json({ message: `status update failed due to: ${err.message}` });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.clearPlate = async (req, res) => {
  const { id, plate_hash } = req.body;
  console.log("sta12", id, plate_hash);
  const deleteFromImgur = async (hash) => {
    console.log("123321");
    if (!hash) return;
    try {
      async function refreshToken() {
        const response = await axios.post(
          "https://api.imgur.com/oauth2/token",
          {
            refresh_token: process.env.IMGUR_REFRESH_TOKEN, // Replace with your refresh token
            client_id: process.env.IMGUR_CLIENT_ID,
            client_secret: process.env.IMGUR_CLIENT_SECRET,
            grant_type: "refresh_token",
          }
        );
        console.log("here1", response.data.access_token);
        accessToken = response.data.access_token; // Store new token
        console.log("New Access Token:", accessToken);
      }
      await refreshToken();
      const imgurResponse = await axios.delete(
        `https://api.imgur.com/3/image/${hash}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(`Image with hash ${hash} deleted:`, imgurResponse.data);
    } catch (error) {
      console.error(`Failed to delete image with hash ${hash}:`, error);
    }
  };
  const sqlUpdate =
    "UPDATE plants SET plate = NULL, plate_hash = NULL WHERE id = $1";

  const removePlate = async (id) => {
    try {
      con.query(sqlUpdate, [id], (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        res.json(results);
      });
    } catch (err) {
      console.log(err);
    }
  };
  await deleteFromImgur(plate_hash);
  await removePlate(id);
};

exports.deletePlant = async (req, res) => {
  const { id } = req.params; // Get the plant ID from the URL

  const test = await Plant.findAll({
    attributes: ["image_url", "delete_hash", "plate", "plate_hash"],
    where: {
      id: id,
    },
  });
  const { image_url, delete_hash, plate, plate_hash } = test[0].dataValues;

  const deleteFromImgur = async (hash) => {
    if (!hash) return;
    try {
      let accessToken = process.env.IMGUR_INTIAL_ACCESS_TOKEN;
      async function refreshToken() {
        const response = await axios.post(
          "https://api.imgur.com/oauth2/token",
          {
            refresh_token: process.env.IMGUR_REFRESH_TOKEN, // Replace with your refresh token
            client_id: process.env.IMGUR_CLIENT_ID,
            client_secret: process.env.IMGUR_CLIENT_SECRET,
            grant_type: "refresh_token",
          }
        );
        console.log("here1", response.data.access_token);
        accessToken = response.data.access_token; // Store new token
      }
      await refreshToken();
      const imgurResponse = await axios.delete(
        `https://api.imgur.com/3/image/${hash}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(`Image with hash ${hash} deleted:`, imgurResponse.data);
    } catch (error) {
      console.error(`Failed to delete image with hash ${hash}:`, error);
    }
  };

  await Promise.all([
    deleteFromImgur(delete_hash),
    deleteFromImgur(plate_hash),
  ]);

  try {
    await Plant.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: `Plant ${id} successfully deleted!` });
  } catch (err) {
    res
      .status(400)
      .json(
        `something went wrong deleting the plant after deleting images from imgur: ${err.message}`
      );
  }
};

exports.getUserPlants = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await Plant.findAll({
      where: {
        user_id: userId,
      },
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).send(err);
  }

  // console.log("test0", user);

  // const sql = "SELECT * FROM plants WHERE user_id = $1";
  // con.query(sql, [userId], (err, results) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).send(err);
  //   }
  //   console.log("test1", results.rows);
  //   res.json(results.rows);
  // });
};

exports.getOwnedPlants = async (req, res) => {
  console.log("ciao dal get owned plants", req.query.ID);
  const ownerID = req.query.ID;
  // const sql = "select * from plants where owner_id = $1";
  // con.query(sql, [ownerID], (err, results) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).send(err);
  //   }
  //   res.json(results.rows);
  // });
  try {
    const user = await Plant.findAll({
      where: {
        owner_id: ownerID,
      },
    });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.getReporterInfo = async (req, res) => {
  const reporterId = req.params.id;
  console.log("aaa1", reporterId);
  try {
    const response = await User.findOne({ where: { id: reporterId } });
    if (response === null) {
      console.log("Not found!");
      es.status(404).send("Not Found");
    } else {
      console.log(response instanceof User); // true
      console.log(response); // 'My Title'
      const formatDate = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString("en-GB");
      };
      const repData = {
        firstName: response.first_name,
        lastName: response.last_name,
        birthday: formatDate(response.birthday),
        user: response.user_name,
        phone: response.phone,
        role: response.role,
        email: response.email,
        cratedAt: formatDate(response.createdAt),
      };
      res.status(200).send(repData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
exports.getOwnerInfo = async (req, res) => {
  const ownerId = req.params.id;
  console.log("aaa1", ownerId);
  try {
    const response = await User.findOne({ where: { id: ownerId } });
    if (response === null) {
      console.log("Not found!");
      es.status(404).send("Not Found");
    } else {
      const formatDate = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString("en-GB");
      };

      const repData = {
        firstName: response.first_name,
        lastName: response.last_name,
        city: response.city,
        birthday: formatDate(response.birthday),
        fiscalCode: response.fiscal_code,
        user: response.user_name,
        role: response.role,
        phone: response.phone,
        email: response.email,
        cratedAt: formatDate(response.createdAt),
      };
      console.log(repData);
      res.status(200).send(repData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
