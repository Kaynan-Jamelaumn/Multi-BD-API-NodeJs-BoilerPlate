import path from 'path';
import HomeModel from '../models/HomeModel.js';

// HomeModel.create(
//   {
//     titulo: 'O Mestre Dos Magos',
//     descricao: 'Algo sobre um grande mago'
//   })
//   .then(dados => {
//     console.log(dados);
//   })
//   .catch(err => {
//     console.log('erro ao inserir', err);
//   });
export const paginaInicial = (req, res) => {
  console.log("Global Route Called")
  res.render('index', { coisa: 'teste', numeros: [0, 1, 2, 3, 4, 5] });
  return;
};