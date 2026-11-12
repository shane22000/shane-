import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrderItemsService {
  constructor(private db: DatabaseService) {}

  // GET ALL ORDER ITEMS
  async findAll() {
    const [rows] = await this.db.getPool().query(
      'SELECT * FROM order_items'
    );

    return rows;
  }

  // GET ORDER ITEM BY ID
  async findOne(id: number) {
    const [rows] = await this.db.getPool().execute(
      'SELECT * FROM order_items WHERE order_item_id = ?',
      [id]
    );

    return rows;
  }

  // CREATE ORDER ITEM
  async create(data: any) {
    const [result] = await this.db.getPool().execute(
      `INSERT INTO order_items
      (order_id, product_id, quantity, unit_price)
      VALUES (?, ?, ?, ?)`,
      [
        data.order_id,
        data.product_id,
        data.quantity,
        data.unit_price,
      ]
    );

    return {
      message: 'Order item created successfully',
      result,
    };
  }

  // UPDATE ORDER ITEM
  async update(id: number, data: any) {
    const [result] = await this.db.getPool().execute(
      `UPDATE order_items SET
      order_id = ?,
      product_id = ?,
      quantity = ?,
      unit_price = ?
      WHERE order_item_id = ?`,
      [
        data.order_id,
        data.product_id,
        data.quantity,
        data.unit_price,
        id,
      ]
    );

    return {
      message: 'Order item updated successfully',
      result,
    };
  }

  // DELETE ORDER ITEM
  async remove(id: number) {
    const [result] = await this.db.getPool().execute(
      'DELETE FROM order_items WHERE order_item_id = ?',
      [id]
    );

    return {
      message: 'Order item deleted successfully',
      result,
    };
  }
}