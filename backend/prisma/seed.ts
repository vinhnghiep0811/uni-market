import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    const categories = [
        {
            name: 'Giáo trình',
            slug: 'giao-trinh',
            description: 'Sách giáo trình, tài liệu học tập',
        },
        {
            name: 'Điện tử',
            slug: 'dien-tu',
            description: 'Laptop, tai nghe, máy tính cầm tay, phụ kiện',
        },
        {
            name: 'Đồ gia dụng',
            slug: 'do-gia-dung',
            description: 'Quạt, nồi cơm, đèn bàn, vật dụng cá nhân',
        },
        {
            name: 'Đồ ký túc xá',
            slug: 'do-ky-tuc-xa',
            description: 'Đồ dùng cho sinh hoạt trong ký túc xá',
        },
        {
            name: 'Khác',
            slug: 'khac',
            description: 'Các mặt hàng khác',
        },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {
                name: category.name,
                description: category.description,
            },
            create: category,
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });