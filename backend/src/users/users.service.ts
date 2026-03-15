import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                zaloLink: true,
                facebookLink: true,
                avatarUrl: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async createUser(data: {
        email: string;
        passwordHash: string;
        fullName: string;
        phoneNumber?: string;
        zaloLink?: string;
        facebookLink?: string;
        avatarUrl?: string;
    }) {
        return this.prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                zaloLink: true,
                facebookLink: true,
                avatarUrl: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}