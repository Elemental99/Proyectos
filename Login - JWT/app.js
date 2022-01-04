const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const expressLayouts = require('express-ejs-layouts');

const app = express();

//Motor de plantilla
app.use(expressLayouts);
app.set('layout', './layout/main')
app.set("view engine", "ejs");

//Public - archivos estaticos
app.use(express.static("public"));

//procesar datos enviados desde form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//variables de entorno
dotenv.config({ path: "./env/.env" });

//Para poder trabajar con las cookies
app.use(cookieParser());

//Llamar al router
app.use("/", require("./routes/router"));

//Para eliminar el cache y que no se pueda volver con el boton de back
app.use(function (req, res, next) {
    if (!req.user) {
        res.header(
            "Cache-Control",
            "private, no-cache, no-store, must-revalidate"
        );
    }
    next();
});

app.listen(8080, () => {
    console.log("Server UP running in http://localhost:8080");
});
