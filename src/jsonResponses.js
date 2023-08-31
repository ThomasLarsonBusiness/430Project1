// requires
const userData = require('./jsonBuilder.js');

// Response Function
const respond = (request, response, status, content) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  if (request.method !== 'HEAD') response.write(JSON.stringify(content));
  response.end();
};

// Respond meta function
const respondMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Get User Function
const getUser = (request, response, body) => {
  const responseJSON = {};

  // Need to check incoming body data
  if (!body.name) {
    responseJSON.message = 'Name value is required';
    responseJSON.id = 'addMissingParam';
    return respond(request, response, 400, responseJSON);
  }

  // If it exists, simply return the data
  if (userData.data[body.name]) {
    responseJSON.message = 'Sucessfully got user';
    responseJSON.content = userData.data[body.name];
    return respond(request, response, 200, responseJSON);
  }

  // If it doesn't exist, create the user
  userData.createNewUserData(body.name);
  responseJSON.message = 'Successfully created user';
  responseJSON.content = userData.data[body.name];
  return respond(request, response, 201, responseJSON);
};

// Function to Create Squadron
const createSquadron = (request, response, body) => {
  const responseJSON = {};

  // Checks incoming Body data to ensure it is valid
  if (!body.name) {
    responseJSON.message = 'Name value is required';
    responseJSON.id = 'addMissingParam';
    return respond(request, response, 400, responseJSON);
  }

  // Need to prevent overwriting data
  if (userData.data[body.userName][body.name]) {
    responseJSON.message = 'Name already exists, please change the name';
    responseJSON.id = 'nameAlreadyExists';
    return respond(request, response, 400, responseJSON);
  }

  // Creates the data for a blank squadron
  userData.createSquadronData(body.userName, body.name, body.points, body.faction);

  // Sends a response
  responseJSON.message = 'Successfully created squadron';
  responseJSON.content = userData.data[body.userName];
  return respond(request, response, 201, responseJSON);
};

// Get Squadron Info Response
const getSquadronInfo = (request, response, params) => {
  const responseJSON = {};

  // If missing parameters, back out
  if (!params.user || !params.name) {
    responseJSON.message = 'Needs a user and name parameter';
    responseJSON.id = 'addMissingParams';
    return respond(request, response, 400, responseJSON);
  }

  // If invalid user or squadron name, back out
  if (!userData.data[params.user] || !userData.data[params.user][params.name]) {
    responseJSON.message = 'Invalid User or Squadron. Content does not exist';
    responseJSON.id = 'squadronNotFound';
    return respond(request, response, 404, responseJSON);
  }

  responseJSON.message = 'Successfully Loaded In Squadron';
  responseJSON.content = userData.data[params.user][params.name];
  return respond(request, response, 200, responseJSON);
};

// Get Squadron Info Meta
const getSquadronInfoMeta = (request, response, params) => {
  // If missing parameters, back out
  if (!params.user || !params.name) {
    return respondMeta(request, response, 400);
  }

  // If invalid user or squadron name, back out
  if (!userData.data[params.user] || !userData.data[params.user][params.name]) {
    return respondMeta(request, response, 404);
  }

  return respondMeta(request, response, 200);
};

// Returns the info on all of a faction's pilots
const getPilotInfo = (request, response, params) => {
  const responseJSON = {};

  // Checks if the faction parameter is present
  if (!params.faction) {
    responseJSON.message = 'Need a faction parameter';
    responseJSON.id = 'missingFactionParam';
    return respond(request, response, 400, responseJSON);
  }

  // Checks to make sure the faction is valid faction
  if (params.faction !== 'Rebel Alliance'
      && params.faction !== 'Galactic Empire'
      && params.faction !== 'Scum and Villainy') {
    responseJSON.message = 'Faction parameters is not correct';
    responseJSON.id = 'invalidFactionParam';
    return respond(request, response, 400, responseJSON);
  }

  const data = userData.getFactionData(params.faction);
  responseJSON.message = 'Sucessfully got faction data';
  responseJSON.content = data;
  return respond(request, response, 200, responseJSON);
};

// Returns the meta data of getting Pilot Info
const getPilotInfoMeta = (request, response, params) => {
  // Checks if the faction parameter is present
  if (!params.faction) {
    return respondMeta(request, response, 400);
  }

  // Checks to make sure the faction is valid faction
  if (params.faction !== 'Rebel Alliance'
      && params.faction !== 'Galactic Empire'
      && params.faction !== 'Scum and Villainy') {
    return respondMeta(request, response, 400);
  }

  return respondMeta(request, response, 200);
};

// Save Squadron function
const saveSquadron = (request, response, body) => {
  const responseJSON = {};

  // Checks if the body has the necessary data
  if (!body.user || !body.squadron) {
    responseJSON.message = 'Invalid Save Body';
    responseJSON.id = 'saveContentsInvalid';
    return respond(request, response, 400, responseJSON);
  }

  // Updates the squadron database on the server
  userData.updateSquadronData(body.user, body.squadron);
  return respondMeta(request, response, 204);
};

// Exports
module.exports = {
  getUser,
  createSquadron,
  getSquadronInfo,
  getSquadronInfoMeta,
  getPilotInfo,
  getPilotInfoMeta,
  saveSquadron,
};
