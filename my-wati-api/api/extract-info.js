const { extractLink } = require('./utils/extract-link');
const { fetchHTML } = require('./utils/fetch-html');
const { parseXML } = require('./utils/parse-xml');

module.exports = async (req, res) => {
  try {
    const message = req.body.message;
    if (!message) {
      return res.status(400).json({ error: 'Mensagem não fornecida.' });
    }

    const link = extractLink(message);
    if (!link) {
      return res.status(400).json({ error: 'Nenhum link encontrado na mensagem.' });
    }

    const html = await fetchHTML(link);
    const propertyCodeMatch = html.match(/publisher_house_id["']\s*:\s*["'](\w+)["']/);
    const propertyCode = propertyCodeMatch ? propertyCodeMatch[1] : null;

    if (!propertyCode) {
      return res.status(400).json({ error: 'Código do imóvel não encontrado no HTML.' });
    }

    const xmlURL = 'https://redeurbana.com.br/imoveis/rede/c6280d26-b925-405f-8aab-dd3afecd2c0b';
    const propertyData = await parseXML(xmlURL, propertyCode);

    if (!propertyData) {
      return res.status(404).json({ error: 'Código do imóvel não encontrado no XML.' });
    }

    const { provider, contactName, telephone } = propertyData;
    const responseMessage = `Imobiliária responsável: ${provider}\nCorretor: ${contactName}\nContato: ${telephone}`;

    return res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

