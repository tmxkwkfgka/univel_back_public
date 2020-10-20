export const typeDefs = ["type SendEmailResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype Mutation {\n  SendEmail(from: String!, to: String!, subject: String!, body: String!): SendEmailResponse!\n  AddMemberToRoom(inviteRoomId: String!, inviteRoomGroup: String!): AddMemberToRoomResponse!\n  ExtendRoomReady(roomKey: String!, point: Int!, extendTime: Int!, changeStatus: Boolean!, plusAtNow: Boolean): ExtendRoomReadyResponse!\n  GetUsersFcm(userIds: [String]!): GetUsersFcmResponse!\n  IsAlive: IsAliveResponse!\n  RoomStatusChange(roomKeys: [String]!, currentStatus: RoomStatusOptions!, afterStatus: RoomStatusOptions!): RoomStatusChangeResponse!\n  AddPhotoUrl(key: String!, url: String!, kind: String!): AddPhotoUrlResponse!\n  AddPhotoUrls(photoUrls: [PhotoUrlInput!]!): AddPhotoUrlResponse!\n  AddTag(tagKind: String!, inputTags: [String!]!): AddTagResponse!\n  ChangeTagActive(inputTags: [ChangeActiveTagInput!]!, tagKind: String!): ChangeTagActiveResponse!\n  CheckNick(nickName: String!): CheckNickResponse!\n  ClickMatch(yourid: ID!, fromHitch: Boolean): ClickMatchResponse!\n  ClickUnmatch(yourid: ID!, delBelike: Boolean!, fromHitch: Boolean): ClickMatchResponse!\n  DeleteUser: DeleteUserResponse!\n  DelPhotoUrl(key: String!, url: String!, kind: String!): DelPhotoUrlResponse!\n  DelTag(tagKind: String!, inputTags: [String!]!): DelTagResponse!\n  EditPhotoUrl(previousKey: String!, newKey: String!, newUrl: String!, kind: String!): EditPhotoUrlResponse!\n  EditUser(shortbio: String!): EditUserResponse!\n  GetServerTime: GetServerTimeResponse!\n  IsValidToken: IsValidTokenResponse!\n  RechargePoint(point: Int!): RechargePointResponse!\n  StartPhoneVerification(phoneNumber: String!): StartPhoneVerificationResponse!\n  TestSendFcm(type: String!, title: String!, body: String!, screen: String): TestSendFcmResponse!\n  UnlockProfile(targetId: String!, point: Int!): UnlockProfileResponse!\n  UpdateMyLoc(lat: Float!, lng: Float!, locStr: String): UpdateMyLocResponse!\n  UpdateMyProfile(_id: ID!, lat: Float, lng: Float): UpdateMyProfileResponse!\n  UpdateUser(shortbio: String, school: String, placestr: String, fcmToken: String, myOs: String, settings: SettingsInput, givePoint: GivePointInput, point: Int, currentRoomName: String, isLoggedIn: Boolean): UpdateUserResponse!\n  UserSignIn(phonenumber: String!): UserSignInResponse!\n  UserSignUp(phonenumber: String!, nickname: String!, uid: String!, gender: Boolean!, point: Int!, birthdate: Date): UserSignUpResponse!\n}\n\ntype AddMemberToRoomResponse {\n  ok: Boolean!\n  error: String\n  changeActive: Boolean\n}\n\ntype ExtendRoomReadyResponse {\n  ok: Boolean!\n  error: String\n  waitingAt: Date\n  currentPoint: Int\n}\n\ntype GetUsersFcmResponse {\n  ok: Boolean!\n  error: String\n  fcms: [String]\n  oss: [String]\n  getNewMessageNotiOns: [Boolean]\n  currentRoomNames: [String]\n  threeRemainNotiOns: [Boolean]\n  isLoggedIns: [Boolean]\n}\n\ntype IsAliveResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype RoomStatusChangeResponse {\n  ok: Boolean!\n  error: String\n}\n\nenum RoomStatusOptions {\n  ready\n  active\n  inactive\n}\n\ntype MongoRoom {\n  roomid: String\n  createdAt: String\n  status: String\n  group: String\n}\n\ntype AddPhotoUrlResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype AddPhotoUrlsResponse {\n  ok: Boolean!\n  error: String\n}\n\ninput PhotoUrlInput {\n  key: String!\n  url: String!\n}\n\ntype AddTagResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype ChangeTagActiveResponse {\n  ok: Boolean!\n  error: String\n}\n\ninput ChangeActiveTagInput {\n  tagName: String!\n  active: Boolean!\n}\n\ntype CheckNickResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype ClickMatchResponse {\n  ok: Boolean!\n  error: String\n  matchIds: [String]\n  nicknames: [String]\n  photos: [String]\n  roomKey: String\n  waitingAt: Date\n  remain: Int\n}\n\ntype ClickUnmatchResponse {\n  ok: Boolean!\n  error: String\n  remain: Int\n}\n\ntype DeleteUserResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype DelPhotoUrlResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype DelTagResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype EditPhotoUrlResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype EditUserResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype FindCrewResponse {\n  ok: Boolean!\n  error: String\n  searchedUser: [User]\n  distance: Int\n  remain: Int\n}\n\ntype Query {\n  FindCrew(lat: Float!, lng: Float!, inputDistance: Int!): FindCrewResponse!\n  GetBelikedUsers: GetBelikedUsersResponse!\n  GetMyProfile: GetMyProfileResponse!\n  GetProfile(id: String!): GetProfileResponse!\n}\n\ntype UserWithLock {\n  userId: User\n  lock: Boolean\n}\n\ntype GetBelikedUsersResponse {\n  ok: Boolean!\n  error: String\n  usersWithLock: [UserWithLock]\n}\n\ntype GetMyProfileResponse {\n  ok: Boolean!\n  error: String\n  user: User\n}\n\ntype GetProfileResponse {\n  ok: Boolean!\n  error: String\n  user: User\n}\n\ntype GetServerTimeResponse {\n  ok: Boolean!\n  error: String\n  time: Date\n}\n\ntype IsValidTokenResponse {\n  ok: Boolean!\n  error: String\n  user: User\n}\n\ntype RechargePointResponse {\n  ok: Boolean!\n  error: String\n  currentPoint: Int\n}\n\ntype s3Photo {\n  key: String\n  url: String\n  key: String\n  url: String\n}\n\ntype Tag {\n  name: String\n  active: Boolean\n  defaultTag: Boolean\n  name: String\n  active: Boolean\n  defaultTag: Boolean\n}\n\ntype Match {\n  _id: ID\n  userid: String\n  createdAt: String\n  _id: ID\n  userid: String\n  createdAt: String\n}\n\ntype Loc {\n  type: String\n  coordinates: [Float]\n  type: String\n  coordinates: [Float]\n}\n\ntype BeLiked {\n  userId: User\n  lock: Boolean\n  userId: User\n  lock: Boolean\n}\n\ntype Settings {\n  getHitchNotiOn: Boolean\n  HitchSuccessNotiOn: Boolean\n  threeRemainNotiOn: Boolean\n  talkRoomCreatedNotiOn: Boolean\n  getNewMessageNotiOn: Boolean\n  eventNotiOn: Boolean\n  getHitchNotiOn: Boolean\n  HitchSuccessNotiOn: Boolean\n  threeRemainNotiOn: Boolean\n  talkRoomCreatedNotiOn: Boolean\n  getNewMessageNotiOn: Boolean\n  eventNotiOn: Boolean\n}\n\ntype GivePoint {\n  firstPoint: Boolean\n  myPicturePoint: Boolean\n  crewPicturePoint: Boolean\n  placeStrPoint: Boolean\n  shortbioPoint: Boolean\n  lastWent: String\n  firstPoint: Boolean\n  myPicturePoint: Boolean\n  crewPicturePoint: Boolean\n  placeStrPoint: Boolean\n  shortbioPoint: Boolean\n  lastWent: String\n}\n\nscalar Date\n\ntype DeletedUser {\n  _id: ID\n  point: Int\n  profilephoto: [s3Photo]\n  oneWordTags: [Tag]\n  likeTags: [Tag]\n  like: [String]\n  unlike: [String]\n  beliked: [BeLiked]\n  beunliked: [String]\n  groupphoto: [s3Photo]\n  phonenumber: String\n  uid: String\n  gender: Boolean\n  birthdate: Date\n  nickname: String\n  fcmToken: String\n  myOs: String\n  loc: Loc\n  locStr: String\n  currentRoomName: String\n  matches: [Match]\n  school: String\n  shortbio: String\n  placestr: String\n  settings: Settings\n  givePoint: GivePoint\n  createdAt: String\n  updatedAt: String\n}\n\ntype User {\n  _id: ID\n  point: Int\n  remain: Int\n  profilephoto: [s3Photo]\n  oneWordTags: [Tag]\n  likeTags: [Tag]\n  like: [String]\n  unlike: [String]\n  beliked: [BeLiked]\n  beunliked: [String]\n  groupphoto: [s3Photo]\n  phonenumber: String\n  uid: String\n  gender: Boolean\n  isLoggedIn: Boolean\n  birthdate: Date\n  nickname: String\n  fcmToken: String\n  myOs: String\n  loc: Loc\n  locStr: String\n  currentRoomName: String\n  matches: [Match]\n  school: String\n  shortbio: String\n  placestr: String\n  settings: Settings\n  givePoint: GivePoint\n  lastClick: String\n  createdAt: String\n  updatedAt: String\n}\n\ntype StartPhoneVerificationResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype TestSendFcmResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype UnlockProfileResponse {\n  ok: Boolean!\n  error: String\n  currentPoint: Int\n}\n\ntype UpdateMyLocResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype UpdateMyProfileResponse {\n  ok: Boolean!\n  error: String\n}\n\ntype UpdateUserResponse {\n  ok: Boolean!\n  error: String\n}\n\ninput SettingsInput {\n  getHitchNotiOn: Boolean\n  HitchSuccessNotiOn: Boolean\n  threeRemainNotiOn: Boolean\n  talkRoomCreatedNotiOn: Boolean\n  getNewMessageNotiOn: Boolean\n  eventNotiOn: Boolean\n}\n\ninput GivePointInput {\n  firstPoint: Boolean\n  myPicturePoint: Boolean\n  crewPicturePoint: Boolean\n  placeStrPoint: Boolean\n  shortbioPoint: Boolean\n  lastWent: String\n}\n\ntype UserSignInResponse {\n  ok: Boolean!\n  error: String\n  token: String\n  user: User\n}\n\ntype UserSignUpResponse {\n  ok: Boolean!\n  error: String\n  token: String\n  user: User\n}\n\ntype Verification {\n  id: Int!\n  target: String!\n  payload: String!\n  key: String!\n  verified: Boolean!\n  createdAt: String!\n  updatedAt: String\n}\n"];
/* tslint:disable */

