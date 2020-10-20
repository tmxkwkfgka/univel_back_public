
var moment = require('moment');
const admin = require('firebase-admin');

export default class FirebaseService {
 

  //messageRef = firestore().collection('');
  constructor(db){
    this.db = db;
    this.roomRef = this.db.collection('rooms')
  }
  
  //chatRef = firestore().collection('chat');


  async createRoom(myBriefInfo, yourBriefInfo){
    // number
    // userids [num]
    // active
    // lastmsg
    // lasttime
    // createdAt
    // updatedAt

    // this.roomRef.add({
    //   number: 1,
    //   userids: [userid],
    //   active: true,
    // })
    console.log('in createroom ', myBriefInfo, yourBriefInfo)
    let now = new Date();
    let waitingAt = moment(now).add(24,'hours').toDate()
    let newRoomRef = await this.roomRef.add({
      number: 2,
      fullnumber: 3,
      userIds: [myBriefInfo._id, yourBriefInfo._id],
      firstIds: [myBriefInfo],
      secondIds: [yourBriefInfo],
      firstGender: myBriefInfo.gender,
      secondGender: yourBriefInfo.gender,
      status: "ready",
      lastmsg: null,
      lasttime: now,
      createdAt: now,
      updatedAt: now ,
      waitingAt: waitingAt
    
    
    })
    console.log("newRoom = ", newRoomRef.id)
    return {
       roomKey: newRoomRef.id,
       waitingAt: waitingAt

    }
  }

 

 async changeRoomStatusToInactiveOrNot(roomKey){
   let roomDocRef = this.roomRef.doc(roomKey)
   let roomDoc = await roomDocRef.get()
   if(roomDoc.exists){
    if(roomDoc.data().status == "active"){
      let updateResult = await roomDocRef.update({status: "inactive"})
    }
   }else{
    console.log("changeRoomStatusToInactiveOrNot: no room mapped with roomKey")
   }

 }

 async changeRoomsStatus(roomKeys, currentStatus, afterStatus){

  try{
    let updateResults = await Promse.all(roomKeys.map((roomKey)=>this.roomRef.doc(roomKey).update({status: afterStatus})))
    console.log("changeroom Status update results = ", updateResults)
    return {
      ok: true,
      error: false,
      results: updateResults
    }

  }catch(err){
    return {
      ok: false,
      error: err,
      results: null
    }

  }
  
 }

 async extendRoomReady(roomKey, extendTime, changeStatus, plusAtNow){

  try{
    let roomDocRef = this.roomRef.doc(roomKey)
    let roomDoc = await roomDocRef.get()
    if(roomDoc.exists){

      if(changeStatus){
        let now = new Date()
        let newWaitingAt = moment(now).add(extendTime, 'minutes').toDate()
        let updateResult = await roomDocRef.update({status: "ready", waitingAt: admin.firestore.Timestamp.fromDate(newWaitingAt)})
        console.log("roomdoc extendready result changestatus = ", updateResult)
        return {
          ok: true,
          error: null,
          waitingAt: newWaitingAt
        }


      }else{

        let newWaitingAt;
        if(plusAtNow){
          newWaitingAt = moment(new Date()).add(extendTime, 'minutes').toDate()
        }else{
          newWaitingAt = moment(roomDoc.data().waitingAt.toDate()).add(extendTime, 'minutes').toDate()
        }
        if(!newWaitingAt){
          return {
            ok: false,
            error: "invalid waitingat"
          }
        }
         
        let updateResult = await roomDocRef.update({waitingAt: admin.firestore.Timestamp.fromDate(newWaitingAt)})
        console.log("roomdoc extendready result = ", updateResult)
        //  roomdoc extendready result =  WriteResult {
        //   _writeTime: Timestamp { _seconds: 1576920113, _nanoseconds: 539351000 } }
        return {
          ok: true,
          error: null,
          waitingAt: newWaitingAt
        }
       

      }

      



    }else{
      return {
        ok: false,
        error: "no room for roomKey"
      }
    }

  }catch(err){
    return {
      ok: false,
      error: err
    }

  }
  

 }

