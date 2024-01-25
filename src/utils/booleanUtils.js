module.exports = {
    passwordValidate: (password) => {
        const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
        if (password === null || password === undefined) {
            return false;
        }
    
        if (!PWD_REGEX.test(password)) {
            return false;
        }
    
        return password;
    }
}