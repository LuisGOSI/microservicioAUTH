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
app.use(express.urlencoded({extended:true}));

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
        apiDomain: "http://localhost:8080",
        websiteDomain: "http://localhost:3000",
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
    origin: "http://localhost:3000",
    allowedHeaders: ["content-type", ...superTokens.getAllCORSHeaders()],
    credentials: true
}));

// Middleware de SuperTokens
app.use(middleware());

//!Rutas -----------------------------------------------------------------------------

// Ruta de SignUp
app.post("/authentication/signUp",async (req, res) => {
    const { email, password } = req.body;
    if (email === "" || password === "") {
        return res.status(400).send("Email or password cannot be empty");
    }
    if (await checkEmail(email) === 1) {
        return res.status(400).send("Email already in use");
    }
    let signUpResponse = await signUpClicked(email,password);
    if (signUpResponse.error) {
        return res.status(200).send(signUpResponse.error);
    }
    else {
        return res.status(400).send(signUpResponse);
    }
});

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

// Ruta de verificación
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(process.env.CONNECTION_URL);
});

//!-----------------------------------------------------------------------------------

// Error handler
app.use(errorHandler());
