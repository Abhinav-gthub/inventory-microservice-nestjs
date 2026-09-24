import { Controller, Inject, Injectable, Param, Post, UseGuards, Request, Body, Get } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AuthGuard } from "src/auth/auth.guards";

@Controller('orders')
export class OrderGatewayController{
    constructor(
        @Inject('ORDER_CLIENT') private orderClient: ClientProxy
    ){}

    @UseGuards(AuthGuard)
    @Post('buy/:id')
    makeOrder(@Request() req: any, @Param('id') id: string, @Body() body: {quantity:number}){
        return this.orderClient.send('create_order',{userId: req.user.sub, productId:+id, quantity: body.quantity})
    }

    @UseGuards(AuthGuard)
    @Get('my-orders')
    getMyOrders(@Request() req: any){
        return this.orderClient.send('get_my_orders',{userId:req.user.sub})
    }

}