const cors = require('cors');
const superTokens = require("supertokens-node");
const Session = require("supertokens-node/recipe/session");
const EmailPassword = require("supertokens-node/recipe/emailpassword");
const Dashboard = require("supertokens-node/recipe/dashboard");
const { errorHandler, middleware } = require('supertokens-node/framework/express');
require('dotenv').config();
const express = require('express');

// Inicializacion de la aplicacion
const app = express();

// Puerto de la aplicacion
const port = 8080;

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
        Dashboard.init()
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

// Ruta de verificación
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(process.env.CONNECTION_URL);  
});

//!-----------------------------------------------------------------------------------

// Error handler
app.use(errorHandler());
