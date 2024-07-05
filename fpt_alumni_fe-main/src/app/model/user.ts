import { Role } from "../services/const/const";

export interface User {
  id: string;
  username: string;
  role: Role;
}
