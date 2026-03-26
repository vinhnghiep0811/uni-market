import { Controller, Body, Post, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @CurrentUser() user: any,
        @Body() dto: CreateTransactionDto,
    ) {
        return this.transactionsService.create(user.id, dto);
    }

    @Get('my-requests')
    @UseGuards(JwtAuthGuard)
    async getMyRequests(@CurrentUser() user: any) {
        return this.transactionsService.getMyRequests(user.id);
    }

    @Get('incoming')
    @UseGuards(JwtAuthGuard)
    async getIncomingRequests(@CurrentUser() user: any) {
        return this.transactionsService.getIncomingRequests(user.id);
    }

    @Patch(':id/accept')
    @UseGuards(JwtAuthGuard)
    async acceptRequest(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.transactionsService.acceptRequest(user.id, id);
    }

    @Patch(':id/reject')
    @UseGuards(JwtAuthGuard)
    async rejectRequest(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.transactionsService.rejectRequest(user.id, id);
    }

    @Patch(':id/cancel')
    @UseGuards(JwtAuthGuard)
    async cancelRequest(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.transactionsService.cancelRequest(user.id, id);
    }

    @Patch(':id/confirm-received')
    @UseGuards(JwtAuthGuard)
    async confirmReceived(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.transactionsService.confirmReceived(user.id, id);
    }

    @Patch(':id/confirm-sold')
    @UseGuards(JwtAuthGuard)
    async confirmSold(
        @CurrentUser() user: any,
        @Param('id') id: string,
    ) {
        return this.transactionsService.confirmSold(user.id, id);
    }
}
