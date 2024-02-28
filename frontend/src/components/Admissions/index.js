import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Header from '../Header';
import './index.css';
import UserHeader from '../UserHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../Sidebar';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3mjvIXgowrzAntZfdwqgg0RNk6y4rwXk",
    authDomain: "major-745ad.firebaseapp.com",
    databaseURL: "https://major-745ad-default-rtdb.firebaseio.com",
    projectId: "major-745ad",
    storageBucket: "major-745ad.appspot.com",
    messagingSenderId: "460361188074",
    appId: "1:460361188074:web:cbe928a362bf723ad70d93",
    measurementId: "G-EZFP9MH10Q"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const firestore = getFirestore();

const Admissions = () => {
  const [allData, setAllData] = useState([]);
  const [admissionData, setAdmissionData] = useState([]);
  const [years] = useState([
    '2021-22', '2020-21', '2019-20', '2018-19', 
    '2017-18', '2016-17', '2015-16', '2014-15'
  ]);
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAllAdmissionData();
  }, []);

  const handlePrint = () => {
    window.print();
  };


  const fetchAllAdmissionData = async () => {
    setLoading(true);
    try {
      const collectionRef = collection(firestore, 'admission');
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map(doc => doc.data());
      setAllData(data);
      // Removed setMessage for data import success
    } catch (error) {
      console.error("Error fetching admissions data: ", error);
      setMessage('Failed to import data');
    }
    setLoading(false);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const filteredData = allData.filter(item => item.Year === selectedYear);

  // Prepare data for the Bar chart
  const programData = filteredData.map(item => ({
    Program: item.Program,
    Intake: item.Intake,
    Admitted: item.Admitted,
    LateralCount: item.LateralCount,
  }));

  const handleGoClick = () => {
    const filteredData = allData.filter(item => item.Year === selectedYear);
    setAdmissionData(filteredData);
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#85144b', '#F012BE', '#3D9970', '#111111'];

  return (
    <>
      <div className='std-sidebar'>
      <Sidebar />
    <div className='module-home'>
    
    <div className="dropdown-container">
      <select value={selectedYear} onChange={handleYearChange} className="year-dropdown">
        <option value="">Select Year</option>
        {years.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))}
      </select>
    </div>

    {!loading && filteredData.length > 0 && (
      <div className="charts-container" style={{ display: 'flex', alignItems:'center', flexWrap: 'wrap', flexDirection:'column' }}>
        <div className="chart-card">
          <h3 className="chart-title">Program Wise Intake</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={programData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Program" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Intake" fill={COLORS[3]} name="Intake" />
              
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        
        
        <div className="chart-card">
          <h3 className="chart-title">Program Wise Intake & Admitted</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={programData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Program" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Intake" fill={COLORS[0]} name="Intake" />
              <Bar dataKey="Admitted" fill={COLORS[1]} name="Admitted" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Program Wise Lateral Entry Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={programData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Program" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="LateralCount" fill={COLORS[2]} name="Lateral Entry Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button onClick={handlePrint} className="print-button">
      Print
    </button>
      </div>
    )}
  </div>
      </div>
    </>
  );
};

export default Admissions;
