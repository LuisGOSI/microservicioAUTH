const cors = require('cors');
const superTokens = require("supertokens-node");
const Session = require("supertokens-node/recipe/session");
const EmailPassword = require("supertokens-node/recipe/emailpassword");
const Dashboard = require("supertokens-node/recipe/dashboard");
const { errorHandler, middleware } = require('supertokens-node/framework/express');
const { signUpClicked, checkEmail } = require('./api/authFunctions');
require('dotenv').config();
const express = require('express');

// Inicializacion de la aplicacion
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Puerto de la aplicacion
const port = process.env.PORT || 8080;

// Configuracion de SuperTokens
superTokens.init({
    framework: "express",
    supertokens: {
        connectionURI: process.env.CONNECTION_URL,
        apiKey: process.env.API_KEY
    },
    appInfo: {
        appName: "ejemploMicroservicios",
        apiDomain: "https://microservicioauth.onrender.com",
        websiteDomain: "https://frontend-microservicios.vercel.app/",
        apiBasePath: "/authentication"
    },
    recipeList: [
        EmailPassword.init(),
        Session.init(),
        Dashboard.init({
            admins: [
                "luis_gosi@outlook.com"
            ]
        })
    ]
});

// Configuracion de CORS
app.use(cors({
    origin: '*', // O el dominio permitido
    allowedHeaders: ["content-type", "authorization", ...superTokens.getAllCORSHeaders()],
    credentials: true
}));



// Middleware de SuperTokens
app.use(middleware());

//!Rutas -----------------------------------------------------------------------------

// Ruta de SignUp
// app.post("/authentication/signUp", async (req, res) => {
//     console.log(req.body);
//     const { email, password } = req.body;
//     console.log(email);
//     console.log(password);
//     if (email === "" || password === "") {
//         return res.status(400).send("Email or password cannot be empty");
//     }
//     if (await checkEmail(email) === 1) {
//         return res.status(400).send("Email already in use");
//     }
//     let signUpResponse = await signUpClicked(email, password);
//     console.log("Si paso por la funcion de signUp");
//     if (signUpResponse.error) {
//         res.status(500).json({message: "Error al registrar la cita"});    }
//     else {
//         res.status(200).json({ message: "Nueva cita registrada" });
//     }
// });

// Ruta de SignIn
app.post("/authentication/signIn", async (req, res) => {
    try {
        let signInResponse = await EmailPassword.signIn(req.body.email, req.body.password);
        if (signInResponse.error) {
            return res.status(400).send(signInResponse.error);
        } else {
            return res.status(200).send("Sign In successful");
        }
    } catch (err) {
        res.status(400).send("Error");
    }
});

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Ruta de verificación
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(process.env.CONNECTION_URL);
});

//!-----------------------------------------------------------------------------------

// Error handler
app.use(errorHandler());
