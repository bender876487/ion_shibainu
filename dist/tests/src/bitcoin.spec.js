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
// MUST set these environment variables before `blockchainService` and `server` are imported.
const supertest = require("supertest");
const bitcoin_1 = require("../../src/bitcoin");
const SharedErrorCode_1 = require("@decentralized-identity/sidetree/dist/lib/common/SharedErrorCode");
const RequestError_1 = require("@decentralized-identity/sidetree/dist/lib/bitcoin/RequestError");
const ResponseStatus_1 = require("@decentralized-identity/sidetree/dist/lib/common/enums/ResponseStatus");
process.env.SIDETREE_TEST_MODE = 'true';
process.env.SIDETREE_BITCOIN_CONFIG_FILE_PATH = '../tests/config/bitcoin-config-test.json';
describe('Bitcoin service', () => __awaiter(void 0, void 0, void 0, function* () {
    it('should return 400 with error code when transaction fetch throws invalid hash error.', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeGetTransactionsMethod = () => __awaiter(void 0, void 0, void 0, function* () { throw new RequestError_1.default(ResponseStatus_1.default.BadRequest, SharedErrorCode_1.default.InvalidTransactionNumberOrTimeHash); });
        spyOn(bitcoin_1.blockchainService, 'transactions').and.callFake(fakeGetTransactionsMethod);
        const response = yield supertest(bitcoin_1.server).get('/transactions?since=6212927891701761&transaction-time-hash=dummyHash');
        expect(response.status).toEqual(400);
        const actualResponseBody = JSON.parse(response.body.toString());
        expect(actualResponseBody).toBeDefined();
        expect(actualResponseBody.code).toEqual(SharedErrorCode_1.default.InvalidTransactionNumberOrTimeHash);
    }));
}));
//# sourceMappingURL=bitcoin.spec.js.map