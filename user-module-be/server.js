const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors')
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000;

connectDB();

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
  }

const app = express();

app.use(express.json());

app.use(cors(corsOptions));

app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(PORT, () => { console.log(`server started on port ${PORT}`)});