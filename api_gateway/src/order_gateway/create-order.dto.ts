import {  IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateOrderDto{
    @IsNotEmpty({message: 'Quantity is required'})
    @IsInt({message: 'Quantity should be an integer'})
    @IsPositive({message: 'Quantity must be greater then 0'})
    quantity!: number;
}