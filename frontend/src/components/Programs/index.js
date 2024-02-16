import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import UserHeader from '../UserHeader';
import './index.css';

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

  initializeApp(firebaseConfig);


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#00C49F', '#0088FE', /* more colors */];

const Programs = () => {
  const [programsData, setProgramsData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [showCharts, setShowCharts] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const schoolWiseIntakeData = []; // Populate this array with actual data
  const programWiseIntakeData = []; // Populate this array with actual data
  const programsDistributionData = []; // Populate this array with actual data

  useEffect(() => {
    // Fetch programs data from Firestore
    const db = getFirestore();
    const collectionRef = collection(db, "programs");
    getDocs(collectionRef).then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      setProgramsData(data);
    });
  }, []);

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    setShowCharts(!!year);

    // Filter the programsData based on the selected year
    const filtered = programsData.filter(program => program.YearofCommencement === year);
    setFilteredData(filtered);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Accredited Year</th>
            <th>Department</th>
            <th>Intake</th>
            <th>Program</th>
            <th>S.No</th>
            <th>School</th>
            <th>Year of Commencement</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.AccreditedYear}</td>
              <td>{item.Department}</td>
              <td>{item.Intake}</td>
              <td>{item.Program}</td>
              <td>{item['S.No']}</td>
              <td>{item.School}</td>
              <td>{item.YearofCommencement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const getSchoolWiseIntake = () => {
    const intakeData = programsData
      .filter(item => item.YearofCommencement === selectedYear)
      .reduce((acc, curr) => {
        const school = curr.School || 'Unknown';
        acc[school] = (acc[school] || 0) + curr.Intake;
        return acc;
      }, {});
    return Object.keys(intakeData).map(school => ({ name: school, intake: intakeData[school] }));
  };

  // Process programsData to get program wise intake data
  const getProgramWiseIntake = () => {
    const intakeData = programsData
      .filter(item => item.YearofCommencement === selectedYear)
      .reduce((acc, curr) => {
        const program = curr.Program || 'Unknown';
        acc[program] = (acc[program] || 0) + curr.Intake;
        return acc;
      }, {});
    return Object.keys(intakeData).map(program => ({ name: program, intake: intakeData[program] }));
  };

  // Process programsData to get programs distribution data
  const getProgramsDistribution = () => {
    const distributionData = programsData
      .filter(item => item.YearofCommencement === selectedYear)
      .reduce((acc, curr) => {
        const program = curr.Program || 'Unknown';
        acc[program] = (acc[program] || 0) + 1;
        return acc;
      }, {});
    return Object.keys(distributionData).map(program => ({ name: program, value: distributionData[program] }));
  };

  const renderCharts = () => {
    if (selectedYear && showCharts) {
      const schoolIntakeData = getSchoolWiseIntake();
      const programIntakeData = getProgramWiseIntake();
      const programDistributionData = getProgramsDistribution();

      return (
        <div className='charts-main-programs'>
          <div className="charts-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', flexDirection:'column'}}>
          {/* Chart wrapper with shadow and title */}
          <div className="chart-wrapper" style={{ width: '40%', boxShadow: '0px 0px 10px #ccc', padding: '10px', margin: '10px' }}>
            <h3 style={{ textAlign: 'center' }}>School Wise Intake</h3>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={schoolIntakeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="intake" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-wrapper" style={{ width: '40%', boxShadow: '0px 0px 10px #ccc', padding: '10px', margin: '10px' }}>
            <h3 style={{ textAlign: 'center' }}>Program Wise Intake</h3>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={programIntakeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="intake" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-wrapper" style={{ width: '40%', boxShadow: '0px 0px 10px #ccc', padding: '10px', margin: '10px' }}>
            <h3 style={{ textAlign: 'center' }}>Programs Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                  data={programDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {programDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <button onClick={handlePrint} className="print-button">
        Print
      </button>
        </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <>
      <div className='module-home'>
      <UserHeader />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <select onChange={handleYearChange} value={selectedYear}>
  <option value="">Select Year of Commencement</option>
  {['2001-02', '2002-03', '2003-04', '2007-08', '2010-11', '2014-15', '2016-17', '2018-19', '2019-20', '2020-21'].map((year) => (
    <option key={year} value={year}>{year}</option>
  ))}
</select>
</div>
{/* {selectedYear && renderTable()} */}

{renderCharts()}
      </div>
    </>
  );
};

export default Programs;