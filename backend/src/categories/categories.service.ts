import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}