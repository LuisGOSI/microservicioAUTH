import Session from 'supertokens-web-js/recipe/session';
import EmailPassword from 'supertokens-web-js/recipe/emailpassword';


//Configuracion de SuperTokens
superTokens.init({
    framework: "express",
    supertokens: {
        connectionURI: "process.env.SUPERTOKENS_CONNECTION_URI",
        apiKey: ""
    },
    appInfo: {
        appName: "ejemploMicroservicios",
        apiDomain: "http://localhost:8080",
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/auth"
    },
    recipeList: [
        EmailPassword.init(),
        Session.init()
    ]
});