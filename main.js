// main.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    GoogleAuthProvider, 
    OAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    setDoc,
    doc,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAkF_ZJQyzR1C8ZE0YIicm_hRYHjBWVthk",
  authDomain: "roomateapp-7603f.firebaseapp.com",
  projectId: "roomateapp-7603f",
  storageBucket: "roomateapp-7603f.firebasestorage.app",
  messagingSenderId: "534745322381",
  appId: "1:534745322381:web:5425d66a5c26ba534c63c4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// DOM elements
const googleSignInBtn = document.getElementById('googleSignInBtn');
const appleSignInBtn = document.getElementById('appleSignInBtn');
const emailBtn = document.getElementById("emailSignUpBtn");

const signInSection = document.getElementById('signInSection');
const successMessage = document.getElementById('successMessage');
const userInfo = document.getElementById('userInfo');
const loading = document.getElementById('loading');

let betaSelected = false;

const betaToggle = document.getElementById("toggleBetaTest");

betaToggle.addEventListener("click", () => {
    betaSelected = !betaSelected;
    betaToggle.classList.toggle("active");
});

// Google Sign In
googleSignInBtn.addEventListener('click', async () => {
    try {
        loading.style.display = 'block';
        googleSignInBtn.disabled = true;
        
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await handleSuccess(user);

    } catch (error) {
        console.error(error);
        alert('Error signing in');
        loading.style.display = 'none';
        googleSignInBtn.disabled = false;
    }
});

// Apple Sign In
appleSignInBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, appleProvider);
        await handleSuccess(result.user);
    } catch (error) {
        console.error('Apple sign in error:', error);
        alert('Apple sign-in failed');
    }
});


// ✉️ EMAIL + PASSWORD SIGNUP
emailBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Enter email and password");
        return;
    }

    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // ✅ checkmark animation
        emailBtn.classList.add("success");

        await handleSuccess(user);

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});


// Shared success handler (DRY)
async function handleSuccess(user) {
    await addToWaitlist(user);

    signInSection.style.display = 'none';
    successMessage.style.display = 'block';
    userInfo.style.display = 'block';

    document.getElementById('userAvatar').src =
        user.photoURL || 'https://via.placeholder.com/60';

    document.getElementById('userName').textContent =
        user.displayName || 'User';

    document.getElementById('userEmail').textContent =
        user.email;
}


async function addToWaitlist(user) {
    try {
        await setDoc(doc(db, 'waitlist', user.uid), {
            uid: user.uid,
            name: user.displayName || null,
            email: user.email,
            joinedAt: serverTimestamp(),
            status: 'pending',
            suggestions: document.getElementById("suggestions")?.value || "",
            beta: betaSelected
        });

        console.log('Added to waitlist');
    } catch (error) {
        console.error(error);
        throw error;
    }
}