const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const validatePassword = (password) => {
    // 8-16 characters, at least one uppercase, at least one special character
    const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    return re.test(password);
};

const validateName = (name) => {
    return name && name.length >= 20 && name.length <= 60;
};

const validateAddress = (address) => {
    return !address || address.length <= 400; // Address is optional but has max length
};

const validateRating = (rating) => {
    return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

module.exports = {
    validateEmail,
    validatePassword,
    validateName,
    validateAddress,
    validateRating
};
