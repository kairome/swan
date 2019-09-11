import { Location } from 'history';

export interface AppUser {
  location: Location,
  sync: UserSyncData,
}

export interface AccessTokenPayload {
  access_token: string,
  expiry_date: number,
}

export interface GoogleCredentials extends AccessTokenPayload {
  refresh_token: string,
}

export interface UserSyncData {
  googleCredentials: GoogleCredentials,
  syncFrequency: number,
  firstTime: boolean,
}
