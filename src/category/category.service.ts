import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

@Injectable()
export class CategoryService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // GET ALL CATEGORIES
  async findAll() {
    const [rows] = await this.databaseService.getPool().query<RowDataPacket[]>(
      'SELECT * FROM categories',
    );

    return rows;
  }

  // GET CATEGORY BY ID
  async findOne(id: number) {
    const [rows] = await this.databaseService.getPool().execute<RowDataPacket[]>(
      'SELECT * FROM categories WHERE category_id = ?',
      [id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Category not found');
    }

    return rows[0];
  }

  // CREATE CATEGORY
  async create(data: {
    category_name: string;
    description?: string;
  }) {
    const [existing] = await this.databaseService.getPool().execute<RowDataPacket[]>(
      'SELECT * FROM categories WHERE category_name = ?',
      [data.category_name],
    );

    if (existing.length > 0) {
      throw new ConflictException('Category already exists');
    }

    const [result] = await this.databaseService.getPool().execute<ResultSetHeader>(
      'INSERT INTO categories (category_name, description) VALUES (?, ?)',
      [data.category_name, data.description ?? null],
    );

    return {
      message: 'Category created successfully',
      category_id: result.insertId,
    };
  }

  // UPDATE CATEGORY
  async update(
    id: number,
    data: {
      category_name?: string;
      description?: string;
    },
  ) {
    await this.findOne(id);

    if (data.category_name) {
      const [existing] = await this.databaseService.getPool().execute<RowDataPacket[]>(
        'SELECT * FROM categories WHERE category_name = ? AND category_id != ?',
        [data.category_name, id],
      );

      if (existing.length > 0) {
        throw new ConflictException('Category name already exists');
      }
    }

    await this.databaseService.getPool().execute(
      `UPDATE categories
       SET category_name = COALESCE(?, category_name),
           description = COALESCE(?, description)
       WHERE category_id = ?`,
      [
        data.category_name ?? null,
        data.description ?? null,
        id,
      ],
    );

    return {
      message: 'Category updated successfully',
    };
  }

  // DELETE CATEGORY
  async remove(id: number) {
    await this.findOne(id);

    await this.databaseService.getPool().execute(
      'DELETE FROM categories WHERE category_id = ?',
      [id],
    );

    return {
      message: 'Category deleted successfully',
    };
  }
}
