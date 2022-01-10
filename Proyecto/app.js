const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const Handlebars = require("handlebars");
const PORT = process.env.PORT || 3000;
const app = express();

//Invocamos a dotenv: Variables de entorno
dotenv.config({ path: "./env/.env" });

app.set("views", path.join(__dirname, "views"));
app.engine(
    ".hbs",
    exphbs({
        defaultLayout: "main",
        layoutsDir: path.join(app.get("views"), "layouts"),
        partialsDir: path.join(app.get("views"), "partials"),
        extname: ".hbs",
    })
);
app.set("view engine", ".hbs");

Handlebars.registerHelper("ife", function (lvalue, rvalue, options) {
    if (lvalue === rvalue) {
        return options.fn(this);
    }
    return options.inverse(this);
});

//Public - archivos estaticos
app.use(express.static("public"));

//procesar datos enviados desde form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Para poder trabajar con las cookies
app.use(cookieParser());

//Define routes
app.use("/", require("./routes/router"));

//Para eliminar el cache y que no se pueda volver con el boton de back
app.use(function (req, res, next) {
    if (!req.nombre_usuario) {
        res.header(
            "Cache-Control",
            "private, no-cache, no-store, must-revalidate"
        );
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});
