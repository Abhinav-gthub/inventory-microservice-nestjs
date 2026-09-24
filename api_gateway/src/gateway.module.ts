import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { InvenoryGatewayController } from './inventory_gateway/inventory.controller';
import { GatewayService } from './gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerMiddleware } from './common/logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthorisation } from './auth/auth.contoller';
import { OrderGatewayController } from './order_gateway/order.controller';

@Module({
  imports: [
    JwtModule.register({
      global:true,
      secret: 'MY_SUPER_SECRET_KEY',
      signOptions: {expiresIn: '1h'},
    }),
    ClientsModule.register([
      {
        name: 'INVENTORY_CLIENT',
        transport: Transport.TCP,
        options:{
          host:'127.0.0.1',
          port: 3001,
        }
      }
    ]),
    ClientsModule.register([
      {
        name: 'ORDER_CLIENT',
        transport: Transport.TCP,
        options:{
          host:'127.0.0.1',
          port: 3002
        }
      }
  ])
  ],
  controllers: [InvenoryGatewayController,UserAuthorisation,OrderGatewayController],
  providers: [GatewayService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
