import { Connection } from 'typeorm';
import { Parameter } from '../modules/parameters/parameter.entity';

export const ParameterFactory = {
  build: (connection: Connection): Parameter[] => {
    const items = [
      {
        name: 'SELF_API_URL',
        value: process.env.SELF_API_URL
      },
      {
        name: 'CONFIRMATION_EMAIL_SUBJECT',
        value: 'Confirma tu email!'
      },
      {
        name: 'FROM_EMAIL',
        value: 'no-reply@basic-acl.com'
      },
      {
        name: 'DEFAULT_COMPANY_LOGO_URL',
        value: 'https://basic-acl-web-dev.herokuapp.com/logo-512.png'
      },
      {
        name: 'FORGOTTEN_PASSOWRD_EMAIL_SUBJECT',
        value: 'did you forget your password?'
      }
    ];

    return items.map(item => connection.getRepository(Parameter).create({
      name: item.name,
      value: item.value
    }));
  },

  handle: async (connection: Connection): Promise<void> => {
    const items = ParameterFactory.build(connection);    

    for (const item of items) {
      const found = await connection.getRepository(Parameter).createQueryBuilder('p')
        .where('p.name = :name', { name: item.name })
        .getOne();

      
      let itemToHandle;

      if (found) {
        itemToHandle = await connection.getRepository(Parameter).preload({
          ...found,
          value: item.value
        });
      } else itemToHandle = item;

      await connection.getRepository(Parameter).save(itemToHandle);
    }
  },

  entity: Parameter
};