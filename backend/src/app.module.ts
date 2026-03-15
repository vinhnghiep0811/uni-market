import { Module } from '@nestjs/common';
import { HealthModule  } from './health/health.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [HealthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
