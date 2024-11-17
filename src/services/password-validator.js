export default function passwordValidator(password) {
    let errors = [];
    // Validate that password is at least 8 characters long
    if (password.length < 8) {
        errors.push('be at least 8 characters long');
    }
    // Validate that password has at least one digit
    if (!password.match(/\d/)) {
        errors.push('contain at least one digit');
    }
    // Validate that password has at least one lowercase letter
    if (!password.match(/[a-z]/)) {
        errors.push('contain at least one lowercase letter');
    }
    // Validate that password has at least one uppercase letter
    if (!password.match(/[A-Z]/)) {
        errors.push('contain at least one uppercase letter');
    }
    // Validate that password has at least one special character
    if (!password.match(/[^a-zA-Z0-9]/)) {
        errors.push('contain at least one special character');
    }
    return errors;
}
