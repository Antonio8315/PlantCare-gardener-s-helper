import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Leaf, AlertCircle, CheckCircle2 } from 'lucide-react';

function App() {
  const [plantName, setPlantName] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [otherSymptom, setOtherSymptom] = useState('');
  const [result, setResult] = useState(null);

  // Тимчасові дані для розробки (потім замінимо на запити до БД)
  //const allPlants = ["Томат", "Огірок", "Яблуня", "Троянда", "Фікус"];
  const commonSymptoms = ["Пожовтіння листя", "Білий наліт", "Плями на плодах", "Плями на листі", "В'ялість", "Закручування листя", "Дірки в листі", "Почорніння стебла біля кореню"];

  const [allPlants, setAllPlants] = useState([]); // Тепер це пустий масив спочатку

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/diseases/plants');
        setAllPlants(response.data); // Отримуємо ["Томат", "Огірок", "Роза"] з бази
      } catch (error) {
        console.error("Не вдалося завантажити список рослин", error);
      }
    };
    fetchPlants();
  }, []);

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleDiagnose = async (e) => {
    e.preventDefault();
    setResult(null); // Очищуємо старий результат

    if (!plantName || (selectedSymptoms.length === 0 && !otherSymptom)) {
      alert("Будь ласка, вкажіть рослину та хоча б один симптом");
      return;
    }
    const finalSymptoms = [...selectedSymptoms];
    if (otherSymptom) finalSymptoms.push(otherSymptom);

    try {
      const response = await axios.post('http://localhost:5001/api/diseases/diagnose', {
        plantName,
        symptoms: finalSymptoms
      });
      setResult(response.data);
    } catch (error) {
      alert("Хворобу не знайдено. Спробуйте змінити опис.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2d5a27' }}>
        <Leaf size={32} /> PlantCare AI
      </h1>

      <form onSubmit={handleDiagnose} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Поле введення назви з Datalist (автодоповнення) */}
        <div>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Яка рослина вас турбує?</label>
          <input
            list="plants-list"
            type="text"
            placeholder="Почніть вводити назву..."
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <datalist id="plants-list">
            {allPlants.map(p => <option key={p} value={p} />)}
          </datalist>
        </div>

        {/* Вибір симптомів */}
        <div>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Оберіть наявні симптоми:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {commonSymptoms.map(s => (
              <div
                key={s}
                onClick={() => handleSymptomToggle(s)}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: selectedSymptoms.includes(s) ? '#28a745' : '#ddd',
                  background: selectedSymptoms.includes(s) ? '#eaffef' : '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {selectedSymptoms.includes(s) ? <CheckCircle2 size={16} color="#28a745" /> : <div style={{ width: 16 }} />}
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Інші симптоми */}
        <div>
          <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Інші симптоми (власний опис):</label>
          <input
            type="text"
            placeholder="Наприклад: липкий наліт на стовбурі"
            value={otherSymptom}
            onChange={(e) => setOtherSymptom(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{
          padding: '15px',
          background: '#2d5a27',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Діагностувати
        </button>
      </form>

      {/* Результат діагностики */}
      {result && result.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2 style={{ marginBottom: '15px', color: '#ffffff' }}>Результати аналізу:</h2>

          {result.map((disease, index) => (
            <div
              key={disease._id}
              style={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderLeft: index === 0 ? '5px solid #e74c3c' : '5px solid #f39c12', // Перша (найімовірніша) підсвічується червоним, інші - помаранчевим
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#333' }}>{disease.diseaseName}</h3>
                <span style={{ backgroundColor: '#e2f0d9', color: '#2d5a27', padding: '4px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                  Збіг симптомів: {disease.matchCount}
                </span>
              </div>

              <p style={{ color: '#666', marginTop: '10px' }}>{disease.description}</p>

              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                <strong>Лікування:</strong> {disease.treatment}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;