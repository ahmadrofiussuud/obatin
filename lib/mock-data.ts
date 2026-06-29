export interface MockVisit {
  date: string;
  facility: string;
  doctor: string;
  chiefComplaint: string;
  diagnosis: string;
  outcome: string;
}

export interface SOAPNote {
  id: string;
  date: string;
  doctor: string;
  facility: string;
  subjective: string;
  objective: string;
  assessment: string;
  icd10: string;
  plan: string;
}

export interface MockLabResult {
  id: string;
  date: string;
  testName: string;
  resultValue: string;
  referenceRange: string;
  isAbnormal: boolean;
  status: "Normal" | "Abnormal";
}

export interface MockPrescriptionItem {
  name: string;
  dosage: string;
  frequency: string;
}

export interface MockPrescription {
  id: string;
  date: string;
  doctor: string;
  medications: MockPrescriptionItem[];
  status: "Active" | "Past";
  pharmacyStatus: "Selesai" | "Diproses" | "Batal";
}

export interface MockBlockchainAudit {
  id: string;
  timestamp: string;
  action: string;
  signerName: string;
  signerRole: string;
  recordHash: string;
  transactionHash: string;
  blockNumber: number;
}

export interface MockPatient {
  id: string;
  name: string;
  nik: string;
  bpjsNumber: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  placeOfBirth: string;
  age: number;
  address: string;
  phoneNumber: string;
  bloodType: string;
  weight: number; // kg
  height: number; // cm
  bmi: number;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  conditions: string[];
  allergies: string[];
  medications: string[];
  lastVisit: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "CRITICAL" | "STABLE";
  attendingDoctor: string;
  visits: MockVisit[];
  soapNotes: SOAPNote[];
  labResults: MockLabResult[];
  prescriptions: MockPrescription[];
  blockchainLogs: MockBlockchainAudit[];
}

