export default {
  dbUrl: 'mongodb://admin:admin123@ds349455.mlab.com:49455/coin',
  port: process.env.API_PORT || 3001,
  secrets: {
    jwtSecret: process.env.JWT_SECRET || 'narendras',
    jwtExp: '30d',
  },
};
