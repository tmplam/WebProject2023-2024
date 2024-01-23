const usernameValidate = (username) => {
    const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9_-]{3,23}$/;
    if (username === null || username === undefined) {
        throw new Error("invalid username");
    }

    if (!USER_REGEX.test(username)) {
        throw new Error("invalid username");
    }

    return username;
}

const passwordValidate = (password) => {
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    if (password === null || password === undefined) {
        throw new Error("invalid password");
    }

    if (!PWD_REGEX.test(password)) {
        throw new Error("invalid password");
    }

    return password;
}

const uuidValidate = (uuid) => {
    const UUID_REGEX = /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/;
    if (uuid === null || uuid === undefined) {
        throw {
            status: 400,
            message: 'invalid UUID'
        }
    }
    if (!UUID_REGEX.test(uuid)) {
        throw {
            status: 400,
            message: 'invalid UUID'
        }
    }
    return uuid;
}

const urlValidate = (url) => {
    const URL_REGEX = /^(http:\/\/www.|https:\/\/www.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+).[a-z]{2,5}(:[0-9]{1,5})?(\/.)?$/;
    if (url === null || url === undefined) {
        throw new Error("invalid Url");
    }
    if (!URL_REGEX.test(url)) {
        throw new Error("invalid Url");
    }
    return url;
}

const emailValidate = (email) => {
    const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (email === null || email === undefined) {
        throw new Error("invalid Email");
    }
    if (!EMAIL_REGEX.test(email)) {
        throw new Error("invalid Email");
    }
    return email;
}

const phoneValidate = (phone) => {
    const PHONE_REGEX = /^(84|0[3|5|7|8|9])\d{8}$/;
    if (phone === null || phone === undefined) {
        throw new Error("invalid phone number");
    }
    if (!PHONE_REGEX.test(phone)) {
        throw new Error("invalid phone number");
    }
    return phone;
}

const numberValidate = (number) => {
    const NUMBER_REGEX = /^\d+(\.\d+)?$/;
    if (number === null || number === undefined) {
        throw new Error("invalid number");
    }
    if (!NUMBER_REGEX.test(number)) {
        throw new Error("invalid number");
    }
    return Number(number);
}

const isUserStatusValid = (status) => {
    return (status === 'Active' || status === 'Blocked')
}

const fullnameValidate = (fullname) => {
    const FULLNAME_REGEX = /^[A-ZÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆÚÙỦŨỤƯỨỪỬỮỰÍÌỈĨỊÓÒỎÕỌƠỚỜỞỠỢÔỐỒỔỖỘÝỲỶỸỴ][a-záàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệúùủũụưứừửữựíìỉĩịóòỏõọơớờởỡợôốồổỗộýỳỷỹỵ]*$/;
    const names = fullname.trim().split(/\s+/); 
    for (let i = 0; i < names.length; i++) {
        if (!FULLNAME_REGEX.test(names[i])) {
            throw new Error("invalid fullname");
        }
    }
    return fullname;
}

module.exports = { usernameValidate, passwordValidate, uuidValidate, urlValidate, emailValidate, phoneValidate, numberValidate, fullnameValidate, isUserStatusValid }
