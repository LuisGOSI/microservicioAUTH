const { signUp } = require('supertokens-node/recipe/emailpassword');
const { signIn } = require('supertokens-node/recipe/emailpassword');
const { signOut } = require('supertokens-node/recipe/session');
const { emailExists } = require('supertokens-node/recipe/emailpassword');


// Funcion para registrarse

async function signUpClicked(email, password) {
    try {
        let response = await signUp({
            formFields: [{ id: "email", value: email }, { id: "password", value: password }]
        });

        if (response.status === "FIELD_ERROR") {
            return { error: response.formFields };
        } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
            return { error: response.reason };
        } else {
            return { success: true };  // Registro exitoso
        }
    } catch (err) {
        if (err.isSuperTokensGeneralError === true) {
            return { error: err.message };
        } else {
            return { error: "Oops! Something went wrong." };
        }
    }
}


// Funcion para revisar el correo unico
async function checkEmail(email) {
    try {
        let response = await emailExists({
            email
        });
        if (response.doesExist) {
            return 1;  // El correo ya existe
        }
        return 0;  // El correo no existe
    } catch (err) {
        if (err.isSuperTokensGeneralError === true) {
            return { error: err.message };
        } else {
            return { error: "Oops! Something went wrong." };
        }
    }
}

// Funcion para loguear
async function signInClicked(email, password) {
    try {
        let response = await signIn({
            formFields: [{ id: "email", value: email }, { id: "password", value: password }]
        });

        if (response.status === "FIELD_ERROR") {
            return { error: "Invalid field values" };
        } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
            return { error: "Email password combination is incorrect." };
        } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
            return { error: response.reason }; 
        } else {
            return { success: true };  // Ingreso exitoso
        }
    } catch (err) {
        if (err.isSuperTokensGeneralError === true) {
            return { error: err.message };
        } else {
            return { error: "Oops! Something went wrong." };
        }
    }
}



module.exports = {signUpClicked, checkEmail, signInClicked};