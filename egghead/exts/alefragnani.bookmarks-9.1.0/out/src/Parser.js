"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parser {
    static parsePosition(position) {
        let re = new RegExp(/\(Ln\s(\d+)\,\sCol\s(\d+)\)/);
        let matches = re.exec(position);
        if (matches) {
            return {
                line: parseInt(matches[1], 10),
                column: parseInt(matches[2], 10)
            };
        }
        return undefined;
    }
    static encodePosition(line, column) {
        return " (Ln " + line.toString() + ", Col " + column.toString() + ")";
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map