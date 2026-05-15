const Disease = require('../models/Disease');

// Функція діагностики
exports.diagnosePlant = async (req, res) => {
  console.log("Отримані дані для діагностики:", req.body);
  try {
    const { plantName, symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: "Будь ласка, виберіть хоча б один симптом." });
    }

    // Створюємо регулярні вирази для ігнорування регістру симптомів
    const symptomRegex = symptoms.map(s => new RegExp(s, "i"));

    // 1. Шукаємо ВСІ хвороби, які підходять для цієї рослини і мають хоча б один симптом
    const possibleDiseases = await Disease.find({
      plants: { $regex: new RegExp(plantName, "i") },
      symptoms: { $in: symptomRegex }
    });

    if (!possibleDiseases || possibleDiseases.length === 0) {
      return res.status(404).json({ message: "Хворобу не знайдено. Спробуйте уточнити симптоми." });
    }

    // 2. Рахуємо кількість збігів та сортуємо хвороби
    const sortedDiseases = possibleDiseases.map(disease => {
      // Рахуємо скільки симптомів із запиту є в поточної хвороби
      const matchCount = disease.symptoms.filter(symptom => 
        symptoms.some(userSymptom => userSymptom.toLowerCase() === symptom.toLowerCase())
      ).length;

      return {
        ...disease.toObject(), // Перетворюємо документ Mongoose в звичайний об'єкт
        matchCount // Додаємо нове поле з кількістю збігів
      };
    }).sort((a, b) => b.matchCount - a.matchCount); // Сортуємо від більшого до меншого

    // Повертаємо весь масив відсортованих хвороб на фронтенд
    res.json(sortedDiseases);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

// Додатково: Функція для отримання списку всіх рослин (для автодоповнення на фронтенді)
exports.getPlants = async (req, res) => {
  try {
    // distinct витягне всі унікальні назви з усіх масивів plants
    const plants = await Disease.distinct("plants");
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
