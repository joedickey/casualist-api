module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    ClIENT_ORIGIN: 'http://localhost:3000',
    API_TOKEN: process.env.API_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://joe_dickey@localhost/casualist_test" ,
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://joe_dickey@localhost/casualist_test" ,
  }