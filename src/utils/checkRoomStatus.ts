import {firebaseService} from "../services"

const checkRoomStatus = (roomKey, timeAfter) => {
    //중간에 서버가 죽었을 경우도 고려한 함수하나 만들어야 할듯 
    setTimeout(()=>{
        console.log("checkroomstatus", roomKey)
        firebaseService.changeRoomStatusToInactiveOrNot(roomKey)

    }, timeAfter)

}

export default checkRoomStatus