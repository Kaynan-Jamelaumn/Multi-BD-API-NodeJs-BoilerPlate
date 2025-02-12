import mongoose from 'mongoose';

const HomeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: String
});

const HomeModel = mongoose.model('Home', HomeSchema);

export default HomeModel;
