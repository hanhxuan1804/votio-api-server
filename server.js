const app = require("./src/app");

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Votio server listening on http://localhost:${port}`);
});


process.on("SIGINT", () => {    
    console.log("Stopping server");
    server.close();
    process.exit();
    }
);

