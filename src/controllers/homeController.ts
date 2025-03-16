import { Request, Response } from 'express'; // Importing types for req and res

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

export const paginaInicial = (req: Request, res: Response): void => {
  res.json({ message: 'Hello from the backend!' });
  return;
};