const express = require("express");
const router = express.Router();

const authController = require("../controllers/controller");

router.get("/", authController.isAuthenticated, (req, res) => {
    res.render("index", {
        nombre_usuario: req.nombre_usuario,
        rol: req.estud,
    });
});

router.get("/register", authController.consultregister);

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/profile", authController.isAuthenticated, (req, res) => {
    res.render("profile", {
        nombre_usuario: req.nombre_usuario,
        dato: req.dato,
        rol: req.estud,
    });
});

router.get("/contact", authController.isAuthenticated, (req, res) => {
    res.render("contact", {
        nombre_usuario: req.nombre_usuario,
        rol: req.estud,
    });
});

router.get("/actualizar", authController.isAuthenticated, (req, res) => {
    res.render("actualizar", {
        nombre_usuario: req.nombre_usuario,
        rol: req.estud,
    });
});

router.get("/nuevohorario", [
    authController.isAuthenticated,
    authController.consultNuevoHorario,
]);

router.get("/vistausuario", [
    authController.isAuthenticated,
    authController.consultvista,
]);

router.get("/GenerarHorario", authController.isAuthenticated, (req, res) => {
    res.render("GenerarHorario", {
        nombre_usuario: req.nombre_usuario,
    });
});

router.get("/AsignarHorario", [
    authController.isAuthenticated,
    authController.consultAsignar,
]);

router.get("/logout", authController.logout);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/actualizar", [
    authController.isAuthenticated,
    authController.editar,
]);

router.post("/contact", [
    authController.isAuthenticated,
    authController.contact,
]);

router.post("/nuevohorario", [
    authController.isAuthenticated,
    authController.consultGenerar,
]);

router.post("/GenerarHorario", [
    authController.isAuthenticated,
    authController.GenerarHorario,
]);

router.post("/AsignarHorario", [
    authController.isAuthenticated,
    authController.AsignarHorario,
]);

module.exports = router;
