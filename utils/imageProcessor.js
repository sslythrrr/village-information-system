const sharp = require('sharp');

const compressImage = async (buffer, options = {}) => {
  const { format = 'jpeg', quality = 80, width = 1000 } = options;
  
  return sharp(buffer)
    .resize({ width, withoutEnlargement: true })
    [format]({ quality })
    .toBuffer();
};

const bufferToBase64 = (buffer) => buffer ? buffer.toString('base64') : null;

const processImages = (results, imageField = 'gambar') => {
  results.forEach(item => {
    if (item[imageField]) {
      item[imageField] = bufferToBase64(item[imageField]);
    }
  });
  return results;
};

module.exports = { compressImage, bufferToBase64, processImages };
