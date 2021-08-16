import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDlCUHam_CoXJ3RTlsxKtcKaSO64RnkQDI",
    authDomain: "instagram-clone-react-d2e67.firebaseapp.com",
    projectId: "instagram-clone-react-d2e67",
    storageBucket: "instagram-clone-react-d2e67.appspot.com",
    messagingSenderId: "98205402744",
    appId: "1:98205402744:web:1d91e78e0ed994f0eecf8d",
    measurementId: "G-EXEJ2CKP3K"
});

const database = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { database, auth, storage };
export default firebase;