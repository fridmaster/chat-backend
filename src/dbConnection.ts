import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('mysql://sql7355529:neMW5Mwgjr@sql7.freemysqlhosting.net:3306/sql7355529', {
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

