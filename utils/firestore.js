
import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const addProject = async (title, date, owner, imageUrl) => {
  try {
    const projectsCollection = collection(db, 'project1');
    const docRef = await addDoc(projectsCollection, {
      title,
      date,
      owner,
      imageUrl,
    });
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const projectsCollection = collection(db, 'project1');
    const snapshot = await getDocs(projectsCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};
