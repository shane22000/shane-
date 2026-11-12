import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProductsService {
  constructor(private db: DatabaseService) {}

  // GET ALL PRODUCTS
  async findAll() {
    const [rows] = await this.db.getPool().query(
      'SELECT * FROM products'
    );

    return rows;
  }

  // GET PRODUCT BY ID
  async findOne(id: number) {
    const [rows] = await this.db.getPool().execute(
      'SELECT * FROM products WHERE product_id = ?',
      [id]
    );

    return rows;
  }

  // CREATE PRODUCT
  async create(data: any) {
    const [result] = await this.db.getPool().execute(
      `INSERT INTO products
      (restaurant_id, category_id, product_name, description,
       price, stock_quantity, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.restaurant_id,
        data.category_id,
        data.product_name,
        data.description,
        data.price,
        data.stock_quantity,
        data.status,
      ]
    );

    return {
      message: 'Product created successfully',
      result,
    };
  }

  // UPDATE PRODUCT
  async update(id: number, data  : any) {
    const [result] = await this.db.getPool().execute(
      `UPDATE products SET
      restaurant_id = ?,
      category_id = ?,
      product_name = ?,
      description = ?,
      price = ?,
      stock_quantity = ?,
      status = ?
      WHERE product_id = ?`,
      [
        data.restaurant_id,
        data.category_id,
        data.product_name,
        data.description,
        data.price,
        data.stock_quantity,
        data.status,
        id,
      ]
    );

    return {
      message: 'Product updated successfully',
      result,
    };
  }

  // DELETE PRODUCT
  async remove(id: number) {
    const [result] = await this.db.getPool().execute(
      'DELETE FROM products WHERE product_id = ?',
      [id]
    );

    return {
      message: 'Product deleted successfully',
      result,
    };
  }
}