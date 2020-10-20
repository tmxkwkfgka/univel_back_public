const schedule = require('node-schedule');
const admin = require('firebase-admin');
const moment = require('moment')
const serviceAccount = require('../univel-36890-firebase-adminsdk-ki899-218e2d462e.json');
const { request }  = require('graphql-request');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const roomRef = db.collection('rooms')




const endpoint = 'http://localhost:4000/graphql';
const getUsersFcmMutation = 
`
    mutation GetUsersFcm(
        $userIds: [String]!
    ){
      GetUsersFcm(
            userIds: $userIds
        ){
            ok
            error
            fcms
            oss
            getNewMessageNotiOns
            currentRoomNames
            isLoggedIns
        }

    }
 `
// const res = await request(endpoint, addRxMutation, obj);
// console.log("res=",res)
// if(res.AddRx.ok){
//     console.log("message is successfully saved in db", res.ok)
// }else{
//     console.log("error! message is not saved in db", )
// }

const chatListenExe = () =>{
  roomRef.onSnapshot(async (docSnapshot) => {

    try{
  
      if (docSnapshot) {
        console.log("just doc snapshot")
        //console.log(docSnapshot)
      
      
        //console.log("docchanges = ", docSnapshot.docChanges())
        docSnapshot.docChanges().forEach(async function(change, index) {
        console.log("chages = ", change)
        let docData = change.doc.data();
        let roomKey = change.doc.id;
        if (change.type === "added") {
          console.log("New : ", change.doc.data());
      
          //docs.push({ ...docData, key: change.doc.id })
      
        } else if (change.type === "modified") {
          console.log("메시지 리슨 처리")
       
        
      
          if(docData.lastEvent == 1){
            let roomTitle = "";
            for(let i=0; i<docData.fullnumber; i++){
              roomTitle += docData.firstIds[i]? docData.firstIds[i].nickname + "," : "";
              roomTitle += docData.secondIds[i]? docData.secondIds[i].nickname + "," : "";
              if(roomTitle.length > 15){
                roomTitle = roomTitle.slice(0, 16) + "...";
                break;
              }
              
            }
      
            const currnetPushTitle = "새로운 메시지가 왔어요.";
            //const currnetContent = docData.lastmsg;
            const userIds = docData.userIds;
            
            let lastId = null;
            let hasSame = false;
            //let youFcmResponse = await sendFcm("data", currnetPushTitle, currnetContent, "message", [you.fcmToken])
            const variables = {
              userIds: userIds
            }
            const res = await request(endpoint, getUsersFcmMutation, variables);   
            if(res.GetUsersFcm.ok){
              console.log("users fcm ok!");
             
              const {fcms, oss, getNewMessageNotiOns, currentRoomNames, isLoggedIns} = res.GetUsersFcm;
              let promises = [];
              //console.log("fcms oss", fcms, oss)
              for(let i =0; i<fcms.length; i++){
                if(getNewMessageNotiOns[i] === true && currentRoomNames[i] != roomTitle && isLoggedIns[i] === true){
                  const type = (oss && oss[i] && oss[i] == "android")? "data" : "notification";
                  promises.push(sendFcm(type, currnetPushTitle, roomTitle + "방에 새 메시지가 있습니다.", "message", [fcms[i]]))
                }else{
                  console.log("필터에 걸림", getNewMessageNotiOns[i], roomTitle)
                }
              
              }
      
              let result = await Promise.all(promises);
              console.log("send fcm result = ", result)
      
      
            }else{
              console.log("users fcm fail!");
      
            }  
           
          }
          //docs = docs.map((room) => (room.key == change.doc.id) ? { ...docData, key: change.doc.id } : room)
        
      
      
        } else if (change.type === "removed") {
          //docs.filter((room) => room.key !== change.doc.id)
         
      
        }
      
      
       })
      
      
      } else {
        //docsnapshot이 널인경우가 있음 message가면 중복으로 docsnapshot 두번실행되고 두번쨰 널로 나옴
        console.log('when null docsnapshot', docSnapshot)
      }
      
    }catch(inerr){
      console.log('error: snapshot 처리 에러', inerr)
      
    }
  
  
  
  
  
  
  }, (error) => {
    console.log("onsnapshot err", error)
    chatListenExe();
  })

}



const sendFcm = async (type, title, body, screen, tokens) => {
  let payload = null
  let options = null
  if(type == "notification" && tokens.length == 1 && tokens[0] ){
      options = {
          priority: 'high',
          
        };
  
       payload = {
          notification: {
             
              title: title,
              body: body,
              data: body,
              mesage: body,
              screen: screen
  
          }
      }
      return await admin.messaging().sendToDevice(tokens[0], payload, options)

  }else if(type == "data" && tokens.length == 1 && tokens[0]){
      // payload = {                
      //     data: {
      //         type: type,
      //         title: title,
      //         body: body,
      //         screen: screen
              
      //     },
      //     token: tokens[0],
       
      // };

      // return await admin.messaging().send(payload)
      options = {
          priority: 'high',
          
        };
  
       payload = {
          data: {
              
              title: title,
              body: body,
              data: body,
              mesage: body,
              screen: screen
  
          }
      }
      return await admin.messaging().sendToDevice(tokens[0], payload, options)
  }else if(type == "multiData" && tokens.length > 0 && tokens[0]){
      payload = {
          data: {
            type, title, body, screen
          },
          tokens: tokens
      }
      return await admin.messaging().sendMulticast(payload)
      //response.successCount + ' messages were sent successfully'

  }else{
      return null
  }
 
 

  //console.log("fcmResponse=", fcmResponse);

};


chatListenExe();

var j = schedule.scheduleJob('42 * * * *', function(){
  console.log('The answer to life, the universe, and everything!', new Date());
});