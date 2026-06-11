const axios = require("axios");

const BASE_URL = "https://api.sportmonks.com/v3/football";

async function getFixtures(date) {
  try {
    const res = await axios.get(`${BASE_URL}/fixtures`, {
      params: {
        api_token: process.env.SPORTMONKS_KEY,
        filters: `starting_between:${date},${date}`
      }
    });

    return res.data.data;
  } catch (err) {
    console.error("SportMonks error:", err.response?.data || err.message);
    return [];
  }
}

module.exports = { getFixtures };