const bcrypt = require('bcrypt');

// Hash the password
const hashPassword = async (password) => {
    const saltRounds = 10; // Number of salt rounds
    return await bcrypt.hash(password, saltRounds);
};

// Check if the entered password matches the hashed password
const checkPassword = async (plainTextPassword, hashedPassword) => {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    checkPassword,
};