export interface Query {
  FindCrew: FindCrewResponse;
  GetBelikedUsers: GetBelikedUsersResponse;
  GetMyProfile: GetMyProfileResponse;
  GetProfile: GetProfileResponse;
}

export interface FindCrewQueryArgs {
  lat: number;
  lng: number;
  inputDistance: number;
}

export interface GetProfileQueryArgs {
  id: string;
}

export interface FindCrewResponse {
  ok: boolean;
  error: string | null;
  searchedUser: Array<User> | null;
  distance: number | null;
  remain: number | null;
}

export interface User {
  _id: string | null;
  point: number | null;
  remain: number | null;
  profilephoto: Array<s3Photo> | null;
  oneWordTags: Array<Tag> | null;
  likeTags: Array<Tag> | null;
  like: Array<string> | null;
  unlike: Array<string> | null;
  beliked: Array<BeLiked> | null;
  beunliked: Array<string> | null;
  groupphoto: Array<s3Photo> | null;
  phonenumber: string | null;
  uid: string | null;
  gender: boolean | null;
  isLoggedIn: boolean | null;
  birthdate: Date | null;
  nickname: string | null;
  fcmToken: string | null;
  myOs: string | null;
  loc: Loc | null;
  locStr: string | null;
  currentRoomName: string | null;
  matches: Array<Match> | null;
  school: string | null;
  shortbio: string | null;
  placestr: string | null;
  settings: Settings | null;
  givePoint: GivePoint | null;
  lastClick: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface s3Photo {
  key: string | null;
  url: string | null;
}

export interface Tag {
  name: string | null;
  active: boolean | null;
  defaultTag: boolean | null;
}

export interface BeLiked {
  userId: User | null;
  lock: boolean | null;
}

export type Date = any;

export interface Loc {
  type: string | null;
  coordinates: Array<number> | null;
}

export interface Match {
  _id: string | null;
  userid: string | null;
  createdAt: string | null;
}

export interface Settings {
  getHitchNotiOn: boolean | null;
  HitchSuccessNotiOn: boolean | null;
  threeRemainNotiOn: boolean | null;
  talkRoomCreatedNotiOn: boolean | null;
  getNewMessageNotiOn: boolean | null;
  eventNotiOn: boolean | null;
}

export interface GivePoint {
  firstPoint: boolean | null;
  myPicturePoint: boolean | null;
  crewPicturePoint: boolean | null;
  placeStrPoint: boolean | null;
  shortbioPoint: boolean | null;
  lastWent: string | null;
}

export interface GetBelikedUsersResponse {
  ok: boolean;
  error: string | null;
  usersWithLock: Array<UserWithLock> | null;
}

export interface UserWithLock {
  userId: User | null;
  lock: boolean | null;
}

export interface GetMyProfileResponse {
  ok: boolean;
  error: string | null;
  user: User | null;
}

export interface GetProfileResponse {
  ok: boolean;
  error: string | null;
  user: User | null;
}

export interface Mutation {
  SendEmail: SendEmailResponse;
  AddMemberToRoom: AddMemberToRoomResponse;
  ExtendRoomReady: ExtendRoomReadyResponse;
  GetUsersFcm: GetUsersFcmResponse;
  IsAlive: IsAliveResponse;
  RoomStatusChange: RoomStatusChangeResponse;
  AddPhotoUrl: AddPhotoUrlResponse;
  AddPhotoUrls: AddPhotoUrlResponse;
  AddTag: AddTagResponse;
  ChangeTagActive: ChangeTagActiveResponse;
  CheckNick: CheckNickResponse;
  ClickMatch: ClickMatchResponse;
  ClickUnmatch: ClickMatchResponse;
  DeleteUser: DeleteUserResponse;
  DelPhotoUrl: DelPhotoUrlResponse;
  DelTag: DelTagResponse;
  EditPhotoUrl: EditPhotoUrlResponse;
  EditUser: EditUserResponse;
  GetServerTime: GetServerTimeResponse;
  IsValidToken: IsValidTokenResponse;
  RechargePoint: RechargePointResponse;
  StartPhoneVerification: StartPhoneVerificationResponse;
  TestSendFcm: TestSendFcmResponse;
  UnlockProfile: UnlockProfileResponse;
  UpdateMyLoc: UpdateMyLocResponse;
  UpdateMyProfile: UpdateMyProfileResponse;
  UpdateUser: UpdateUserResponse;
  UserSignIn: UserSignInResponse;
  UserSignUp: UserSignUpResponse;
}

export interface SendEmailMutationArgs {
  from: string;
  to: string;
  subject: string;
  body: string;
}

export interface AddMemberToRoomMutationArgs {
  inviteRoomId: string;
  inviteRoomGroup: string;
}

export interface ExtendRoomReadyMutationArgs {
  roomKey: string;
  point: number;
  extendTime: number;
  changeStatus: boolean;
  plusAtNow: boolean | null;
}

export interface GetUsersFcmMutationArgs {
  userIds: Array<string>;
}

export interface RoomStatusChangeMutationArgs {
  roomKeys: Array<string>;
  currentStatus: RoomStatusOptions;
  afterStatus: RoomStatusOptions;
}

export interface AddPhotoUrlMutationArgs {
  key: string;
  url: string;
  kind: string;
}

export interface AddPhotoUrlsMutationArgs {
  photoUrls: Array<PhotoUrlInput>;
}

export interface AddTagMutationArgs {
  tagKind: string;
  inputTags: Array<string>;
}

export interface ChangeTagActiveMutationArgs {
  inputTags: Array<ChangeActiveTagInput>;
  tagKind: string;
}

export interface CheckNickMutationArgs {
  nickName: string;
}

export interface ClickMatchMutationArgs {
  yourid: string;
  fromHitch: boolean | null;
}

export interface ClickUnmatchMutationArgs {
  yourid: string;
  delBelike: boolean;
  fromHitch: boolean | null;
}

export interface DelPhotoUrlMutationArgs {
  key: string;
  url: string;
  kind: string;
}

export interface DelTagMutationArgs {
  tagKind: string;
  inputTags: Array<string>;
}

export interface EditPhotoUrlMutationArgs {
  previousKey: string;
  newKey: string;
  newUrl: string;
  kind: string;
}

export interface EditUserMutationArgs {
  shortbio: string;
}

export interface RechargePointMutationArgs {
  point: number;
}

export interface StartPhoneVerificationMutationArgs {
  phoneNumber: string;
}

export interface TestSendFcmMutationArgs {
  type: string;
  title: string;
  body: string;
  screen: string | null;
}

export interface UnlockProfileMutationArgs {
  targetId: string;
  point: number;
}

export interface UpdateMyLocMutationArgs {
  lat: number;
  lng: number;
  locStr: string | null;
}

export interface UpdateMyProfileMutationArgs {
  _id: string;
  lat: number | null;
  lng: number | null;
}

export interface UpdateUserMutationArgs {
  shortbio: string | null;
  school: string | null;
  placestr: string | null;
  fcmToken: string | null;
  myOs: string | null;
  settings: SettingsInput | null;
  givePoint: GivePointInput | null;
  point: number | null;
  currentRoomName: string | null;
  isLoggedIn: boolean | null;
}

export interface UserSignInMutationArgs {
  phonenumber: string;
}

export interface UserSignUpMutationArgs {
  phonenumber: string;
  nickname: string;
  uid: string;
  gender: boolean;
  point: number;
  birthdate: Date | null;
}

export interface SendEmailResponse {
  ok: boolean;
  error: string | null;
}

export interface AddMemberToRoomResponse {
  ok: boolean;
  error: string | null;
  changeActive: boolean | null;
}

export interface ExtendRoomReadyResponse {
  ok: boolean;
  error: string | null;
  waitingAt: Date | null;
  currentPoint: number | null;
}

export interface GetUsersFcmResponse {
  ok: boolean;
  error: string | null;
  fcms: Array<string> | null;
  oss: Array<string> | null;
  getNewMessageNotiOns: Array<boolean> | null;
  currentRoomNames: Array<string> | null;
  threeRemainNotiOns: Array<boolean> | null;
  isLoggedIns: Array<boolean> | null;
}

export interface IsAliveResponse {
  ok: boolean;
  error: string | null;
}

export type RoomStatusOptions = "ready" | "active" | "inactive";

export interface RoomStatusChangeResponse {
  ok: boolean;
  error: string | null;
}

export interface AddPhotoUrlResponse {
  ok: boolean;
  error: string | null;
}

export interface PhotoUrlInput {
  key: string;
  url: string;
}

export interface AddTagResponse {
  ok: boolean;
  error: string | null;
}

export interface ChangeActiveTagInput {
  tagName: string;
  active: boolean;
}

export interface ChangeTagActiveResponse {
  ok: boolean;
  error: string | null;
}

export interface CheckNickResponse {
  ok: boolean;
  error: string | null;
}

export interface ClickMatchResponse {
  ok: boolean;
  error: string | null;
  matchIds: Array<string> | null;
  nicknames: Array<string> | null;
  photos: Array<string> | null;
  roomKey: string | null;
  waitingAt: Date | null;
  remain: number | null;
}

export interface DeleteUserResponse {
  ok: boolean;
  error: string | null;
}

export interface DelPhotoUrlResponse {
  ok: boolean;
  error: string | null;
}

export interface DelTagResponse {
  ok: boolean;
  error: string | null;
}

export interface EditPhotoUrlResponse {
  ok: boolean;
  error: string | null;
}

export interface EditUserResponse {
  ok: boolean;
  error: string | null;
}

export interface GetServerTimeResponse {
  ok: boolean;
  error: string | null;
  time: Date | null;
}

export interface IsValidTokenResponse {
  ok: boolean;
  error: string | null;
  user: User | null;
}

export interface RechargePointResponse {
  ok: boolean;
  error: string | null;
  currentPoint: number | null;
}

export interface StartPhoneVerificationResponse {
  ok: boolean;
  error: string | null;
}

export interface TestSendFcmResponse {
  ok: boolean;
  error: string | null;
}

export interface UnlockProfileResponse {
  ok: boolean;
  error: string | null;
  currentPoint: number | null;
}

export interface UpdateMyLocResponse {
  ok: boolean;
  error: string | null;
}

export interface UpdateMyProfileResponse {
  ok: boolean;
  error: string | null;
}

export interface SettingsInput {
  getHitchNotiOn: boolean | null;
  HitchSuccessNotiOn: boolean | null;
  threeRemainNotiOn: boolean | null;
  talkRoomCreatedNotiOn: boolean | null;
  getNewMessageNotiOn: boolean | null;
  eventNotiOn: boolean | null;
}

export interface GivePointInput {
  firstPoint: boolean | null;
  myPicturePoint: boolean | null;
  crewPicturePoint: boolean | null;
  placeStrPoint: boolean | null;
  shortbioPoint: boolean | null;
  lastWent: string | null;
}

export interface UpdateUserResponse {
  ok: boolean;
  error: string | null;
}

export interface UserSignInResponse {
  ok: boolean;
  error: string | null;
  token: string | null;
  user: User | null;
}

export interface UserSignUpResponse {
  ok: boolean;
  error: string | null;
  token: string | null;
  user: User | null;
}

export interface MongoRoom {
  roomid: string | null;
  createdAt: string | null;
  status: string | null;
  group: string | null;
}

export interface AddPhotoUrlsResponse {
  ok: boolean;
  error: string | null;
}

export interface ClickUnmatchResponse {
  ok: boolean;
  error: string | null;
  remain: number | null;
}

export interface DeletedUser {
  _id: string | null;
  point: number | null;
  profilephoto: Array<s3Photo> | null;
  oneWordTags: Array<Tag> | null;
  likeTags: Array<Tag> | null;
  like: Array<string> | null;
  unlike: Array<string> | null;
  beliked: Array<BeLiked> | null;
  beunliked: Array<string> | null;
  groupphoto: Array<s3Photo> | null;
  phonenumber: string | null;
  uid: string | null;
  gender: boolean | null;
  birthdate: Date | null;
  nickname: string | null;
  fcmToken: string | null;
  myOs: string | null;
  loc: Loc | null;
  locStr: string | null;
  currentRoomName: string | null;
  matches: Array<Match> | null;
  school: string | null;
  shortbio: string | null;
  placestr: string | null;
  settings: Settings | null;
  givePoint: GivePoint | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Verification {
  id: number;
  target: string;
  payload: string;
  key: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string | null;
}
