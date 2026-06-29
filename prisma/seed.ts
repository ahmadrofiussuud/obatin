import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Clean existing database records (optional for fresh seeds)
  // To avoid circular dependency errors, clean in correct order:
  await prisma.blockchainLog.deleteMany({});
  await prisma.prescription.deleteMany({});
  await prisma.labResult.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.medicalRecord.deleteMany({});
  await prisma.doctorProfile.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.aIConsultation.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.facility.deleteMany({});

  // 2. Create Mock Facilities
  const facility1 = await prisma.facility.create({
    data: {
      name: "RS Pondok Indah",
      type: "HOSPITAL",
      code: "10000004", // SATUSEHAT Mock Org Code
      address: "Jl. Metro Pondok Indah, Kebayoran Lama",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      phoneNumber: "021-7690160",
    },
  });

  const facility2 = await prisma.facility.create({
    data: {
      name: "Klinik Medika Utama",
      type: "CLINIC",
      code: "20000008",
      address: "Jl. Margonda Raya No. 45",
      city: "Depok",
      province: "Jawa Barat",
      phoneNumber: "021-7788990",
    },
  });

  console.log("Seeded Facilities.");

  // 3. Create Users
  const passwordHash = await bcrypt.hash("password123", 10);

  // A. Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: "Dr. Pratama Hardi (Admin)",
      email: "admin@obatin.id",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  // B. Doctor User
  const doctorUser = await prisma.user.create({
    data: {
      name: "Dr. Andi Wijaya",
      email: "doctor@obatin.id",
      password: passwordHash,
      role: "DOCTOR",
    },
  });

  // Associate Doctor Profile
  const doctorProfile = await prisma.doctorProfile.create({
    data: {
      userId: doctorUser.id,
      facilityId: facility1.id,
      sipNumber: "SIP.123/KANKES/2024",
      specialty: "Spesialis Penyakit Dalam",
    },
  });

  // C. Patient User
  const patientUser = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "patient@obatin.id",
      password: passwordHash,
      role: "PATIENT",
    },
  });

  // Associate Patient Profile
  const patientProfile = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      nik: "3171012345670001",
      bpjsNumber: "0001234567890",
      gender: "MALE",
      dateOfBirth: new Date("1988-08-17"),
      placeOfBirth: "Jakarta",
      address: "Jl. Kemang Raya No. 12, Kebayoran Baru, Jakarta Selatan",
      phoneNumber: "081234567890",
      bloodType: "O",
      allergies: "Antibiotik Penicillin",
      emergencyContactName: "Siti Rahma (Istri)",
      emergencyContactPhone: "081298765432",
      emergencyContactRelation: "SPOUSE",
    },
  });

  console.log("Seeded Users & Associated Profiles.");

  // 4. Create a mock EMR / MedicalRecord
  const record = await prisma.medicalRecord.create({
    data: {
      patientId: patientProfile.id,
      doctorId: doctorProfile.id,
      facilityId: facility1.id,
      symptoms: "Pasien mengeluhkan pusing hebat di bagian belakang kepala selama 3 hari terakhir, disertai leher kaku.",
      diagnosis: "Hipertensi Essensial (Primary Hypertension)",
      icd10Code: "I10",
      treatmentPlan: "Amlodipine 5mg sekali sehari pagi hari. Diet rendah garam dan batasi konsumsi kopi. Kontrol 1 minggu lagi.",
      notes: "Tekanan darah saat pemeriksaan: 145/95 mmHg. Nadi: 82x/menit.",
      status: "FINALIZED",
    },
  });

  // 5. Create a blockchain integrity log for EMR
  // Clinical data digest hash mock
  const recordHash = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        patientId: patientProfile.id,
        doctorId: doctorProfile.id,
        facilityId: facility1.id,
        symptoms: record.symptoms,
        diagnosis: record.diagnosis,
        icd10Code: record.icd10Code,
        treatmentPlan: record.treatmentPlan,
      })
    )
    .digest("hex");

  const txHash = crypto
    .createHash("sha256")
    .update(record.id + "CREATE" + recordHash + Date.now().toString())
    .digest("hex");

  await prisma.blockchainLog.create({
    data: {
      medicalRecordId: record.id,
      action: "CREATE",
      recordHash,
      transactionHash: txHash,
      blockNumber: 15902,
      signerId: doctorUser.id,
    },
  });

  console.log("Seeded Mock Medical Record and Blockchain Audit Log.");
  console.log("Seeding completed successfully.");
}

// We need crypto import inside seed.ts
import crypto from "crypto";

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
