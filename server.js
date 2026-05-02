const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

// файл для хранения
const FILE = "guests.json";

// читаем старые данные
function loadGuests() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

// сохраняем
function saveGuests(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// отправка анкеты
app.post("/api/guest", (req, res) => {
  const { name, attendance, alcohol, comments, favorite_track } = req.body;

  if (!name || !attendance) {
    return res.status(400).json({ message: "Заполните обязательные поля" });
  }

  const guests = loadGuests();

  const newGuest = {
    id: Date.now(),
    name,
    attendance,
    alcohol: Array.isArray(alcohol) ? alcohol : [alcohol].filter(Boolean),
    comments,
    favorite_track,
    createdAt: new Date()
  };

  guests.push(newGuest);
  saveGuests(guests);

  console.log("Новая анкета:", newGuest);

  res.json({ message: "Спасибо! Анкета отправлена 💛" });
});

// список гостей (для админки)
app.get("/api/guests", (req, res) => {
  res.json(loadGuests());
});

app.listen(3000, () => {
  console.log("Сервер запущен: http://localhost:3000");
});