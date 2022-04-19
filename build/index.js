"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintV2 = exports.loadWalletKey = exports.createAssociatedTokenAccountInstruction = exports.loadCandyProgramV2 = exports.getCluster = exports.getCollectionPDA = exports.getTokenWallet = exports.getCandyMachineCreator = exports.getMetadata = exports.getMasterEdition = exports.getAtaForMint = exports.getCollectionAuthorityRecordPDA = exports.DEFAULT_CLUSTER = exports.CLUSTERS = exports.CANDY_MACHINE_PROGRAM_V2_ID = exports.TOKEN_METADATA_PROGRAM_ID = exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
const anchor = __importStar(require("@project-serum/anchor"));
const spl_token_1 = require("@solana/spl-token");
const connection_1 = require("./connection");
const promises_1 = __importDefault(require("fs/promises"));
exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3_js_1.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
exports.TOKEN_METADATA_PROGRAM_ID = new web3_js_1.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
exports.CANDY_MACHINE_PROGRAM_V2_ID = new web3_js_1.PublicKey("cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ");
exports.CLUSTERS = [
    {
        name: "mainnet-beta",
        url: "https://api.metaplex.solana.com/",
    },
    {
        name: "testnet",
        url: (0, web3_js_1.clusterApiUrl)("testnet"),
    },
    {
        name: "devnet",
        url: (0, web3_js_1.clusterApiUrl)("devnet"),
    },
];
exports.DEFAULT_CLUSTER = exports.CLUSTERS[2];
const getCollectionAuthorityRecordPDA = (mint, newAuthority) => __awaiter(void 0, void 0, void 0, function* () {
    return yield anchor.web3.PublicKey.findProgramAddress([
        Buffer.from("metadata"),
        exports.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("collection_authority"),
        newAuthority.toBuffer(),
    ], exports.TOKEN_METADATA_PROGRAM_ID);
});
exports.getCollectionAuthorityRecordPDA = getCollectionAuthorityRecordPDA;
const getAtaForMint = (mint, buyer) => __awaiter(void 0, void 0, void 0, function* () {
    return yield anchor.web3.PublicKey.findProgramAddress([buyer.toBuffer(), spl_token_1.TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID);
});
exports.getAtaForMint = getAtaForMint;
const getMasterEdition = (mint) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield anchor.web3.PublicKey.findProgramAddress([
        Buffer.from("metadata"),
        exports.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
    ], exports.TOKEN_METADATA_PROGRAM_ID))[0];
});
exports.getMasterEdition = getMasterEdition;
const getMetadata = (mint) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield anchor.web3.PublicKey.findProgramAddress([
        Buffer.from("metadata"),
        exports.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
    ], exports.TOKEN_METADATA_PROGRAM_ID))[0];
});
exports.getMetadata = getMetadata;
const getCandyMachineCreator = (candyMachine) => __awaiter(void 0, void 0, void 0, function* () {
    return yield anchor.web3.PublicKey.findProgramAddress([Buffer.from("candy_machine"), candyMachine.toBuffer()], exports.CANDY_MACHINE_PROGRAM_V2_ID);
});
exports.getCandyMachineCreator = getCandyMachineCreator;
const getTokenWallet = function (wallet, mint) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield web3_js_1.PublicKey.findProgramAddress([wallet.toBuffer(), spl_token_1.TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID))[0];
    });
};
exports.getTokenWallet = getTokenWallet;
const getCollectionPDA = (candyMachineAddress) => __awaiter(void 0, void 0, void 0, function* () {
    return yield anchor.web3.PublicKey.findProgramAddress([Buffer.from("collection"), candyMachineAddress.toBuffer()], exports.CANDY_MACHINE_PROGRAM_V2_ID);
});
exports.getCollectionPDA = getCollectionPDA;
function getCluster(name) {
    for (const cluster of exports.CLUSTERS) {
        if (cluster.name === name) {
            return cluster.url;
        }
    }
    return exports.DEFAULT_CLUSTER.url;
}
exports.getCluster = getCluster;
function loadCandyProgramV2(wallet, env, customRpcUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (customRpcUrl)
            console.log("USING CUSTOM URL", customRpcUrl);
        const walletWrapper = new anchor.Wallet(wallet);
        const solConnection = new anchor.web3.Connection(customRpcUrl || getCluster(env));
        const provider = new anchor.Provider(solConnection, walletWrapper, {
            preflightCommitment: "recent",
        });
        const idl = yield anchor.Program.fetchIdl(exports.CANDY_MACHINE_PROGRAM_V2_ID, provider);
        if (!idl) {
            throw new Error("Could not load IDL");
        }
        const program = new anchor.Program(idl, exports.CANDY_MACHINE_PROGRAM_V2_ID, provider);
        return program;
    });
}
exports.loadCandyProgramV2 = loadCandyProgramV2;
function createAssociatedTokenAccountInstruction(associatedTokenAddress, payer, walletAddress, splTokenMintAddress) {
    const keys = [
        {
            pubkey: payer,
            isSigner: true,
            isWritable: true,
        },
        {
            pubkey: associatedTokenAddress,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: walletAddress,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: splTokenMintAddress,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: spl_token_1.TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys,
        programId: exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        data: Buffer.from([]),
    });
}
exports.createAssociatedTokenAccountInstruction = createAssociatedTokenAccountInstruction;
function loadWalletKey(keypair) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!keypair || keypair == "") {
            throw new Error("Keypair is required!");
        }
        const loaded = web3_js_1.Keypair.fromSecretKey(new Uint8Array(JSON.parse(yield promises_1.default.readFile(keypair, "utf-8"))));
        return loaded;
    });
}
exports.loadWalletKey = loadWalletKey;
function mintV2(keypair, env, candyMachineAddress, rpcUrl) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const mint = web3_js_1.Keypair.generate();
        const userKeyPair = yield loadWalletKey(keypair);
        const anchorProgram = yield loadCandyProgramV2(userKeyPair, env, rpcUrl);
        const userTokenAccountAddress = yield (0, exports.getTokenWallet)(userKeyPair.publicKey, mint.publicKey);
        const candyMachine = yield anchorProgram.account.candyMachine.fetch(candyMachineAddress);
        const remainingAccounts = [];
        const signers = [mint, userKeyPair];
        const cleanupInstructions = [];
        const instructions = [
            anchor.web3.SystemProgram.createAccount({
                fromPubkey: userKeyPair.publicKey,
                newAccountPubkey: mint.publicKey,
                space: spl_token_1.MintLayout.span,
                lamports: yield anchorProgram.provider.connection.getMinimumBalanceForRentExemption(spl_token_1.MintLayout.span),
                programId: spl_token_1.TOKEN_PROGRAM_ID,
            }),
            spl_token_1.Token.createInitMintInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint.publicKey, 0, userKeyPair.publicKey, userKeyPair.publicKey),
            createAssociatedTokenAccountInstruction(userTokenAccountAddress, userKeyPair.publicKey, userKeyPair.publicKey, mint.publicKey),
            spl_token_1.Token.createMintToInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint.publicKey, userTokenAccountAddress, userKeyPair.publicKey, [], 1),
        ];
        if (candyMachine.data.whitelistMintSettings) {
            const mint = new anchor.web3.PublicKey(candyMachine.data.whitelistMintSettings.mint);
            const whitelistToken = (yield (0, exports.getAtaForMint)(mint, userKeyPair.publicKey))[0];
            remainingAccounts.push({
                pubkey: whitelistToken,
                isWritable: true,
                isSigner: false,
            });
            if (candyMachine.data.whitelistMintSettings.mode.burnEveryTime) {
                const whitelistBurnAuthority = anchor.web3.Keypair.generate();
                remainingAccounts.push({
                    pubkey: mint,
                    isWritable: true,
                    isSigner: false,
                });
                remainingAccounts.push({
                    pubkey: whitelistBurnAuthority.publicKey,
                    isWritable: false,
                    isSigner: true,
                });
                signers.push(whitelistBurnAuthority);
                const exists = yield anchorProgram.provider.connection.getAccountInfo(whitelistToken);
                if (exists) {
                    instructions.push(spl_token_1.Token.createApproveInstruction(spl_token_1.TOKEN_PROGRAM_ID, whitelistToken, whitelistBurnAuthority.publicKey, userKeyPair.publicKey, [], 1));
                    cleanupInstructions.push(spl_token_1.Token.createRevokeInstruction(spl_token_1.TOKEN_PROGRAM_ID, whitelistToken, userKeyPair.publicKey, []));
                }
            }
        }
        let tokenAccount;
        if (candyMachine.tokenMint) {
            const transferAuthority = anchor.web3.Keypair.generate();
            tokenAccount = yield (0, exports.getTokenWallet)(userKeyPair.publicKey, candyMachine.tokenMint);
            remainingAccounts.push({
                pubkey: tokenAccount,
                isWritable: true,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: transferAuthority.publicKey,
                isWritable: false,
                isSigner: true,
            });
            instructions.push(spl_token_1.Token.createApproveInstruction(spl_token_1.TOKEN_PROGRAM_ID, tokenAccount, transferAuthority.publicKey, userKeyPair.publicKey, [], candyMachine.data.price.toNumber()));
            signers.push(transferAuthority);
            cleanupInstructions.push(spl_token_1.Token.createRevokeInstruction(spl_token_1.TOKEN_PROGRAM_ID, tokenAccount, userKeyPair.publicKey, []));
        }
        const metadataAddress = yield (0, exports.getMetadata)(mint.publicKey);
        const masterEdition = yield (0, exports.getMasterEdition)(mint.publicKey);
        const [candyMachineCreator, creatorBump] = yield (0, exports.getCandyMachineCreator)(candyMachineAddress);
        instructions.push(yield anchorProgram.instruction.mintNft(creatorBump, {
            accounts: {
                candyMachine: candyMachineAddress,
                candyMachineCreator,
                payer: userKeyPair.publicKey,
                //@ts-ignore
                wallet: candyMachine.wallet,
                mint: mint.publicKey,
                metadata: metadataAddress,
                masterEdition,
                mintAuthority: userKeyPair.publicKey,
                updateAuthority: userKeyPair.publicKey,
                tokenMetadataProgram: exports.TOKEN_METADATA_PROGRAM_ID,
                tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                systemProgram: web3_js_1.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                recentBlockhashes: anchor.web3.SYSVAR_SLOT_HASHES_PUBKEY,
                instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            },
            remainingAccounts: remainingAccounts.length > 0 ? remainingAccounts : undefined,
        }));
        const collectionPDA = (yield (0, exports.getCollectionPDA)(candyMachineAddress))[0];
        const collectionPDAAccount = yield anchorProgram.provider.connection.getAccountInfo(collectionPDA);
        if (collectionPDAAccount && candyMachine.data.retainAuthority) {
            try {
                const collectionPdaData = (yield anchorProgram.account.collectionPda.fetch(collectionPDA));
                const collectionMint = collectionPdaData.mint;
                const collectionAuthorityRecord = (yield (0, exports.getCollectionAuthorityRecordPDA)(collectionMint, collectionPDA))[0];
                if (collectionMint) {
                    const collectionMetadata = yield (0, exports.getMetadata)(collectionMint);
                    const collectionMasterEdition = yield (0, exports.getMasterEdition)(collectionMint);
                    instructions.push(yield anchorProgram.instruction.setCollectionDuringMint({
                        accounts: {
                            candyMachine: candyMachineAddress,
                            metadata: metadataAddress,
                            payer: userKeyPair.publicKey,
                            collectionPda: collectionPDA,
                            tokenMetadataProgram: exports.TOKEN_METADATA_PROGRAM_ID,
                            instructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
                            collectionMint: collectionMint,
                            collectionMetadata,
                            collectionMasterEdition,
                            authority: candyMachine.authority,
                            collectionAuthorityRecord,
                        },
                    }));
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        const data = candyMachine.data;
        const txnEstimate = 892 +
            (collectionPDAAccount && data.retainAuthority ? 182 : 0) +
            (candyMachine.tokenMint ? 177 : 0) +
            (data.whitelistMintSettings ? 33 : 0) +
            (((_b = (_a = data.whitelistMintSettings) === null || _a === void 0 ? void 0 : _a.mode) === null || _b === void 0 ? void 0 : _b.burnEveryTime) ? 145 : 0) +
            (data.gatekeeper ? 33 : 0) +
            (((_c = data.gatekeeper) === null || _c === void 0 ? void 0 : _c.expireOnUse) ? 66 : 0);
        const INIT_INSTRUCTIONS_LENGTH = 4;
        const INIT_SIGNERS_LENGTH = 1;
        let initInstructions = [];
        let initSigners = [];
        if (txnEstimate > 1230) {
            initInstructions = instructions.splice(0, INIT_INSTRUCTIONS_LENGTH);
            initSigners = signers.splice(0, INIT_SIGNERS_LENGTH);
        }
        if (initInstructions.length > 0) {
            yield (0, connection_1.sendTransactionWithRetryWithKeypair)(anchorProgram.provider.connection, userKeyPair, initInstructions, initSigners);
        }
        const mainInstructions = (yield (0, connection_1.sendTransactionWithRetryWithKeypair)(anchorProgram.provider.connection, userKeyPair, instructions, signers)).txid;
        if (cleanupInstructions.length > 0) {
            yield (0, connection_1.sendTransactionWithRetryWithKeypair)(anchorProgram.provider.connection, userKeyPair, cleanupInstructions, []);
        }
        return mainInstructions;
    });
}
exports.mintV2 = mintV2;
