"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
/**
 * Abstraction for colored logs.
 */
class LogColor {
}
/** Method for logging in light blue. */
LogColor.lightBlue = chalk.hex('#75b0eb');
/** Method for logging in green. */
LogColor.green = chalk.green;
/** Method for logging in yellow. */
LogColor.yellow = chalk.yellow;
/** Method for logging in bright yellow. */
LogColor.brightYellow = chalk.yellowBright;
exports.default = LogColor;
//# sourceMappingURL=LogColor.js.map