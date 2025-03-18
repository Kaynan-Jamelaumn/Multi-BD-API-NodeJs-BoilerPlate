import mongoose from "mongoose";
import { MongoModel, MongoModelType } from "../types/models";
export interface IAddress extends MongoModel {
    userId: mongoose.Types.ObjectId;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const AddressMongo: MongoModelType;
export default AddressMongo;
