import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "sk-proj-mockopenapikeyformediaiprojectfoundation";

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey,
});

export class AIService {
  /**
   * Generates clinical suggestions or differential diagnoses based on patient symptoms.
   * NOTE: Anchored with a system prompt specifying that it is a decision support tool, not a replacement for MDs.
   */
  public static async suggestDifferentialDiagnosis(symptoms: string, clinicalNotes?: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: `Anda adalah asisten diagnosis AI medis klinis untuk platform MediAI Indonesia. 
Tugas Anda adalah menganalisis keluhan (symptoms) pasien dan memberikan saran klinis pendukung keputusan (clinical decision support) untuk dokter.
Format output Anda harus terstruktur:
1. Kemungkinan Differential Diagnosis (serta kode ICD-10 jika relevan).
2. Rekomendasi Tes Penunjang / Tes Lab.
3. Rencana Perawatan Awal (Treatment Plan).
4. Peringatan Keselamatan Kontraindikasi (Red flags).

PENTING: Gunakan bahasa Indonesia profesional medis. Berikan disclaimer bahwa saran ini murni bersifat administratif medis pendukung keputusan.`,
          },
          {
            role: "user",
            content: `Gejala Pasien: ${symptoms}\nCatatan Tambahan Dokter: ${clinicalNotes || "Tidak ada"}`,
          },
        ],
        temperature: 0.2, // Low temperature for factual consistency
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || "Gagal mendapatkan respons AI.";
    } catch (error) {
      console.error("[AI Service Error] Diagnosis Helper:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return `Layanan AI terganggu: ${errorMessage}`;
    }
  }

  /**
   * General chatbot consultation helper for patient portal.
   */
  public static async generatePatientChatResponse(
    history: Array<{ role: "user" | "assistant"; content: string }>
  ): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Anda adalah MediBot - asisten kesehatan virtual AI terpercaya di Indonesia. 
Anda membantu menjawab pertanyaan seputar kesehatan umum secara ramah, empati, dan aman.
Patuhi aturan berikut:
1. JANGAN memberikan resep obat keras (hanya berikan saran obat umum bebas / OTC atau herbal sederhana jika aman).
2. Beritahu pengguna secara tegas untuk segera mengunjungi klinik/rumah sakit jika timbul gejala darurat (sesak napas, nyeri dada parah, pendarahan aktif).
3. Gunakan bahasa Indonesia yang mudah dipahami oleh pasien awam.`,
          },
          ...history.map(msg => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
        ],
        temperature: 0.5,
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content || "MediBot sedang tidak dapat menjawab.";
    } catch (error) {
      console.error("[AI Service Error] Patient Consultation:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return `Layanan MediBot sedang terganggu: ${errorMessage}`;
    }
  }
}