export const MOCK_PATIENTS: MockPatient[] = [
  {
    id: "P-001",
    name: "Budi Santoso",
    nik: "3171012345670001",
    bpjsNumber: "0001234567890",
    gender: "MALE",
    dateOfBirth: "1988-08-17",
    placeOfBirth: "Jakarta",
    age: 37,
    address: "Jl. Kemang Raya No. 12, Kebayoran Baru, Jakarta Selatan",
    phoneNumber: "081234567890",
    bloodType: "O",
    weight: 78,
    height: 172,
    bmi: 26.4,
    emergencyContact: {
      name: "Siti Rahma",
      phone: "081298765432",
      relation: "Istri (Spouse)",
    },
    conditions: ["Hipertensi Primer", "Hiperkolesterolemia"],
    allergies: ["Penicillin", "Sulfa drugs"],
    medications: ["Amlodipine 5mg", "Simvastatin 20mg"],
    lastVisit: "28 Juni 2026",
    status: "CRITICAL",
    attendingDoctor: "Dr. Andi Wijaya",
    visits: [
      {
        date: "28 Juni 2026",
        facility: "RS Pondok Indah",
        doctor: "Dr. Andi Wijaya",
        chiefComplaint: "Pusing hebat di bagian belakang kepala dan leher kaku",
        diagnosis: "Hipertensi Essensial Akut (ICD-10: I10)",
        outcome: "Rawat jalan dengan terapi amlodipine dipertinggi",
      },
      {
        date: "14 Mei 2026",
        facility: "RS Pondok Indah",
        doctor: "Dr. Andi Wijaya",
        chiefComplaint: "Pemeriksaan lab profil lipid rutin",
        diagnosis: "Hiperkolesterolemia Ringan (ICD-10: E78.2)",
        outcome: "Dilanjutkan dosis simvastatin malam hari",
      },
    ],
    soapNotes: [
      {
        id: "soap-1",
        date: "28 Juni 2026",
        doctor: "Dr. Andi Wijaya",
        facility: "RS Pondok Indah",
        subjective: "Pasien mengeluh pusing berat berdenyut di bagian tengkuk belakang kepala sejak 3 hari lalu. Leher terasa sangat kaku. Pasien mengaku sibuk bekerja dan lupa minum obat amlodipine selama 5 hari terakhir.",
        objective: "Kesadaran Compos Mentis. Tekanan Darah: 165/100 mmHg. Nadi: 88x/menit. Suhu: 36.6 °C. Kolesterol Total: 220 mg/dL. Kaku kuduk negatif secara neurologis umum.",
        assessment: "Hipertensi Essensial Eksaserbasi Akut akibat non-adherence terapi obat (ICD-10: I10).",
        icd10: "I10",
        plan: "Edukasi kepatuhan obat. Tingkatkan dosis Amlodipine menjadi 10mg 1x1 pagi hari. Jadwalkan kontrol ulang tekanan darah dalam 5 hari.",
      },
    ],
    labResults: [
      { id: "lab-1", date: "28 Juni 2026", testName: "Kolesterol Total", resultValue: "220 mg/dL", referenceRange: "< 200 mg/dL", isAbnormal: true, status: "Abnormal" },
      { id: "lab-2", date: "28 Juni 2026", testName: "Trigliserida", resultValue: "145 mg/dL", referenceRange: "< 150 mg/dL", isAbnormal: false, status: "Normal" },
      { id: "lab-3", date: "14 Mei 2026", testName: "Hemoglobin (Hb)", resultValue: "14.2 g/dL", referenceRange: "13.5 - 17.5 g/dL", isAbnormal: false, status: "Normal" },
    ],
    prescriptions: [
      {
        id: "rx-1",
        date: "28 Juni 2026",
        doctor: "Dr. Andi Wijaya",
        status: "Active",
        pharmacyStatus: "Selesai",
        medications: [
          { name: "Amlodipine", dosage: "10mg", frequency: "1x1 Pagi" },
          { name: "Simvastatin", dosage: "20mg", frequency: "1x1 Malam" },
        ],
      },
    ],
    blockchainLogs: [
      {
        id: "bc-1",
        timestamp: "2026-06-28T09:22:15Z",
        action: "CREATE_RECORD",
        signerName: "Dr. Andi Wijaya",
        signerRole: "DOCTOR",
        recordHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        transactionHash: "7f3c4dbde0ef14dbf77c8e9b6a12f91a50c822ffb7617c0c1b48b99148d42d38",
        blockNumber: 15902,
      },
      {
        id: "bc-2",
        timestamp: "2026-06-28T09:15:30Z",
        action: "READ_RECORD",
        signerName: "Nurse Linda",
        signerRole: "NURSE",
        recordHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        transactionHash: "6f5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5",
        blockNumber: 15901,
      },
    ],
  },
  {
    id: "P-002",
    name: "Siti Rahmawati",
    nik: "3273019876540003",
    bpjsNumber: "0001987654321",
    gender: "FEMALE",
    dateOfBirth: "1992-04-12",
    placeOfBirth: "Bandung",
    age: 34,
    address: "Jl. Dago Asri No. 4, Coblong, Bandung",
    phoneNumber: "081298765412",
    bloodType: "A",
    weight: 56,
    height: 160,
    bmi: 21.9,
    emergencyContact: {
      name: "Hendra Wijaya",
      phone: "081298765499",
      relation: "Suami (Spouse)",
    },
    conditions: ["Bronkitis Akut"],
    allergies: ["Aspirin"],
    medications: ["Cefadroxil 500mg", "Salbutamol 2mg"],
    lastVisit: "28 Juni 2026",
    status: "PENDING",
    attendingDoctor: "Dr. Sarah Siregar",
    visits: [
      {
        date: "28 Juni 2026",
        facility: "Klinik Medika Utama",
        doctor: "Dr. Sarah Siregar",
        chiefComplaint: "Batuk berdahak kuning kental lebih dari 2 minggu disertai demam",
        diagnosis: "Bronkitis Akut Suspek Infeksi Bakteri (ICD-10: J20.9)",
        outcome: "Rawat jalan dengan terapi antibiotik oral",
      },
    ],
    soapNotes: [
      {
        id: "soap-2",
        date: "28 Juni 2026",
        doctor: "Dr. Sarah Siregar",
        facility: "Klinik Medika Utama",
        subjective: "Pasien datang mengeluh batuk berdahak kuning pekat sejak 10 hari terakhir, dada terasa sedikit sesak saat batuk keras. Demam naik turun terutama malam hari.",
        objective: "Kesadaran Compos Mentis. Suhu: 37.9 °C. Tekanan Darah: 115/75 mmHg. Nadi: 80x/menit. Ronchi basah halus pada paru kanan basolateral.",
        assessment: "Bronkitis Akut (ICD-10: J20.9).",
        icd10: "J20.9",
        plan: "Cefadroxil 500mg 2x1 tablet (habiskan). Salbutamol 2mg 3x1 tablet jika sesak/batuk mengganggu. Edukasi istirahat cukup, hindari makanan berminyak.",
      },
    ],
    labResults: [
      { id: "lab-4", date: "28 Juni 2026", testName: "Leukosit (WBC)", resultValue: "11,500 /uL", referenceRange: "4,000 - 10,000 /uL", isAbnormal: true, status: "Abnormal" },
    ],
    prescriptions: [
      {
        id: "rx-2",
        date: "28 Juni 2026",
        doctor: "Dr. Sarah Siregar",
        status: "Active",
        pharmacyStatus: "Diproses",
        medications: [
          { name: "Cefadroxil", dosage: "500mg", frequency: "2x1 Hari" },
          { name: "Salbutamol", dosage: "2mg", frequency: "3x1 Hari" },
        ],
      },
    ],
    blockchainLogs: [
      {
        id: "bc-3",
        timestamp: "2026-06-28T09:42:00Z",
        action: "CREATE_RECORD",
        signerName: "Dr. Sarah Siregar",
        signerRole: "DOCTOR",
        recordHash: "f6e5d4c3b2a1f0e9d8c7b6a57f3c4dbde0ef14dbf77c8e9b6a12f91a50c822ff",
        transactionHash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        blockNumber: 15903,
      },
    ],
  },
  {
    id: "P-003",
    name: "Aditya Pratama",
    nik: "3174020912830005",
    bpjsNumber: "0002135467890",
    gender: "MALE",
    dateOfBirth: "1983-09-02",
    placeOfBirth: "Semarang",
    age: 42,
    address: "Jl. Radio Dalam No. 100, Kebayoran Baru, Jakarta Selatan",
    phoneNumber: "081122334455",
    bloodType: "B",
    weight: 85,
    height: 175,
    bmi: 27.8,
    emergencyContact: {
      name: "Rudi Pratama",
      phone: "081122334466",
      relation: "Adik (Sibling)",
    },
    conditions: ["Dispepsia Fungsional", "Obesitas Tipe 1"],
    allergies: [],
    medications: ["Omeprazole 20mg", "Domperidone 10mg"],
    lastVisit: "27 Juni 2026",
    status: "ACTIVE",
    attendingDoctor: "Dr. Andi Wijaya",
    visits: [
      {
        date: "27 Juni 2026",
        facility: "RS Pondok Indah",
        doctor: "Dr. Andi Wijaya",
        chiefComplaint: "Nyeri ulu hati kronis, kembung, dan mual sesudah makan",
        diagnosis: "Dispepsia Fungsional (ICD-10: K30)",
        outcome: "Terapi antasida dan proton-pump inhibitor (PPI)",
      },
    ],
    soapNotes: [
      {
        id: "soap-3",
        date: "27 Juni 2026",
        doctor: "Dr. Andi Wijaya",
        facility: "RS Pondok Indah",
        subjective: "Pasien mengeluh nyeri tumpul di daerah epigastrium sejak 2 minggu, diperberat sesudah mengonsumsi makanan berlemak atau pedas. Disertai mual pagi hari dan sering bersendawa.",
        objective: "Nyeri tekan ringan pada epigastrium. Nadi: 76x/menit. Tekanan Darah: 125/80 mmHg. Suhu: 36.4 °C.",
        assessment: "Dispepsia Fungsional (ICD-10: K30).",
        icd10: "K30",
        plan: "Omeprazole 20mg 1x1 kapsul (30 menit sebelum sarapan). Domperidone 10mg 3x1 tablet jika mual (15 menit sebelum makan). Edukasi diet porsi kecil tapi sering, hindari kafein dan makanan asam.",
      },
    ],
    labResults: [],
    prescriptions: [
      {
        id: "rx-3",
        date: "27 Juni 2026",
        doctor: "Dr. Andi Wijaya",
        status: "Active",
        pharmacyStatus: "Selesai",
        medications: [
          { name: "Omeprazole", dosage: "20mg", frequency: "1x1 Hari" },
          { name: "Domperidone", dosage: "10mg", frequency: "3x1 Hari" },
        ],
      },
    ],
    blockchainLogs: [
      {
        id: "bc-4",
        timestamp: "2026-06-27T11:20:00Z",
        action: "CREATE_RECORD",
        signerName: "Dr. Andi Wijaya",
        signerRole: "DOCTOR",
        recordHash: "dbe8ffbfd3b93bbff5e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934",
        transactionHash: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        blockNumber: 15898,
      },
    ],
  },
  {
    id: "P-004",
    name: "Dewi Lestari",
    nik: "3578031405920002",
    bpjsNumber: "0002983748293",
    gender: "FEMALE",
    dateOfBirth: "1992-05-14",
    placeOfBirth: "Surabaya",
    age: 34,
    address: "Jl. Manyar Sabrangan No. 89, Mulyorejo, Surabaya",
    phoneNumber: "083812345678",
    bloodType: "AB",
    weight: 62,
    height: 165,
    bmi: 22.8,
    emergencyContact: {
      name: "Rini Astuti",
      phone: "083812345600",
      relation: "Ibu (Mother)",
    },
    conditions: ["Diabetes Melitus Tipe 2"],
    allergies: ["Aspirin"],
    medications: ["Metformin 500mg"],
    lastVisit: "20 Juni 2026",
    status: "STABLE",
    attendingDoctor: "Dr. Sarah Siregar",
    visits: [
      {
        date: "20 Juni 2026",
        facility: "Klinik Medika Utama",
        doctor: "Dr. Sarah Siregar",
        chiefComplaint: "Pemeriksaan gula darah rutin postprandial",
        diagnosis: "Diabetes Melitus Tipe 2 Terkontrol (ICD-10: E11.9)",
        outcome: "Terapi obat dilanjutkan, edukasi nutrisi rendah glukosa",
      },
    ],
    soapNotes: [
      {
        id: "soap-4",
        date: "20 Juni 2026",
        doctor: "Dr. Sarah Siregar",
        facility: "Klinik Medika Utama",
        subjective: "Pasien datang untuk kontrol rutin gula darah bulanan. Tidak ada keluhan sering haus (polidipsi), lapar berlebih (polifagi), atau sering kencing malam hari (poliuria). Kepatuhan obat baik.",
        objective: "GDS (Gula Darah Sewaktu): 118 mg/dL. TD: 120/80 mmHg. Nadi: 72x/menit. BB stabil.",
        assessment: "Diabetes Melitus Tipe 2 Terkontrol Baik (ICD-10: E11.9).",
        icd10: "E11.9",
        plan: "Lanjutkan Metformin 500mg 2x1 tablet sesudah makan. Cek HbA1c bulan depan. Tetap jaga aktivitas fisik sedang minimal 30 menit sehari.",
      },
    ],
    labResults: [
      { id: "lab-5", date: "20 Juni 2026", testName: "Gula Darah Sewaktu (GDS)", resultValue: "118 mg/dL", referenceRange: "< 140 mg/dL", isAbnormal: false, status: "Normal" },
    ],
    prescriptions: [
      {
        id: "rx-4",
        date: "20 Juni 2026",
        doctor: "Dr. Sarah Siregar",
        status: "Past",
        pharmacyStatus: "Selesai",
        medications: [
          { name: "Metformin", dosage: "500mg", frequency: "2x1 Hari" },
        ],
      },
    ],
    blockchainLogs: [
      {
        id: "bc-5",
        timestamp: "2026-06-20T10:15:00Z",
        action: "CREATE_RECORD",
        signerName: "Dr. Sarah Siregar",
        signerRole: "DOCTOR",
        recordHash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        transactionHash: "8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
        blockNumber: 15872,
      },
    ],
  },
];

