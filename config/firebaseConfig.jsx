
// import { initializeApp } from "firebase/app";
// import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import { getFirestore } from "firebase/firestore";
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBzPGDam5f2bVnwA26sK0TUE2cmGjs_yEo",
//   authDomain: "projects2025-dce63.firebaseapp.com",
//   projectId: "projects2025-dce63",
//   storageBucket: "projects2025-dce63.firebasestorage.app",
//   messagingSenderId: "129633716370",
//   appId: "1:129633716370:web:2b9692e73ed9313e87fe4b",
//   measurementId: "G-PMYJCQWT2T"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Auth with persistence
// let auth;
// try {
//   // For React Native environments
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//   });
// } catch (error) {
//   // Fallback for non-React Native environments (web)
//   console.log("Using regular auth initialization due to error:", error);
//   auth = getAuth(app);
// }

// // Initialize Firestore
// const db = getFirestore(app);

// // Export the Firebase services
// export { auth, db };


// version - 2
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzPGDam5f2bVnwA26sK0TUE2cmGjs_yEo",
  authDomain: "projects2025-dce63.firebaseapp.com",
  projectId: "projects2025-dce63",
  storageBucket: "projects2025-dce63.firebasestorage.app",
  messagingSenderId: "129633716370",
  appId: "1:129633716370:web:2b9692e73ed9313e87fe4b",
  measurementId: "G-PMYJCQWT2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
try {
  // For React Native environments
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  console.log("Firebase Auth initialized with React Native persistence");
} catch (error) {
  // Fallback for non-React Native environments (web)
  console.log("Using regular auth initialization due to error:", error);
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

// Enable offline persistence for Firestore when possible
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore persistence enabled");
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.log("Multiple tabs open, persistence can only be enabled in one tab at a time");
      } else if (err.code === 'unimplemented') {
        console.log("The current browser doesn't support all features required for Firestore persistence");
      }
    });
} catch (error) {
  console.log("Error enabling Firestore persistence:", error);
}

// Export the Firebase services
export { auth, db };

