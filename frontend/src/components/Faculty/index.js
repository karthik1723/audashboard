import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import UserHeader from '../UserHeader';
import './index.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';


// Your web app's Firebase configuration

// Your web app's Firebase configuration
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#00C49F', '#0088FE', /* more colors */];

const FacultyComponent = () => {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [facultyData, setFacultyData] = useState([]);

  const programs = {
    "B.Tech": [
      "INFORMATION TECHNOLOGY",
      "ELECTRICAL AND ELECTRONICS ENGINEERING",
      "COMPUTER SCIENCE AND ENGINEERING",
      "MECHANICAL ENGINEERING",
      "CHEMICAL ENGINEERING",
      "CIVIL ENGINEERING",
      "ARTIFICIAL INTELLIGENCE",
      "ELECTONICS AND COMMUNICATION ENGINEERING",
      "COMPUTER SCIENCE ENGINEERING( CYBER SECURITY)",
      "COMPUTER SCIENCE ENGINEERING( DATA SCIENCE)",
      "CONSTRUCTION TECHNOLOGY AND MANAGEMENT",
      "CHEMICAL ENGINEERING"
    ],
    "M.Tech": [
      "VLSI DESIGN SYSTEM",
      "STRUCTURAL ENGINEERING",
      "CYBER SECURITY",
      "EMBEDDED SYSTEMS",
      "ARTIFICIAL INTELLIGENCE",
      "DATA SCIENCES",
      "CONSTRUCTION TECHNOLOGY AND MANAGEMENT",
      "ADDITIVE MANUFACTURING",
      "POWER ELECTRONICS AND ELECTRICAL DRIVES",
      "ROBOTICS AND AUTOMATION",
      "CIVIL",
      "MACHINE DESIGN"
    ],
    "Ph.D": [
      "COMPUTER SCIENCE AND ENGINEERING",
      "CHEMICAL ENGINEERING",
      "CIVIL ENGINEERING",
      "MECHANICAL ENGINEERING",
      "ELECTONICS AND COMMUNICATION ENGINEERING",
      "ELECTRICAL AND ELECTRONIC ENGINEERING",
      "CSE (SPECIALIZATION IN ARTIFICIAL INTELLIGENCE)",
      "CSE (SPECIALIZATION IN IT)"
    ],
    "M.Pharm": [
      "PHARMACEUTICS",
      "PHARMACOLOGY",
      "INDUSTRIAL PHARMACY",
      "DOCTOR OF PHARMACY",
      "PHARMA ANALYSIS",
      "PHARMACEUTICAL REGULATORY AFFAIRS"
    ],
    "B.Pharm": [
      "BACHELOR OF PHARMACY"
    ],
    "BBA": [
      "BACHELOR OF BUSINESS ADMINISTRATION"
    ],
    "B.Com": [
      "BACHELOR OF COMMERCE"
    ],
    "B.Sc": [
      "BACHELOR OF SCIENCE-DATA SCIENCE",
      "BACHELOR OF SCIENCE-ARTIFICIAL INTELLIGENCE"
    ],
    "B.J": [
      "BACHELOR OF JOURNALISM"
    ],
    "B.A": [
      "BACHELOR OF ARTS"
    ]
    // ... other programs and their departments can be added here ...
  };
  

  useEffect(() => {
    // Update the departments based on the selected program
    if (selectedProgram) {
      setDepartments(programs[selectedProgram] || []);
    }
  }, [selectedProgram]);


  useEffect(() => {
    if (selectedProgram && selectedDepartment) {
      fetchFacultyData();
    }
  }, [selectedProgram, selectedDepartment]);

  const handleProgramChange = (event) => {
    const program = event.target.value;
    setSelectedProgram(program);
  
    // Reset the department selection when program changes
    setSelectedDepartment('');
  
    // Update departments list based on the selected program
    // Use a Set to ensure unique values
    const uniqueDepartments = new Set(programs[program]);
    setDepartments([...uniqueDepartments]);
  };
  

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const getDesignationChartData = (data) => {
    const designationCount = data.reduce((acc, faculty) => {
      const designation = faculty.designation; // Assuming 'designation' is the key for faculty designation
      acc[designation] = (acc[designation] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(designationCount).map(([name, value]) => ({ name, value }));
  };
  
  const getGenderChartData = (data) => {
    const genderCount = data.reduce((acc, faculty) => {
      const gender = faculty.gender; // Assuming 'gender' is the key for faculty gender
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(genderCount).map(([name, value]) => ({ name, value }));
  };

  const getProfessorGenderChartData = (data) => {
    const result = data.reduce((acc, faculty) => {
      const { designation, gender } = faculty;
      acc[designation] = acc[designation] || { M: 0, F: 0 }; // Initialize if not present
      acc[designation][gender]++; // Increment gender count
      return acc;
    }, {});
  
    return Object.entries(result).map(([designation, genders]) => ({
      designation,
      ...genders,
    }));
  };

  const getCasteChartData = (data) => {
    const casteCount = data.reduce((acc, faculty) => {
      const { caste } = faculty;
      acc[caste] = (acc[caste] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(casteCount).map(([name, value]) => ({ name, value }));
  };
  
  const handlePrint = () => {
    window.print();
  };

  

  const fetchFacultyData = async () => {
    try {
      // Adjust the query to match the case and structure of your Firestore collection
      const q = query(
        collection(db, "faculty"),
        where("Program", "==", selectedProgram.toUpperCase()),
        where("f_branch", "==", selectedDepartment.toUpperCase())
      );
  
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const faculty = doc.data();
        // Mapping keys based on your Firestore document structure
        return {
          name: faculty.f_name,   // Assuming 'f_name' is the correct key
          designation: faculty.f_course,  // Assuming 'f_course' is the correct key
          branch: faculty.f_branch,  // Assuming 'f_branch' is the correct key
          gender: faculty.f_gender,  // Assuming 'f_gender' is the correct key
          caste: faculty.Caste  // Assuming 'Caste' is the correct key
        };
      });
      setFacultyData(data);
    } catch (error) {
      console.error("Error fetching faculty data: ", error);
    }
  };
  

  return (
          
    <div className='module-home'>
    <UserHeader />
    <div className="dropdown-container">
        <select value={selectedProgram} onChange={handleProgramChange}>
          <option value="">Select Program</option>
          {Object.keys(programs).map(program => (
            <option key={program} value={program}>{program}</option>
          ))}
        </select>

        <select value={selectedDepartment} onChange={handleDepartmentChange} disabled={!selectedProgram}>
          <option value="">Select Department</option>
          {departments.map(department => (
            <option key={department} value={department}>{department}</option>
          ))}
        </select>
      </div>
      
      

      {facultyData.length > 0 && (
        <>
  {/* <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Designation</th>
        <th>Branch</th>
        <th>Gender</th>
        <th>Caste</th>
        {/* Add other table headers here if needed */}
      {/* </tr>
    </thead>
    <tbody>
      {facultyData.map((faculty, index) => (
        <tr key={index}>
          <td>{faculty.name}</td>
          <td>{faculty.designation}</td>
          <td>{faculty.branch}</td>
          <td>{faculty.gender}</td>
          <td>{faculty.caste}</td>
          {/* Render other faculty data here if needed */}
        {/* </tr>
      ))}
    </tbody>
  </table> */}

<div className="charts-container">
  <div className="charts-row"  style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', flexDirection:'column', alignItems:'center' }}>
<div className="chart-card">
<h3 className="chart-title">Professors by Designation</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={getDesignationChartData(facultyData)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8" name="Count" />
    </BarChart>
  </ResponsiveContainer>
  
</div>

<div className="chart-card">
<h3 className="chart-title">Gender Distribution</h3>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie data={getGenderChartData(facultyData)} cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label>
        {getGenderChartData(facultyData).map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
  
</div>
</div>
<div className="charts-row" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px',flexDirection:'column',alignItems:'center' }}>
<div className="chart-card">
<h3 className="chart-title">Professor-wise Gender Distribution</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      layout="horizontal" // Set layout to vertical
      data={getProfessorGenderChartData(facultyData)}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <YAxis type="number" /> // XAxis now represents the numeric axis
      <XAxis dataKey="designation" type="category" width={150} /> // YAxis is now the category axis
      <Tooltip />
      <Legend />
      <Bar dataKey="M" fill="#8884d8" />
      <Bar dataKey="F" fill="#82ca9d" />
    </BarChart>
  </ResponsiveContainer>
  
</div>


<div className="chart-card">
<h3 className="chart-title">Caste Distribution</h3>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie data={getCasteChartData(facultyData)} cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label>
        {getCasteChartData(facultyData).map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
  
</div>

</div>
<div className='print-cont'>
<button onClick={handlePrint} className="print-button">
        Print
      </button>
</div>
</div>

</>
)}
</div>
  );
};

export default FacultyComponent;