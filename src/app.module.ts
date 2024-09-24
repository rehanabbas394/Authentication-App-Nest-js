import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import  { dataSourceOption } from 'db/data_source';
import { UserModule } from './user/user.module';
import { currentUserMiddleware } from './utility/middleware/current.user.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOption), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(currentUserMiddleware).forRoutes({path:"*", method:RequestMethod.ALL})
  }
}
