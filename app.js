const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

app.use(express.json());

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

//GET API 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
        SELECT 
        * 
        FROM    
        cricket_team;
    `;
  const playersArraySnakeCase = await db.all(getPlayersQuery);

  const convertSnakeCaseToCamelCase = (eachPlayerObject) => {
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

//POST API 2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  console.log(playerDetails);
  const postPlayersQuery = `
         INSERT INTO
          cricket_team (player_name, jersey_number, role)
         VALUES
          (
           '${playerName}',
            ${jerseyNumber},
            ${role}
          );`;

  const dbResponse = await db.run(postPlayersQuery);
  const bookID = dbResponse.lastID;
  response.send("Player Added to Team");
});

//PUT API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerID } = request.params;

  const getPlayerQuery = `
        SELECT 
          *
        FROM 
          cricket_team 
        WHERE 
          player_id = playerID;
     `;
  const playerDetails = await db.get(getPlayerQuery);

  response.send(playerDetails);
});

//PUT API 4
app.put("/players/:playerID/", async (request, response) => {
  const { playerID } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  console.log(playerDetails);
  const updatePlayerDetailsQuery = `
        UPDATE 
            cricket_team 
        SET 
            player_name = '${playerName}',
            jersey_number = '${jerseyNumber}',
            role = '${role}'
        WHERE 
            player_id = ${playerID};`;

  await db.run(updatePlayerDetailsQuery);
  response.send("Player Details Updated");
});

//DELETE
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
        DELETE FROM
         cricket_team 
        WHERE 
            player_id = ${playerId};`;

  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
