const con = require("../config/db");
const fs = require("fs");
const path = require("path");
const bucket = require("../config/firebaseConfig");
const { v4: uuidv4 } = require("uuid");
exports.addPlant = (req, res) => {
  const { lat, lang, user_id } = req.body; // Extract lat, lang, user_id from the form
  console.log("test555", user_id);
  // Handle file upload
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // const image_url = `/uploads/${req.file.filename}`;
    const extension = path.extname(req.file.originalname); // Get the original file extension
    const newName = uuidv4();
    const uniqueFileName = `${newName}${extension}`; // Generate a unique name
    const blob = bucket.file(uniqueFileName); // Reference to the file in Firebase Storage
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      console.error("Error uploading file to Firebase:", err);
      res.status(500).send("Error uploading file.");
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;
      console.log("File uploaded to Firebase:", publicUrl);

      // Save `publicUrl` in your database along with other plant details
      res
        .status(200)
        .send({ message: "File uploaded successfully.", url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file.");
  }

  // Insert the record into the database
  const sql =
    "INSERT INTO piantine (lat, lang, image_url, user_id) VALUES ($1, $2, $3, $4)";

  con.query(sql, [lat, lang, image_url, user_id], (err, result) => {
    console.log("yo", user_id);
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    // Return a success response with the inserted record's ID
    res.status(201).json({
      message: "Item added successfully!",
      id: result.insertId,
      image_url, // Return the image URL for further use (optional)
    });
  });
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

exports.deletePlant = (req, res) => {
  const { id } = req.params; // Get the plant ID from the URL

  const sqlSelect = "SELECT image_url FROM piantine WHERE id = $1"; // PostgreSQL parameterized query

  con.query(sqlSelect, [id], (err, result) => {
    if (err) {
      console.log("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plant not found" });
    }

    const imageFileName = result.rows[0].image_url;
    console.log("Image file name:", imageFileName);

    const sqlDelete = "DELETE FROM piantine WHERE id = $1"; // Delete plant query
    con.query(sqlDelete, [id], (err, result) => {
      if (err) {
        console.log("Error during deletion:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Plant not found" });
      }

      if (imageFileName) {
        const filePath = path.join(__dirname, "..", imageFileName);
        console.log("Attempting to delete file:", filePath);

        // Check if the file exists before attempting deletion
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.error("File does not exist:", filePath);
          } else {
            // File exists, attempt to delete
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error deleting file:", err); // More detailed error logging
              } else {
                console.log("File deleted successfully:", filePath);
              }
            });
          }
        });
      }

      res.status(200).json({ message: `Plant ${id} successfully deleted!` });
    });
  });
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
