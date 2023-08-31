// Requires
const fs = require('fs');

// HTML, CSS, and Javascript Files
const homepage = fs.readFileSync(`${__dirname}/../hosted/homepage.html`);
const editor = fs.readFileSync(`${__dirname}/../hosted/editor.html`);
const notFound = fs.readFileSync(`${__dirname}/../hosted/notFound.html`);
const homepageStyle = fs.readFileSync(`${__dirname}/../hosted/homepageStyle.css`);
const editorStyle = fs.readFileSync(`${__dirname}/../hosted/editorStyle.css`);
const notFoundStyle = fs.readFileSync(`${__dirname}/../hosted/notFoundStyle.css`);
const homepageJS = fs.readFileSync(`${__dirname}/../hosted/homepageBundle.js`);
const editorJS = fs.readFileSync(`${__dirname}/../hosted/editorBundle.js`);
const notFoundJS = fs.readFileSync(`${__dirname}/../hosted/notFoundBundle.js`);

// Respond Function
const respond = (request, response, status, content, contentType) => {
  response.writeHead(status, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};

// Get HTML function
const getHomepageHTML = (request, response) => respond(request, response, 200, homepage, 'text/html');

// Get Editor Function
const getEditorHTML = (request, response) => respond(request, response, 200, editor, 'text/html');

// Get Not Found HTML
const getNotFoundHTML = (request, response) => respond(request, response, 404, notFound, 'text/html');

// Get Homepage CSS File
const getHomepageCSS = (request, response) => respond(request, response, 200, homepageStyle, 'text/css');

// Get Editor CSS File
const getEditorCSS = (request, response) => respond(request, response, 200, editorStyle, 'text/css');

// Get Not Found CSS File
const getNotFoundCSS = (request, response) => respond(request, response, 200, notFoundStyle, 'text/css');

// Get Homepage JS File
const getHomepageJS = (request, response) => respond(request, response, 200, homepageJS, 'application/javascript');

// Get Editor JS File
const getEditorJS = (request, response) => respond(request, response, 200, editorJS, 'application/javascript');

// Get Not Found JS File
const getNotFoundJS = (request, response) => respond(request, response, 200, notFoundJS, 'application/javascript');

// Exports
module.exports = {
  getHomepageHTML,
  getEditorHTML,
  getNotFoundHTML,
  getHomepageCSS,
  getEditorCSS,
  getNotFoundCSS,
  getHomepageJS,
  getEditorJS,
  getNotFoundJS,
};
