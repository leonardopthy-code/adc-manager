import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBkGkO2wa3FjRyrARHskX3Do1lvMB64KgM",
  authDomain: "adc-manager-v2.firebaseapp.com",
  projectId: "adc-manager-v2",
  storageBucket: "adc-manager-v2.firebasestorage.app",
  messagingSenderId: "801603130758",
  appId: "1:801603130758:web:70271292df2bd8791f0807",
};

const app = initializeApp(firebaseConfig);

export default app;