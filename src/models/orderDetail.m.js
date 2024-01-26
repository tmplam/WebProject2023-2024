const db = require('../utils/db');
const tableName = 'order_details';
const tableId = 'order_id';

module.exports = class OrderDetail {
    constructor(obj) {
        this.order_id = obj?.order_id;
        this.book_id = obj?.book_id;
        this.quantity = obj?.quantity;
        this.price = obj?.price;
    }

    static async add(orderDetail) {
        const response = await db.insert(tableName, orderDetail, tableId);
        return response;
    }

    static async getOrderDetails(orderId) {
        const response = await db.getManyOrNone(tableName, [
            { fieldName: tableId, value: orderId },
        ]);
        const orderDetailList = response.map((orderDetail) => new OrderDetail(orderDetail));
        return orderDetailList;
    }

    static async getManyOrNone(constraintValues) {
        const response = await db.getManyOrNone(tableName, constraintValues);
        const orderList = response.map((order) => new OrderDetail(order));
        return orderList;
    }
};
