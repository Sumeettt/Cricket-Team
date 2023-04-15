const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost/3000/");
    });
  } catch (e) {
    console.log(`DB Error: $(e.message)`);
    process.exit(1);
  }
};

initializeDBAndServer();

//GET
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
        SELECT 
        * 
        FROM    
        cricket_team;
    `;
  const playersArraySnakeCase = await db.all(getPlayersQuery);

  const convertSnakeCaseToCamelCase = (eachPlayerObject) => {
    console.log(eachPlayerObject);
    return {
      playerId: eachPlayerObject.player_id,
      playerName: eachPlayerObject.player_name,
      jerseyNumber: eachPlayerObject.jersey_number,
      role: eachPlayerObject.role,
    };
  };

  let playersArrayCamelCase = [];

  for (let eachPlayerObject of playersArraySnakeCase) {
    const convertedCamelCasePlayers = convertSnakeCaseToCamelCase(
      eachPlayerObject
    );
    playersArrayCamelCase.push(convertedCamelCasePlayers);
  }

  response.send(playersArrayCamelCase);
});
