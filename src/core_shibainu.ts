import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as getRawBody from 'raw-body';

import {
  SidetreeConfig,
  SidetreeCore,
  SidetreeResponse,
  SidetreeResponseModel,
  SidetreeVersionModel
} from '@decentralized-identity/sidetree';






/*
import {SidetreeConfig} from './sidetree-reference-impl/lib/core/models/Config';
import {SidetreeCore} from './sidetree-reference-impl/lib/core/Core';
import {SidetreeResponse} from './sidetree-reference-impl/lib/common/Response';
import {SidetreeResponseModel} from './sidetree-reference-impl/lib/common/models/ResponseModel';
import {SidetreeVersionModel} from './sidetree-reference-impl/lib/core/models/VersionModel';
*/




/*
import SidetreeConfig from './core/models/Config';
import SidetreeCore from './core/Core';
import SidetreeEventCode from './core/EventCode';
import SidetreeResponse from './common/Response';
import SidetreeResponseModel from './common/models/ResponseModel';
import SidetreeVersionModel from './core/models/VersionModel';
  
import ISidetreeBitcoinConfig from './bitcoin/IBitcoinConfig';
import ISidetreeBitcoinWallet from './bitcoin/interfaces/IBitcoinWallet';
import ISidetreeBlockchain from './core/interfaces/IBlockchain';
import ISidetreeCas from './core/interfaces/ICas';
import ISidetreeEventEmitter from './common/interfaces/IEventEmitter';
import ISidetreeLogger from './common/interfaces/ILogger';
import SidetreeBitcoinEventCode from './bitcoin/EventCode';
import SidetreeBitcoinMonitor from './bitcoin/Monitor';
import SidetreeBitcoinProcessor from './bitcoin/BitcoinProcessor';
import SidetreeBitcoinVersionModel from './bitcoin/models/BitcoinVersionModel';
import SidetreeBlockchain from './core/Blockchain';
import SidetreeBlockchainTimeModel from './core/models/BlockchainTimeModel';
import SidetreeConfig from './core/models/Config';
import SidetreeCore from './core/Core';
import SidetreeEventCode from './core/EventCode';
import SidetreeMonitor from './core/Monitor';
import SidetreeResponse from './common/Response';
import SidetreeResponseModel from './common/models/ResponseModel';
import SidetreeServiceVersionModel from './common/models/ServiceVersionModel';
import SidetreeTransactionModel from './common/models/TransactionModel';
import SidetreeValueTimeLockModel from './common/models/ValueTimeLockModel';
import SidetreeVersionModel from './core/models/VersionModel';


 
 
 
 * 
 * 
 */



/*
import {
  SidetreeConfig,
  SidetreeCore,
  SidetreeResponse,
  SidetreeResponseModel,
  SidetreeVersionModel
} from './sidetree-reference-impl/lib/index.ts'
*/



///media/ubuntu/shareddir1/karametron/ion_001/ion_shibainu/src/sidetree-reference-impl/lib

//sidetree
//import index from './sidetree-reference-impl/dist/lib/index'


//import lib = require('libName');
/*
import  { SidetreeConfig }= require('./sidetree-reference-impl/dist/lib/index');
import  {SidetreeCore } = require('./sidetree-reference-impl/dist/lib/index');
import  {SidetreeResponse} = require('./sidetree-reference-impl/dist/lib/index');
import  {SidetreeResponseModel }= require('./sidetree-reference-impl/dist/lib/index');
import  {SidetreeVersionModel }= require('./sidetree-reference-impl/dist/lib/index');
*/

/*
import SidetreeConfig from './sidetree-reference-impl/dist/lib/index'
import SidetreeCore from './sidetree-reference-impl/dist/lib/index'
import SidetreeResponse from './sidetree-reference-impl/dist/lib/index'
import SidetreeResponseModel from './sidetree-reference-impl/dist/lib/index'
import SidetreeVersionModel from './sidetree-reference-impl/dist/lib/index'
*/



import Ipfs from '@decentralized-identity/sidetree/dist/lib/ipfs/Ipfs';
//import LogColor from '../bin/LogColor';
import ResponseStatus from '@decentralized-identity/sidetree/dist/lib/common/enums/ResponseStatus';

/** Configuration used by this server. */
interface ServerConfig extends SidetreeConfig {
  /** IPFS HTTP API endpoint URI. */
  ipfsHttpApiEndpointUri: string;

  /** Port to be used by the server. */
  port: number;
}

// Selecting core config file, environment variable overrides default config file.
let configFilePath = '../config/testnet-core_shibainu-config.json';
if (process.env.ION_CORE_SHIBAINU_CONFIG_FILE_PATH === undefined) {
  console.log('\n\n');
  console.log((`[msg from ion/src/core_shibainu.ts]. Environment variable ION_CORE_SHIBAINU_CONFIG_FILE_PATH undefined, using default core config path ${configFilePath} instead. \n\n`));
} else {
  configFilePath = process.env.ION_CORE_SHIBAINU_CONFIG_FILE_PATH;
  console.log('\n\n');
  console.log((`[msg from ion/src/core_shibainu.ts]. Loading core config from ${(configFilePath)}...\n\n`));
}
const config: ServerConfig = require(configFilePath);

// Selecting versioning file, environment variable overrides default config file.
let versioningConfigFilePath = '../config/testnet-core_shibainu-versioning.json';
if (process.env.ION_CORE_SHIBAINU_VERSIONING_CONFIG_FILE_PATH === undefined) {
  console.log('\n\n');
  console.log((
    `Environment variable ION_CORE_SHIBAINU_VERSIONING_CONFIG_FILE_PATH undefined, using default core versioning config path ${versioningConfigFilePath} instead. \n\n`
  ));
} else {
  versioningConfigFilePath = process.env.ION_CORE_SHIBAINU_VERSIONING_CONFIG_FILE_PATH;
  console.log((`[msg from ion/src/core_shibainu.ts]. Loading core versioning config from ${(versioningConfigFilePath)}...\n\n`));
}
const coreVersions: SidetreeVersionModel[] = require(versioningConfigFilePath);

