import React, { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Modal = ({ predictions = [], onClose, onGenerate, t, language }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h3 className="text-xl font-semibold mb-4">
          {t?.farePrediction || 'Fare Prediction for next 2 weeks'}
        </h3>
        {predictions.length > 0 ? (
          <table className="table-auto w-full mb-4 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Timeslot</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="border border-gray-300 px-4 py-2">{prediction.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{prediction.timeslot}</td>
                  <td className="border border-gray-300 px-4 py-2">{prediction.fare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No predictions available. Please generate new predictions.</p>
        )}
        <div className="flex justify-center">
          <button
            onClick={onGenerate}
            className="bg-yellow-400 text-[#027f86] px-6 py-2 rounded-lg shadow-lg hover:bg-yellow-500 transition-all mr-4"
          >
            {language === 'en' ? 'Generate New Predictions' : 'Generar Nuevas Predicciones'}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};




const Analytics = () => {
  const { language, setLanguage } = useLanguage();
  const [predictions, setPredictions] = useState([]);

  // Generate fare predictions
  const generatePredictions = () => {
    const newPredictions = [];
    const today = new Date();
    const timeSlots = ['07-08 AM', '09-10 AM', '11-12 PM', '05-06 PM'];
  
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
  
      const formattedDate = date.toLocaleDateString('en-US');
      const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      const fare = (Math.random() * (10 - 1) + 1).toFixed(2); // Generate random price
  
      newPredictions.push({
        date: formattedDate,
        timeslot: timeSlot,
        fare: `S/${fare}`,
      });
    }
  
    setPredictions(newPredictions);
    console.log('Generated Predictions:', newPredictions); // Debug log
  };
  


  // Translations for two languages
  const translations = {
    en: {
      title: 'GoLobitos Analytics',
      revenueAnalysis: 'Revenue Generation Analysis',
      peakTimeAnalysis: 'Peak Time Analysis',
      vehicleEfficiency: 'Vehicle Utilization and Efficiency',
      emergencyDistribution: 'Emergency Type Distribution',
      customerSatisfaction: 'Customer Satisfaction Analysis',
      evEfficiency: 'Efficiency and Cost Reduction Using Electric Vehicles',
    },
    es: {
      title: 'Análisis de GoLobitos',
      revenueAnalysis: 'Análisis de Generación de Ingresos',
      peakTimeAnalysis: 'Análisis de Horas Pico',
      vehicleEfficiency: 'Utilización y Eficiencia de Vehículos',
      emergencyDistribution: 'Distribución por Tipo de Emergencia',
      customerSatisfaction: 'Análisis de Satisfacción del Cliente',
      evEfficiency: 'Eficiencia y Reducción de Costos con Vehículos Eléctricos',
    },
  };

  const t = translations[language];

  // Sample data for charts
  const revenueData = {
    labels: ['Medical', 'Fire', 'Police', 'Natural Disaster'],
    datasets: [
      {
        label: 'Revenue (in $)',
        data: [15000, 12000, 8000, 5000],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const peakTimeData = {
    labels: ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'],
    datasets: [
      {
        label: 'Requests (per hour)',
        data: [30, 50, 70, 90, 40],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const vehicleEfficiencyData = {
    labels: ['Ambulance', 'Rescue Truck', 'Police Car', 'Fire Engine'],
    datasets: [
      {
        label: 'Vehicle Efficiency (%)',
        data: [80, 60, 70, 75],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const emergencyTypeDistributionData = {
    labels: ['Medical - Critical', 'Medical - Non-Critical', 'Fire Emergency', 'Police Assistance', 'Natural Disaster'],
    datasets: [
      {
        label: 'Emergency Type Distribution',
        data: [40, 20, 15, 10, 15],
        backgroundColor: ['#FF6347', '#FFD700', '#20B2AA', '#87CEEB', '#8A2BE2'],
        hoverOffset: 4,
      },
    ],
  };

  const customerSatisfactionData = {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    datasets: [
      {
        label: 'Customer Feedback',
        data: [50, 30, 15, 5],
        backgroundColor: ['#28a745', '#ffcc00', '#ffc107', '#dc3545'],
        hoverOffset: 4,
      },
    ],
  };

  const evEfficiencyAndCostData = {
    labels: ['Electric Vehicle', 'Diesel Vehicle'],
    datasets: [
      {
        label: 'Cost Reduction (%)',
        data: [30, 10],
        backgroundColor: ['#34D399', '#F87171'],
        borderColor: ['#34D399', '#F87171'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#027f86] to-[#3a0ca3] text-white flex flex-col items-center overflow-hidden m-0 p-0 box-border">
       {/* Language Toggle Button */}
       <div className="w-full flex justify-end p-4">
      <button
        onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
        className="flex items-center bg-yellow-400 text-[#027f86] px-3 py-1 rounded-lg hover:bg-yellow-500 transition-all"
      >
        <FontAwesomeIcon icon={faGlobe} className="mr-2" />
        {language === 'en' ? 'Español' : 'English'}
      </button>
    </div>

      {/* Centered Logo and Title */}
      <div className="flex flex-col items-center mb-6 px-4 md:px-0">
        <div className="w-12 h-12 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-xl mb-2">
          Go
        </div>
        <h1 className="text-2xl font-bold text-white">{t.title}</h1>
      </div>
      
      {/* Predict Button */}
    <div className="w-full flex justify-center mb-6">
      <button
        onClick={generatePredictions}
        className="bg-yellow-400 text-[#027f86] px-6 py-2 rounded-lg shadow-lg hover:bg-yellow-500 transition-all"
      >
        {language === 'en' ? 'Predict Fare' : 'Predecir Tarifa'}
      </button>
    </div>

    {/* Predictions Modal */}
    <div className="w-full flex justify-center">
      {predictions.length > 0 && (
        <Modal
          predictions={predictions}
          onClose={() => setPredictions([])}
          onGenerate={generatePredictions}
          t={t}
          language={language}
        />
      )}
    </div>
      
      <div className="w-full overflow-y-auto max-h-screen px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{t.revenueAnalysis}</h3>
            <Bar data={revenueData} options={{ responsive: true }} />
          </div>

          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{t.peakTimeAnalysis}</h3>
            <Line data={peakTimeData} options={{ responsive: true }} />
          </div>

          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{t.vehicleEfficiency}</h3>
            <Bar data={vehicleEfficiencyData} options={{ responsive: true }} />
          </div>

          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{t.emergencyDistribution}</h3>
            <Pie data={emergencyTypeDistributionData} options={{ responsive: true }} />
          </div>

          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{t.customerSatisfaction}</h3>
            <Pie data={customerSatisfactionData} options={{ responsive: true }} />
          </div>

          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{t.evEfficiency}</h3>
            <Bar data={evEfficiencyAndCostData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
