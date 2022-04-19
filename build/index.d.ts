import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
export declare const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey;
export declare const TOKEN_METADATA_PROGRAM_ID: PublicKey;
export declare const CANDY_MACHINE_PROGRAM_V2_ID: PublicKey;
export interface WhitelistMintMode {
    neverBurn: undefined | boolean;
    burnEveryTime: undefined | boolean;
}
export interface CandyMachine {
    authority: anchor.web3.PublicKey;
    wallet: anchor.web3.PublicKey;
    tokenMint: null | anchor.web3.PublicKey;
    itemsRedeemed: anchor.BN;
    data: CandyMachineData;
}
export interface CandyMachineData {
    itemsAvailable: anchor.BN;
    uuid: null | string;
    symbol: string;
    sellerFeeBasisPoints: number;
    isMutable: boolean;
    maxSupply: anchor.BN;
    price: anchor.BN;
    retainAuthority: boolean;
    gatekeeper: null | {
        expireOnUse: boolean;
        gatekeeperNetwork: anchor.web3.PublicKey;
    };
    goLiveDate: null | anchor.BN;
    endSettings: null | [number, anchor.BN];
    whitelistMintSettings: null | {
        mode: WhitelistMintMode;
        mint: anchor.web3.PublicKey;
        presale: boolean;
        discountPrice: null | anchor.BN;
    };
    hiddenSettings: null | {
        name: string;
        uri: string;
        hash: Uint8Array;
    };
    creators: {
        address: PublicKey;
        verified: boolean;
        share: number;
    }[];
}
declare type Cluster = {
    name: string;
    url: string;
};
export declare const CLUSTERS: Cluster[];
export declare const DEFAULT_CLUSTER: Cluster;
export declare const getCollectionAuthorityRecordPDA: (mint: anchor.web3.PublicKey, newAuthority: anchor.web3.PublicKey) => Promise<[anchor.web3.PublicKey, number]>;
export declare const getAtaForMint: (mint: anchor.web3.PublicKey, buyer: anchor.web3.PublicKey) => Promise<[anchor.web3.PublicKey, number]>;
export declare const getMasterEdition: (mint: anchor.web3.PublicKey) => Promise<anchor.web3.PublicKey>;
export declare const getMetadata: (mint: anchor.web3.PublicKey) => Promise<anchor.web3.PublicKey>;
export declare const getCandyMachineCreator: (candyMachine: anchor.web3.PublicKey) => Promise<[anchor.web3.PublicKey, number]>;
export declare const getTokenWallet: (wallet: PublicKey, mint: PublicKey) => Promise<PublicKey>;
export declare const getCollectionPDA: (candyMachineAddress: anchor.web3.PublicKey) => Promise<[anchor.web3.PublicKey, number]>;
export declare function getCluster(name: string): string;
export declare function loadCandyProgramV2(wallet: Keypair, env: string, customRpcUrl?: string): Promise<anchor.Program>;
export declare function createAssociatedTokenAccountInstruction(associatedTokenAddress: PublicKey, payer: PublicKey, walletAddress: PublicKey, splTokenMintAddress: PublicKey): TransactionInstruction;
export declare function loadWalletKey(keypair: string): Promise<Keypair>;
export declare function mintV2(keypair: string, env: string, candyMachineAddress: PublicKey, rpcUrl: string): Promise<string>;
export {};
