import { Blockhash, Commitment, Connection, FeeCalculator, Keypair, Transaction, TransactionInstruction } from "@solana/web3.js";
export declare const DEFAULT_TIMEOUT = 30000;
export declare const getUnixTs: () => number;
export declare function sleep(ms: number): Promise<void>;
interface BlockhashAndFeeCalculator {
    blockhash: Blockhash;
    feeCalculator: FeeCalculator;
}
export declare const sendTransactionWithRetryWithKeypair: (connection: Connection, wallet: Keypair, instructions: TransactionInstruction[], signers: Keypair[], commitment?: Commitment, includesFeePayer?: boolean, block?: BlockhashAndFeeCalculator | undefined, beforeSend?: (() => void) | undefined) => Promise<{
    txid: string;
    slot: number;
}>;
export declare function sendSignedTransaction({ signedTransaction, connection, timeout, }: {
    signedTransaction: Transaction;
    connection: Connection;
    sendingMessage?: string;
    sentMessage?: string;
    successMessage?: string;
    timeout?: number;
}): Promise<{
    txid: string;
    slot: number;
}>;
export {};
