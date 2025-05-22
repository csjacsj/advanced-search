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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
var fs = require("fs");
var path = require("path");
var readline = require("readline");
// 递归读取目录
function walkDir(dir) {
    var files = fs.readdirSync(dir);
    var result = [];
    files.forEach(function (file) {
        var filePath = path.join(dir, file);
        var stat = fs.statSync(filePath);
        if (filePath.indexOf('node_modules') !== -1) {
            return;
        }
        if (stat.isDirectory()) {
            result = result.concat(walkDir(filePath)); // 如果是目录，递归搜索
        }
        else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            result.push(filePath); // 找到 .ts 或 .tsx 文件
        }
    });
    return result;
}
// 检查文件中是否有符合条件的行
function searchFile(filePath, findstr, sidestr, range, sidestr2, sidestr3, sidestr4) {
    var rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity,
    });
    var matches = [];
    var lines = [];
    var lineNumber = 0; // 跟踪行号
    rl.on('line', function (line) {
        lineNumber++;
        lines.push(line);
        if (line.includes(findstr)) {
            matches.push({ lineNumber: lineNumber, line: line, lines: [] });
        }
    });
    return new Promise(function (resolve) {
        rl.on('close', function () {
            // 为每个匹配的行生成上下文行
            matches.forEach(function (match) {
                var startLine = Math.max(1, match.lineNumber - 5);
                var endLine = Math.min(lines.length, match.lineNumber + 5);
                for (var i = startLine; i <= endLine; i++) {
                    match.lines.push({ lineNumber: i, line: lines[i - 1] });
                }
            });
            // 确认匹配的行是否在指定范围内出现了伴随字符串
            var filteredMatches = matches.filter(function (match) {
                var lineNumber = match.lineNumber;
                var i_range = range;
                if (range === -1) {
                    // 如果range为-1，检查整个文件
                    i_range = 10 * 10000;
                }
                // 查找前后指定范围的行
                var startLine = Math.max(1, lineNumber - i_range);
                var endLine = Math.min(lines.length, lineNumber + i_range);
                // 检查范围内是否包含sidestr
                var hasSidestr = false;
                var hasSidestr2 = false;
                var hasSidestr3 = false;
                var hasSidestr4 = false;
                for (var i = startLine; i <= endLine; i++) {
                    if (lines[i - 1].includes(sidestr)) {
                        hasSidestr = true;
                    }
                    if (sidestr2 && lines[i - 1].includes(sidestr2)) {
                        hasSidestr2 = true;
                    }
                    if (sidestr3 && lines[i - 1].includes(sidestr3)) {
                        hasSidestr3 = true;
                    }
                    if (sidestr4 && lines[i - 1].includes(sidestr4)) {
                        hasSidestr4 = true;
                    }
                }
                // 检查所有非空的sidestr参数是否都匹配
                var requiredSidestrs = [];
                if (sidestr2)
                    requiredSidestrs.push(hasSidestr2);
                if (sidestr3)
                    requiredSidestrs.push(hasSidestr3);
                if (sidestr4)
                    requiredSidestrs.push(hasSidestr4);
                var allRequiredSidestrsMatch = requiredSidestrs.every(Boolean);
                return (hasSidestr &&
                    (requiredSidestrs.length === 0 || allRequiredSidestrsMatch));
            });
            resolve(filteredMatches);
        });
    });
}
function search(params) {
    return __awaiter(this, void 0, void 0, function () {
        var projdir, findstr, sidestr, range, sidestr2, sidestr3, sidestr4, files, allMatches, output, resultRecords, _loop_1, _i, files_1, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projdir = params.projdir, findstr = params.findstr, sidestr = params.sidestr, range = params.range, sidestr2 = params.sidestr2, sidestr3 = params.sidestr3, sidestr4 = params.sidestr4;
                    files = walkDir(projdir);
                    allMatches = [];
                    output = [];
                    resultRecords = [];
                    _loop_1 = function (file) {
                        var matches;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, searchFile(file, findstr, sidestr, range, sidestr2, sidestr3, sidestr4)];
                                case 1:
                                    matches = _b.sent();
                                    if (matches.length > 0) {
                                        allMatches.push({ file: file, matches: matches });
                                        matches.forEach(function (match) {
                                            resultRecords.push({
                                                lineNumber: match.lineNumber,
                                                line: match.line,
                                                lines: match.lines,
                                                filePath: file,
                                            });
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, files_1 = files;
                    _a.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 4];
                    file = files_1[_i];
                    return [5 /*yield**/, _loop_1(file)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    // 输出符合条件的文件和行号
                    if (allMatches.length > 0) {
                        allMatches.forEach(function (_a) {
                            var file = _a.file, matches = _a.matches;
                            output.push("\u6587\u4EF6: ".concat(file));
                            matches.forEach(function (match) {
                                output.push("  \u884C\u53F7: ".concat(match.lineNumber, ", \u5185\u5BB9: ").concat(match.line));
                                var record = resultRecords.find(function (r) { return r.lineNumber === match.lineNumber && r.filePath === file; });
                                if (record) {
                                    output.push("  \u4E0A\u4E0B\u6587\u5185\u5BB9: \n".concat(record.lines.map(function (linesInfo) { return "".concat(linesInfo.lineNumber, ":\t").concat(linesInfo.line); }).join('\n'), "\n"));
                                }
                            });
                        });
                    }
                    else {
                        output.push('没有找到符合条件的结果');
                    }
                    return [2 /*return*/, {
                            result_string_list: output,
                            result_record_list: resultRecords,
                        }];
            }
        });
    });
}
exports.search = search;
// 主程序入口
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, params, result_string_list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv.slice(2);
                    // console.log('asearch::main', args.length);
                    if (args.length === 0) {
                        return [2 /*return*/];
                    }
                    params = {
                        // 项目目录路径
                        projdir: args[0],
                        // 需要查找的字符串
                        findstr: args[1],
                        // 伴随字符串（必须出现在匹配行的附近）
                        sidestr: args[2],
                        // 查找范围（行数），-1表示检查整个文件
                        range: parseInt(args[3], 10),
                        // 可选伴随字符串2
                        sidestr2: args[4],
                        // 可选伴随字符串3
                        sidestr3: args[5],
                        // 可选伴随字符串4
                        sidestr4: args[6],
                    };
                    return [4 /*yield*/, search(params)];
                case 1:
                    result_string_list = (_a.sent()).result_string_list;
                    console.log(result_string_list.join('\n'));
                    return [2 /*return*/];
            }
        });
    });
}
void main();
