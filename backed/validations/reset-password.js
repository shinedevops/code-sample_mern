const Validator = require('validator');
const isEmpty = require('is-empty');
module.exports = validateResetPasswordInput = (data) => {
    let errors = {};
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.token = !isEmpty(data.token) ? data.token : "";

    if(Validator.isEmpty(data.password)){
        errors.password = "Password is Required.";
    }else if(!Validator.isLength(data.password, { min: 6, max: 30 })){
        errors.password = "Password must be between 6 to 30 Characters";
    }

    if(Validator.isEmpty(data.password2)){
        errors.password2 = "Confirm Password Field is Required.";
    }else if(!Validator.equals(data.password, data.password2)){
        errors.password2 = "Passwords must match."
    }

    if(Validator.isEmpty(data.token)){
        errors.token = "Token is required.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

} 