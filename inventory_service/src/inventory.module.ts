import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:5432,
      username:'postgres',
      password:'password',
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
