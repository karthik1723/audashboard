import React, { Component } from 'react';
import './index.css';
import Header from '../Header';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import UserHeader from '../UserHeader';
import Sidebar from '../Sidebar';
import Scrolling from '../Scrolling';

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


class Students extends Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedProgram: "default",
        selectedBranch: "default",
        selectedYear: "default",
        showCharts: false,
        programOptions: ["BTECH", "MTECH", "PHD", "BPHARM", "BSC", "MPHARM", "BBA"],
        branchOptions: [],
        studentsData: [],
        yearOptions: []
      };
      }
      
      componentDidUpdate(prevProps, prevState) {
        // Check if the selection has changed and is not default
        if (this.state.selectedProgram !== "default" && this.state.selectedBranch !== "default" && this.state.selectedYear !== "default" &&
            (prevState.selectedProgram !== this.state.selectedProgram || prevState.selectedBranch !== this.state.selectedBranch || prevState.selectedYear !== this.state.selectedYear)) {
            this.fetchData();
        }
    }

      getGenderChartData() {
        const { studentsData } = this.state;
        const genderCount = studentsData.reduce((acc, student) => {
            const gender = student.s_gender.toUpperCase();
            if (acc[gender]) {
                acc[gender] += 1;
            } else {
                acc[gender] = 1;
            }
            return acc;
        }, {});

        return Object.keys(genderCount).map(key => ({
            name: key,
            value: genderCount[key]
        }));
    }

    getCasteChartData() {
      const { studentsData } = this.state;
      const casteCount = studentsData.reduce((acc, student) => {
          const caste = student.Caste.toUpperCase();
          if (acc[caste]) {
              acc[caste] += 1;
          } else {
              acc[caste] = 1;
          }
          return acc;
      }, {});
  
      return Object.keys(casteCount).map(key => ({
          name: key,
          value: casteCount[key]
      }));
  }

  
    // Loop through each student and build up the counts
    getGenderVsCasteChartData() {
      const { studentsData } = this.state;
      let data = {};
  
      // Loop through each student and build up the counts
      studentsData.forEach(student => {
          const gender = student.s_gender.toUpperCase();
          const caste = student.Caste.toUpperCase();
  
          if (!data[caste]) {
              data[caste] = { caste, Male: 0, Female: 0 }; // Initialize caste object with Male and Female counts set to 0
          }
  
          if (gender === 'M') {
              data[caste].Male++; // Increment male count for the caste
          } else if (gender === 'F') {
              data[caste].Female++; // Increment female count for the caste
          }
          // Add more conditions here if there are more genders in your data
      });
  
      // Convert the data object to an array format suitable for Recharts
      return Object.values(data); // We use Object.values here because we want the values from the 'data' object which are our formatted caste objects
  }
  


    handleProgramChange = (event) => {
        const program = event.target.value;
        this.setState({
          selectedProgram: program,
          selectedBranch: "default",
          selectedYear: "default"
        }, () => {
          this.updateBranchOptions(program);
          this.updateYearOptions(program);
        });
      }

      handleBranchChange = (event) => {
        this.setState({ selectedBranch: event.target.value });
      }

    
      handleYearChange = (event) => {
        this.setState({ selectedYear: event.target.value });
      }

    updateBranchOptions = (program) => {
        const programKey = program.toUpperCase(); // Convert program to uppercase to match keys
        const branches = {
          "BTECH": ["CIVIL ENGINEERING", "ELECTRICAL AND ELECTRONIC ENGINEERING", "MECHANICAL  ENGINEERING", "INFORMATIONTECHNOLOGY", "COMPUTER SCIENCE AND ENGINEERING"],
          "MTECH": ["COMPUTER SCIENCE AND ENGINEERING", "INFORMATIONTECHNOLOGY", "MECHANICAL  ENGINEERING", "CIVIL ENGINEERING", "MACHINE DESIGN"],
          "PHD": ["ELECTRICAL AND ELECTRONIC ENGINEERING", "INFORMATIONTECHNOLOGY", "MECHANICAL ENGINEERING", "CIVIL ENGINEERING"],
          "BPHARM": ["PHARMACEUTICS", "PHARMACOLOGY", "MEDICAL CHEMISTRY", "PHARMACOGNOSY"],
          "BSC": ["BACHELOR OF SCIENCE-DATA SCIENCE", "BACHELOR OF SCIENCE-ARTIFICIAL INTELLIGENCE"],
          "MPHARM": ["PHARMACEUTICS", "PHARMACOLOGY", "INDUSTRIAL PHARMACY", "DOCTOR OF PHARMACY", "PHARMA ANALYSIS", "PHARMACEUTICAL REGULATORY AFFAIRS"],
          "BBA": ["MARKETING", "HUMAN RESOURCES", "ENTREPRENEURSHIP"]
        };
      
        // Check if the provided program key exists in the branches object
        if (branches.hasOwnProperty(programKey)) {
          this.setState({ branchOptions: branches[programKey] });
        } else {
          this.setState({ branchOptions: [] }); // No branches match the selected program
        }
      }
      
      // The rest of the component remains unchanged...
      
        


    updateYearOptions = (program) => {
        // Mapping the programs to the correct year options in Roman numerals
        const yearsByProgram = {
            "M.Tech": ["I year", "II year"],
            "BSc": ["I year", "II year", "III year"],
            "BBA": ["I year", "II year", "III year"],
            "M.Pharm": ["II year"],
            // Default to all years for programs not listed above
            "default": ["I year", "II year", "III year", "IV year"],
        };

        // Set the year options based on the selected program
        const newYearOptions = yearsByProgram[program] || yearsByProgram["default"];
        this.setState({ yearOptions: newYearOptions.map(year => year.toUpperCase()) });
    }

    fetchData = async () => {
        try {
          const db = getFirestore();
          let collectionRef = collection(db, "students");
    
          // Use a modified query logic for case-insensitive comparison
          const querySnapshot = await getDocs(collectionRef);
          const filteredData = querySnapshot.docs.map(doc => doc.data())
            .filter(doc => {
              const programMatch = this.state.selectedProgram === "default" || doc.program.toUpperCase() === this.state.selectedProgram;
              const branchMatch = this.state.selectedBranch === "default" || doc.s_branch.toUpperCase() === this.state.selectedBranch;
              const yearMatch = this.state.selectedYear === "default" || doc.s_year.toUpperCase() === this.state.selectedYear;
              return programMatch && branchMatch && yearMatch;
            });
    
        this.setState({ studentsData: filteredData, showCharts: true });
        } catch (error) {
          console.error("Error fetching data: ", error);
          this.setState({ successMessage: 'Failed to import data' });
        }
      }
    

    renderTable() {
        const { studentsData } = this.state;
        if (!studentsData.length) {
            return <p>No data available</p>;
        }

        return (
            <div className="table-container">
            <table >
                <thead>
                    <tr>
                        <th>StudentID</th>
                        <th>Student Course</th>
                        <th>Student Program</th>
                        <th>Student Branch</th>
                        <th>Year</th>
                        <th>Gender</th>
                        <th>Caste</th>
                    </tr>
                </thead>
                <tbody>
                {studentsData.map((student, index) => (
    <tr key={index}>
        <td>{student.s_id.toUpperCase()}</td>
        <td>{student.s_course.toUpperCase()}</td>
        <td>{student.program.toUpperCase()}</td>
        <td>{student.s_branch.toUpperCase()}</td>
        <td>{student.s_year.toUpperCase()}</td>
        <td>{student.s_gender.toUpperCase()}</td>
        <td>{student.Caste.toUpperCase()}</td>
    </tr>
))}
            </tbody>
            </table>
            </div>
        );
    }

    handlePrint = () => {
      window.print();
  };

    render() {
      const genderChartData = this.getGenderChartData();
      const casteChartData = this.getCasteChartData();
      const { showCharts } = this.state;
      const genderVsCasteChartData = this.getGenderVsCasteChartData();
      const chartCardClassName = showCharts ? "chart-card show-shadow" : "chart-card";
        return (
          <>
          <div className='std-sidebar'>
          <Sidebar />
          <div className='module-home'>
            <Scrolling/>
            <div className='std-main-container'>
          <div className='dropdown-container'>
            <select
              value={this.state.selectedProgram}
              onChange={this.handleProgramChange}
            >
              <option value="default">Select Program</option>
              {this.state.programOptions.map((program, index) => (
                <option key={index} value={program}>{program}</option>
              ))}
            </select>

            <select
              value={this.state.selectedBranch}
              onChange={this.handleBranchChange}
            >
              <option value="default">Select Branch</option>
              {this.state.branchOptions.map((branch, index) => (
                <option key={index} value={branch}>{branch}</option>
              ))}
            </select>

            <select
              value={this.state.selectedYear}
              onChange={this.handleYearChange}
            >
              <option value="default">Select Year</option>
              {this.state.yearOptions.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
          </div>
              {/* {this.renderTable()} */}

              {showCharts && (
              <div className="charts-flex-container">
              <div className={showCharts ? "chart-card show-shadow" : "chart-card"}>
              <h3 className="chart-title">Gender Distribution</h3>
            <ResponsiveContainer width="80%" height={300}>
              <PieChart>
                {/* Caste Pie Chart */}
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={115}
                  fill="#82ca9d"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {casteChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend align="right" verticalAlign="top" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
            
          </div>
        <div className={showCharts ? "chart-card show-shadow" : "chart-card"}>
        <h3 className="chart-title">Caste Distribution</h3>
            <ResponsiveContainer width="80%" height={300}>
              <PieChart>
                {/* Caste Pie Chart */}
                <Pie
                  data={casteChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={115}
                  fill="#82ca9d"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {casteChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend align="right" verticalAlign="top" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
            
          </div>

    <div className={chartCardClassName}>
      <h3 className="chart-title">Caste-wise Gender Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={genderVsCasteChartData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="caste" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Male" fill="#8884d8" />
          <Bar dataKey="Female" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="print-button-container">
                        <button onClick={this.handlePrint} className="print-button">
                            Print
                        </button>
                    </div>


            </div>

          
            
            )}
            </div>
          </div>
          </div>
            
          </>
        );
      }
      
}

export default Students;