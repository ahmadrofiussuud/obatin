import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, nik, password } = body;

    if (!name || !email || !nik || !password) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi." },
        { status: 400 }
      );
    }

    if (nik.length !== 16) {
      return NextResponse.json(
        { message: "NIK harus berjumlah 16 digit." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();

    // 1. Verify if user email already exists
    const existingUser = await db.user.findUnique({
      where: { email: emailLower },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 400 }
      );
    }

    // 2. Verify if NIK already exists
    const existingPatient = await db.patient.findUnique({
      where: { nik },
    });

    if (existingPatient) {
      return NextResponse.json(
        { message: "NIK sudah terdaftar." },
        { status: 400 }
      );
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user and profile in a transaction
    const newUser = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: emailLower,
          password: hashedPassword,
          role: "PATIENT",
        },
      });

      await tx.patient.create({
        data: {
          userId: user.id,
          nik,
          gender: "MALE", // Default placeholder
          dateOfBirth: new Date("2000-01-01"), // Default placeholder
          address: "Belum diisi", // Default placeholder
          phoneNumber: "081234567890", // Default placeholder
          emergencyContactName: "Belum diisi",
          emergencyContactPhone: "081234567890",
          emergencyContactRelation: "Belum diisi",
        },
      });

      return user;
    });

    return NextResponse.json(
      { message: "Registrasi sukses.", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Signup API Error]:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Terjadi kesalahan server.", error: errorMessage },
      { status: 500 }
    );
  }
}
