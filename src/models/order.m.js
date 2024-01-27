const db = require('../utils/db');
const tableName = 'orders';
const tableId = 'id';

module.exports = class Order {
    constructor(obj) {
        this.id = obj?.id;
        this.order_by = obj?.order_by;
        this.order_date = obj?.order_date;
        this.delivery_address = obj?.delivery_address;
        this.delivery_date = obj?.delivery_date;
        this.total_amount = obj?.total_amount;
        this.delivery_status = obj?.delivery_status;
        this.phone_number = obj?.phone_number;
        this.receiver = obj?.receiver;
    }

    static async add(order) {
        const response = await db.insert(tableName, order, tableId);
        return response;
    }

    static async get(orderId) {
        const response = await db.getOneOrNone(tableName, [{ fieldName: tableId, value: orderId }]);
        const order = new Order(response);
        return order;
    }

    static async count(constraintValues) {
        const response = await db.getCount(tableName, constraintValues);
        return response.count;
    }

    static async getAll() {
        const response = await db.getAll(tableName);
        const orderList = response.map((order) => new Order(order));
        return orderList;
    }

    static async getSearch(constraintValues, page = 1, perPage = 8, orderField) {
        const response = await db.getSearch(tableName, constraintValues, page, perPage, orderField);
        const orderList = response.result.map((order) => new Order(order));
        delete response.result;
        return { ...response, orderList };
    }

    static async getManyOrNone(constraintValues) {
        const response = await db.getManyOrNone(tableName, constraintValues);
        const orderList = response.map((order) => new Order(order));
        return orderList;
    }

    static async delete(orderId) {
        await db.delete(tableName, [{ fieldName: tableId, value: orderId }]);
    }

    static async update(order, orderId) {
        const response = await db.update(tableName, order, tableId, orderId);
        return response;
    }
};
