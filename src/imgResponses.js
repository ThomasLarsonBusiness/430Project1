// Requires
const fs = require('fs');

// Missing Image Tag
const missingImg = fs.readFileSync(`${__dirname}/../node_modules/xwing-data/images/damage-decks/core/back.png`);

// Response Function
const respond = (request, response, status, content) => {
  response.writeHead(status, { 'Content-Type': 'img/png' });
  response.write(content);
  response.end();
};

// Get Image File
const getImage = (request, response, params) => {
  // Checks if was given the parameter
  if (!params.path) {
    return respond(request, response, 400, missingImg);
  }

  // Checks to see if the file exists
  // Check found here: https://flaviocopes.com/how-to-check-if-file-exists-node/
  if (!fs.existsSync(`${__dirname}/../node_modules/xwing-data/images/${params.path}`)) {
    return respond(request, response, 404, missingImg);
  }

  return respond(request, response, 200, fs.readFileSync(`${__dirname}/../node_modules/xwing-data/images/${params.path}`));
};

// Exports
module.exports = {
  getImage,
};
