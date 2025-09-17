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
module.exports = { imgurAdd };
// Log the final headers
