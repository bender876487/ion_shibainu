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
exports.blockchainService = exports.server = void 0;
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
// Selecting configuration file, environment variable overrides default config file.
let configFilePath = '../config/testnet-shibainu-config.json';
if (process.env.SHIBAINU_CONFIG_FILE_PATH === undefined) {
    console.log((`[msg from ion/src/shibainu.ts]. Environment variable SHIBAINU_CONFIG_FILE_PATH undefined, using default path ${configFilePath} instead.`));
}
else {
    configFilePath = process.env.SHIBAINU_CONFIG_FILE_PATH;
    console.log(LogColor.lightBlue(`[msg from ion/src/shibainu.ts]. Loading configuration from ${LogColor.green(configFilePath)}...`));
}
const config = require(configFilePath);
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
// Selecting versioning file, environment variable overrides default config file.
let versioningConfigFilePath = '../config/testnet-shibainu-versioning.json';
if (process.env.ION_SHIBAINU_VERSIONING_CONFIG_FILE_PATH === undefined) {
    console.log((`[msg from ion/src/shibainu.ts]. Environment variable ION_SHIBAINU_VERSIONING_CONFIG_FILE_PATH undefined, using default ION Shibainu versioning config path ${versioningConfigFilePath}.`));
}
else {
    versioningConfigFilePath = process.env.ION_SHIBAINU_VERSIONING_CONFIG_FILE_PATH;
    console.log(LogColor.lightBlue(`[msg from ion/src/shibainu.ts]. Loading ION Shibainu versioning config from ${LogColor.green(versioningConfigFilePath)}...`));
}
const ionBitcoinVersions = require(versioningConfigFilePath);
const app = new Koa();
// Raw body parser.
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield getRawBody(ctx.req);
    yield next();
}));
const router = new Router();
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
// initialize the blockchain service and kick-off background tasks
let server;
let blockchainService;
try {
    exports.blockchainService = blockchainService = new sidetree_1.SidetreeBitcoinProcessor(config);
    // SIDETREE_TEST_MODE enables unit testing of this file by bypassing blockchain service initialization.
    if (process.env.SIDETREE_TEST_MODE === 'true') {
        exports.server = server = app.listen(port);
    }
    else {
        blockchainService.initialize(ionBitcoinVersions)
            .then(() => {
            exports.server = server = app.listen(port, () => {
                console.log(`[msg from ion/src/shibainu.ts]. Sidetree-Shibainu node running on port: ${port}`);
            });
        })
            .catch((error) => {
            console.error(`[msg from ion/src/shibainu.ts]. Sidetree-Shibainu node initialization failed with error: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
            process.exit(1);
        });
    }
}
catch (error) {
    console.log('[msg from ion/src/shibainu.ts] msg54. ' + error.toString());
    console.log('[msg from ion/src/shibainu.ts] msg55. ' + 'Is bitcoinWalletOrImportString (shibainuWalletOrImportString) valid? Consider using testnet key generated below:');
    console.log('[msg from ion/src/shibainu.ts]. msg56. ' + sidetree_1.SidetreeBitcoinProcessor.generatePrivateKeyForTestnet());
    process.exit(1);
}
console.info('[msg from ion/src/shibainu.ts]. msg57. ' + 'Sidetree Shibainu service configuration:');
//# sourceMappingURL=shibainu.bkp3.js.map