import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CustomersService {
  constructor(private db: DatabaseService) {}

  // GET ALL CUSTOMERS
  async findAll() {
    const [rows] = await this.db.getPool().query(
      `SELECT customer_id, first_name, last_name,
       email, phone, created_at FROM customers`
    );

    return rows;
  }

  // GET CUSTOMER BY ID
  async findOne(id: number) {
    const [rows] = await this.db.getPool().execute(
      `SELECT customer_id, first_name, last_name,
       email, phone, created_at
       FROM customers WHERE customer_id = ?`,
      [id]
    );

    return rows;
  }

  // CREATE CUSTOMER
  // CREATE CUSTOMER
async create(data: any) {

  const passwordHash = await bcrypt.hash(data.password, 10);

  const [result] = await this.db.getPool().execute(
    `INSERT INTO customers
    (first_name, last_name, email, phone, password_hash)
    VALUES (?, ?, ?, ?, ?)`,
    [
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      passwordHash,
    ]
  );

  return {
    message: 'Customer created successfully',
    result,
  };
}

  // UPDATE CUSTOMER
  async update(id: number, data: any) {
    const [result] = await this.db.getPool().execute(
      `UPDATE customers SET
      first_name = ?,
      last_name = ?,
      email = ?,
      phone = ?
      WHERE customer_id = ?`,
      [
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        id,
      ]
    );

    return {
      message: 'Customer updated successfully',
      result,
    };
  }

  // DELETE CUSTOMER
  async remove(id: number) {
    const [result] = await this.db.getPool().execute(
      'DELETE FROM customers WHERE customer_id = ?',
      [id]
    );

    return {
      message: 'Customer deleted successfully',
      result,
    };
  }
}