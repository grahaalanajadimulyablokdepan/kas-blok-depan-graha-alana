const firebaseConfig = { apiKey: "API_KEY", authDomain: "PROJECT.firebaseapp.com", projectId: "PROJECT_ID", storageBucket: "PROJECT.appspot.com", messagingSenderId: "123456", appId: "APP_ID" }

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
