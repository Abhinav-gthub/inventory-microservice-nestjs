import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryService {
    constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>,){}

    async processOrder(productId: number, quantity: number){
        const product = await this.productRepository.findOneBy({id:productId})
        if(!product){
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: `No product found with id ${productId}.`
            });
        }
        else if(product.stock<quantity){
            throw new RpcException({
                statusCode: HttpStatus.BAD_REQUEST,
                message: `Not enough stock available.`
            });
        }
        product.stock-=quantity;
        return {product};
    }

    async getProductWithId(productId: number){
        const product = await this.productRepository.findOneBy({id:productId})
        if(!product){
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: `No product found with id ${productId}.`
            });
        }
        return {product};
    }

    async getAllProducts(){
        return await this.productRepository.find();
        }
    
    async addNewProduct(product: CreateProductDto){
        if(await this.productRepository.findOneBy({name:product.name}))
        {
            throw new RpcException({
                statusCode: HttpStatus.CONFLICT,
                message: `Product ${product.name} already exist.`
            });
        }
        const newProduct = this.productRepository.create(product)
        return await this.productRepository.save(newProduct)
    }

    async updateProduct(productId:number, updateProduct: UpdateProductDto){
        const product = await this.productRepository.findOneBy({id:productId})
        if(!product){
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: `No product with ${productId} exist.`
            });
        }
        const productToUpdate = Object.assign(product,updateProduct)
        return this.productRepository.save(productToUpdate)
    }

    async deleteProductById(productId: number){
        const productToDelete = await this.productRepository.delete(productId);
        if(productToDelete.affected === 0){
            throw new RpcException({
                statusCode: HttpStatus.NOT_FOUND,
                message: `No product with ${productId} exist.`
            });
        };
        return { message: `Product ${productId} deleted successfully.` };
    }
}
