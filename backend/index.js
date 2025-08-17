import express from 'express';
import dotenv  from 'dotenv';
import cookieParser  from 'cookie-parser';
import {DBConnection} from './database/db.js'
import {router} from './routes/indexRoute.js'
import cors from 'cors'

dotenv.config();
const app = express();

const allowed = [ 
  "https://project-mu-three-59.vercel.app" ,
  "https://project-krishs-projects-a41f1900.vercel.app",
  "https://project-git-master-krishs-projects-a41f1900.vercel.app"
];

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

app.use('/',router);

app.listen(process.env.PORT,()=>{
    console.log(`server is listening to port ${process.env.PORT}`);
});