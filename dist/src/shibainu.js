"use strict";
//https://tsmatz.wordpress.com/2020/09/01/did-sidetree-ion/
//As I show you later, this process (default port 3002) will extract all transactions from Bitcoin core and check whether it’s a sidetree transaction for each transactions. Because of this, it will take a lot of time to
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
exports.blockchainService = exports.server = void 0;
//in this file /ion_shibainu/src/shibainu.ts search the keyworks 
//transaction 
//writeTransaction
//anchorString
const Koa = require("koa");
const Router = require("koa-router");
const getRawBody = require("raw-body");
const querystring = require("querystring");
const sidetree_1 = require("@decentralized-identity/sidetree");
/**
 * Handles the request using the given request handler then assigns the returned value as the body.
 * NOTE: The value of this method is really the unified handling of errors thrown.
 * @param requestHandler Request handler.
 * @param koaResponse Response object to update.
 */
function handleRequestAndSetKoaResponse(requestHandler, koaResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const responseBody = yield requestHandler();
            koaResponse.status = 200;
            koaResponse.set('Content-Type', 'application/json');
            if (responseBody) {
                koaResponse.body = JSON.stringify(responseBody);
            }
            else {
                // Need to set the body explicitly, otherwise Koa will return HTTP 204
                koaResponse.body = '';
            }
        }
        catch (error) {
            if ('status' in error) {
                koaResponse.status = error.status;
            }
            else {
                // This is an unknown/unexpected error.
                koaResponse.status = 500;
                // Log error if the config flag is switched on.
                if (config.logRequestError) {
                    console.error(error);
                }
            }
            if ('code' in error) {
                koaResponse.body = JSON.stringify({
                    code: error.code
                });
            }
        }
    });
}
console.log(`\n\n`);
console.log(`[msg from ion/src/shibainu.ts]. check1 ok. \n\n`);
// Selecting configuration file, environment variable overrides default config file.
let configFilePath = '../config/testnet-shibainu-config.json';
if (process.env.SHIBAINU_CONFIG_FILE_PATH === undefined) {
    console.log((`[msg from ion/src/shibainu.ts]. msg10. Environment variable SHIBAINU_CONFIG_FILE_PATH undefined, using default path ${configFilePath} instead.\n\n`));
}
else {
    configFilePath = process.env.SHIBAINU_CONFIG_FILE_PATH;
    console.log((`[msg from ion/src/shibainu.ts]. msg11. Loading configuration from ${(configFilePath)}...\n\n`));
}
const config = require(configFilePath);
console.log(`\n\n`);
console.log(`[msg from ion/src/shibainu.ts]. check2 ok. \n\n`);
// see if there are overrides for the service endpoints with env vars
const bitcoinDataDirectoryEnv = process.env.SHIBAINU_DATA_DIR;
if (bitcoinDataDirectoryEnv !== undefined) {
    config.bitcoinDataDirectory = bitcoinDataDirectoryEnv;
}
const bitcoinRpcPasswordEnv = process.env.SHIBAINU_RPC_PASSWORD;
if (bitcoinRpcPasswordEnv !== undefined) {
    config.bitcoinRpcPassword = bitcoinRpcPasswordEnv;
}
const bitcoinWalletEnv = process.env.SHIBAINU_WALLET;
if (bitcoinWalletEnv !== undefined) {
    config.bitcoinWalletOrImportString = bitcoinWalletEnv;
}
const bitcoinEndpointEnv = process.env.SHIBAINU_ENDPOINT;
if (bitcoinEndpointEnv !== undefined) {
    config.bitcoinPeerUri = bitcoinEndpointEnv;
}
const mongoEndpointEnv = process.env.MONGO_ENDPOINT;
if (mongoEndpointEnv !== undefined) {
    config.mongoDbConnectionString = mongoEndpointEnv;
}
console.log(`\n\n`);
console.log(`[msg from ion/src/shibainu.ts]. check3 ok. \n\n`);
// Selecting versioning file, environment variable overrides default config file.
let versioningConfigFilePath = '../config/testnet-shibainu-versioning.json';
if (process.env.ION_SHIBAINU_VERSIONING_CONFIG_FILE_PATH === undefined) {
    console.log('\n\n');
    console.log((`[msg from ion/src/shibainu.ts]. msg12. Environment variable ION_SHIBAINU_VERSIONING_CONFIG_FILE_PATH undefined, using default ION Shibainu versioning config path ${versioningConfigFilePath}.\n\n`));
}
else {
    versioningConfigFilePath = process.env.ION_SHIBAINU_VERSIONING_CONFIG_FILE_PATH;
    console.log((`[msg from ion/src/shibainu.ts]. msg13. Loading ION Shibainu versioning config from ${(versioningConfigFilePath)}...\n\n`));
}
const ionBitcoinVersions = require(versioningConfigFilePath);
console.log(`\n\n`);
console.log(`[msg from ion/src/shibainu.ts]. check4 ok. \n\n`);
const app = new Koa();
// Raw body parser.
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield getRawBody(ctx.req);
    yield next();
}));
const router = new Router();
//###############################################//
//###############################################//
//###############################################//
//###############################################//
//transaction
//routing.start
router.get('/transactions', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const params = querystring.parse(ctx.querystring);
    let requestHandler;
    if ('since' in params && 'transaction-time-hash' in params) {
        const since = Number(params['since']);
        const transactionTimeHash = String(params['transaction-time-hash']);
        requestHandler = () => blockchainService.transactions(since, transactionTimeHash);
    }
    else {
        requestHandler = () => blockchainService.transactions();
    }
    yield handleRequestAndSetKoaResponse(requestHandler, ctx.response);
}));
router.get('/version', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestHandler = () => blockchainService.getServiceVersion();
    yield handleRequestAndSetKoaResponse(requestHandler, ctx.response);
}));
router.get('/fee/:blockchainTime', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestHandler = () => blockchainService.getNormalizedFee(ctx.params.blockchainTime);
    yield handleRequestAndSetKoaResponse(requestHandler, ctx.response);
}));
//transaction
//anchorString
router.post('/transactions', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const writeRequest = JSON.parse(ctx.body);
    const requestHandler = () => blockchainService.writeTransaction(writeRequest.anchorString, writeRequest.minimumFee);
    yield handleRequestAndSetKoaResponse(requestHandler, ctx.response);
}));
router.post('/transactions/firstValid', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionsObject = JSON.parse(ctx.body);
    const requestHandler = () => blockchainService.firstValidTransaction(transactionsObject.transactions);
    yield handleRequestAndSetKoaResponse(requestHandler, ctx.response);
}));
router.get('/time', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestHandler = () => blockchainService.time();
    yield handleRequestAndSetKoaResponse(requestHandler, ctx.response);
}));
router.get('/time/:hash', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestHandler = () => blockchainService.time(ctx.params.hash);
    yield handleRequestAndSetKoaResponse(requestHandler, ctx.response);
}));
router.get('/locks/:identifier', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestHandler = () => blockchainService.getValueTimeLock(ctx.params.identifier);
    yield handleRequestAndSetKoaResponse(requestHandler, ctx.response);
}));
router.get('/writerlock', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestHandler = () => blockchainService.getActiveValueTimeLockForThisNode();
    yield handleRequestAndSetKoaResponse(requestHandler, ctx.response);
}));
router.get('/monitors/balance', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestHandler = () => blockchainService.monitor.getWalletBalance();
    yield handleRequestAndSetKoaResponse(requestHandler, ctx.response);
}));
app.use(router.routes())
    .use(router.allowedMethods());
// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
    ctx.response.status = 400;
});
const port = process.env.SIDETREE_SHIBAINU_PORT || config.port;
console.log(`\n\n`);
console.log(`[msg from ion/src/shibainu.ts]. check5 ok. \n\n`);
//###########################################
//routing.end
//###########################################
// initialize the blockchain service and kick-off background tasks. start
let server;
let blockchainService;
try {
    console.log(`[msg from ion/src/shibainu.ts]. check5a.1 ok. \n\n`);
    /*
     * source code of SidetreeBitcoinProcessor
     * sidetree-reference-impl/lib/index.ts
     * import SidetreeBitcoinProcessor from './bitcoin/BitcoinProcessor';
     */
    //SidetreeBitcoinProcessor() logging: Creating bitcoin wallet using the import string passed in.
    exports.blockchainService = blockchainService = new sidetree_1.SidetreeBitcoinProcessor(config);
    console.log(`[msg from ion/src/shibainu.ts]. check5a.2 ok. \n\n`);
}
catch (error) {
    console.log('\n\n');
    console.log('[msg from ion/src/shibainu.ts] catch error91');
    console.log('[msg from ion/src/shibainu.ts] msg58. ' + error.toString());
    console.log('\n\n');
    console.log('process.exit error91');
    console.log('\n\n');
    process.exit(1);
}
try {
    // SIDETREE_TEST_MODE enables unit testing of this file by bypassing blockchain service initialization.
    if (process.env.SIDETREE_TEST_MODE === 'true') {
        exports.server = server = app.listen(port);
        console.log(`[msg from ion/src/shibainu.ts]. check5b ok. \n\n`);
    }
    else {
        console.log(`[msg from ion/src/shibainu.ts]. check5c ok. \n\n`);
        blockchainService.initialize(ionBitcoinVersions)
            .then(() => {
            exports.server = server = app.listen(port, () => {
                console.log('\n\n');
                console.log(`[msg from ion/src/shibainu.ts]. msg20. Sidetree-Shibainu node running on port: ${port}`);
            });
        })
            .catch((error) => {
            console.log('\n\n');
            console.error(`[msg from ion/src/shibainu.ts]. msg21. Sidetree-Shibainu node initialization failed with error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
            blockchainService;
            process.exit(1);
        });
    }
    console.log(`[msg from ion/src/shibainu.ts]. check5d ok. \n\n`);
}
catch (error) {
    console.log('\n\n');
    console.log('[msg from ion/src/shibainu.ts] catch error432');
    console.log('[msg from ion/src/shibainu.ts] msg54. ' + error.toString());
    //../config/testnet-shibainu-config.json
    //../config/testnet-shibainu-versioning.json
    console.log('\n\n');
    console.log('[msg from ion/src/shibainu.ts] msg55. ' + 'Is bitcoinWalletOrImportString  valid? Consider using testnet key generated below:');
    console.log('[msg from ion/src/shibainu.ts]. msg56. ' + sidetree_1.SidetreeBitcoinProcessor.generatePrivateKeyForTestnet());
    console.log('\n\n');
    console.log('[msg from ion/src/shibainu.ts] msg57. ');
    console.log('Check bitcoinWalletOrImportString  in [config/testnet-shibainu-config.json]');
    console.log('[DEV]. Check bitcoinWalletOrImportString  in [sidetree-reference-impl/lib/bitcoin/IBitcoinConfig.ts]');
    console.log('[DEV]. Check IBitcoinConfig in [sidetree-reference-impl/lib/index.ts]');
    console.log('[DEV]. Check IBitcoinConfig in [sidetree-reference-impl/lib/index.ts]');
    console.log('\n\n');
    console.log('process.exit error432');
    console.log('\n\n');
    process.exit(1);
}
console.info('[msg from ion/src/shibainu.ts]. msg57. ' + 'Sidetree Shibainu service configuration:');
// console.info(config);
console.log(`\n\n`);
console.log(`[msg from ion/src/shibainu.ts]. check6 ok. \n\n`);
//# sourceMappingURL=shibainu.js.map