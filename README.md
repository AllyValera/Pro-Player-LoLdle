# Pro Player LoLdle
Welcome to the Pro Player LoLdle Game! This project involves building a simplified guessing game related to professional League of Legends players. Players can interact with the game, and the server handles the game's logic, such as fetching random player data and fetching data for the players from user input.

## Features
- **Beautiful Soup** - Utilizes the Beautiful Soup Python package to web scrape information about League of Legends professional players.
- **Node.js and npm Installation**: Ensures the availability of Node.js and npm for server-side JavaScript development and interacting with the SQLite database. npm is employed as the package manager for managing external libraries and tools.
- **Express Framework Integration**: Utilizes the Express framework to simplify server-side logic development. Express facilitates tasks such as routing (for fetching player data), middleware support (with CORS), and serving static files (HTML, CSS, JS).
- **Fetch API Usage for Dynamic Content**: Utilizes the fetch API on the client side to make HTTP GET requests to the /getRandomPlayer and /getSummonerDetails routes on the server. 
- **CORS Middleware Implementation**: Addresses Cross-Origin Resource Sharing (CORS) issues using the cors middleware. Ensures proper communication between the frontend and backend, especially when hosted on different domains. (In other words, by enabling CORS, we are essentially telling the browser that the frontend code is allowed to make requests to the backend server, even if they are on different ports or domains.) 
- **SQLite3 Database Interaction**: Incorporates the lightweight SQLite3 database system for storing and retrieving game-related data. The sqlite3 package for Node.js is used to interact with the SQLite3 database, enabling various operations.

## Known Limitations
- **Missing Information**: For some players, the country of birth and birthday slots in the database are set to "N/A". This is either due to missing info on their wiki or extra navigation needed on the wiki to get to their page/information.
  - This poses a challenge when trying to display if the user's guess is younger or older than the randomly generated player, especially when the randomly generated person is the one without a birthday. A workaround is an SQLite query that filters out people whose birthdays are N/A (and also “Sharkz” who doesn’t have a year associated with his birthday). This workaround can be found on line 25 of the script.js file.
- **Case/Spelling Sensitive**: The user's guess has to match the player's summoner name EXACTLY. This includes uppercase/lowercase letters matching and specific spelling.
- **Multiple Inputs for the Same Person**: Does not restrict the user from entering the same player multiple times.
- **No Automatic Database Updates**: The [Google Sheet]([https://nodejs.org/en](https://docs.google.com/spreadsheets/d/1Y7k5kQ2AegbuyiGwEPsa62e883FYVtHqr6UVut9RC4o/pubhtml#)) that scrape.py uses to web scrape information is updated automatically every 5 minutes. However, users have to run this script manually, as it does not automatically run whenever there is a change made on the spreadsheet.

## Installation
1. Install Node.js and npm (automatically installed with Node.js). [Download Node.js](https://nodejs.org/en)
2. Navigate to the project directory in your terminal and run: `npm install`

## Usage
1. Use the scrape.py script to web scrape player information. (Note: This is just set to web scrape LCS players, but line 100 of the script can be altered to change this)
2. Navigate to the project directory and run `node server.js` to run the server at http://localhost:3000.

## Gameplay Example
![Gameplay](/images/example.png)

## Notes
- This was inspired by [LoLdle](https://loldle.net/) and [OWLEL](https://owlel.zusor.io/).

## Usage Disclaimer
Unauthorized use, reproduction, or distribution of this project, or any part thereof, without the explicit permission of the author is strictly prohibited.
