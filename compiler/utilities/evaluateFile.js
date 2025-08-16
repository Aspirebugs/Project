import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

function runCommand(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) return reject({ err, stderr, stdout });
      resolve({ stdout, stderr });
    });
  });
}

export async function evaluateFile(filePath, tests) {
  const workDir = path.dirname(filePath);
  const jobId = path.basename(filePath).split('.')[0];
  const exeName = path.join(workDir, `${jobId}.exe`);
  const compileCmd = `g++ "${filePath}" -o "${exeName}"`;

  

  // 1️⃣ Compile
  try {
    await runCommand(compileCmd, { timeout: 10_000 });
    
  } catch ({ err, stderr, stdout }) {
   
    return {
      stat: 'COMPILE_ERROR',
      problem: stderr || err.message
    };
  }

  // 2️⃣ Run each test and compare
  let result = { stat: 'OK' };
  for (const [i, test] of tests.entries()) {
    

    const safeInput = test.input.replace(/"/g, '\\"');
    const singleLineInput = safeInput.replace(/\r?\n/g, ' ');
    const runCmd = `echo ${singleLineInput} | "${exeName}"`;
    

    try {
      const { stdout, stderr } = await runCommand(runCmd, {
        timeout: 2_000,
        maxBuffer: 10 * 1024 * 1024
      });

      
      if (stderr) {
        result = { stat: 'RUNTIME_ERROR', problem: stderr.trim() };
        break;
      } else {
        const actual = stdout.trim();
        const expected = test.output.trim();
        
        if (actual !== expected) {
          
          result = {
            stat: 'WRONG_ANSWER',
            output: stdout,
            problem: `Expected: ${test.output}`
          };
          break;
        } 
      }
    } catch (runErr) {
      if (runErr.err.killed) {
        result = { stat: 'TIMEOUT', problem: 'Time limit exceeded' };
      } else {
        result = {
          stat: 'RUNTIME_ERROR',
          problem: (runErr.stderr || runErr.err.message).trim()
        };
      }
      break;
    }
  }

  try {
    await fs.unlink(exeName);
    
  } catch (err) {
   
  }

  
  return result;
}
