import { prop, arrayProp, getModelForClass, Ref, index  } from '@typegoose/typegoose';
//import * as mongoose from 'mongoose';
import {User} from './User';

@index({ location: '2dsphere' })
class Loc {
  @prop({required: true, enum: ['Point', 'LineString', 'Polygon'], default: 'Point'})
  public type!: string
  @arrayProp({ items: Number })
  coordinates: [number]
}

//@prop({ enum: Gender, type: String })
// @prop({ required: true, enum: 'Car' | 'Shop' })

class Match {
  public _id
  @prop({required: true})
  userid!: string
  @prop({type: Date})
  createdAt: string
  
}

class s3Photo {
  @prop({required: true})
  key!: string
  @prop({required: true})
  url!: string

}

class BeLiked {
  @prop({default: null})
  userId!: Ref<User>;
  @prop({default: true})
  lock!: boolean;
  
  
}

class Tag {
  @prop()
  name: string
  @prop()
  public active!: boolean;
  @prop()
  public defaultTag: boolean
}

class Settings {
  @prop()
  public getHitchNotiOn: boolean
  @prop()
  public HitchSuccessNotiOn: boolean
  @prop()
  public threeRemainNotiOn: boolean
  @prop()
  public talkRoomCreatedNotiOn: boolean
  @prop()
  public getNewMessageNotiOn: boolean
  @prop()
  public eventNotiOn: boolean
}

class GivePoint {
  @prop()
  public firstPoint: boolean
  @prop()
  public myPicturePoint: boolean
  @prop()
  public crewPicturePoint: boolean
  @prop()
  public placeStrPoint: boolean
  @prop()
  public shortbioPoint: boolean
  @prop({type: Date})
  public lastWent: string
 

}


class DeletedUser{

  public _id
  @prop({ required: true})
  public uid!: string;
  @prop({required: true})
  public phonenumber!: string;
  @prop({required: true})
  public nickname!: string;
  @prop({default: null})
  public fcmToken: string;
  @prop({default: null})
  public myOs: string;
  @prop({default: null})
  public birthdate: Date;
  @prop({required:true})
  public gender!: boolean;
  @prop({required:true, default: 0})
  public point!: number;
  @prop({required:true})
  public profilephoto!: [s3Photo]
  @prop({default: null})
  public shortbio!: string
  @prop({default: null})
  public placestr!: string
  @prop({default: null})
  public currentRoomName!: string
  @arrayProp({ items: Tag, default:[{name: "모두 싱글",active: false, defaultTag: true}, {name: "재밌어요",active: false, defaultTag: true}, {name: "활발해요",active: false, defaultTag: true}, {name: "대화를 잘해요",active: false, defaultTag: true}, {name: "이야기를 잘 들어줘요",active: false, defaultTag: true}, {name: "솔직해요",active: false, defaultTag: true}, {name: "예뻐요",active: false, defaultTag: true}, {name: "잘 생겼어요",active: false, defaultTag: true}, {name: "피부가 좋아요",active: false, defaultTag: true}, {name: "웃음이 많아요",active: false, defaultTag: true}, {name: "매너가 좋아요",active: false, defaultTag: true}, {name: "담배 안펴요",active: false, defaultTag: true}, {name: "술 안마셔요",active: false, defaultTag: true}, {name: "패션센스",active: false, defaultTag: true}, {name: "고기를 잘 구워요",active: false, defaultTag: true}]  })
  public oneWordTags!: [Tag] 
  @arrayProp({ items: Tag, default:[{name: "운동",active: false, defaultTag: true}, {name: "노래 부르기",active: false, defaultTag: true}, {name: "악기 연주",active: false, defaultTag: true}, {name: "다같이 게임하기",active: false, defaultTag: true}, {name: "감성 카페 찾기",active: false, defaultTag: true}, {name: "카페에서 수다",active: false, defaultTag: true}, {name: "쇼핑",active: false, defaultTag: true}, {name: "영화 보기",active: false, defaultTag: true}, {name: "드라마 보기",active: false, defaultTag: true}, {name: "웹툰 보기",active: false, defaultTag: true}, {name: "파티하기",active: false, defaultTag: true}, {name: "드라이브",active: false, defaultTag: true}, {name: "덕질",active: false, defaultTag: true}, {name: "인스타 맛집탐방",active: false, defaultTag: true}, {name: "독서",active: false, defaultTag: true}, {name: "반려동물",active: false, defaultTag: true}, {name: "공연관람",active: false, defaultTag: true}, {name: "여행",active: false, defaultTag: true}, {name: "한강에서 치맥",active: false, defaultTag: true}] })
  public likeTags!: [Tag]
  @arrayProp({ itemsRef: User, default: [] })
  public like!: [Ref<User>]
  @arrayProp({ items: BeLiked, default: [] })
  public beliked!: [BeLiked]
  @arrayProp({ itemsRef: User, default: [] })
  public unlike!: [Ref<User>]
  @arrayProp({ itemsRef: User, default: [] })
  public beunliked!: [Ref<User>]
  @prop({default: []})
  public groupphoto!: [s3Photo]
  @prop({default: null})
  public school!: string
  @prop({default: null})
  public schoolloc! : Loc
  @prop({default: {type: "Point", coordinates: [126.584063, 37.335887]}})
  public loc! : Loc
  @prop({default: null})
  public locStr! : string
  @arrayProp({ items: Match, default: []})
  public matches!: [Match]
  @prop({default: {getHitchNotiOn: true, HitchSuccessNotiOn: true, threeRemainNotiOn: true, talkRoomCreatedNotiOn: true, getNewMessageNotiOn: true, eventNotiOn: true}})
  public settings!: Settings
  @prop({default: {firstPoint: false, myPicturePoint: false, crewPicturePoint: false, placeStrPoint: false, shortbioPoint: false, lastWent: null}})
  public givePoint!: GivePoint
  @prop({type: Date})
  createdAt: string
  @prop({type: Date})
  updatedAt: string

   
  

}

const DeletedUserModel = getModelForClass(DeletedUser, { schemaOptions: { timestamps: true } });

export {
  DeletedUser,
  DeletedUserModel

}
