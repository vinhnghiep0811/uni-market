import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
    constructor(private readonly prisma: PrismaService) {}

    async addFavorite(userId: string, listingId: string){
        const listing = await this.prisma.listing.findUnique({
            where: { id: listingId },
            select: { id: true }
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        const existingFavorite = await this.prisma.favorite.findUnique({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                }
            }
        })

        if (existingFavorite) {
            throw new ConflictException('Listing already added to favorites');
        }

        return this.prisma.favorite.create({
            data: {
                userId,
                listingId,
            }
        })
    }

    async removeFavorite(userId: string, listingId: string) {
        const existingFavorite = await this.prisma.favorite.findUnique({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                }
            }
        })

        if (!existingFavorite) {
            throw new NotFoundException('Favorite not found');
        }

        await this.prisma.favorite.delete({
            where: {
                userId_listingId: {
                    userId,
                    listingId,
                }
            }
        })

        return {
            message: 'Removed from favorites successfully',
        }
    }

    async getMyFavorites(userId: string) {
        return this.prisma.favorite.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                listing: {
                    include: {
                        category: true,
                        seller: {
                            select: {
                                id: true,
                                fullName: true,
                                avatarUrl: true,
                            },
                        },
                        images: {
                            orderBy: { sortOrder: 'asc' },
                        },
                    },
                },
            },
        });
    }
}
