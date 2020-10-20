const admin = require('firebase-admin');
const serviceAccount = require('../../univel-36890-firebase-adminsdk-ki899-218e2d462e.json');
import FirebaseService from './FirebaseService'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();



const firebaseService = new FirebaseService(db)


export {
  firebaseService
 
}
