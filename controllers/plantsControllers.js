const con = require("../config/db");
const FormData = require("form-data");
const axios = require("axios");
const db = require("../models");
const { imgurAdd, imgurDelete } = require("../assets/imgur.js");
const Plant = db.Plant;
const User = db.User;

exports.addPlate = async (req, res) => {
  const file = req.file;
  let { id } = req.params;
  id = parseInt(id);

  if (!file) {
    res.status(400).send("no file uploaded");
  }
  try {
    const formData = new FormData();
    formData.append("image", req.file.buffer);
    const imgurResponse = await imgurAdd(formData);
    if (imgurResponse && imgurResponse.data && imgurResponse.data.success) {
      const imageUrl = imgurResponse.data.data.link;
      const plateHash = imgurResponse.data.data.deletehash;
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
      } catch (err) {}
    } else {
      console.error("Error uploading image:", imgurResponse.data);
      return res
        .status(500)
        .json({ message: "Error uploading image to Imgur" });
    }
  } catch (err) {}
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
    formData.append("image", req.file.buffer);
    // Get headers for the form data
    const imgurResponse = await imgurAdd(formData);

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
      const io = req.app.get("io");

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

exports.updatePlantPic = async (req, res) => {
  // await imgurAdd()
  // await deleteFromImgur()

  const file = req.file;

  const deleteHash = req.body.deleteHash;
  let { plantId } = req.params;
  console.log(file);
  console.log(plantId);

  if (deleteHash == "null") {
    console.log("delete hash è null");
    try {
      const formData = new FormData();
      formData.append("image", req.file.buffer);
      console.log("formData", formData);
      const imgurResponse = await imgurAdd(formData);
      if (imgurResponse && imgurResponse.data && imgurResponse.data.success) {
        const imageUrl = imgurResponse.data.data.link;
        const imageHash = imgurResponse.data.data.deletehash;
        try {
          await Plant.update(
            { image_url: imageUrl, delete_hash: imageHash },
            {
              where: {
                id: plantId,
              },
            }
          );
          return res.status(200).json({
            message: "image successfully updated",
            // id: updatedPlantPic.insertId,
            image_url: imageUrl,
            delete_hash: imageHash,
          });
        } catch (err) {
          console.log("err", err);
          return res.status(400).json({
            message: "found no old pic to delete but new posting error is:",
            err,
            // id: updatedPlantPic.insertId,
            //  image_url: imageUrl,
            //  delete_hash: imageHash,
          });
        }
      } else {
        console.error("Error uploading image:", imgurResponse.data);
        return res
          .status(500)
          .json({ message: "Error uploading image to Imgur" });
      }
    } catch (err) {
      res.status(500).json({
        message:
          "this is from update pic, old pic has been cancelled but something went wrong with adding new one",
        err,
      });
    }
  }

  if (!file) {
    res.status(400).send("no file uploaded");
  }

  if (!deleteHash) {
    res.status(400).send("no file uploaded");
  }
  try {
    const deleteResponse = await imgurDelete(deleteHash);
    if (deleteResponse) {
      console.log("t123444444444", deleteResponse);
      if (deleteResponse.status === 200) {
        try {
          const formData = new FormData();
          formData.append("image", req.file.buffer);
          console.log("formData", formData);
          const imgurResponse = await imgurAdd(formData);
          if (
            imgurResponse &&
            imgurResponse.data &&
            imgurResponse.data.success
          ) {
            const imageUrl = imgurResponse.data.data.link;
            const imageHash = imgurResponse.data.data.deletehash;
            try {
              await Plant.update(
                { image_url: imageUrl, delete_hash: imageHash },
                {
                  where: {
                    id: plantId,
                  },
                }
              );
              return res.status(200).json({
                message: "image successfully updated",
                // id: updatedPlantPic.insertId,
                image_url: imageUrl,
                delete_hash: imageHash,
              });
            } catch (err) {
              console.log("err", err);
              return res.status(400).json({
                message:
                  "old image successfully deleted but new one not posted successfully",
                // id: updatedPlantPic.insertId,
                //  image_url: imageUrl,
                //  delete_hash: imageHash,
              });
            }
          } else {
            console.error("Error uploading image:", imgurResponse.data);
            return res
              .status(500)
              .json({ message: "Error uploading image to Imgur" });
          }
        } catch (err) {
          res.status(500).json({
            message:
              "this is from update pic, old pic has been cancelled but something went wrong with adding new one",
            error: err,
          });
        }
      } else {
        res.status(501).json({ message: "old pic not successfully cancelled" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error from update image", error: err });
  }
};
exports.getAllPlants = async (req, res) => {
  try {
    const io = req.app.get("io");
    const plants = await Plant.findAll();
    res.status(200).json(plants);
    io.emit("all-plants", plants);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateOwner = async (req, res) => {
  const { id, owner_id, comment, plantType, status, purchase_date } = req.body; // Get the new status from the request body

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
  const io = req.app.get("io");
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

exports.updatePlantType = async (req, res) => {
  const { id } = req.params;
  const { plant_type } = req.body;
  try {
    await Plant.update(
      { plant_type: plant_type },
      {
        where: {
          id: id,
        },
      }
    );
    return res
      .status(200)
      .json({ message: `Plant type updated to ${plant_type} successfully!` });
  } catch (err) {
    res
      .status(500)
      .json({ message: `rejection update failed due to: ${err.message}` });
  }
};

exports.clearPlate = async (req, res) => {
  const { id, plate_hash } = req.body;
  const deleteFromImgur = async (hash) => {
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
          return res.status(500).send(err);
        }
        res.json(results);
      });
    } catch (err) {}
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
  const io = req.app.get("io");

  const { image_url, delete_hash, plate, plate_hash } = test[0].dataValues;
  const imgurResponse = await imgurDelete(delete_hash);

  if (imgurResponse.status === 200) {
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
};

exports.getOwnedPlants = async (req, res) => {
  const ownerID = req.query.ID;
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
  try {
    const response = await User.findOne({ where: { id: reporterId } });
    if (response === null) {
      es.status(404).send("Not Found");
    } else {
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
    res.status(500).send(err.message);
  }
};
exports.getOwnerInfo = async (req, res) => {
  const ownerId = req.params.id;
  try {
    const response = await User.findOne({ where: { id: ownerId } });
    if (response === null) {
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
      res.status(200).send(repData);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
exports.getOwnerPublicInfo = async (req, res) => {
  const ownerId = req.params.ownerId;
  try {
    const response = await User.findOne({
      where: {
        id: ownerId,
      },
    });

    const userName = response.user_name;
    if (response) {
      res.status(200).json({ ownerUserName: userName });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
