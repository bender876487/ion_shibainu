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
const Koa = require("koa");
const Router = require("koa-router");
const getRawBody = require("raw-body");
const sidetree_1 = require("@decentralized-identity/sidetree");
const Ipfs_1 = require("@decentralized-identity/sidetree/dist/lib/ipfs/Ipfs");
////import LogColor from '../bin/LogColor';
const ResponseStatus_1 = require("@decentralized-identity/sidetree/dist/lib/common/enums/ResponseStatus");
// Selecting core config file, environment variable overrides default config file.
let configFilePath = '../config/testnet-core_shibainu-config.json';
if (process.env.ION_CORE_SHIBAINU_CONFIG_FILE_PATH === undefined) {
    console.log((`MSG545. Environment variable ION_CORE_SHIBAINU_CONFIG_FILE_PATH undefined, using default core config path ${configFilePath} instead.`));
}
else {
    configFilePath = process.env.ION_CORE_SHIBAINU_CONFIG_FILE_PATH;
    console.log((`MSG545. Loading core config from ${(configFilePath)}...`));
}
const config = require(configFilePath);
// Selecting versioning file, environment variable overrides default config file.
let versioningConfigFilePath = '../config/testnet-core_shibainu-versioning.json';
if (process.env.ION_CORE_SHIBAINU_VERSIONING_CONFIG_FILE_PATH === undefined) {
    console.log((`Environment variable ION_CORE_SHIBAINU_VERSIONING_CONFIG_FILE_PATH undefined, using default core versioning config path ${versioningConfigFilePath} instead.`));
}
else {
    versioningConfigFilePath = process.env.ION_CORE_SHIBAINU_VERSIONING_CONFIG_FILE_PATH;
    console.log((`MSG545. Loading core versioning config from ${(versioningConfigFilePath)}...`));
}
const coreVersions = require(versioningConfigFilePath);
// see if there are overrides for the service endpoints with env vars
const ipfsEndpointEnv = process.env.IPFS_ENDPOINT;
if (ipfsEndpointEnv !== undefined) {
    config.ipfsHttpApiEndpointUri = ipfsEndpointEnv;
}
const blockchainEndpointEnv = process.env.BLOCKCHAIN_SERVICE_ENDPOINT;
if (blockchainEndpointEnv !== undefined) {
    config.blockchainServiceUri = blockchainEndpointEnv;
}
const mongoEndpointEnv = process.env.MONGO_ENDPOINT;
if (mongoEndpointEnv !== undefined) {
    config.mongoDbConnectionString = mongoEndpointEnv;
}
const ipfsFetchTimeoutInSeconds = 10;
const cas = new Ipfs_1.default(config.ipfsHttpApiEndpointUri, ipfsFetchTimeoutInSeconds);
const sidetreeCore = new sidetree_1.SidetreeCore(config, coreVersions, cas);
const app = new Koa();
// Raw body parser.
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield getRawBody(ctx.req);
    yield next();
}));
const router = new Router();
router.post('/operations', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield sidetreeCore.handleOperationRequest(ctx.body);
    setKoaResponse(response, ctx.response);
}));
router.get('/version', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield sidetreeCore.handleGetVersionRequest();
    setKoaResponse(response, ctx.response);
}));
const resolvePath = '/identifiers/';
router.get(`${resolvePath}:did`, (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    // Strip away the first '/identifiers/' string.
    const didOrDidDocument = ctx.url.split(resolvePath)[1];
    const response = yield sidetreeCore.handleResolveRequest(didOrDidDocument);
    setKoaResponse(response, ctx.response);
}));
router.get('/monitor/operation-queue-size', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = yield sidetreeCore.monitor.getOperationQueueSize();
    const response = { status: ResponseStatus_1.default.Succeeded, body };
    setKoaResponse(response, ctx.response);
}));
router.get('/monitor/writer-max-batch-size', (ctx, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = yield sidetreeCore.monitor.getWriterMaxBatchSize();
    const response = { status: ResponseStatus_1.default.Succeeded, body };
    setKoaResponse(response, ctx.response);
}));
app.use(router.routes())
    .use(router.allowedMethods());
// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
    ctx.response.status = 400;
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sidetreeCore.initialize();
        const port = config.port;
        app.listen(port, () => {
            console.log(`MSG545. ION node running on port: ${port}`);
        });
    }
    catch (error) {
        const serializedError = JSON.stringify(error, Object.getOwnPropertyNames(error));
        console.log(`MSG545. ION node initialization failed with error ${serializedError}`);
        process.exit(1);
    }
}))();
/**
 * Sets the koa response according to the Sidetree response object given.
 */
const setKoaResponse = (response, koaResponse) => {
    koaResponse.status = sidetree_1.SidetreeResponse.toHttpStatus(response.status);
    if (response.body) {
        koaResponse.set('Content-Type', 'application/json');
        koaResponse.body = response.body;
    }
    else {
        // Need to set the body explicitly to empty string, else koa will echo the request as the response.
        koaResponse.body = '';
    }
};
//# sourceMappingURL=core_shibainu.bkp1.js.map