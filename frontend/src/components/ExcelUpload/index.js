import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc, query, getDocs, where, deleteDoc } from 'firebase/firestore';
import AdminHeader from '../AdminHeader';
import './index.css'

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


const ExcelUpload = () => {
  const [file, setFile] = useState(null); // Single state for file
  const [message, setMessage] = useState('');

  const deleteCollectionData = async (collectionName) => {
    const collectionRef = collection(firestore, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update file state
    setMessage('');
  };

  const getFileName = (file) => {
    return file.name.split('.').slice(0, -1).join('.');
  };

  const updateData = async (collectionName, data) => {
    const collectionRef = collection(firestore, collectionName);
    for (const row of data) {
      const docRef = doc(collectionRef);
      await setDoc(docRef, row);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first!');
      return;
    }

    try {
      const collectionName = getFileName(file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        await deleteCollectionData(collectionName);

        await updateData(collectionName, data);
        setMessage(`Data uploaded successfully to collection: ${collectionName}`);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      setMessage('Error processing data: ' + error.message);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className='uploadfiles'>
          
      <div className="excel-upload-container">
      <div className="file-input">
        <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
        </div>
        <button className="upload-btn" onClick={handleUpload}>Upload File</button>
        {message && <p className="message">{message}</p>}
      </div>
      </div>
    </>
  );
};

export default ExcelUpload;
