const con = require("../config/db");
const FormData = require("form-data");
const axios = require("axios");
const User = require("../models/User");
// const fs = require("fs");
// const path = require("path");
// const bucket = require("../config/firebaseConfig");
// const { v4: uuidv4 } = require("uuid");

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

    // Add the Authorization header for Imgur API
    const headers = {
      ...formHeaders,
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, // Ensure the Client-ID is set properly
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

      // Now insert the record into the database with the image URL
      const sql = `UPDATE piantine set plate = $1, plate_hash = $2 where id = ${id}`;
      con.query(sql, [imageUrl, plateHash], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }

        // Return success response with the inserted record's ID
        res.status(201).json({
          message: "Item added successfully!",
          id: result.insertId,
          image_url: imageUrl,
        });
      });
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
    console.log("File buffer:", req.file.buffer); // Ensure this contains data
    console.log("File mime type:", req.file.mimetype); // Check mime type
    console.log("File size:", req.file.size); // Check file size
    // Create a new FormData instance and append the file buffer
    // Create form data and append the image buffer
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
    const headers = {
      ...formHeaders,
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, // Ensure the Client-ID is set properly
    };

    // Log the final headers
    console.log("Request Headers:", headers);

    const imgurResponse = await axios.post(
      "https://api.imgur.com/3/image",
      formData,
      {
        headers: headers,
      }
    );
    // If the response is successful, extract the image URL
    if (imgurResponse && imgurResponse.data && imgurResponse.data.success) {
      const imageUrl = imgurResponse.data.data.link;
      const deleteHash = imgurResponse.data.data.deletehash;

      // Now insert the record into the database with the image URL
      const sql =
        "INSERT INTO piantine (lat, lang, image_url, delete_hash, user_id, city, suburb, road, residential, shop, house_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
      con.query(
        sql,
        [
          lat,
          lang,
          imageUrl,
          deleteHash,
          user_id,
          city,
          suburb,
          road,
          residential,
          shop,
          house_number,
        ],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }

          // Return success response with the inserted record's ID
          res.status(201).json({
            message: "Item added successfully!",
            id: result.insertId,
            image_url: imageUrl,
          });
        }
      );
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

exports.getAllPlants = (req, res) => {
  const sql = "SELECT * FROM piantine";
  con.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    console.log("results123", results);
    res.json(results.rows);
  });
};

exports.updateOwner = (req, res) => {
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

  const sql =
    "UPDATE piantine SET owner_id = $1, plant_type = $2, user_comment = $3, status_piantina = $4, purchase_date = $5 WHERE id = $6";
  con.query(
    sql,
    [owner_id, plantType, comment, status, purchase_date, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
      }
      if (result.affectedRows === 0) {
        console.log(err);
        return res.status(404).json({ message: "Plant not found" });
      }
      res.status(200).json({
        message: `Plant ${id} ownership updated successfully, owner id is ${owner_id}`,
      });
    }
  );
  return "test";
};
exports.updateStatus = (req, res) => {
  const { id } = req.params; // Get the plant ID from the URL
  const { status, rejection_comment } = req.body; // Get the new status and rejection comment from the request body
  console.log("comment", rejection_comment);

  // Validate the status
  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({ message: "Invalid status" });
  }

  // Prepare the SQL query
  let sql = "UPDATE piantine SET status_piantina = $1";
  const params = [status];
  console.log("params", params);
  // If rejection_comment is defined, add it to the update query
  if (rejection_comment !== undefined) {
    sql += ", rejection_comment = $2 WHERE id = $3";
    params.push(rejection_comment);
  }
  if (!rejection_comment) {
    sql += " WHERE id = $2";
  }
  params.push(id);

  con.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Plant not found" });
    }
    res
      .status(200)
      .json({ message: `Plant ${id} updated to ${status} successfully!` });
  });
};

exports.clearPlate = async (req, res) => {
  const { id, plate_hash } = req.body;
  console.log("sta12", id, plate_hash);
  const deleteFromImgur = async (hash) => {
    console.log("123321");
    if (!hash) return;
    try {
      const imgurResponse = await axios.delete(
        `https://api.imgur.com/3/image/${hash}`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          },
        }
      );
      console.log(`Image with hash ${hash} deleted:`, imgurResponse.data);
    } catch (error) {
      console.error(`Failed to delete image with hash ${hash}:`, error);
    }
  };
  const sqlUpdate =
    "UPDATE piantine SET plate = NULL, plate_hash = NULL WHERE id = $1";

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

  const sqlSelect =
    "SELECT image_url, delete_hash, plate, plate_hash FROM piantine WHERE id = $1"; // PostgreSQL parameterized query
  try {
    const selectResult = await new Promise((resolve, reject) => {
      con.query(sqlSelect, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
    if (selectResult.rows.length === 0) {
      return res.status(404).json({ message: "Plant not found" });
    }
    const { image_url, delete_hash, plate, plate_hash } = selectResult.rows[0];
    console.log("Image URL:", image_url);
    console.log("Delete hash:", delete_hash);
    console.log("plate URL:", plate);
    console.log("plate hash:", plate_hash);

    const deleteFromImgur = async (hash) => {
      if (!hash) return;
      try {
        const imgurResponse = await axios.delete(
          `https://api.imgur.com/3/image/${hash}`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            },
          }
        );
        console.log(`Image with hash ${hash} deleted:`, imgurResponse.data);
      } catch (error) {
        console.error(`Failed to delete image with hash ${hash}:`, error);
      }
    };
    // Attempt to delete both images
    await Promise.all([
      deleteFromImgur(delete_hash), // Delete first image
      deleteFromImgur(plate_hash), // Delete second image
    ]);

    const sqlDelete = "DELETE FROM piantine WHERE id = $1"; // Delete plant query
    const deleteResult = await new Promise((resolve, reject) => {
      con.query(sqlDelete, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json({ message: `Plant ${id} successfully deleted!` });
  } catch (err) {
    console.error("Error during deletion process:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserPlants = (req, res) => {
  console.log("aooo", req.query.userId);
  const { userId } = req.query;
  console.log("ciaooo", userId);
  // first get the id from local storage and set in in a varialble here
  const sql = "SELECT * FROM piantine WHERE user_id = $1";
  con.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    console.log("results222", results);
    res.json(results.rows);
  });
};

exports.getOwnedPlants = (req, res) => {
  console.log("ciao dal get owned plants", req.query.ID);
  const ownerID = req.query.ID;
  const sql = "select * from piantine where owner_id = $1";
  con.query(sql, [ownerID], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.json(results.rows);
  });
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
