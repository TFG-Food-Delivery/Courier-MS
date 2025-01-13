import { Module } from '@nestjs/common';
import { CouriersModule } from './couriers/couriers.module';

@Module({
  imports: [CouriersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
