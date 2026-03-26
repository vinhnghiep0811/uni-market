import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListingStatus, TransactionStatus } from 'generated/prisma/client';

@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(buyerId: string, dto: CreateTransactionDto) {
        const listing = await this.prisma.listing.findUnique({
            where: { id: dto.listingId },
            select: {
                id: true,
                sellerId: true,
                status: true,
                title: true,
            }
        })

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        if (listing.sellerId === buyerId) {
            throw new BadRequestException('You cannot request your own listing');
        }

        if (listing.status !== ListingStatus.PUBLISHED) {
            throw new BadRequestException('This listing is not available for request');
        }

        const existingTransaction = await this.prisma.transaction.findFirst({
            where: {
                listingId: dto.listingId,
                buyerId,
                status: {
                    in: [TransactionStatus.PENDING, TransactionStatus.ACCEPTED],
                },
            },
            select: { id: true, status: true },
        });

        if (existingTransaction) {
            throw new BadRequestException(
                'You already have an active request for this listing',
            );
        }

        const transaction = await this.prisma.transaction.create({
            data: {
                listingId: dto.listingId,
                buyerId,
                sellerId: listing.sellerId,
                message: dto.message,
                status: TransactionStatus.PENDING,
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        status: true,
                        images: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        facebookLink: true,
                        phoneNumber: true,
                    },
                },
            },
        });

        return {
            message: 'Request created successfully',
            data: transaction,
        };
    }

    async getMyRequests(buyerId: string) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                buyerId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        status: true,
                        images: true,
                        condition: true,
                        location: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                        facebookLink: true,
                        phoneNumber: true,
                    },
                },
            },
        });

        return {
            message: 'My requests fetched successfully',
            data: transactions,
        };
    }

    async getIncomingRequests(sellerId: string) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                sellerId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        status: true,
                        images: true,
                        condition: true,
                        location: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                        email: true,
                        phoneNumber: true,
                        facebookLink: true,
                    },
                },
            },
        });

        return {
            message: 'Incoming requests fetched successfully',
            data: transactions,
        };
    }

    async acceptRequest(sellerId: string, transactionId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                listing: {
                    select: {
                        id: true,
                        sellerId: true,
                        status: true,
                        title: true,
                    },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        if (transaction.sellerId !== sellerId) {
            throw new BadRequestException('You cannot accept this request');
        }

        if (transaction.status !== TransactionStatus.PENDING) {
            throw new BadRequestException('Only pending requests can be accepted');
        }

        if (transaction.listing.status !== ListingStatus.PUBLISHED) {
            throw new BadRequestException('This listing is not available for accepting requests');
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const existingAccepted = await tx.transaction.findFirst({
                where: {
                    listingId: transaction.listingId,
                    status: TransactionStatus.ACCEPTED,
                },
                select: { id: true },
            });

            if (existingAccepted) {
                throw new BadRequestException(
                    'This listing already has an accepted request',
                );
            }

            const updatedTransaction = await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    status: TransactionStatus.ACCEPTED,
                },
                include: {
                    listing: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            status: true,
                            images: true,
                            condition: true,
                            location: true,
                        },
                    },
                    buyer: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                            email: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                            facebookLink: true,
                            phoneNumber: true,
                        },
                    },
                },
            });

            await tx.listing.update({
                where: { id: transaction.listingId },
                data: {
                    status: ListingStatus.IN_TRANSACTION,
                },
            });

            return updatedTransaction;
        });

        return {
            message: 'Request accepted successfully',
            data: result,
        };
    }

    async rejectRequest(sellerId: string, transactionId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                listing: {
                    select: {
                        id: true,
                        sellerId: true,
                        status: true,
                    },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        if (transaction.sellerId !== sellerId) {
            throw new BadRequestException('You cannot reject this request');
        }

        if (transaction.status !== TransactionStatus.PENDING) {
            throw new BadRequestException('Only pending requests can be rejected');
        }

        const updatedTransaction = await this.prisma.transaction.update({
            where: { id: transactionId },
            data: {
                status: TransactionStatus.REJECTED,
            },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        status: true,
                        images: true,
                        condition: true,
                        location: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                        email: true,
                    },
                },
            },
        });

        return {
            message: 'Request rejected successfully',
            data: updatedTransaction,
        };
    }

    async cancelRequest(userId: string, transactionId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                listing: {
                    select: {
                        id: true,
                        sellerId: true,
                        status: true,
                    },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        const isBuyer = transaction.buyerId === userId;
        const isSeller = transaction.sellerId === userId;

        if (!isBuyer && !isSeller) {
            throw new BadRequestException('You cannot cancel this request');
        }

        if (
            transaction.status !== TransactionStatus.PENDING &&
            transaction.status !== TransactionStatus.ACCEPTED
        ) {
            throw new BadRequestException(
                'Only pending or accepted requests can be cancelled',
            );
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const updatedTransaction = await tx.transaction.update({
                where: { id: transactionId },
                data: {
                    status: TransactionStatus.CANCELLED,
                    buyerConfirmed: false,
                    sellerConfirmed: false,
                },
                include: {
                    listing: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            status: true,
                            images: true,
                            condition: true,
                            location: true,
                        },
                    },
                    buyer: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                            email: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                            facebookLink: true,
                            phoneNumber: true,
                        },
                    },
                },
            });

            if (transaction.status === TransactionStatus.ACCEPTED) {
                await tx.listing.update({
                    where: { id: transaction.listingId },
                    data: {
                        status: ListingStatus.PUBLISHED,
                    },
                });
            }

            return updatedTransaction;
        });

        return {
            message: 'Request cancelled successfully',
            data: result,
        };
    }

    async confirmReceived(buyerId: string, transactionId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                listing: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        if (transaction.buyerId !== buyerId) {
            throw new BadRequestException('You cannot confirm this transaction');
        }

        if (transaction.status !== TransactionStatus.ACCEPTED) {
            throw new BadRequestException(
                'Only accepted transactions can be confirmed',
            );
        }

        await this.prisma.transaction.update({
            where: { id: transactionId },
            data: {
                buyerConfirmed: true,
            },
        });

        await this.finalizeIfBothConfirmed(transactionId);

        return {
            message: 'Buyer confirmed successfully',
        };
    }

    async confirmSold(sellerId: string, transactionId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                listing: {
                    select: {
                        id: true,
                        sellerId: true,
                        status: true,
                    },
                },
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        if (transaction.sellerId !== sellerId) {
            throw new BadRequestException('You cannot confirm this transaction');
        }

        if (transaction.status !== TransactionStatus.ACCEPTED) {
            throw new BadRequestException(
                'Only accepted transactions can be confirmed',
            );
        }

        await this.prisma.transaction.update({
            where: { id: transactionId },
            data: {
                sellerConfirmed: true,
            },
        });

        await this.finalizeIfBothConfirmed(transactionId);

        return {
            message: 'Seller confirmed successfully',
        };
    }

    private async finalizeIfBothConfirmed(transactionId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
            select: {
                id: true,
                listingId: true,
                buyerConfirmed: true,
                sellerConfirmed: true,
                status: true,
            },
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        if (
            transaction.status === TransactionStatus.ACCEPTED &&
            transaction.buyerConfirmed &&
            transaction.sellerConfirmed
        ) {
            await this.prisma.$transaction([
                this.prisma.transaction.update({
                    where: { id: transactionId },
                    data: {
                        status: TransactionStatus.COMPLETED,
                    },
                }),
                this.prisma.listing.update({
                    where: { id: transaction.listingId },
                    data: {
                        status: ListingStatus.SOLD,
                    },
                }),
                this.prisma.transaction.updateMany({
                    where: {
                        listingId: transaction.listingId,
                        status: TransactionStatus.PENDING,
                        id: {
                            not: transactionId,
                        },
                    },
                    data: {
                        status: TransactionStatus.REJECTED,
                    },
                }),
            ]);
        }
    }
}
