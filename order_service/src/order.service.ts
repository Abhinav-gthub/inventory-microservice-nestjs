import { HttpStatus, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { Repository } from "typeorm";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { lastValueFrom, timeout, TimeoutError } from "rxjs";

@Injectable()
export class OrderService{
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @Inject('INVENTORY_CLIENT') private readonly inventoryClient: ClientProxy
  ){}

  async createOrder(userId: number, productId:number,quantity:number){
    const order = this.orderRepository.create({userId,productId,quantity})
    const saveOrder = await this.orderRepository.save(order)
    
    try{
      await lastValueFrom(this.inventoryClient.send('checkout_order',{productId, data:{quantity}}).pipe(timeout(5000)))
    }
    catch(error){
      if (error instanceof TimeoutError) {
        throw new RpcException({
          statusCode: HttpStatus.REQUEST_TIMEOUT,
          message: 'Inventory service is unresponsive. Order is pending verification.'
        });
      }
      const errorMessage = error instanceof Error?error.message:'Checkout failed due to inventory constraints'
      saveOrder.status='FAILED'
      await this.orderRepository.save(saveOrder)
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: errorMessage
      });

    }
    saveOrder.status = 'CONFIRMED'
    return await this.orderRepository.save(saveOrder)
  }

  async getOrderHistory(userId:number){
    return await this.orderRepository.find({
      where:{userId:userId},
      order:{orderId:'DESC'}
    });
  }


}