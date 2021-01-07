var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

var DB = require('./config/oracleConnection');

app.listen(port, function(){
    console.log('Listening on port ', port)
});

app.get('/', function(req, res) {
    res.send('Sergio Lenin González Solis - 201503798')
});

app.post('/crearPadreHijo', async function(req, res) {
    try{
        const email = req.body.email;
        const nombrePadre = req.body.nombrePadre;
        const pass = req.body.pass;
        const telefono = req.body.telefono;
        const dinero = req.body.dinero;
        const depto = req.body.departamento;
        const muni = req.body.municipio;
        const detalle = req.body.detalle;
        const nombreHijo = req.body.nombreHijo;
        const nickname = req.body.nickname;
        const fecha = req.body.fecha;
        const sexo = req.body.sexo;

        let sql1 = 'INSERT INTO padre(email, nombre_padre, contraseña, telefono, dinero, departamento, municipio, detalle) VALUES (\'' + email + '\', \'' + nombrePadre + '\', \'' + pass + '\', \'' + telefono + '\', \'' + dinero + '\', \'' + depto + '\', \'' + muni + '\', \'' + detalle + '\')';
        await DB.Open(sql1, [], true);

        let sql2 = 'INSERT INTO hijo(nombre_hijo, nickname, fecha_nacimineto, sexo, email_padre) VALUES (\'' + nombreHijo + '\', \'' + nickname + '\', \'' + fecha + '\', \'' + sexo + '\', \'' + email + '\')';
        await DB.Open(sql2, [], true);

        res.send('Usuarios agregado con éxito!')
        console.log('Usuarios agregados con éxito!')
    } catch (err) {
        res.send('Error al crear los usuarios!')
        console.log('Error al crear los usuarios! ', err)
    }
});








app.post('/getTotal', async function(req, res) {
    try{
        const id = req.body.idCliente;

        let sql = 'select sum(producto.precioproducto*detalle_factura.cantidad) from cliente, factura, detalle_factura, producto where cliente.idCliente = ' + id + ' and  factura.idCliente = cliente.idCliente and factura.idfactura = detalle_factura.idfactura and detalle_factura.idproducto = producto.idproducto';
        let result = await DB.Open(sql, [], false);
        let usuarios = [];

        usuarios = result.rows.map(user =>{
            let usuariosSchema = {
                "ID" : id,
                "Total":  user[0]
            }

            return(usuariosSchema);
        })
        res.json(usuarios);
    } catch (err) {
        res.send('Error !')
        console.log('Error ! ', err)
    }
});

app.get('/getProductos', async function(req, res) {
    try {
        let query = "SELECT * FROM producto";
        let result = await DB.Open(query, [], false);
        let usuarios = [];

        usuarios = result.rows.map(user =>{
            let usuariosSchema = {
                "ID" : user[0],
                "Nombre":  user[1],
                "Precio" : user[2]
            }

            return(usuariosSchema);
        })
        res.json(usuarios);
    } catch (err) {
        res.send('Error al hacer la petición!');
        console.error('Error al hacer la petición! ', err);
    }
});

//Hoja de Trabajo


app.post('/registro', async function(req, res) {
    try{
        const nombre = req.body.nombre;
        const email = req.body.email;
        const pass = req.body.password;

        let sql = 'INSERT INTO usuario(nombre, email, contraseña) VALUES (\'' + nombre + '\', \'' + email + '\', \'' + pass +'\')';
        await DB.Open(sql, [], true);

        res.send('Usuario agregado con éxito!')
        //res.send(sql);
    } catch (err) {
        res.send('Error al crear el usuario!')
        console.log('Error al crear el usuario! ', err)
    }
});

app.post('/login', async function(req, res) {
    try{
        const email = req.body.email;
        const pass = req.body.password;

        let sql = 'SELECT contraseña FROM usuario WHERE email=\'' + email + '\'';
        let result = await DB.Open(sql, [], false);
        let auth = [];

        auth = result.rows.map(user =>{

            if (user[0] == pass) {
                let authSchema = {
                    "auth" : true
                }
                return(authSchema);
            }else {
                let authSchema = {
                    "auth" : false
                }
                return(authSchema);
            }
        })

        res.json(auth)
    } catch (err) {
        res.send('Error !')
        console.log('Error ! ', err)
    }
});

app.get('/getUsuarios', async function(req, res) {
    try {
        let query = "SELECT * FROM usuario";
        let result = await DB.Open(query, [], false);
        let usuarios = [];

        usuarios = result.rows.map(user =>{
            let usuariosSchema = {
                "Nombre" : user[1],
                "Correo":  user[0],
                "Contraseña" : user[2]
            }

            return(usuariosSchema);
        })
        res.json(usuarios);
    } catch (err) {
        res.send('Error al hacer la petición!');
        console.error('Error al hacer la petición! ', err);
    }
});