import { PrismaClient, UserRole, ArticleStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting full database seed...');

  try {
    // Clean existing data
    console.log('Cleaning existing data...');
    await prisma.pageView.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.article.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Data cleaned');

    // Create Users
    console.log('Creating users...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@kpp-kb2.go.id',
        passwordHash: adminPassword,
        fullName: 'Administrator',
        role: UserRole.admin,
        isActive: true,
      },
    });

    const staffPassword = await bcrypt.hash('staff123', 12);
    const staff = await prisma.user.create({
      data: {
        email: 'staff@kpp-kb2.go.id',
        passwordHash: staffPassword,
        fullName: 'Staff KPP',
        role: UserRole.staff,
        isActive: true,
      },
    });
    console.log('✅ Users created');

    // Create Categories
    console.log('Creating categories...');
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Pendaftaran NPWP',
          slug: 'pendaftaran-npwp',
          description: 'Panduan pendaftaran dan penerbitan NPWP',
          icon: 'Users',
          displayOrder: 1,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Pelaporan SPT',
          slug: 'pelaporan-spt',
          description: 'Cara pelaporan SPT Tahunan dan Masa',
          icon: 'FileText',
          displayOrder: 2,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Pembayaran Pajak',
          slug: 'pembayaran-pajak',
          description: 'Panduan pembayaran dan kode billing',
          icon: 'CreditCard',
          displayOrder: 3,
        },
      }),
    ]);
    console.log('✅ Categories created');

    // Sample Tiptap Content
    const sampleContent = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Cara Daftar NPWP Online' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Pendaftaran NPWP kini dapat dilakukan secara online melalui sistem Coretax DJP.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Langkah-langkah Pendaftaran' }],
        },
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'Buka website ' },
                    {
                      type: 'text',
                      marks: [{ type: 'bold' }],
                      text: 'coretaxdjp.pajak.go.id',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Klik menu "Daftar"' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Isi formulir pendaftaran dengan lengkap',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Dokumen yang Diperlukan' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'KTP (untuk WNI)' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Paspor (untuk WNA)' }],
                },
              ],
            },
          ],
        },
      ],
    };

    // Create Articles
    console.log('Creating articles...');
    await Promise.all([
      prisma.article.create({
        data: {
          authorId: staff.id,
          categoryId: categories[0].id,
          title: 'Cara Daftar NPWP Online melalui Coretax DJP',
          slug: 'cara-daftar-npwp-online-coretax',
          excerpt:
            'Panduan lengkap pendaftaran NPWP secara online melalui sistem Coretax DJP',
          content: sampleContent,
          status: ArticleStatus.published,
          publishedAt: new Date(),
        },
      }),
      prisma.article.create({
        data: {
          authorId: staff.id,
          categoryId: categories[1].id,
          title: 'Cara Lapor SPT Tahunan 1770SS untuk Karyawan',
          slug: 'cara-lapor-spt-1770ss',
          excerpt: 'Panduan pelaporan SPT Tahunan menggunakan formulir 1770SS',
          content: sampleContent,
          status: ArticleStatus.published,
          publishedAt: new Date(),
        },
      }),
      prisma.article.create({
        data: {
          authorId: admin.id,
          categoryId: categories[2].id,
          title: 'Cara Membuat Kode Billing di DJP Online',
          slug: 'cara-membuat-kode-billing',
          excerpt:
            'Langkah-langkah pembuatan kode billing untuk pembayaran pajak',
          content: sampleContent,
          status: ArticleStatus.published,
          publishedAt: new Date(),
        },
      }),
    ]);
    console.log('✅ Articles created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@kpp-kb2.go.id / admin123');
    console.log('   Staff: staff@kpp-kb2.go.id / staff123');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