console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check1 ok. \n\n`)


// see if there are overrides for the service endpoints with env vars
const ipfsEndpointEnv = process.env.IPFS_ENDPOINT;
if (ipfsEndpointEnv !== undefined) {
  config.ipfsHttpApiEndpointUri = ipfsEndpointEnv;
}

console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check2 ok. \n\n`)


const blockchainEndpointEnv = process.env.BLOCKCHAIN_SERVICE_ENDPOINT;
if (blockchainEndpointEnv !== undefined) {
  config.blockchainServiceUri = blockchainEndpointEnv;
}



console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check3 ok. \n\n`)

const mongoEndpointEnv = process.env.MONGO_ENDPOINT;
if (mongoEndpointEnv !== undefined) {
  config.mongoDbConnectionString = mongoEndpointEnv;
}



console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. msg341.  new Ipfs() \n\n`)

const ipfsFetchTimeoutInSeconds = 10;
const cas = new Ipfs(config.ipfsHttpApiEndpointUri, ipfsFetchTimeoutInSeconds);


console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. msg342.  new SidetreeCore()  \n\n`)
console.log(`Run Mongo, blockchain  \n\n`)
console.log(`sidetree-reference-impl/lib/core/Core.ts  \n\n`)
const sidetreeCore = new SidetreeCore(config, coreVersions, cas);







console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check5 ok. \n\n`)

const app = new Koa();

console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check6 ok. \n\n`)



// Raw body parser.
app.use(async (ctx, next) => {
  ctx.body = await getRawBody(ctx.req);
  await next();
});




//################################
//sidetreeCore() is defined in sidetree-reference-impl/lib/core/Core.ts



//About handleOperationRequest, check /ion_shibainu/src/Core_fork_shibainu.ts
/*
response=ResponseModel 

ResponseModel {
        status: {
        BadRequest = 'bad-request',
        Deactivated = 'deactivated',
        NotFound = 'not-found',
        ServerError = 'server-error',
        Succeeded = 'succeeded'
        };
        body?: any;
}
*/



console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check7 ok. \n\n`)

const router = new Router();
router.post('/operations', async (ctx, _next) => {
  const response = await sidetreeCore.handleOperationRequest(ctx.body);
  setKoaResponse(response, ctx.response);
});


console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check8 ok. \n\n`)


router.get('/version', async (ctx, _next) => {
  const response = await sidetreeCore.handleGetVersionRequest();
  setKoaResponse(response, ctx.response);
});


console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check9 ok. \n\n`)


const resolvePath = '/identifiers/';
router.get(`${resolvePath}:did`, async (ctx, _next) => {
  // Strip away the first '/identifiers/' string.
  const didOrDidDocument = ctx.url.split(resolvePath)[1];
  const response = await sidetreeCore.handleResolveRequest(didOrDidDocument);
  setKoaResponse(response, ctx.response);
});


console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check10 ok. \n\n`)

router.get('/monitor/operation-queue-size', async (ctx, _next) => {
  const body = await sidetreeCore.monitor.getOperationQueueSize();
  const response = { status: ResponseStatus.Succeeded, body };
  setKoaResponse(response, ctx.response);
});


console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check11 ok. \n\n`)

router.get('/monitor/writer-max-batch-size', async (ctx, _next) => {
  const body = await sidetreeCore.monitor.getWriterMaxBatchSize();
  const response = { status: ResponseStatus.Succeeded, body };
  setKoaResponse(response, ctx.response);
});



console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check12 ok. \n\n`)

app.use(router.routes())
  .use(router.allowedMethods());

  
  
console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check13 ok. \n\n`)

// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
  ctx.response.status = 400;
});


console.log(`\n\n`)
console.log(`[msg from ion/src/core_shibainu.ts]. check14 ok. \n\n`);

//################################




/**
 * Sets the koa response according to the Sidetree response object given.
 */

const setKoaResponse = (response: SidetreeResponseModel, koaResponse: Koa.Response) => {
  koaResponse.status = SidetreeResponse.toHttpStatus(response.status);

  if (response.body) {
    koaResponse.set('Content-Type', 'application/json');
    koaResponse.body = response.body;
    console.log(`\n\n`)
    console.log(`[msg from ion/src/core_shibainu.ts]. check13 ok. \n\n`)
    
  } else {
    // Need to set the body explicitly to empty string, else koa will echo the request as the response.
    koaResponse.body = '';
    console.log(`\n\n`)
    console.log(`[msg from ion/src/core_shibainu.ts]. check13 ok. \n\n`)
  }
};











//################################
//sidetreeCore() is defined in sidetree-reference-impl/lib/core/Core.ts

//Backend API
(async () => {
  try {
    await sidetreeCore.initialize();

    const port = config.port;
    app.listen(port, () => {
      console.log(`[msg from ion/src/core_shibainu.ts]. msg343. ION-Shiba node running on port: ${port} \n\n`);
    });
    
  } catch (error) {
      
    const serializedError = JSON.stringify(error, Object.getOwnPropertyNames(error));


    console.log(`\n\n`);
    
    console.log(`[msg from ion/src/core_shibainu.ts]. msg344. ION-Shiba node initialization failed with error ${serializedError} \n\n`);


    console.log(`process.exit 6464 \n\n`);
    
    process.exit(1);
  }
})();




