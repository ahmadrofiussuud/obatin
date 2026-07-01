import crypto from "crypto";
import { db } from "./db";

export interface BlockchainRecordData {
  patientId: string;
  doctorId: string;
  facilityId: string;
  symptoms: string;
  diagnosis: string;
  icd10Code: string;
  treatmentPlan?: string | null;
}

export class BlockchainService {
  /**
   * Generates a SHA-256 checksum hash of the medical record's clinical content.
   * This hash acts as the immutable fingerprint on the blockchain.
   */
  public static hashRecord(data: BlockchainRecordData): string {
    const serializedString = JSON.stringify({
      patientId: data.patientId,
      doctorId: data.doctorId,
      facilityId: data.facilityId,
      symptoms: data.symptoms,
      diagnosis: data.diagnosis,
      icd10Code: data.icd10Code,
      treatmentPlan: data.treatmentPlan || "",
    });

    return crypto
      .createHash("sha256")
      .update(serializedString)
      .digest("hex");
  }

  /**
   * Commits the record audit fingerprint to the ledger.
   * Simulates connection to a Hyperledger Fabric peer and returns ledger indices.
   */
  public static async commitToLedger(
    recordId: string,
    action: "CREATE" | "UPDATE" | "REVOKE",
    recordHash: string,
    signerId: string
  ) {
    // 1. Simulating connection to Hyperledger Gateway node
    const blockchainNode = process.env.BLOCKCHAIN_NODE_URL;
    const channel = process.env.BLOCKCHAIN_CHANNEL || "medilink-channel";
    const chaincode = process.env.BLOCKCHAIN_CHAINCODE || "emr-ledger";
    
    // In a real network, this client would sign a proposal using user certificate & private key:
    // const mspId = process.env.BLOCKCHAIN_USER_MSP;
    // const gateway = new Gateway();
    // await gateway.connect(connectionProfile, { identity });
    
    // 2. Generate mock transaction data
    const transactionHash = crypto
      .createHash("sha256")
      .update(recordId + action + recordHash + Date.now().toString())
      .digest("hex");

    const mockBlockNumber = Math.floor(Math.random() * 50000) + 12000;

    // 3. Write metadata to database for audit trail checking
    const auditLog = await db.blockchainLog.create({
      data: {
        medicalRecordId: recordId,
        action,
        recordHash,
        transactionHash,
        blockNumber: mockBlockNumber,
        signerId,
      },
    });

    console.log(`[Blockchain Service] Committed block #${mockBlockNumber} | Tx: ${transactionHash}`);
    
    return {
      success: true,
      log: auditLog,
      gatewayDetails: {
        node: blockchainNode,
        channel,
        chaincode,
      }
    };
  }

  /**
   * Verifies EMR integrity by comparing current hash with blockchain log hash.
   */
  public static async verifyRecordIntegrity(
    recordId: string,
    currentClinicalData: BlockchainRecordData
  ): Promise<{ isValid: boolean; latestBlockchainHash?: string; currentHash: string }> {
    const currentHash = this.hashRecord(currentClinicalData);

    const latestLog = await db.blockchainLog.findFirst({
      where: { medicalRecordId: recordId },
      orderBy: { timestamp: "desc" },
    });

    if (!latestLog) {
      return { isValid: false, currentHash };
    }

    return {
      isValid: latestLog.recordHash === currentHash,
      latestBlockchainHash: latestLog.recordHash,
      currentHash,
    };
  }
}
