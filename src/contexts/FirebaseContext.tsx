import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    updateEmail,
    updatePassword,
    sendEmailVerification,
    deleteUser as deleteUserAccount,
    sendPasswordResetEmail,
    Auth,
    User,
    signInWithCredential,
    signInWithCustomToken,
    Persistence
} from 'firebase/auth';
import {
    collection,
    addDoc,
    doc,
    getDoc,
    query,
    getDocs,
    setDoc,
    serverTimestamp,
    deleteDoc,
    updateDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import LoginCard from '@/components/login';

// Initialize Firebase with the provided configuration
let firebaseApp: FirebaseApp;
let firebaseDb: Firestore;
let firebaseAuth: Auth;
let firebaseStorage: FirebaseStorage;

let fireBaseConf = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE || "{}");
try {
    firebaseApp = initializeApp(fireBaseConf, "[DEFAULT]")
    firebaseDb = getFirestore(firebaseApp)
} catch (error: any) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/duplicate-app/u.test(error.message)) {
        console.error('Firebase initialization error', error.stack)
    }
}

firebaseAuth = getAuth();
firebaseStorage = getStorage();

export interface FirebaseContext {
    firebase: FirebaseApp;
    user?: User;
    storage: FirebaseStorage;
    firestore: Firestore;
    auth: Auth;
}

const FirebaseContext = createContext<FirebaseContext>({} as FirebaseContext);
export default FirebaseContext;

export function useFirebase() {
    return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }: any) {
    const [authUser, setAuthUser] = useState<User | undefined>();
    const [authReady, setAuthReady] = useState<boolean>(false);

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    useEffect(() => {
        const unsubscribe = firebaseAuth.onAuthStateChanged((user: any) => {
            setAuthUser(user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // This ensures we don't show the login screen until the auth state is ready
        (async () => {
            await firebaseAuth.authStateReady();
            setAuthReady(true);
        })();
    }, [])

    const value: FirebaseContext = useMemo(() => {
        return { firebase: firebaseApp, user: authUser, storage: firebaseStorage, firestore: firebaseDb, auth: firebaseAuth }
    }, [authUser]);

    return (
        <FirebaseContext.Provider value={value}>
            {/* Render nothing if auth is not ready, then login if there is no user.
            If there is a user continue rendering the app */}
            {!authReady ? null : !authUser ? (
                <div className="flex justify-center items-center w-screen h-screen overflow-hidden fixed top-0 left-0">
                    <LoginCard />
                </div>
            ) : children}
        </FirebaseContext.Provider>
    );
}
