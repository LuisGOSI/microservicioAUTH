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

// Puerto de la aplicacion
const port = 3000;

// Configuracion de SuperTokens
superTokens.init({
    framework: "express",
    supertokens: {
        connectionURI: process.env.CONNECTION_URL,
        apiKey: process.env.API_KEY
    },
    appInfo: {
        appName: "ejemploMicroservicios",
        apiDomain: "https://microservicio-auth-tau.vercel.app:8080",
        websiteDomain: "https://microservicio-auth-tau.vercel.app:3000",
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
    origin: "https://microservicio-auth-tau.vercel.app:3000",
    allowedHeaders: ["content-type", ...superTokens.getAllCORSHeaders()],
    credentials: true
}));

// Middleware de SuperTokens
app.use(middleware());

//!Rutas -----------------------------------------------------------------------------

// Ruta de SignUp
app.post("/authentication/signUp",async (req, res) => {
    if (checkEmail(req.body.email) === 1) {
        res.status(400).send("Email already in use");
    }
    let signUpResponse = await signUpClicked(req.body.email, req.body.password);
    if (signUpResponse === 0) {
        res.status(200).send(signUpResponse);
    }
    else {
        res.status(400).send(signUpResponse);
    }
});

// Ruta de SignIn
app.post("/authentication/signIn", async (req, res) => {
    try {
        let signInResponse = await EmailPassword.signIn(req.body.email, req.body.password);
        if (signInResponse === 0) {
            res.status(400).send("Error");
        } else {
            res.status(200).send(signInResponse);
        }
    } catch (err) {
        res.status(400).send("Error");
    }
});

// Ruta de verificación
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(process.env.CONNECTION_URL);
});

//!-----------------------------------------------------------------------------------

// Error handler
app.use(errorHandler());
