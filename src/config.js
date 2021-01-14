module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    ClIENT_ORIGIN: 'http://localhost:3000',
    API_TOKEN: process.env.API_TOKEN,
    DATABASE_URL: "postgres://gqwnwmcspsonso:b8baa9b6b3997000b7d3449051d0e46a337af4c00f9fd6bffd5ff38f117234c8@ec2-52-205-61-60.compute-1.amazonaws.com:5432/d8tvb7drgbl69h?sslmode=require",
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://joe_dickey@localhost/casualist_test" ,
  }