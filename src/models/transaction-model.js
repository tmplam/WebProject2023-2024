const transactionQueries = require('../queries/transaction-queries')
const objectUtils = require('../utils/objectUtils')

module.exports = class Transaction {
    constructor(transaction) {
        this.id = transaction.id
        this.from_account = transaction.from_account
        this.to_account = transaction.to_account
        this.amount = transaction.amount
        this.status = transaction.status
        this.created_time = transaction.created_time
    }

    static getTransaction = async ({ id }) => {
        const transactionData = await transactionQueries.getTransactionQuery({ id })

        if (!objectUtils.isEmpty(transactionData)) {
            return new Transaction(transactionData)
        }
        return {}
    }

    static addTransaction = async ({ fromAccount, toAccount, amount }) => {
        return await transactionQueries.addTransactionQuery({ fromAccount, toAccount, amount })
    }

    static updateTransaction = async ({ status, id }) => {
        return await transactionQueries.updateTransactionQuery({ status, id })
    }
}