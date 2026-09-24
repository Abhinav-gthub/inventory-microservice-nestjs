import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'order_db',
      entities: [Order],
      synchronize:true,
    }),
    TypeOrmModule.forFeature([Order]),

    ClientsModule.register([
      {
        name:'INVENTORY_CLIENT',
        transport: Transport.TCP,
        options:{
          host:'127.0.0.1',
          port: 3001
        }
      }
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
