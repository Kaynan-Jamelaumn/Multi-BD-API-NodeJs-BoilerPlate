export default HomeModel;
declare const HomeModel: mongoose.Model<{
    titulo: string;
    descricao?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    titulo: string;
    descricao?: string | null | undefined;
}> & {
    titulo: string;
    descricao?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    titulo: string;
    descricao?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    titulo: string;
    descricao?: string | null | undefined;
}>> & mongoose.FlatRecord<{
    titulo: string;
    descricao?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
import mongoose from 'mongoose';
