const jwt = require("jsonwebtoken");
const db = require("../database/db");
const { promisify } = require("util");

//Registro
exports.register = async (req, res) => {
    try {
        console.log(req.body);

        const {
            nombres,
            apellidos,
            nombre_usuario,
            contrasena,
            contrasena2,
            rol,
            correo,
            direccion,
        } = req.body;

        db.query(
            "SELECT * FROM usuario WHERE nombre_usuario = ?",
            [nombre_usuario],
            async (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    if (results.length > 0) {
                        return res.render("register", {
                            message: "Usuario en uso",
                        });
                    } else if (contrasena != contrasena2) {
                        return res.render("register", {
                            message: "Contraseñas no coinciden",
                        });
                    }
                    console.log(contrasena);
                    if (
                        results.length == 0 ||
                        !(nombres,
                            apellidos,
                            nombre_usuario,
                            contrasena,
                            contrasena2,
                            rol,
                            correo,
                            direccion)
                    ) {
                        return res.render("register", {
                            message: "Ingrese todos los datos",
                        });
                    } else {
                        if (rol == "Docente") {
                            db.query(
                                "INSERT INTO usuario SET ?",
                                {
                                    id_rol: 2,
                                    nombre: nombres,
                                    apellido: apellidos,
                                    nombre_usuario: nombre_usuario,
                                    correo: correo,
                                    contrasena: contrasena,
                                    direccion: direccion,
                                },
                                (error, results) => {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log(results);
                                        return res.render("register", {
                                            message: "Usuario registrado",
                                        });
                                    }
                                }
                            );
                        } else {
                            db.query(
                                "INSERT INTO usuario SET ?",
                                {
                                    id_rol: 1,
                                    nombre: nombres,
                                    apellido: apellidos,
                                    nombre_usuario: nombre_usuario,
                                    correo: correo,
                                    contrasena: contrasena,
                                    direccion: direccion,
                                },
                                (error, results) => {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log(results);
                                        return res.render("register", {
                                            message: "Usuario registrado",
                                        });
                                    }
                                }
                            );
                        }
                    }
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

//Inicio de sesion
exports.login = async (req, res) => {
    try {
        const { nombre_usuario, contrasena } = req.body;
        if (!nombre_usuario || !contrasena) {
            return res.render("login", {
                message: "Ingrese nombre de Usuario y/o contraseña",
            });
        } else {
            await db.query(
                "SELECT id_usuario, id_rol, nombre, apellido, nombre_usuario, correo, "
                + "contrasena, direccion FROM usuario WHERE nombre_usuario = ?",
                [nombre_usuario],
                async (error, results) => {
                    if (results.length == 0) {
                        return res.render("login", {
                            message:
                                "Nombre de Usuario y/o contraseña incorrecta",
                        });
                    } else {
                        const id_usuario = results[0].id_usuario;
                        const token = jwt.sign(
                            { id_usuario: id_usuario },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: process.env.JWT_TIME_EXPIRE,
                            }
                        );

                        const cookiesOption = {
                            expires: new Date(
                                Date.now() +
                                process.env.JWT_COOKIE_EXPIRE *
                                24 *
                                60 *
                                60 *
                                1000
                            ),
                            httpOnly: true,
                        };

                        res.cookie("jwt", token, cookiesOption);
                        return res.render("index");
                    }
                }
            );
        }
    } catch (error) {
        console.log(error);
    }
};

//Autenticacion
exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodify = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );
            await db.query(
                "SELECT id_usuario, id_rol, nombre, apellido, nombre_usuario, correo, "
                + "contrasena, direccion FROM usuario WHERE id_usuario = ?",
                [decodify.id_usuario],
                (error, results) => {
                    if (!results) {
                        return next();
                    }
                    req.nombre_usuario = results[0];
                    return next();
                }
            );
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect("/login");
    }
};

//Cierre de sesion sss
exports.logout = (req, res) => {
    res.clearCookie("jwt");
    return res.redirect("/");
};
