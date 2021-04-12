const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateUpdateUserInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    if(Validator.isEmpty(data.phone)){
        errors.phone = "Phone number field is required.";
    }else if(!Validator.isNumeric(data.phone)){
        errors.phone = "Phone number must be numeric.";
    }else if(!Validator.isLength(data.phone, { min: 10, max: 10 })){
        errors.phone = "Phone number must be 10 characters long.";
    }

    if(data.password && !Validator.isLength(data.password, { min: 6, max: 30 })){
        errors.password = "Password must be between 6 to 30 Characters";
    }

    if(data.password && Validator.isEmpty(data.password2)){
        errors.password2 = "Confirm Password Field is Required.";
    }

    if(data.password2 && !Validator.equals(data.password, data.password2)){
        errors.password2 = "Passwords must match."
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
