import { MongoModel, MongoModelType } from "../../../types/models";
export interface IUser extends MongoModel {
    username: string;
    name: string;
    surname: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date | null;
    password: string;
    bio?: string;
    profilePicture: string;
    birthDate?: Date;
    isActive: boolean;
    role: "User" | "Admin";
    comparePassword(inputPassword: string): Promise<boolean>;
}
declare const UserMongo: MongoModelType;
export default UserMongo;