 async changeRoomPhoto(userId, newUrl){
   console.log("userid and newurl", userId, newUrl)

  try{
    let promises = [];

    const query = this.roomRef.where('userIds', 'array-contains', userId)

    let rooms = await query.get();
    console.log("change photo rooms = ", rooms)

    rooms.forEach((documentSnapshot) => {
     
        let room = documentSnapshot.data();
        console.log("changephoto  room doc = ", room)
        let firstMatch = false;
        let firstIds = room.firstIds.map((v)=>{
          if(v._id == userId){
            firstMatch = true;

            return {...v, profilephoto: newUrl}
          }
          return v;

        })
        if(firstMatch){
          promises.push(this.roomRef.doc(documentSnapshot.id).update({
            firstIds : firstIds,
            lastEvent: 0
          }));

        }else{
          promises.push(this.roomRef.doc(documentSnapshot.id).update({
            secondIds : room.secondIds.map((v)=>{
              if(v._id == userId){
                return {...v, profilephoto: newUrl}
              }
              return v;
            }),
            lastEvent: 0
          }));
        }
    });

    let allRes = await Promise.all(promises);
    return allRes;
    

  }catch(err){
    console.log("fb changeroomphoto error = ", err)
    return null;

  }


    






 }

 async addMemberToRoom(userId, nickname, profilephoto, mygender, roomKey, group){

    
  try{

    if(!(userId && roomKey && group)){
      //한가지 값이라도 유효하지 않은경우 
      return {
        ok: false,
        error: "one or more values are invalid"
      }
    }

    // 중복초대 방지
    let previousRoom = await this.roomRef.doc(roomKey).get();
    console.log("addmemtoRoom userids = ", previousRoom.data().userIds)
    if(previousRoom.data().userIds.includes(userId)){
      console.log("before already return invite")
      return {
        ok: false,
        error: "Already invited member",
        
      } 

    }

    let willUpdateFields = {}
    if(group == "first"){
      if(previousRoom.data().firstIds.length > 2){
        //방에 3명이상의 인원이 꽉 찼을 경우
        return {
          ok: false,
          error: "Already full",
         
        }

      }
      if((previousRoom.data().firstGender===true || previousRoom.data().firstGender===false)  && previousRoom.data().firstGender !== mygender ){
        // 성별이 다름 
        return {
          ok: false,
          error: "different gender"
        }
      }
      willUpdateFields = {
        userIds: admin.firestore.FieldValue.arrayUnion(userId),
        number: admin.firestore.FieldValue.increment(1),
        firstIds: admin.firestore.FieldValue.arrayUnion({
          _id: userId,
          nickname,
          profilephoto
        })
      }
    }else if(group == "second"){

      if(previousRoom.data().secondIds.length > 2){
        //방에 3명이상의 인원이 꽉 찼을 경우
        return {
          ok: false,
          error: "Already full"
        }

      }
      if((previousRoom.data().secondGender === true || previousRoom.data().secondGender === false) && previousRoom.data().secondGender !== mygender ){
        // 성별이 다름 
        return {
          ok: false,
          error: "different gender"
        }
      }
      willUpdateFields = {
        userIds:  admin.firestore.FieldValue.arrayUnion(userId),
        number: admin.firestore.FieldValue.increment(1),
        secondIds: admin.firestore.FieldValue.arrayUnion({
          _id: userId,
          nickname,
          profilephoto
        })
      }
    }else{
      return {
        ok: false,
        error: "not valid group name"
      }
    }
    
    const result = await this.roomRef.doc(roomKey).update(willUpdateFields)
  
    let room = await this.roomRef.doc(roomKey).get();
    //room.firstIds가 없을수도 있음 에러남
      //초대된 사람수가 full이면 active시키고 방 만듬
    console.log("초대된 인원 length = ", room.data().firstIds.length, room.data().secondIds.length)
    if((room.data().firstIds.length >= room.data().fullnumber) && (room.data().secondIds.length >= room.data().fullnumber)){
      await this.roomRef.doc(roomKey).update({
        status: "active",
        lasttime: new Date()      
      })
      return {
        ok: true,
        error: false,
        changeActive: true,
        userIds: room.data().userIds,
        
      }
    }else{
      return {
        ok: true,
        error: false,
        changeActive: false
      }

    }
    

  }catch(err){
    console.log("addMemberToRoom", err)
    return {
      ok: false,
      error: err
    }

  }
}


