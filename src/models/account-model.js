const accountQueries = require('../queries/account-queries')
const objectUtils = require('../utils/objectUtils')

module.exports = class Account {
    constructor(account) {
        this.id = account.id
        this.main_system_id = account.main_system_id
        this.name = account.name
        this.password = account.password
        this.avatar = account.avatar
        this.balance = account.balance
        this.created_time = account.created_time
    }

    static getAccountModel = async ({ id }) => {
        const accountData = await accountQueries.getAccountQuery({ id })

        if (!objectUtils.isEmpty(accountData)) {
            return new Account(accountData)
        }
        return {}
    }

    static getAccountModelByMainSystemID = async ({ id }) => {
        const accountData = await accountQueries.getAccountByMainSystemIDQuery({ id })

        if (!objectUtils.isEmpty(accountData)) {
            return new Account(accountData)
        }
        return {}
    }

    static addAccountModel = async ({ id, mainSystemID, name, password }) => {
        await accountQueries.addNewAccount({ id, mainSystemID, name, password })
    }

    static updateAccountModel = async ({ id, balance }) => {
        await accountQueries.updateAccount({ id, balance })
    }
}