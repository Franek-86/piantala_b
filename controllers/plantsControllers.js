const con = require("../config/db");
const FormData = require("form-data");
const axios = require("axios");
// const fs = require("fs");
// const path = require("path");
// const bucket = require("../config/firebaseConfig");
// const { v4: uuidv4 } = require("uuid");
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
  console.log("Uploaded filee:", req.file);
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

// exports.deletePlant = (req, res) => {
//   const { id } = req.params; // Get the plant ID from the URL

//   // Validate the status

//   const sql = "DELETE FROM piantine WHERE id = $1";
//   con.query(sql, [id], (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ message: "Server error" });
//     }
//     if (result.affectedRows === 0) {
//       console.log(err);
//       return res.status(404).json({ message: "Plant not found" });
//     }
//     res.status(200).json({ message: `Plant ${id} successfully deleted!` });
//   });
// };

exports.deletePlant = async (req, res) => {
  const { id } = req.params; // Get the plant ID from the URL

  const sqlSelect = "SELECT image_url, delete_hash FROM piantine WHERE id = $1"; // PostgreSQL parameterized query
  try {
    const selectResult = await new Promise((resolve, reject) => {
      con.query(sqlSelect, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
    if ((selectResult.rows.length === 0) === 0) {
      return res.status(404).json({ message: "Plant not found" });
    }
    const { image_url, delete_hash } = selectResult.rows[0];
    console.log("Image URL:", image_url);
    console.log("Delete hash:", delete_hash);
    if (delete_hash) {
      try {
        const imgurResponse = await axios.delete(
          `https://api.imgur.com/3/image/${delete_hash}`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            },
          }
        );
        console.log("Imgur delete response:", imgurResponse.data);
      } catch (err) {
        console.error(
          "Failed to delete image from Imgur:",
          err.response?.data || err.message
        );
        // You might want to proceed anyway, even if Imgur deletion fails
      }
    } else {
      console.warn("No deletehash found for image. Skipping Imgur deletion.");
    }

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
