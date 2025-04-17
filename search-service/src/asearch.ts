import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// 递归读取目录
function walkDir(dir: string): string[] {
  const files: string[] = fs.readdirSync(dir);
  let result: string[] = [];

  files.forEach((file) => {
    const filePath: string = path.join(dir, file);
    const stat: fs.Stats = fs.statSync(filePath);

    if (filePath.indexOf('node_modules') !== -1) {
      return;
    }

    if (stat.isDirectory()) {
      result = result.concat(walkDir(filePath)); // 如果是目录，递归搜索
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      result.push(filePath); // 找到 .ts 或 .tsx 文件
    }
  });

  return result;
}

// 检查文件中是否有符合条件的行
function searchFile(
  filePath: string,
  findstr: string,
  sidestr: string,
  range: number,
  sidestr2?: string,
  sidestr3?: string,
  sidestr4?: string,
): Promise<Array<{ lineNumber: number; line: string }>> {
  const rl: readline.Interface = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  const matches: Array<{ lineNumber: number; line: string }> = [];
  const lines: string[] = [];

  let lineNumber: number = 0; // 跟踪行号
  rl.on('line', (line: string) => {
    lineNumber++;
    lines.push(line);
    if (line.includes(findstr)) {
      matches.push({ lineNumber, line });
    }
  });

  return new Promise((resolve) => {
    rl.on('close', () => {
      // 确认匹配的行是否在指定范围内出现了伴随字符串
      const filteredMatches = matches.filter((match) => {
        const lineNumber = match.lineNumber;

        let i_range = range;
        if (range === -1) {
          // 如果range为-1，检查整个文件
          i_range = 10 * 10000;
        }

        // 查找前后指定范围的行
        const startLine = Math.max(1, lineNumber - i_range);
        const endLine = Math.min(lines.length, lineNumber + i_range);

        // 检查范围内是否包含sidestr
        let hasSidestr = false;
        let hasSidestr2 = false;
        let hasSidestr3 = false;
        let hasSidestr4 = false;
        for (let i = startLine; i <= endLine; i++) {
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
        const requiredSidestrs: boolean[] = [];
        if (sidestr2) requiredSidestrs.push(hasSidestr2);
        if (sidestr3) requiredSidestrs.push(hasSidestr3);
        if (sidestr4) requiredSidestrs.push(hasSidestr4);

        const allRequiredSidestrsMatch = requiredSidestrs.every(Boolean);
        return (
          hasSidestr &&
          (requiredSidestrs.length === 0 || allRequiredSidestrsMatch)
        );
      });

      resolve(filteredMatches);
    });
  });
}

// 定义 search 函数的参数类型
interface SearchParams {
  projdir: string;
  findstr: string;
  sidestr: string;
  range: number;
  sidestr2?: string;
  sidestr3?: string;
  sidestr4?: string;
}

interface ResultRecord {
  lineNumber: number;
  line: string;
  filePath: string;
}

async function search(params: SearchParams): Promise<{
  result_string_list: string[];
  result_record_list: ResultRecord[];
}> {
  const { projdir, findstr, sidestr, range, sidestr2, sidestr3, sidestr4 } =
    params;
  const files: string[] = walkDir(projdir);
  const allMatches: Array<{
    file: string;
    matches: Array<{ lineNumber: number; line: string }>;
  }> = [];
  const output: string[] = [];
  const resultRecords: ResultRecord[] = [];

  for (const file of files) {
    const matches = await searchFile(
      file,
      findstr,
      sidestr,
      range,
      sidestr2,
      sidestr3,
      sidestr4,
    );
    if (matches.length > 0) {
      allMatches.push({ file, matches });
      matches.forEach((match) => {
        resultRecords.push({
          lineNumber: match.lineNumber,
          line: match.line,
          filePath: file,
        });
      });
    }
  }

  // 输出符合条件的文件和行号
  if (allMatches.length > 0) {
    allMatches.forEach(({ file, matches }) => {
      output.push(`文件: ${file}`);
      matches.forEach((match) => {
        output.push(`  行号: ${match.lineNumber}, 内容: ${match.line}`);
      });
    });
  } else {
    output.push('没有找到符合条件的结果');
  }

  return {
    result_string_list: output,
    result_record_list: resultRecords,
  };
}

// 主程序入口
async function main(): Promise<void> {
  // node myfind.js "/Users/jasonchen/src/yuanbao/chatbot-web/apps/yuanbao-desktop" "main_mod" "AllAgentPage" 5
  const args: string[] = process.argv.slice(2);
  const params: SearchParams = {
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
  const { result_string_list } = await search(params);
  console.log(result_string_list.join('\n'));
}

void main();

export { search };
