import { Injectable, NotFoundException } from '@nestjs/common';
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
                facebookLink: true,
                avatarUrl: true,
                isActive: true,
                provider: true,
                providerId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async createUser(data: {
        email: string;
        passwordHash: string;
        fullName: string;
    }) {
        return this.prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                facebookLink: true,
                avatarUrl: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async createGoogleUser(data: {
        email: string;
        fullName: string;
        avatarUrl?: string | null;
        providerId: string;
    }) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                fullName: data.fullName,
                avatarUrl: data.avatarUrl ?? null,
                provider: 'GOOGLE',
                providerId: data.providerId,
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                facebookLink: true,
                avatarUrl: true,
                isActive: true,
                provider: true,
                providerId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async updateGoogleUser(
        userId: string,
        data: {
            fullName?: string;
            avatarUrl?: string | null;
            providerId?: string;
        },
    ) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.fullName !== undefined && { fullName: data.fullName }),
                ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
                ...(data.providerId !== undefined && { providerId: data.providerId }),
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                facebookLink: true,
                avatarUrl: true,
                isActive: true,
                provider: true,
                providerId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async updateProfile(
        userId: string,
        data: {
            fullName?: string;
            phoneNumber?: string;
            facebookLink?: string | null;
            avatarUrl?: string | null;
        },
    ) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.fullName !== undefined && { fullName: data.fullName }),
                ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
                ...(data.facebookLink !== undefined && {
                    facebookLink: data.facebookLink,
                }),
                ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phoneNumber: true,
                facebookLink: true,
                avatarUrl: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}