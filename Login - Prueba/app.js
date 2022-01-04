// Invocamos a express
const color = require('colors');
const express = require('express');
const app = express();

//Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Invocamos a dotenv: Variables de entorno
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//Directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

// Establecer motor de plantillas
app.set('view engine', 'ejs');

//Variable de sesion
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Invocamos modulo de la conexion a DB
const conexion = require('./database/db');

//Estableciendo las rutas
isAuthenticated = async (req, res, next) => {
    if (!req.session.logeado) {
        return next()
    }
    res.redirect('/');
}

app.get('/login', isAuthenticated, (req, res) => {
    res.render('login');
})

app.get('/register', isAuthenticated, (req, res) => {
    res.render('register');
})
app.get('/contactenos', isAuthenticated, (req, res) => {
    res.render('contactenos');
})

//Registro de usuario
app.post('/register', async (req, res) => {
    const nombre = req.body.nombres;
    const apellidos = req.body.apellidos;
    const nombre_usuario = req.body.nombre_usuario;
    const contrasena = req.body.contrasena;
    const rol = req.body.rol;
    const correo = req.body.correo;
    const direccion = req.body.direccion;
    if (rol == 'docente') {
        conexion.query('INSERT INTO usuario SET ?', {
            id_rol: '2', nombre: nombre, apellido: apellidos, nombre_usuario: nombre_usuario,
            contrasena: contrasena, direccion: direccion, correo: correo
        }, async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render('register', {
                    alert: true,
                    alertTitle: "Registo",
                    alertMessage: "Registrado correctamente",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'login'
                })
            }
        });
    } else {
        conexion.query('INSERT INTO usuario SET ?', {
            id_rol: '1', nombre: nombre, apellido: apellidos, nombre_usuario: nombre_usuario,
            contrasena: contrasena, direccion: direccion
        }, async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.render('register', {
                    alert: true,
                    alertTitle: "Registo",
                    alertMessage: "Registrado correctamente",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'login'
                })
            }
        });
    }
})

//Inicio de sesion
app.post('/login', async (req, res) => {
    const usuario = req.body.nombre_usuario;
    const contrasena = req.body.contrasena;
    if (usuario && contrasena) {
        conexion.query('SELECT id_usuario, nombre, contrasena FROM usuario WHERE nombre_usuario = ?',
            [usuario], async (error, results) => {
                if (results.length == 0 || !contrasena) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o contraseña incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                } else {
                    req.session.logeado = true;
                    req.session.nombre = results[0].nombre;
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexion exitosa",
                        alertMessage: "Login correcto",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: ''
                    });
                }
            })
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Adventencia",
            alertMessage: "Ingrese usuario y/o contraseña",
            alertIcon: 'info',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
})

// Autenticar sesion
app.get('/', async (req, res) => {
    if (req.session.logeado) {
        const links = await conexion.query('SELECT * FROM usuario WHERE id_usuario = ?', [req.params.id_usuario]);
        res.render('index', {
            links,
            login: true,
            name: req.session.nombre
        });
    } else {
        res.render('index', {
            login: false,
            name: 'Debe registrarse'
        });
    }
})

//Salir de la sesion
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
})

app.listen(3000, (req, res) => {

    console.log('Server running in http://localhost:3000'.cyan);
})