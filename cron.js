const cron = require("node-cron");
const { User } = require("./models/User"); // adjust path to your User model
const { Op } = require("sequelize");

// Runs every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running cleanup job...");

  const oneHoursAgo = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 hours ago

  try {
    const deleted = await User.destroy({
      where: {
        isVerified: false,
        createdAt: {
          [Op.lt]: oneHoursAgo, // created before 1 hours ago
        },
      },
    });

    console.log(`Deleted ${deleted} unverified users.`);
  } catch (error) {
    console.error("Error deleting unverified users:", error);
  }
});
