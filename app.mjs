import './db.mjs';
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
app.set('view engine', 'hbs');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.listen(process.env.PORT || 3000);
