/* Squadron Format
{
    'User': {
        'Squadron Name': {
            name: 'Squadron Name',
            currentPoints: curPoints,
            maxPoinst: pointsMax,
            faction: 'Faction',
            ships: {
                'Ship 1':{
                    name: 'Ship 1',
                    points: pointsCost,
                    image: imageURL,
                },
            },
        },
    },

}
*/

// Requires the pilots data
const fs = require('fs');

// Loads in the json of all the pilots data
const pilotData = JSON.parse(fs.readFileSync(`${__dirname}/../node_modules/xwing-data/data/pilots.js`));

// The base data for storing squadrons
const data = {
  Sample: {
    'Sample Squadron': {
      name: 'Sample Squadron',
      currentPoints: 0,
      maxPoints: 50,
      faction: 'Rebel Alliance',
      ships: {},
    },
    'Empire\'s Elite': {
      name: 'Empire\'s Elite',
      currentPoints: 0,
      maxPoints: 100,
      faction: 'Galactic Empire',
      ships: {},
    },
    'Pirate Crew': {
      name: 'Pirate Crew',
      currentPoints: 0,
      maxPoints: 75,
      faction: 'Scum and Villainy',
      ships: {},
    },
  },
};

// Function for creating a new user
const createNewUserData = (name) => {
  data[name] = {};
};

// Function for creating new blank squadrons
const createSquadronData = (userName, name, points, faction) => {
  data[userName][name] = {};
  data[userName][name].name = name;
  data[userName][name].currentPoints = 0;
  data[userName][name].maxPoints = points;
  data[userName][name].faction = faction;
  data[userName][name].ships = {};
};

// Gets a factions set of pilots
const getFactionData = (faction) => {
  const filtered = pilotData.filter((x) => x.faction === faction);
  return filtered;
};

// Updates squadron data
const updateSquadronData = (user, squadron) => {
  data[user][squadron.name] = squadron;
};

module.exports = {
  data,
  createNewUserData,
  createSquadronData,
  getFactionData,
  updateSquadronData,
};
