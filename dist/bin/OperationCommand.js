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
const ion_sdk_1 = require("@decentralized-identity/ion-sdk");
const fs = require("fs");
const LogColor_1 = require("./LogColor");
/**
 * Class that handles the `operation` CLI command.
 */
class OperationCommand {
    /**
     * Handles the `create` sub-command.
     */
    static handleCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            const [recoveryKey, recoveryPrivateKey] = yield ion_sdk_1.IonKey.generateEs256kOperationKeyPair();
            const [updateKey, updatePrivateKey] = yield ion_sdk_1.IonKey.generateEs256kOperationKeyPair();
            const [signingKey, signingPrivateKey] = yield ion_sdk_1.IonKey.generateEs256kDidDocumentKeyPair({ id: 'signing-key' });
            const publicKeys = [signingKey];
            const document = {
                publicKeys
            };
            const input = { recoveryKey, updateKey, document };
            const createRequest = ion_sdk_1.IonRequest.createCreateRequest(input);
            const longFormDid = ion_sdk_1.IonDid.createLongFormDid(input);
            const shortFormDid = longFormDid.substring(0, longFormDid.lastIndexOf(':'));
            const didSuffix = shortFormDid.substring(shortFormDid.lastIndexOf(':') + 1);
            console.info(LogColor_1.default.lightBlue(`DID: `) + (`${shortFormDid}`));
            console.info('');
            // Save all private keys.
            const recoveryKeyFileName = `${didSuffix}-RecoveryPrivateKey.json`;
            const updateKeyFileName = `${didSuffix}-UpdatePrivateKey.json`;
            const signingKeyFileName = `${didSuffix}-SigningPrivateKey.json`;
            fs.writeFileSync(recoveryKeyFileName, JSON.stringify(recoveryPrivateKey));
            fs.writeFileSync(updateKeyFileName, JSON.stringify(updatePrivateKey));
            fs.writeFileSync(signingKeyFileName, JSON.stringify(signingPrivateKey));
            console.info(LogColor_1.default.brightYellow(`Recovery private key saved as: ${(recoveryKeyFileName)}`));
            console.info(LogColor_1.default.brightYellow(`Update private key saved as: ${(updateKeyFileName)}`));
            console.info(LogColor_1.default.brightYellow(`Signing private key saved as: ${(signingKeyFileName)}`));
            console.info('');
            console.info(LogColor_1.default.lightBlue(`Create request body:`));
            console.info(JSON.stringify(createRequest, null, 2)); // 2 space indents.
            console.info('');
            console.info(LogColor_1.default.lightBlue(`Long-form DID:`));
            console.info(longFormDid);
            console.info('');
            console.info(LogColor_1.default.lightBlue(`DID suffix data:`));
            console.info(JSON.stringify(createRequest.suffixData, null, 2));
            console.info('');
            console.info(LogColor_1.default.lightBlue(`Document delta:`));
            console.info(JSON.stringify(createRequest.delta, null, 2));
            console.info('');
        });
    }
}
exports.default = OperationCommand;
//# sourceMappingURL=OperationCommand.js.map