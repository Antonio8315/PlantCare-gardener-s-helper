const mongoose = require('mongoose');

const DiseaseSchema = new mongoose.Schema({
  // Тепер тут масив, щоб одна хвороба могла належати багатьом рослинам
  plants: [{ type: String, required: true }], 
  diseaseName: { type: String, required: true },
  symptoms: [String],
  description: String,
  treatment: String,
  imageUrl: String
});

module.exports = mongoose.model('Disease', DiseaseSchema);