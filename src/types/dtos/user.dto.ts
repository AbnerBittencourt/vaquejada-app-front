import { UserRoleEnum } from "../enums/api-enums";

export class QueryUserDto {
  createdAt?: string;
  role?: UserRoleEnum;
  cpf?: string;
  name?: string;
}
