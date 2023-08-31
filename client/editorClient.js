// Saved Client Data
// Faction Ship Types
const factionShips = {
  'Rebel Alliance': ['A-wing', 'ARC-170', 'Attack Shuttle', 'B-wing', 'CR90 Corvette', 'E-wing', 'GR-75 Medium Transport',
    'HWK-290', 'K-wing', 'Scurrg H-6 Bomber', 'TIE Fighter', 'U-wing', 'VCX-100', 'X-wing', 'Y-wing',
    'YT-1300', 'YT-2400', 'Z-95 Headhunter'],
  'Galactic Empire': ['Firespray-31', 'Gozanti-class Cruiser', 'Lambda-class Shuttle', 'Raider-class Corvete', 'TIE Advanced',
    'TIE Aggressor', 'TIE Adv. Prototype', 'TIE Bomber', 'TIE Defender', 'TIE Fighter', 'TIE Interceptor', 'TIE Phantom',
    'TIE Punisher', 'TIE Striker', 'VT-49 Decimator'],
  'Scum and Villainy': ['Aggressor', 'C-ROC Cruiser', 'Firespray-31', 'G-1A Starfighter', 'HWK-290', 'JumpMaster 5000',
    'Kihraxz Fighter', 'Lancer-class Pursuit Craft', 'M3-A Interceptor', 'Protectorate Starfighter', 'Quadjumper',
    'Scurrg H-6 Bomber', 'StarViper', 'Y-wing', 'YV-666', 'Z-95 Headhunter'],
};

// Client Fields
let user;
let faction;
let squadronObj;
const currentPoints = 0;
let message;

// Save Squadron
const saveSquadron = async () => {
  // Creates an json object to be saved
  const saveObj = {
    user: window.location.search.split('&')[0].split('=')[1],
    squadron: squadronObj,
  };

  // Posts the saveObj back to the server
  const response = await fetch('/saveSquadron', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(saveObj),
  });

  handleResponse(response, 'save');
};

// Function for printing squadron's cards
const printSquadron = () => {
  // Updates the stats for the squadron
  document.querySelector('#stats').textContent = `Points: ${squadronObj.currentPoints}/${squadronObj.maxPoints}     
  Faction: ${squadronObj.faction}`;

  // Loops through, printing the information for all cards present in the squadron
  const squadron = document.querySelector('#squadron');
  squadron.innerHTML = '';
  for (const ship in squadronObj.ships) {
    for (let i = 0; i < squadronObj.ships[ship].count; i++) {
      // Creates the div Wrapper
      const div = document.createElement('div');
      div.classList.add('ship');

      // Creates the data paragraphs
      const p1 = document.createElement('p');
      const p2 = document.createElement('p');
      p1.textContent = `Pilot: ${squadronObj.ships[ship].name}`;
      p2.textContent = `Points: ${squadronObj.ships[ship].points}`

      // Creates the remove button
      const btn = document.createElement('button');
      btn.textContent = 'Remove From Squadron';
      // If the ship being printed has multiple images, changes its class
      if (squadronObj.ships[ship].image.length > 1){
        div.classList.add('bigShip');
        div.classList.remove('ship');
      }
      // When the button is clicked, remove the ship from the obj and the points total
      btn.addEventListener('click', () => {
        squadronObj.currentPoints -= squadronObj.ships[ship].points;

        // Decrements the count for that ship, or removes it from the obj entirely
        if (squadronObj.ships[ship].count > 1) {
          squadronObj.ships[ship].count--;
        } else {
          delete squadronObj.ships[ship];
        }

        // Updates the messages
        message.textContent = 'Ship Removed';

        printSquadron();
      });

      // Append all of the elements to the div wrapper
      div.appendChild(p1);
      div.appendChild(p2)
      for (const url in squadronObj.ships[ship].image) {
        const img = document.createElement('img');
        img.src = `/getImage?path=${squadronObj.ships[ship].image[url]}`;
        div.appendChild(img);
      }
      div.appendChild(btn);

      // Add it to the squadron section of the webpage
      squadron.appendChild(div);
    }
  }
};

