import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('ADD_YOUR_CONNECTION', {
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
});

