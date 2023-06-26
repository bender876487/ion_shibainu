#!/usr/bin/env node
"use strict";
// NOTE: MUST keep the line above so `npm i` will install the CLI correctly across all operating systems.
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
const yargs = require("yargs");
const OperationCommand_1 = require("./OperationCommand");
// tslint:disable-next-line: no-unused-expression - Invoking `argv` is the way to trigger argument processing in `yargs`...
yargs
    .scriptName('ion') // Make usage help print 'ion' instead 'index.js'.
    .usage('Usage: $0 <command> [options]')
    .demandCommand(1, 'A <command> is not specified.') // Requires a command to be specified.
    .command('operation', 'Generates a new <create|update|recover|deactivate> operation.', (yargs) => {
    yargs
        .usage('Usage: $0 operation <create|update|recover|deactivate> [options]')
        .demandCommand(1, 'An <operation type> is not specified.') // Requires a sub-command (operation type) to be specified.
        .command('create', 'Generates a create operation.', () => __awaiter(void 0, void 0, void 0, function* () {
        yield OperationCommand_1.default.handleCreate();
    }))
        .command('update', 'Generates an update operation.', () => {
        console.log('To be implemented.');
    })
        .command('recover', 'Generates a recover operation.', () => {
        console.log('To be implemented.');
    })
        .command('deactivate', 'Generates a deactivate operation.', () => {
        console.log('To be implemented.');
    })
        .updateStrings({
        'Commands:': 'Operation type:'
    })
        .wrap(null)
        .strict(); // Requires the sub-command must be one of the explicitly defined sub-commands.
})
    .command('resolve', 'Resolves an ION DID.', () => {
    console.log('To be implemented.');
})
    .strict() // Requires the command must be one of the explicitly defined commands.
    .help(false) // Disabling --help option.
    .version(false) // Disabling --version option.
    .argv;
//# sourceMappingURL=index.js.map