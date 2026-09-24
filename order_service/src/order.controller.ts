import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('create_order')
  createOrder(@Payload() Payload: {userId: number;productId:number,quantity:number}){
    return this.orderService.createOrder(Payload.userId,Payload.productId,Payload.quantity);
  }

  @MessagePattern('get_orders')
  getOrders(@Payload() Payload:{userId:number}){
    return this.orderService.getOrderHistory(Payload.userId);
  }
}
