import { Controller } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern('get_product_with_id')
  getProductWithId(@Payload() id:number){
    return this.inventoryService.getProductWithId(id)
  }

  @MessagePattern('checkout_order')
  processOrder(@Payload() Payload: {productId: number; data: {quantity: number}}){
    return this.inventoryService.processOrder(+Payload.productId,+Payload.data.quantity)
  }

  @MessagePattern('get_all_products')
  getAllProducts(){
    return this.inventoryService.getAllProducts()
  }

  @MessagePattern('create_new_product')
  createNewProduct(@Payload() data: CreateProductDto){
    return this.inventoryService.addNewProduct(data)
  }

  @MessagePattern('update_product')
  updateProduct(@Payload() payload: {productId: number, data: UpdateProductDto}){
    return this.inventoryService.updateProduct(payload.productId,payload.data)
  }

  @MessagePattern('delete_product')
  deleteProductById(@Payload() productId: number){
    return this.inventoryService.deleteProductById(productId)
  }


}
