const axios = require("axios");

const imgurAdd = async (formData) => {
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
    // ...formHeaders,
    Authorization: `Bearer ${accessToken}`, // Ensure the Client-ID is set properly
  };

  const imgurResponse = await axios.post(
    "https://api.imgur.com/3/image",
    formData,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return imgurResponse;
};
const imgurDelete = async (hash) => {
  console.log("123321");
  if (!hash) return;
  try {
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
    const imgurResponse = await axios.delete(
      `https://api.imgur.com/3/image/${hash}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(`Image with hash ${hash} deleted:`, imgurResponse.data);
    return imgurResponse;
  } catch (error) {
    console.error(`Failed to delete image with hash ${hash}:`, error);
  }
};
module.exports = { imgurAdd, imgurDelete };
// Log the final headers
