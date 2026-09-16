import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerMiddleware } from './logger.middleware';
import { JwtModule } from '@nestjs/jwt';

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
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
