const axios = require('axios');

async function fetchHTML(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar HTML:', error);
    return null;
  }
}

module.exports = { fetchHTML };

