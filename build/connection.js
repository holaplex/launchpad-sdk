"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSignedTransaction = exports.sendTransactionWithRetryWithKeypair = exports.sleep = exports.getUnixTs = exports.DEFAULT_TIMEOUT = void 0;
const web3_js_1 = require("@solana/web3.js");
exports.DEFAULT_TIMEOUT = 30000;
const getUnixTs = () => {
    return new Date().getTime() / 1000;
};
exports.getUnixTs = getUnixTs;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
const sendTransactionWithRetryWithKeypair = (connection, wallet, instructions, signers, commitment = "singleGossip", includesFeePayer = false, block, beforeSend) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = new web3_js_1.Transaction();
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash = (block || (yield connection.getRecentBlockhash(commitment))).blockhash;
    if (includesFeePayer) {
        transaction.setSigners(...signers.map((s) => s.publicKey));
    }
    else {
        transaction.setSigners(
        // fee payed by the wallet owner
        wallet.publicKey, ...signers.map((s) => s.publicKey));
    }
    if (signers.length > 0) {
        transaction.sign(...[wallet, ...signers]);
    }
    else {
        transaction.sign(wallet);
    }
    if (beforeSend) {
        beforeSend();
    }
    const { txid, slot } = yield sendSignedTransaction({
        connection,
        signedTransaction: transaction,
    });
    return { txid, slot };
});
exports.sendTransactionWithRetryWithKeypair = sendTransactionWithRetryWithKeypair;
function sendSignedTransaction({ signedTransaction, connection, timeout = exports.DEFAULT_TIMEOUT, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const rawTransaction = signedTransaction.serialize();
        const startTime = (0, exports.getUnixTs)();
        let slot = 0;
        const txid = yield connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
        });
        let done = false;
        (() => __awaiter(this, void 0, void 0, function* () {
            while (!done && (0, exports.getUnixTs)() - startTime < timeout) {
                connection.sendRawTransaction(rawTransaction, {
                    skipPreflight: true,
                });
                yield sleep(500);
            }
        }))();
        try {
            const confirmation = yield awaitTransactionSignatureConfirmation(txid, timeout, connection, "confirmed", true);
            if (!confirmation)
                throw new Error("Timed out awaiting confirmation on transaction");
            if (confirmation.err) {
                throw new Error("Transaction failed: Custom instruction error");
            }
            slot = (confirmation === null || confirmation === void 0 ? void 0 : confirmation.slot) || 0;
        }
        catch (err) {
            if (err.timeout) {
                throw new Error("Timed out awaiting confirmation on transaction");
            }
            let simulateResult = null;
            try {
                simulateResult = (yield simulateTransaction(connection, signedTransaction, "single")).value;
            }
            catch (e) {
            }
            if (simulateResult && simulateResult.err) {
                if (simulateResult.logs) {
                    for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
                        const line = simulateResult.logs[i];
                        if (line.startsWith("Program log: ")) {
                            throw new Error("Transaction failed: " + line.slice("Program log: ".length));
                        }
                    }
                }
                throw new Error(JSON.stringify(simulateResult.err));
            }
            // throw new Error('Transaction failed');
        }
        finally {
            done = true;
        }
        return { txid, slot };
    });
}
exports.sendSignedTransaction = sendSignedTransaction;
function simulateTransaction(connection, transaction, commitment) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        transaction.recentBlockhash = yield connection._recentBlockhash(
        // @ts-ignore
        connection._disableBlockhashCaching);
        const signData = transaction.serializeMessage();
        // @ts-ignore
        const wireTransaction = transaction._serialize(signData);
        const encodedTransaction = wireTransaction.toString("base64");
        const config = { encoding: "base64", commitment };
        const args = [encodedTransaction, config];
        // @ts-ignore
        const res = yield connection._rpcRequest("simulateTransaction", args);
        if (res.error) {
            throw new Error("failed to simulate transaction: " + res.error.message);
        }
        return res.result;
    });
}
function awaitTransactionSignatureConfirmation(txid, timeout, connection, commitment = "recent", queryStatus = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let done = false;
        let status = {
            slot: 0,
            confirmations: 0,
            err: null,
        };
        let subId = 0;
        // eslint-disable-next-line no-async-promise-executor
        status = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => {
                if (done) {
                    return;
                }
                done = true;
                reject({ timeout: true });
            }, timeout);
            try {
                subId = connection.onSignature(txid, (result, context) => {
                    done = true;
                    status = {
                        err: result.err,
                        slot: context.slot,
                        confirmations: 0,
                    };
                    if (result.err) {
                        reject(status);
                    }
                    else {
                        resolve(status);
                    }
                }, commitment);
            }
            catch (e) {
                done = true;
            }
            while (!done && queryStatus) {
                // eslint-disable-next-line no-loop-func
                (() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const signatureStatuses = yield connection.getSignatureStatuses([
                            txid,
                        ]);
                        status = signatureStatuses && signatureStatuses.value[0];
                        if (!done) {
                            if (!status) {
                            }
                            else if (status.err) {
                                done = true;
                                reject(status.err);
                            }
                            else if (!status.confirmations) {
                            }
                            else {
                                done = true;
                                resolve(status);
                            }
                        }
                    }
                    catch (e) {
                        if (!done) {
                        }
                    }
                }))();
                yield sleep(2000);
            }
        }));
        //@ts-ignore
        if (connection._signatureSubscriptions[subId])
            connection.removeSignatureListener(subId);
        done = true;
        return status;
    });
}
