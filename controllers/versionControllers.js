const db = require("../models");
const Version = db.Version;

exports.version = async (req, res) => {
  // console.log("qui", Version);
  // const version = process.env.CURRENT_VERSION;
  try {
    const response = await Version.findAll({});
    let version_number = response[0].dataValues.version;

    await res.json({ message: { version_number }, status: 200 });
  } catch (err) {
    console.log(err);
    // await res.json({ message: { version_number: "0.0.1" }, status: 200 });
    await res.json({ message: { "error from catch": err }, status: 500 });
  }
};