export interface MockActivity {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  txHash: string;
}

export const MOCK_ACTIVITIES: MockActivity[] = [
  {
    id: "act-1",
    timestamp: "10 menit yang lalu",
    actor: "Dr. Andi Wijaya",
    role: "DOKTER",
    action: "Membuat Rekam Medis baru",
    details: "EMR #90421 - Budi Santoso (Hipertensi)",
    txHash: "7f3c4dbde0ef14dbf77c8e9b6a12f91a...",
  },
  {
    id: "act-2",
    timestamp: "15 menit yang lalu",
    actor: "Dr. Andi Wijaya",
    role: "DOKTER",
    action: "Menandatangani Resep Digital",
    details: "Resep #RX-9942 - Amlodipine 10mg",
    txHash: "a4c5e6f7b8c9d0e1f2a3b4c5d6e7f8a9...",
  },
  {
    id: "act-3",
    timestamp: "45 menit yang lalu",
    actor: "Lab RS Pondok Indah",
    role: "LAB_TECH",
    action: "Mengunggah Hasil Tes Lab",
    details: "Profil Lipid - Budi Santoso",
    txHash: "b8c9d0e1f2a3b4c5d6e7f8a9a4c5e6f7...",
  },
  {
    id: "act-4",
    timestamp: "1 jam yang lalu",
    actor: "Nurse Linda",
    role: "PERAWAT",
    action: "Membaca Berkas Rekam Medis",
    details: "EMR #90421 - Budi Santoso (Triase Kunjungan)",
    txHash: "6f5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d...",
  },
  {
    id: "act-5",
    timestamp: "3 jam yang lalu",
    actor: "Dr. Sarah Siregar",
    role: "DOKTER",
    action: "Membuat Rekam Medis baru",
    details: "EMR #90422 - Siti Rahmawati (Bronkitis)",
    txHash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d...",
  },
];

export const MOCK_VISIT_HISTORY = [
  { date: "01/06", count: 12 },
  { date: "05/06", count: 15 },
  { date: "10/06", count: 18 },
  { date: "15/06", count: 14 },
  { date: "20/06", count: 22 },
  { date: "25/06", count: 20 },
  { date: "28/06", count: 28 },
];

export const MOCK_STATUS_BREAKDOWN = [
  { name: "Active", value: 45, color: "hsl(var(--primary))" },
  { name: "Discharged", value: 30, color: "hsl(var(--secondary))" },
  { name: "Critical", value: 15, color: "hsl(var(--destructive))" },
  { name: "Scheduled", value: 10, color: "hsl(var(--warning))" },
];

export const MOCK_DOCTOR_WORKLOAD = [
  { name: "Dr. Andi Wijaya", load: 24, specialty: "Penyakit Dalam" },
  { name: "Dr. Sarah Siregar", load: 18, specialty: "Umum" },
  { name: "Dr. Pratama Hardi", load: 14, specialty: "Kardiologi" },
];
