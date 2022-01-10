const db = require("../database/db");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.consultregister = (req, res) => {
    db.query("SELECT * FROM rol", (error, results) => {
        if (error) {
            console.log(error);
        } else {
            req.datos = results;
            res.render("register", {
                datos: req.datos,
            });
        }
    });
};

//Registro
exports.register = async (req, res) => {
    try {
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

        if (
            !nombres ||
            !apellidos ||
            !nombre_usuario ||
            !contrasena ||
            !contrasena2 ||
            !rol ||
            !correo ||
            !direccion
        ) {
            res.render("register", {
                message: "Ingrese todos los campos",
            });
        } else {
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
                        db.query(
                            "INSERT INTO usuario SET ?",
                            {
                                id_rol: rol,
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
                                    return res.render("register", {
                                        message: "Usuario registrado",
                                    });
                                }
                            }
                        );
                    }
                }
            );
        }
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
                "SELECT * FROM usuario WHERE nombre_usuario = ?",
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
                        return res.redirect("/");
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
                "SELECT * FROM usuario INNER JOIN rol ON usuario.id_rol = rol.id_rol " +
                    "WHERE id_usuario = ?",
                [decodify.id_usuario],
                (error, results) => {
                    if (!results) {
                        return next();
                    }
                    if (results[0].id_rol == 1 || results[0].id_rol == 2) {
                        req.estud = 0;
                    } else {
                        req.estud = 1;
                    }
                    req.nombre_usuario = results[0];
                    return next();
                }
            );
        } catch (error) {
            console.log(error);
        }
    } else {
        return res.render("index");
    }
};

//Cierre de sesion
exports.logout = (req, res) => {
    res.clearCookie("jwt");
    return res.render("index");
};

//Actualizar datos
exports.editar = (req, res) => {
    try {
        const {
            nombre,
            apellido,
            nombre_usuario,
            contrasena,
            correo,
            direccion,
        } = req.body;

        const datos = {
            nombre,
            apellido,
            contrasena,
            nombre_usuario,
            correo,
            direccion,
        };

        if (!nombre || !apellido || !contrasena || !correo || !direccion) {
            res.render("actualizar", {
                message: "Ingrese todos los campos",
            });
        } else {
            db.query(
                "UPDATE usuario SET ? WHERE id_usuario = ?",
                [datos, req.nombre_usuario.id_usuario],
                (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.render("profile", {
                            nombre_usuario: req.nombre_usuario,
                            message: "Datos Actualizados",
                        });
                    }
                }
            );
        }
    } catch (error) {
        console.log(error);
    }
};

//Consulta de horario
exports.consultvista = async (req, res) => {
    db.query(
        "SELECT * FROM horario_asignado ha " +
            "INNER JOIN horario h ON ha.id_horario = h.id_horario " +
            "INNER JOIN materia m ON m.id_materia = h.id_materia " +
            "INNER JOIN nivel n ON n.id_nivel = m.id_nivel " +
            "INNER JOIN paralelo p ON p.id_nivel = n.id_nivel " +
            "INNER JOIN usuario u ON u.id_usuario = ha.id_usuario " +
            "WHERE u.id_usuario = ?",
        [req.nombre_usuario.id_usuario],
        (error, results) => {
            if (error) {
                console.log(error);
            } else {
                req.datos = results;
                res.render("vistausuario", {
                    nombre_usuario: req.nombre_usuario,
                    datos: req.datos,
                    rol: req.estud,
                });
            }
        }
    );
};

//Contact
exports.contact = (req, res) => {
    const { nombre, telefono, correo, mensaje } = req.body;
    if (!nombre || !telefono || !correo || !mensaje) {
        res.render("contact", {
            nombre_usuario: req.nombre_usuario,
            message: "Ingrese todos los campos",
        });
    } else {
        res.render("contact", {
            nombre_usuario: req.nombre_usuario,
            message: "Datos enviados correctamente",
        });
    }
};

//Consulta
exports.consultNuevoHorario = (req, res) => {
    db.query("SELECT * FROM usuario WHERE id_rol = 2", (error, results) => {
        if (error) {
            console.log(error);
        }
        req.docente = results;
        db.query("SELECT * FROM nivel", (error, resp) => {
            if (error) {
                console.log(error);
            }
            req.nivel = resp;
            res.render("nuevohorario", {
                nombre_usuario: req.nombre_usuario,
                docente: req.docente,
                nivel: req.nivel,
            });
        });
    });
};

//Consulta Generar Horario
exports.consultGenerar = (req, res) => {
    const { nivel } = req.body;
    db.query(
        "SELECT * FROM paralelo WHERE id_nivel = ?",
        [nivel],
        (error, results) => {
            if (error) {
                console.log(error);
            }
            req.paralelo = results;
            db.query(
                "SELECT * FROM materia WHERE id_nivel = ?",
                [nivel],
                (error, resp) => {
                    if (error) {
                        console.log(error);
                    }
                    req.materia = resp;
                    res.render("GenerarHorario", {
                        nombre_usuario: req.nombre_usuario,
                        paralelo: req.paralelo,
                        materia: req.materia,
                    });
                }
            );
        }
    );
};

//Generar Horario
exports.GenerarHorario = (req, res) => {
    const { hora_inicio, hora_fin, materia, dia_s } = req.body;
    if (!hora_fin || !hora_inicio || !materia || !dia_s) {
        res.render("GenerarHorario", {
            message: "Ingrese todos los campos",
        });
    } else {
        db.query(
            "INSERT INTO horario set ?",
            {
                id_materia: materia,
                dia_s: dia_s,
                hora_ini: hora_inicio,
                hora_fin: hora_fin,
            },
            (error, results) => {
                if (error) {
                    console.log(error);
                }
                res.render("nuevohorario", {
                    nombre_usuario: req.nombre_usuario,
                    message: "Horario generado",
                });
            }
        );
    }
};

//Consulta Asignar Horario
exports.consultAsignar = (req, res) => {
    db.query(
        "SELECT * FROM usuario u inner join rol r on u.id_rol = r.id_rol WHERE u.id_rol = 1 or u.id_rol = 2",
        (error, results) => {
            if (error) {
                console.log(error);
            }
            req.usuario = results;
            db.query("SELECT * FROM horario", (error, result) => {
                if (error) {
                    console.log(error);
                }
                req.horario = result;
                res.render("AsignarHorario", {
                    nombre_usuario: req.nombre_usuario,
                    usuario: req.usuario,
                    horario: req.horario,
                });
            });
        }
    );
};

//Asignar Horario
exports.AsignarHorario = (req, res) => {
    const { horario, usuario } = req.body;
    const datos = {
        id_horario: horario,
        id_usuario: usuario,
    };
    db.query(
        "INSERT INTO horario_asignado SET ?",
        [datos],
        (error, results) => {
            if (error) {
                console.log(error);
            }
            res.render("AsignarHorario", {
                nombre_usuario: req.nombre_usuario,
                message: "Horario asignado",
            });
        }
    );
};
