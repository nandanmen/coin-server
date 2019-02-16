# Coin REST API

The backend server for the [coin](https://github.com/narendrasss/finance-react) app.

This server is a simple API that accepts standard CRUD operations. The API is built on a Node-Express-MongoDB stack and is written in Typescript. It is tested using Jest and authenticates using JSON web tokens.

# Starting the Server

First clone the repo:

```
$ git clone https://github.com/narendrasss/finance-server.git
```

Then install all dependencies:

```
$ npm install
```

Then start the server with `npm run start` or `yarn start`.

Running `npm run test` or `yarn test` will run the test suites. `npm run dev / yarn dev` will start the development server with nodemon, a utility that watches for changes and automatically restarts the server.

# Goals

This API was built as a learning tool first and a product second. Thus the code is not _perfect_ and I'm open to suggestions/critics.

The API has the following dependencies for the following reasons:

- [bcrypt](https://www.npmjs.com/package/bcrypt) - for hashing and comparing passwords
- [body-parser](https://www.npmjs.com/package/body-parser) - for parsing incoming requests
- [express](https://expressjs.com/) - for creating/running server
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - js implementation of json web tokens, primary method of authentication
- [mongoose](https://mongoosejs.com/) - for database operations with mongoDB

# Acknowledgements

I'd like to thank Scott Moss and his [API design in Node.js v3 course](https://frontendmasters.com/courses/api-design-nodejs-v3/). The course material helped me in the creation of this API.

I'd also like to thank Arthur Longbottom and his [article](https://medium.com/@art.longbottom.jr/concurrent-testing-with-mongoose-and-jest-83a27ceb87ee) on concurrent testing with Mongoose and Jest. It helped me debug a race condition that was occuring in my tests.
