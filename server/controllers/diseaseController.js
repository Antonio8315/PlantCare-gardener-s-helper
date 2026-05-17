const Disease = require('../models/Disease');

// Функція діагностики
exports.diagnosePlant = async (req, res) => {
  console.log("Отримані дані для діагностики:", req.body);
  try {
    const { plantName, symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: "Будь ласка, виберіть хоча б один симптом." });
    }

    const symptomRegex = symptoms.map(s => new RegExp(s, "i"));

    const possibleDiseases = await Disease.find({
      plants: { $regex: new RegExp(plantName, "i") },
      symptoms: { $in: symptomRegex }
    });

    if (!possibleDiseases || possibleDiseases.length === 0) {
      return res.status(404).json({ message: "Хворобу не знайдено. Спробуйте уточнити симптоми." });
    }

    const sortedDiseases = possibleDiseases.map(disease => {

      const matchCount = disease.symptoms.filter(symptom => 
        symptoms.some(userSymptom => userSymptom.toLowerCase() === symptom.toLowerCase())
      ).length;

      return {
        ...disease.toObject(),
        matchCount
      };
    }).sort((a, b) => b.matchCount - a.matchCount);

    res.json(sortedDiseases);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};


exports.getPlants = async (req, res) => {
  try {
    const plants = await Disease.distinct("plants");
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
