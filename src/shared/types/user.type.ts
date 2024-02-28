import { UserType } from "./user-type.enum";

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  userType: UserType;
};
