import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';

export const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setData(docs);
    setLoading(false);
  };

  const addData = async (newData) => {
    await addDoc(collection(db, collectionName), newData);
    getData(); // Refresh data
  };

  const updateData = async (id, updatedData) => {
    await updateDoc(doc(db, collectionName, id), updatedData);
    getData(); // Refresh data
  };

  useEffect(() => { getData(); }, []);

  return { data, loading, addData, updateData };
};