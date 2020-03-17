// packages
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const expressJwt = require("express-jwt");
const passport = require("./config/passport");
const PORT = process.env.PORT || 5000;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(morgan("dev"));
app.use(express.json());
// app.use(express.static("public")); // may use 
app.use(passport.initialize());

app.use("/api", expressJwt({ secret: process.env.SECRET }));

// Requiring routes
app.use("/auth", require("./routes/auth.js"));
app.use("/api/image", require("./routes/image"));

// Error
app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === "UnauthorizedError") {
        res.status(err.status)
    }
    return res.send({ message: err.message });
});
// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
