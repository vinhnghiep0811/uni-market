import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { UpdateListingStatusDto } from './dto/update-listing-status.dto';
import { GetListingsQueryDto } from './dto/get-listing-query.dto';
import { ListingStatus } from '../../generated/prisma/client';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ListingsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: string, dto: CreateListingDto) {
        const category = await this.prisma.category.findUnique({
            where: { id: dto.categoryId },
            select: { id: true },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return this.prisma.listing.create({
            data: {
                title: dto.title,
                description: dto.description,
                price: dto.price,
                condition: dto.condition,
                location: dto.location,
                contactNote: dto.contactNote,
                categoryId: dto.categoryId,
                sellerId: userId,
                images: dto.imageUrls?.length
                    ? {
                        create: dto.imageUrls.map((imageUrl, index) => ({
                            imageUrl,
                            sortOrder: index,
                        })),
                    }
                    : undefined,
            },
            include: {
                category: true,
                seller: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true,
                        facebookLink: true,
                        avatarUrl: true,
                    },
                },
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
    }

    async findAll(query: GetListingsQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 12;
        const skip = (page - 1) * limit;

        const sortBy = query.sortBy ?? 'createdAt';
        const sortOrder = query.sortOrder ?? 'desc';

        const where: Prisma.ListingWhereInput = {
            status: ListingStatus.PUBLISHED,
        };

        if (query.categoryId) {
            where.categoryId = query.categoryId;
        }

        if (query.search?.trim()) {
            const keyword = query.search.trim();

            where.OR = [
                {
                    title: {
                        contains: keyword,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: keyword,
                        mode: 'insensitive',
                    },
                },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.listing.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                include: {
                    category: true,
                    seller: {
                        select: {
                            id: true,
                            fullName: true,
                            phoneNumber: true,
                            facebookLink: true,
                            avatarUrl: true,
                        },
                    },
                    images: {
                        orderBy: { sortOrder: 'asc' },
                    },
                },
            }),
            this.prisma.listing.count({ where }),
        ]);

        return {
            data: items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findMine(userId: string) {
        return this.prisma.listing.findMany({
            where: {
                sellerId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                category: true,
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
    }

    async findOne(id: string) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: {
                category: true,
                seller: {
                    select: {
                        id: true,
                        fullName: true,
                        phoneNumber: true,
                        facebookLink: true,
                        avatarUrl: true,
                    },
                },
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        return listing;
    }

    async update(userId: string, id: string, dto: UpdateListingDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            select: {
                id: true,
                sellerId: true,
            },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (listing.sellerId !== userId) {
            throw new ForbiddenException('You can only update your own listing');
        }

        if (dto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: dto.categoryId },
                select: { id: true },
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }
        }

        return this.prisma.listing.update({
            where: { id },
            data: {
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.price !== undefined && { price: dto.price }),
                ...(dto.condition !== undefined && { condition: dto.condition }),
                ...(dto.location !== undefined && { location: dto.location }),
                ...(dto.contactNote !== undefined && { contactNote: dto.contactNote }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
            },
            include: {
                category: true,
                seller: {
                    select: {
                        id: true,
                        fullName: true,
                        phoneNumber: true,
                        facebookLink: true,
                        avatarUrl: true,
                    },
                },
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
    }

    async updateStatus(
        userId: string,
        id: string,
        dto: UpdateListingStatusDto,
    ) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            select: {
                id: true,
                sellerId: true,
            },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (listing.sellerId !== userId) {
            throw new ForbiddenException('You can only update your own listing');
        }

        return this.prisma.listing.update({
            where: { id },
            data: {
                status: dto.status,
            },
            include: {
                category: true,
                seller: {
                    select: {
                        id: true,
                        fullName: true,
                        phoneNumber: true,
                        facebookLink: true,
                        avatarUrl: true,
                    },
                },
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
    }

    async remove(userId: string, id: string) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            select: {
                id: true,
                sellerId: true,
            },
        });

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (listing.sellerId !== userId) {
            throw new ForbiddenException('You can only delete your own listing');
        }

        await this.prisma.listing.delete({
            where: { id },
        });

        return { message: 'Listing deleted successfully' };
    }
}