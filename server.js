const express = require('express');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

// Inicialización de la aplicación
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Puerto de la aplicación
const port = process.env.PORT || 8080;

// Configuración de Firebase
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

//! Rutas -----------------------------------------------------------------------

app.post("/authentication/signUp", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken(); 
        res.json({
            message: 'User registered successfully',
            token: token,
            userId: userCredential.user.uid
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error registering user',
            error: error.message
        });
    }
});

app.post("/authentication/signIn", async (req, res) => {
    const { email, password } = req.body;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        res.json({
            message: 'User logged in successfully',
            token: token,
            userId: userCredential.user.uid
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error logging in',
            error: error.message
        });
    }
});

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Ruta de verificación
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//!--------------------------------------------------------------------------------
