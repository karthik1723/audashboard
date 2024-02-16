import React, { Component } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import UserHeader from '../UserHeader';
import './index.css';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#00C49F', '#0088FE', /* more colors */];

const firebaseConfig = {
  // your firebase config
  apiKey: "AIzaSyC3mjvIXgowrzAntZfdwqgg0RNk6y4rwXk",
  authDomain: "major-745ad.firebaseapp.com",
  databaseURL: "https://major-745ad-default-rtdb.firebaseio.com",
  projectId: "major-745ad",
  storageBucket: "major-745ad.appspot.com",
  messagingSenderId: "460361188074",
  appId: "1:460361188074:web:cbe928a362bf723ad70d93",
  measurementId: "G-EZFP9MH10Q"
};

const handlePrint = () => {
  window.print();
};

// Initialize Firebase
initializeApp(firebaseConfig);
const firestore = getFirestore();

class ResearchGrants extends Component {
  state = {
    allData: [],
    filteredData: [],
    departments: [
      'IT', 
      'EEE',
      'Pharmacy', 
      'ECE', 
      'English',
      'Computer Science and Engineering', 
      'CE',
      'BM', 
      'Mathematics', 
      'Institution', 
      'MBA', 
      'Physics'
    ],
    selectedDepartment: '',
    showCharts: false,
    loading: false,
    message: ''
  };

  componentDidMount() {
    this.fetchResearchGrantsData();
  }

  fetchResearchGrantsData = async () => {
    this.setState({ loading: true });
    try {
      const collectionRef = collection(firestore, 'researchgrants');
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map(doc => doc.data());
      this.setState({
        allData: data
      });
      
    } catch (error) {
      console.error("Error fetching research grants data: ", error);
      this.setState({ message: 'Failed to import data' });
    }
    this.setState({ loading: false });
  };

  handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    this.setState({ selectedDepartment }, () => {
      this.filterDataByDepartment();
    });
  };
  

  filterDataByDepartment = () => {
    const filteredData = this.state.allData.filter(item => item.Department === this.state.selectedDepartment);
    this.setState({ filteredData, showCharts: filteredData.length > 0 });
  };

  getFundsPerInvestigator = () => {
    const { filteredData } = this.state;
    const fundsPerInvestigator = {};
  
    filteredData.forEach(grant => {
      const { Investigator, SanctionedAmount } = grant;
      fundsPerInvestigator[Investigator] = (fundsPerInvestigator[Investigator] || 0) + parseFloat(SanctionedAmount);
    });
  
    return Object.keys(fundsPerInvestigator).map(key => ({
      name: key,
      SanctionedAmount: fundsPerInvestigator[key]
    }));
  };

  getFundsPerAgency = () => {
    const { filteredData } = this.state;
    const fundsPerAgency = {};
  
    filteredData.forEach(grant => {
      const { FundingAgency, SanctionedAmount } = grant;
      fundsPerAgency[FundingAgency] = (fundsPerAgency[FundingAgency] || 0) + parseFloat(SanctionedAmount);
    });
  
    return Object.keys(fundsPerAgency).map(key => ({
      name: key,
      value: fundsPerAgency[key]
    }));
  };

  renderTable = () => {
    const { filteredData } = this.state;
    return (
      <div className="table-container">
      <table className="research-table">
        <thead>
          <tr>
            <th>Investigator</th>
            <th>Department</th>
            <th>Funding Agency</th>
            <th>Sanctioned Amount</th>
            <th>Year Of Sanction</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.Investigator}</td>
              <td>{item.Department}</td>
              <td>{item.FundingAgency}</td>
              <td>{item.SanctionedAmount}</td>
              <td>{item.YearOfSanction}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  };

  render() {
    const { showCharts, departments, selectedDepartment, loading, message } = this.state;
    return (
      <>
        <div className='module-home'>
        <UserHeader />
        <div className="dropdown-container">
          <select value={selectedDepartment} onChange={this.handleDepartmentChange} className="department-dropdown">
            <option value="">Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        {this.state.filteredData.length > 0 && this.renderTable()}
        {showCharts && (
        <div className="charts-container" style={{ display: 'flex', justifyContent: 'space-around', flexDirection:'column', alignItems:'center'}}>
          {/* Funds Per Investigator Chart */}
          <div className="chart-card" style={{ width: '50%' }}>
            <h3 style={{textAlign:'center'}}>Funds sanctioned to investigator</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={this.getFundsPerInvestigator()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="SanctionedAmount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Funds Per Agency Chart */}
          <div className="chart-card" style={{ width: '50%' }}>
          <h3 style={{textAlign:'center'}}>Funds sanctioned by agency</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={this.getFundsPerAgency()} cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label>
                  {this.getFundsPerAgency().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            
          </div>
          <div className='print-cont2'>
          <button onClick={handlePrint} className="print-button">
        Print
      </button>
          </div>
        </div>
        
        )}
        </div>
      </>
    );
  }
}

export default ResearchGrants;
