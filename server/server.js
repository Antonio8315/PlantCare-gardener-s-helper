const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const diseaseRoutes = require('./routes/diseaseRoutes');

// Завантажуємо змінні з .env
dotenv.config();

// Підключаємося до бази
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Щоб сервер розумів JSON-дані в запитах

app.get('/', (req, res) => {
  res.send('API працює, база підключена!');
});
app.get('/test', (req, res) => res.send('Тест пройдено!'));
app.use('/api/diseases', diseaseRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});