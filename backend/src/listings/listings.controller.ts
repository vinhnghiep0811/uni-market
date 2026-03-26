import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { UpdateListingStatusDto } from './dto/update-listing-status.dto';
import { GetListingsQueryDto } from './dto/get-listing-query.dto';

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Query() query: GetListingsQueryDto, @CurrentUser() user: any,) {
        return this.listingsService.findAll(query, user.id);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async findMine(@CurrentUser() user: any) {
        return this.listingsService.findMine(user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @CurrentUser() user: any,) {
        return this.listingsService.findOne(id, user.id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@CurrentUser() user: any, @Body() dto: CreateListingDto) {
        return this.listingsService.create(user.id, dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() dto: UpdateListingDto,
    ) {
        return this.listingsService.update(user.id, id, dto);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    async updateStatus(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body() dto: UpdateListingStatusDto,
    ) {
        return this.listingsService.updateStatus(user.id, id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@CurrentUser() user: any, @Param('id') id: string) {
        return this.listingsService.remove(user.id, id);
    }
}