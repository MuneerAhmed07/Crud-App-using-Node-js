const mongoose = require("mongoose");

// database connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error',(error) => console.log(error));
db.once('open',() => console.log("Connected to the database"));