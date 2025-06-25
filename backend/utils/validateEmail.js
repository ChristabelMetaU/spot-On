const validateEmail = async (email) => {
    const emailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    if (!isValid) {
        return false;
    }
    return email.endsWith('.edu');
}

module.exports = validateEmail;