  // async addMemberToRoom(userId, roomKey){

  //   try{
  //     const result = await this.roomRef.doc(roomKey).update({
  //       userids:  firebase.firestore.FieldValue.arrayUnion(userId),
  //       number: firebase.firestore.FieldValue.increment(1)
  //     })
  //     //초대된 사람수가 full이면 active시키고 방 만듬
  //     let room = this.roomRef.doc(roomKey).get();
  //     if(room.userids.length >= room.fullnumber){
  //       await this.roomRef.doc(roomKey).update({
  //         active: true       
  //       })
  //     }
  //     return {
  //       ok: true,
  //       error: false
  //     }

  //   }catch(err){
  //     return {
  //       ok: false,
  //       error: err
  //     }

  //   }
  // }

  // async fetchRooms(userId, active){
  //   console.log("in fetchrooms userid = ", userId, active)
    
  //   const query = this.roomRef.where('active', '==', active).where('userids', 'array-contains', userId)

  //   let rooms = await query.get()
  //   console.log("in fetch rooms rooms = ", rooms.docs)
  //   return rooms.docs.map((documentSnapshot) => {
  //     return {
  //       ...documentSnapshot.data(),
  //       key: documentSnapshot.id, // required for FlatList
  //     };
  //   });

  // }



  // async fetchRooms(){
  //   const querySnapshot = await firestore()
  //   .collection('rooms')
  //   .get();

  //   const rooms = querySnapshot.docs.map((documentSnapshot) => {
  //     return {
  //       ...documentSnapshot.data(),
  //       key: documentSnapshot.id, // required for FlatList
  //     };
  //   });
    
  //   //console.warn(querySnapshot.docs)
  //   console.warn(rooms)
  //   return rooms;

  // }

  // async fetchMessages(roomId){
    
  //   let messagesRef = this.roomRef.doc(roomId).collection("messages")
  //   let messages = await messagesRef.orderBy('createdAt', 'desc').get()
  //   console.warn("in firebase service fetch messages")
  //   console.warn(messages)
   
  //   return messages.docs.map((documentSnapshot) => {
  //     return {
  //       ...documentSnapshot.data(),
  //       key: documentSnapshot.id, // required for FlatList
  //     }
   
  //   });

  // }

  // async saveMsg(uid, roomId, messages){
  //   console.warn("insaveMsg =  " + roomId)
  //   let messagesRef = this.roomRef.doc(roomId).collection("messages")
  //   let pushedArr = messages.map((msg)=>{
  //     return {
  //       roomId: roomId,
  //       createdAt: new Date(),
  //       userUid: uid,
  //       text: msg.text
  //     }
  //   })

  //   pushedArr.forEach((data)=>{
  //     messagesRef.add(data)
  //   })
    

    

  //}

  // async signIn () {
  //   try {
  //     const response = await this.auth.signInAnonymously()
  //     return { user: response.user }
  //   } catch (error) {
  //     return { error }
  //   }
  // }

  // async fetchMessages () {
  //   const messages = await this.messageRef
  //     .orderBy('created_at', 'desc')
  //     .limit(10)
  //     .get()

  //   return messages.docs
  // }

  // async createMessage ({ message, uid }) {
  //   await this.messageRef.add({
  //     message,
  //     user_id: uid,
  //     created_at: new Date()
  //   })
  // }


}