// Adds a ship to the local squadron data
const addShip = (_name, _points, _image) => {
  // Updates the message
  message.textContent = 'Ship Added';

  // Adds the ship to the SquadronObj, incrementing the count if necessary
  if (!squadronObj.ships[_name]) {
    squadronObj.ships[_name] = {
      name: _name,
      points: _points,
      image: _image,
      count: 1,
    };
  } else {
    squadronObj.ships[_name].count++;
  }

  squadronObj.currentPoints += _points;
  printSquadron();
};

// Handles all response cases
const handleResponse = async (response, key) => {
  const { status } = response;


  if (status === 200) {
    const resJSON = await response.json();

    // If the response comes from loading in squadron's data
    if (key === 'squadron') {
      // Sets up the squadronObj
      squadronObj = resJSON.content;
      faction = squadronObj.faction;
      document.querySelector('#squadronName').textContent += squadronObj.name;

      // Creates Tabs for Ships
      const pilots = document.querySelector('#pilots');
      pilots.innerHTML = '';

      // Info on how to create for in loops
      // https://www.microverse.org/blog/how-to-loop-through-the-array-of-json-objects-in-javascript
      for (const ship in factionShips[faction]) {
        const div = document.createElement('div');
        const p = document.createElement('p');

        p.textContent = factionShips[faction][ship] + ' \\/';
        p.classList.add('title');
        div.classList.add('tab');
        div.id = factionShips[faction][ship].replace(/ /g, '-');
        p.addEventListener('click', () => {
          let ships = div.getElementsByClassName('ship');
          let bigShip = div.getElementsByClassName('bigShip');

          // Toggles hidden value for regular ships
          for (let ship in ships){
            if (ships[ship].hidden){
              ships[ship].hidden = false;
            } else {
              ships[ship].hidden = true;
            }
          }
        }); // Functionality for opening tabs of ships

        div.appendChild(p);
        pilots.appendChild(div);
      }

      // Prints the squadron to the screen
      printSquadron();

      // Loads in the faction's pilots if the squadron is loaded in
      const pilotResponse = await fetch(`/getFactionData?faction=${faction}`, {
        method: 'get',
        headers: {
          accept: 'application/json',
        },
      });

      handleResponse(pilotResponse, 'pilots');
    // If the response comes from loading in the pilot data 
    } else if (key === 'pilots') {
      // Loops through each ship type in the current factions ships array above
      for (const ship in factionShips[faction]) {
        // Creates a tab reference
        // Info on how to replace all spaces in a string
        // https://stackoverflow.com/questions/3214886/javascript-replace-only-replaces-first-match
        const tab = document.getElementById(`${factionShips[faction][ship].replace(/ /g, '-')}`);

        // Special creation function for creating the CR90 Corvette
        if (faction === 'Rebel Alliance' && factionShips[faction][ship] === 'CR90 Corvette') {
          // Creates the div wrapper
          const div = document.createElement('div');
          div.id = 'CR90-Corvette';

          // Creates the data paragraphs
          const p1 = document.createElement('p');
          const p2 = document.createElement('p');
          let cost = resJSON.content[35].points + resJSON.content[36].points;
          p1.textContent = 'Ship: CR90 Corvette';
          p2.textContent = `Points: ${cost}`;

          // Creates a button to add the card to the squadron
          const button = document.createElement('button');
          button.textContent = 'Add To Squadron';
          button.addEventListener('click', () => {
            // Checks if the card will bring the squadrons points above the maximum value
            if (squadronObj.currentPoints + 90 > squadronObj.maxPoints) {
              message.textContent = 'Cannot Add Ship, Exceeds Max Squadron Value';
              return;
            }

            // Adds the ship to the client's side
            addShip('CR90 Corvette', 90, [resJSON.content[35].image, resJSON.content[36].image]);
          });

          // Sets up the two images for the ship
          const img1 = document.createElement('img');
          const img2 = document.createElement('img');
          img1.src = `/getImage?path=${resJSON.content[35].image}`;
          img2.src = `/getImage?path=${resJSON.content[36].image}`;
          img1.alt = 'Ship Card';
          img2.alt = 'Ship Card';

          // Added elements to div
          div.appendChild(p1);
          div.appendChild(p2);
          div.appendChild(img1);
          div.appendChild(img2);
          div.appendChild(button);

          // Adding class and hidden status
          div.classList.add('ship');
          div.classList.add('bigShip');
          div.hidden = true;

          // Add to the tab
          tab.appendChild(div);
        // Special creation function for creating the Raider-class Corvete
        } else if (faction === 'Galactic Empire' && factionShips[faction][ship] === 'Raider-class Corvete') {
          // Creates the div wrapper
          const div = document.createElement('div');
          div.id = 'Raider-class-Corvete';

          // Sets up the data paragraphs
          const p1 = document.createElement('p');
          const p2 = document.createElement('p');
          let cost = resJSON.content[49].points + resJSON.content[50].points;
          p1.textContent = 'Ship: CR90 Corvette';
          p2.textContent = `Points: ${cost}`;

          // Creates a button to add the card to the squadron
          const button = document.createElement('button');
          button.textContent = 'Add To Squadron';
          button.addEventListener('click', () => {
            // Checks if the card will bring the squadrons points above the maximum value
            if (squadronObj.currentPoints + cost > squadronObj.maxPoints) {
              message.textContent = 'Cannot Add Ship, Exceeds Max Squadron Value';
              return;
            }

            // Adds the ship to the client's side
            addShip('Raider-class Corvete', cost, [resJSON.content[49].image, resJSON.content[50].image]);
          });

          // Sets up the images
          const img1 = document.createElement('img');
          const img2 = document.createElement('img');
          img1.src = `/getImage?path=${resJSON.content[49].image}`;
          img2.src = `/getImage?path=${resJSON.content[50].image}`;
          img1.alt = 'Ship Card';
          img2.alt = 'Ship Card';

          // Adds children to the div
          div.appendChild(p1);
          div.appendChild(p2);
          div.appendChild(img1);
          div.appendChild(img2);
          div.appendChild(button);

          // Adds classes and hidden status
          div.classList.add('ship');
          div.classList.add('bigShip');
          div.hidden = true;

          // Appends to the tab
          tab.appendChild(div);
        // For every other ship
        } else {
          // Gets a filtered array from the response of all ships of the current type
          const filtered = resJSON.content.filter((x) => x.ship === factionShips[faction][ship]);
          for (const pilot in filtered) {
            // Creates the div wrapper
            const div = document.createElement('div');
            div.id = filtered[pilot].name;

            // Creates the data paragraphs
            const p1 = document.createElement('p');
            const p2 = document.createElement('p');
            p1.textContent = `Pilot: ${filtered[pilot].name}`;
            p2.textContent = `Points: ${filtered[pilot].points}`;

            // Creates a button to add the card to the squadron
            const button = document.createElement('button');
            button.textContent = 'Add To Squadron';
            button.addEventListener('click', () => {
              // Checks if the card will bring the squadrons points above the maximum value
              if (squadronObj.currentPoints + filtered[pilot].points > squadronObj.maxPoints) {
                message.textContent = 'Cannot Add Ship, Exceeds Max Squadron Value';
                return;
              }

              // Adds the ship to the client's side
              addShip(filtered[pilot].name, filtered[pilot].points, [filtered[pilot].image]);
            });

            // Creates the ship image
            const img = document.createElement('img');
            img.src = `/getImage?path=${filtered[pilot].image}`;

            // Add elements to the div
            div.appendChild(p1);
            div.appendChild(p2);
            div.appendChild(img);
            div.appendChild(button);

            // Add class and hidden status
            div.classList.add('ship');
            div.hidden = true;

            // Add div to the tab
            tab.appendChild(div);
          }
        }
      }
    }
  // If not a 200 code, update the message based on the status code
  } else if (status === 204) {
    message.textContent = 'Squadron Saved';
  } else if (status === 400) {
    const resJSON = await response.json();
    message.textContent = `${resJSON.message}`;
  } else if (status === 404) {
    const resJSON = await response.json();
    message.textContent = `${resJSON.message}`; 
  }
};

// Init function
const init = async () => {
  // Gets the message element
  message = document.getElementById('message');

  // Gets the necessary data for the squadron
  const squadronResponse = await fetch(`/getSquadronInfo${window.location.search}`, {
    method: 'get',
    headers: {
      'content-type': 'application:x-www-form-urlencoded',
      accept: 'application/json',
    },
  });

  handleResponse(squadronResponse, 'squadron');

  // Set up Return to Homepage Button
  const returnBtn = document.querySelector('#home');
  returnBtn.addEventListener('click', () => { window.location.href = '/'; });

  // Set up Save Squadron Button
  document.querySelector('#save').addEventListener('click', saveSquadron);
};

window.onload = init;
