import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrderModule,{
    transport: Transport.TCP,
    options:{
      host: '127.0.0.1',
      port: 3002
    }
  })
  await app.listen()
  console.log('order service is listening on port 3002!!')
}
bootstrap();
