import {
    doc,
    collection,
    setDoc,
    addDoc,
    getDoc,
    serverTimestamp,
    updateDoc,
    getDocs,
    deleteDoc,
    increment,
} from "firebase/firestore";
import { db } from "../firebase.js";

export async function initialiseFirebaseSessionRecord(projectId) {
    const session = {
        projectId,
        createdAt: serverTimestamp(),
        endedAt: null,
        status: "ongoing",
    };

    const docRef = await addDoc(collection(db, "projects", projectId, "sessions"), session);

    return docRef.id;
}

export async function writeTranscriptToFirebase(projectId, sessionId, data) {
    const sessionRef = collection(db, "projects", projectId, "sessions", sessionId, "transcript");

    const transciptDoc = addDoc(sessionRef, {
        content: data.content,
        role: data.role,
        createdAt: serverTimestamp(),
    });

    return true;
}

export async function writeSessionCloseToFirebase(projectId, sessionId) {
    const sessionRef = doc(db, "projects", projectId, "sessions", sessionId);

    const sessionSnap = await getDoc(sessionRef);
    if (!sessionSnap.exists()) {
        console.log("No such session!");
        return false;
    }

    const sessionData = sessionSnap.data();

    const now = new Date();
    const durationLength = now.getTime() - sessionData.createdAt.toMillis();

    await updateDoc(sessionRef, {
        endedAt: serverTimestamp(),
        status: "ended",
        durationLength: durationLength/1000,
    });

    await updateDoc(doc(db, "projects", projectId), {
        totalMonthlySecondsUsed: increment(durationLength),
    });
    
    return true;
}
