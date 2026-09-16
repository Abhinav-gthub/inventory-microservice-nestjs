import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guards';

@Controller('products')
export class AppController {
  constructor(@Inject('INVENTORY_CLIENT') private client: ClientProxy,private jwtService: JwtService) {}

  @Get('login')
  login(){
    const payload = {sub: 1}
    return{
      access_token: this.jwtService.sign(payload)
    }
  }

  @UseGuards(AuthGuard)
  @Post('buy/:id')
  purchaseOrder(@Param('id') id: string, @Body() body: { quantity: number }){
    return this.client.send('checkout_order',{productId: +id,data: body})
  }

  @Get(':id')
  getProductDetails(@Param('id') id: string){
    return this.client.send('get_product_with_id',+id)
  }

  @Get()
  getAllProducts(){
    return this.client.send('get_all_products',{})
  }

  @UseGuards(AuthGuard)
  @Post()
  createNewProduct(@Body() body: CreateProductDto){
    return this.client.send('create_new_product',body)
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  updateProduct(@Param('id') id:string, @Body() body: UpdateProductDto){
    return this.client.send('update_product',{productId:+id, data: body});
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteProductById(@Param('id') id: string){
    return this.client.send('delete_product',+id)
  }

}