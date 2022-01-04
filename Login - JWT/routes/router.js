const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/", authController.isAuthenticated, (req, res) => {
    res.render("index", { nombre: req.nombre_usuario });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

//Router para los metodos del controller
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
