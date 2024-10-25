const { signUp } = require('supertokens-node/recipe/emailpassword');
const { signIn } = require('supertokens-node/recipe/emailpassword');
const { signOut } = require('supertokens-node/recipe/session');
const { emailExists } = require('supertokens-node/recipe/emailpassword');


// Funcion para registrarse

async function signUpClicked(email, password) {
    let error = 1;
    try {
        let response = await signUp({
            formFields: [{
                id: "email",
                value: email
            }, {
                id: "password",
                value: password
            }]
        })

        if (response.status === "FIELD_ERROR") {
            // one of the input formFields failed validation
            response.formFields.forEach(formField => {
                if (formField.id === "email") {
                    // Email validation failed (for example incorrect email syntax),
                    // or the email is not unique.
                    error = formField.error
                    return error;
                } else if (formField.id === "password") {
                    // Password validation failed.
                    // Maybe it didn't match the password strength
                    error = formField.error
                    return error;
                }
            })
        } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
            // the reason string is a user friendly message
            // about what went wrong. It can also contain a support code which users
            // can tell you so you know why their sign up was not allowed.
            error = response.reason
            return error;
        } else {
            // sign up successful. The session tokens are automatically handled by
            // the frontend SDK.
            error = 0
            return error;
        }
    } catch (err) {
        if (err.isSuperTokensGeneralError === true) {
            // this may be a custom error message sent from the API by you.
            error = err.message
            return error;
        } else {
            error = "Oops! Something went wrong."
            return error;
        }
    }
}

// Funcion para revisar el correo unico
async function checkEmail(email) {
    try {
        let response = await doesEmailExist({
            email
        });
        if (response.doesExist) {
            window.alert("Email already exists. Please sign in instead")
        }
    } catch (err) {
        if (err.isSuperTokensGeneralError === true) {
            // this may be a custom error message sent from the API by you.
            window.alert(err.message);
        } else {
            window.alert("Oops! Something went wrong.");
        }
    }
}

// Funcion para loguear
async function signInClicked(email, password) {
    let error = 1;
    try {
        let response = await signIn({
            formFields: [{
                id: "email",
                value: email
            }, {
                id: "password",
                value: password
            }]
        })

        if (response.status === "FIELD_ERROR") {
            response.formFields.forEach(formField => {
                if (formField.id === "email") {
                    // Email validation failed (for example incorrect email syntax).
                    return error;
                }
            })
        } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
            window.alert("Email password combination is incorrect.")
        } else if (response.status === "SIGN_IN_NOT_ALLOWED") {
            // the reason string is a user friendly message
            // about what went wrong. It can also contain a support code which users
            // can tell you so you know why their sign in was not allowed.
            return error; 
        } else {
            // sign in successful. The session tokens are automatically handled by
            // the frontend SDK.
            error = 0;
            return error;
        }
    } catch (err) {
        if (err.isSuperTokensGeneralError === true) {
            // this may be a custom error message sent from the API by you.
            return error;
        } else {
            return error;
        }
    }
}


module.exports = {signUpClicked, checkEmail, signInClicked};