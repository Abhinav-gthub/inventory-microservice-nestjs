import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:process.env.DB_HOST || 'localhost',
      port:5432,
      username:'postgres',
      password:process.env.DB_PASSWORD ||'password',
      database:'inventory_db',
      entities:[Product],
      synchronize:true,
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class AppModule {}
