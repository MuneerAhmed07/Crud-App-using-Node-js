// imports
require('dotenv').config();
const express = require("express");
const session = require("express-session");
const mongoose = require("./config");
const routes = require("./routes/routes")

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//session middleware
app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}));
// middleware storing session message
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));

// set template engine
app.set("view engine", "ejs");

// route prefix
app.use("", routes);

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});