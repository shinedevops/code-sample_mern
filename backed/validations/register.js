const Validator = require('validator');
const isEmpty = require('is-empty');
module.exports = validateRegisterInput = (data) => {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.phone = !isEmpty(data.phone) ? data.phone : "";

    if(Validator.isEmpty(data.name)){
        errors.name = "Name field is required.";
    }

    if(Validator.isEmpty(data.email)){
        errors.email = "Email field is required.";
    }else if(!Validator.isEmail(data.email)){
        errors.email = "Please provide a valid email.";
    }

    if(Validator.isEmpty(data.password)){
        errors.password = "Password is Required.";
    }

    if(Validator.isEmpty(data.password2)){
        errors.password2 = "Confirm Password Field is Required.";
    }

    if(!Validator.isLength(data.password, { min: 6, max: 30 })){
        errors.password = "Password must be between 6 to 30 Characters";
    }

    if(!Validator.equals(data.password, data.password2)){
        errors.password2 = "Passwords must match."
    }
    if(Validator.isEmpty(data.phone)){
        errors.phone = "Phone number field is required.";
    }else if(!Validator.isNumeric(data.phone)){
        errors.phone = "Phone number must be numeric.";
    }else if(!Validator.isLength(data.phone, { min: 10, max: 10 })){
        errors.phone = "Phone number must be 10 characters long.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

} 