const axios = require('axios');
const { parseStringPromise } = require('xml2js');

async function parseXML(xmlURL, propertyCode) {
  try {
    const response = await axios.get(xmlURL);
    const xmlData = response.data;

    const jsonData = await parseStringPromise(xmlData);
    const properties = jsonData.Listings.Listing || [];
    const property = properties.find(item => item.ListingID[0] === propertyCode);

    if (!property) return null;

    return {
      provider: property.Provider[0],
      contactName: property.ContactName[0],
      telephone: property.Telephone[0],
    };
  } catch (error) {
    console.error('Erro ao processar XML:', error);
    return null;
  }
}

module.exports = { parseXML };

