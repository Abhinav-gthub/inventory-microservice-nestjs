import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('orders')
export class Order{
    @PrimaryGeneratedColumn()
    id!: number
    @Column()
    userId!: number
    @Column()
    productId!:number
    @Column()
    quantity!:number
    @Column({default:'PENDING'})
    status!:string

}