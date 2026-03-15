import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

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

        const accessToken = await this.signToken(user.id, user.email);

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

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            existingUser.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = await this.signToken(
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

    async getProfile(userId: string) {
        return this.usersService.findById(userId);
    }

    private async signToken(userId: string, email: string) {
        return this.jwtService.signAsync({
            sub: userId,
            email,
        });
    }
}