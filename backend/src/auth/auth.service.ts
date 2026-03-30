import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class AuthService {
    private googleClient: OAuth2Client;

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {
        const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

        if (!googleClientId) {
            throw new Error('GOOGLE_CLIENT_ID is not configured');
        }

        this.googleClient = new OAuth2Client(googleClientId);
    }

    async googleLogin(idToken: string) {
        if (!process.env.GOOGLE_CLIENT_ID) {
            throw new BadRequestException('GOOGLE_CLIENT_ID is not configured');
        }

        const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload?.email) {
            throw new UnauthorizedException('Invalid Google token');
        }

        const email = payload.email;
        const fullName = payload.name || email.split('@')[0];
        const avatarUrl = payload.picture || null;
        const providerId = payload.sub;

        let user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email,
                    fullName,
                    avatarUrl,
                    provider: 'GOOGLE',
                    providerId,
                },
            });
        } else {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    providerId: user.providerId ?? providerId,
                    avatarUrl: user.avatarUrl ?? avatarUrl,
                    fullName: user.fullName || fullName,
                },
            });
        }

        const accessToken = await this.signAccessToken(user.id, user.email);
        const refreshToken = await this.signRefreshToken(user.id)
        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.createUser({
            email: dto.email,
            passwordHash,
            fullName: dto.fullName,
        });

        const accessToken = await this.signAccessToken(user.id, user.email);

        return {
            accessToken,
            user,
        };
    }

    async login(dto: LoginDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);

        if (!existingUser) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!existingUser.isActive) {
            throw new UnauthorizedException('Account is inactive');
        }

        // const isPasswordValid = await bcrypt.compare(
        //     dto.password,
        //     existingUser.passwordHash,
        // );

        // if (!isPasswordValid) {
        //     throw new UnauthorizedException('Invalid credentials');
        // }

        const accessToken = await this.signAccessToken(
            existingUser.id,
            existingUser.email,
        );

        return {
            accessToken,
            user: {
                id: existingUser.id,
                email: existingUser.email,
                fullName: existingUser.fullName,
                phoneNumber: existingUser.phoneNumber,
                facebookLink: existingUser.facebookLink,
                avatarUrl: existingUser.avatarUrl,
                isActive: existingUser.isActive,
                createdAt: existingUser.createdAt,
                updatedAt: existingUser.updatedAt,
            },
        };
    }

    async refresh(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            console.log('refresh payload:', payload);

            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });

            console.log('refresh user found:', !!user);

            if (!user) throw new UnauthorizedException();

            const accessToken = await this.signAccessToken(user.id, user.email);

            return { accessToken };
        } catch (error) {
            console.error('refresh verify failed:', error);
            throw new UnauthorizedException();
        }
    }

    async getProfile(userId: string) {
        return this.usersService.findById(userId);
    }

    private async signAccessToken(userId: string, email: string) {
        return this.jwtService.signAsync(
            {
                sub: userId,
                email,
                type: "access"
            },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: "15m",
            },
        );
    }

    private async signRefreshToken(userId: string) {
        return this.jwtService.signAsync(
            {
                sub: userId,
                type: "refresh"
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: "7d",
            },
        );
    }
}