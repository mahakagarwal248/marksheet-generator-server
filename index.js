import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import routes from './routes/index.js'

const app = express();
dotenv.config();
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('This is a shopping site API');
});

app.use('/user', routes);

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.CONNECTION_URL;

mongoose
    .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    )
    .catch((err) => console.log(err.message));
