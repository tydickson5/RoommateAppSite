// main.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    setDoc,
    doc,
    query, 
    onSnapshot,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAkF_ZJQyzR1C8ZE0YIicm_hRYHjBWVthk",
  authDomain: "roomateapp-7603f.firebaseapp.com",
  projectId: "roomateapp-7603f",
  storageBucket: "roomateapp-7603f.firebasestorage.app",
  messagingSenderId: "534745322381",
  appId: "1:534745322381:web:5425d66a5c26ba534c63c4",
  measurementId: "G-76V7T7TVWM"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// DOM elements
const googleSignInBtn = document.getElementById('googleSignInBtn');
const signInSection = document.getElementById('signInSection');
const successMessage = document.getElementById('successMessage');
const userInfo = document.getElementById('userInfo');
const loading = document.getElementById('loading');
const counterElement = document.getElementById('counter');

// Google Sign In
googleSignInBtn.addEventListener('click', async () => {
    try {
        loading.style.display = 'block';
        googleSignInBtn.disabled = true;
        
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        console.log('User signed in:', user);
        
        // Add to waitlist
        await addToWaitlist(user);
        
        // Show success
        signInSection.style.display = 'none';
        successMessage.style.display = 'block';
        userInfo.style.display = 'block';
        
        // Display user info
        document.getElementById('userAvatar').src = user.photoURL || 'https://via.placeholder.com/60';
        document.getElementById('userName').textContent = user.displayName || 'User';
        document.getElementById('userEmail').textContent = user.email;
        
    } catch (error) {
        console.error('Error signing in:', error);
        alert('Error signing in. Please try again.');
        loading.style.display = 'none';
        googleSignInBtn.disabled = false;
    }
});

appleSignInBtn.addEventListener('click', async () => {

    try {
        const result = await signInWithPopup(auth, appleProvider);
        await addToWaitlist(result.user);
    } catch (error) {
        console.error('Apple sign in error:', error);
    }
});


// Add user to waitlist
async function addToWaitlist(user) {
    try {
        // Add to waitlist collection with user ID as document ID
        await setDoc(doc(db, 'waitlist', user.uid), {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            joinedAt: serverTimestamp(),
            status: 'pending'
        });
        
        console.log('Added to waitlist');
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        throw error;
    }
}
