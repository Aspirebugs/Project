import express from 'express'
import dotenv from 'dotenv'
import cookieParser  from 'cookie-parser';
import cors from 'cors';
import { generateFile } from './utilities/generateFile.js';
import { evaluateFile } from './utilities/evaluateFile.js';
import fs from 'fs';


dotenv.config();
const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/run',async (req,res) => {
     try {
      const { code, language, tests } = req.body;
      const filePath = await generateFile(code, language);

      const result = await evaluateFile(filePath, tests);

      fs.unlink(filePath,() => {});

      return res.json(result);
  } catch (err) {
    console.error('Error in /run:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/',(req,res) => {
  res.send("Hello");
})

app.listen(process.env.PORT,()=>{
    console.log("Compiler backend listening on",process.env.PORT);
});