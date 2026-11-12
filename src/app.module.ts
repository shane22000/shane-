import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/product.module';
import { OrderItemsModule } from './order-items/order-items.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CategoryModule,
    UsersModule,
    ProductsModule,
    OrderItemsModule,
  ],
})
export class AppModule {}