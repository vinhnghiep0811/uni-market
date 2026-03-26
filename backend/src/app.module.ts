import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ListingsModule } from './listings/listings.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,}),
            HealthModule, 
            UsersModule, 
            PrismaModule, 
            AuthModule,
            CategoriesModule,
            ListingsModule,
            FavoritesModule,
            TransactionsModule,
            UploadsModule,
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
