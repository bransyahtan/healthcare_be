import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function hash(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  // Clear order-sensitive tables first (pivot -> children)
  await prisma.hospitalSpecialization.deleteMany();
  await prisma.hospitalFacility.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.articleCategory.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.hospitalService.deleteMany();
  await prisma.hospitalData.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const [adminPwd, doctorPwd, authorPwd] = await Promise.all([
    hash("Admin@123"),
    hash("Doctor@123"),
    hash("Author@123"),
  ]);

  const admin = await prisma.user.create({
    data: {
      name: "Admin One",
      email: "admin@example.com",
      username: "admin1",
      password: adminPwd,
      role: 1,
      phoneNumber: "0800000001",
    },
  });

  const doctor = await prisma.user.create({
    data: {
      name: "Dr. John Doe",
      email: "doctor@example.com",
      username: "doctor1",
      password: doctorPwd,
      role: 2,
      phoneNumber: "0800000002",
    },
  });

  const author = await prisma.user.create({
    data: {
      name: "Author Jane",
      email: "author@example.com",
      username: "author1",
      password: authorPwd,
      role: 3,
      phoneNumber: "0800000003",
    },
  });

  // Hospitals
  const hospitalA = await prisma.hospitalData.create({
    data: {
      hospitalName: "Rumah Sakit Sehat A",
      longitude: 106.8456,
      latitude: -6.2088,
      address: "Jl. Kesehatan No. 1, Jakarta",
      phoneNumber: "0211234567",
    },
  });

  // Hospital Services
  const services = await prisma.hospitalService.createMany({
    data: [
      {
        name: "UGD 24 Jam",
        slug: "ugd-24-jam",
        description: "Layanan gawat darurat 24 jam.",
      },
      {
        name: "Laboratorium",
        slug: "laboratorium",
        description: "Pemeriksaan laboratorium lengkap.",
      },
      {
        name: "Radiologi",
        slug: "radiologi",
        description: "X-ray, CT-Scan, MRI.",
      },
    ],
    skipDuplicates: true,
  });

  // Facilities
  const facilityIgd = await prisma.facility.create({
    data: { name: "IGD", slug: "igd" },
  });
  const facilityIcu = await prisma.facility.create({
    data: { name: "ICU", slug: "icu" },
  });
  const facilityFarmasi = await prisma.facility.create({
    data: { name: "Farmasi", slug: "farmasi" },
  });

  // Specializations (dengan hospitalId sesuai permintaan skema)
  const spesJantung = await prisma.specialization.create({
    data: { name: "Kardiologi", slug: "kardiologi", hospitalId: hospitalA.id },
  });
  const spesSaraf = await prisma.specialization.create({
    data: { name: "Neurologi", slug: "neurologi", hospitalId: hospitalA.id },
  });
  const spesAnak = await prisma.specialization.create({
    data: { name: "Pediatri", slug: "pediatri", hospitalId: hospitalA.id },
  });

  // Pivot: Hospital-Facility
  await prisma.hospitalFacility.createMany({
    data: [
      { hospitalId: hospitalA.id, facilityId: facilityIgd.id },
      { hospitalId: hospitalA.id, facilityId: facilityIcu.id },
      { hospitalId: hospitalA.id, facilityId: facilityFarmasi.id },
    ],
    skipDuplicates: true,
  });

  // Pivot: Hospital-Specialization
  await prisma.hospitalSpecialization.createMany({
    data: [
      { hospitalId: hospitalA.id, specializationId: spesJantung.id },
      { hospitalId: hospitalA.id, specializationId: spesSaraf.id },
      { hospitalId: hospitalA.id, specializationId: spesAnak.id },
    ],
    skipDuplicates: true,
  });

  // Article Categories
  const catNews = await prisma.articleCategory.create({
    data: { name: "Berita", slug: "berita" },
  });
  const catTips = await prisma.articleCategory.create({
    data: { name: "Tips Kesehatan", slug: "tips-kesehatan" },
  });

  // Articles
  await prisma.article.create({
    data: {
      title: "Hidup Sehat Setiap Hari",
      slug: "hidup-sehat-setiap-hari",
      bannerPhoto: null,
      publishedAt: new Date(),
      status: "published",
      content: "<h1>Hidup Sehat</h1><p>Mulai dari pola makan dan olahraga.</p>",
      authorId: author.id,
      categoryId: catTips.id,
    },
  });

  await prisma.article.create({
    data: {
      title: "Peresmian Fasilitas Baru",
      slug: "peresmian-fasilitas-baru",
      bannerPhoto: null,
      publishedAt: null,
      status: "draft",
      content: "Pengumuman fasilitas baru segera dibuka.",
      authorId: author.id,
      categoryId: catNews.id,
    },
  });

  // Appointments (gunakan doctorId dari user role=2)
  await prisma.appointment.create({
    data: {
      patientName: "Budi Santoso",
      appointmentAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      doctorId: doctor.id,
    },
  });

  await prisma.appointment.create({
    data: {
      patientName: "Siti Aminah",
      appointmentAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      doctorId: doctor.id,
    },
  });

  console.log("Seeding selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
