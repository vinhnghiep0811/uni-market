import { Controller, Param, Post, UseGuards, Delete, Get } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
    constructor (private readonly favoritesService: FavoritesService) {}

    @Post(':listingId')
    addFavorite(
        @CurrentUser() user: any,
        @Param('listingId') listingId: string,
    ) {
        return this.favoritesService.addFavorite(user.id, listingId);
    }

    @Delete(':listingId')
    removeFavorite(
        @CurrentUser() user: any,
        @Param('listingId') listingId: string,
    ) {
        return this.favoritesService.removeFavorite(user.id, listingId);
    }

    @Get()
    getMyFavorites(@CurrentUser() user: any) {
        return this.favoritesService.getMyFavorites(user.id);
    }
}
