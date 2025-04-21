const dotenv = require("dotenv");
dotenv.config();

const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); 
const { createHandler } = require('graphql-http/lib/use/express');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');



const db = require('./db/models');
const isAuth = require('./middleware/is_auth');
const {
  auth0UserCheck,
} = require('./middleware/utils/utils');

const { auth, requiresAuth } = require('express-openid-connect');
const auth0_base_url = process.env.ENV === 'production' ? `https://api.oommoo.xyz` : 'http://localhost:6000';
const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: auth0_base_url,
  clientID: process.env.ENV === 'production' ? `${process.env.AUTH0_CLIENT_ID}` : `${process.env.AUTH0_CLIENT_ID}`,
  issuerBaseURL:  process.env.ENV === 'production' ? `https://${process.env.AUTH0_DOMAIN}` : `https://${process.env.AUTH0_DOMAIN}`,
  clientSecret: Buffer.from( process.env.ENV === 'production' ? `${process.env.AUTH0_SECRET}` : `${process.env.AUTH0_SECRET}`, 'base64').toString('utf8'), // Decode the base64 encoded secret
  secret: Buffer.from( process.env.ENV === 'production' ? `${process.env.AUTH0_SECRET}` : `${process.env.AUTH0_SECRET}`, 'base64').toString('utf8'), // Decode the base64 encoded secret
  routes: {
    // postLoginRedirect: 'https://oommoo.xyz/auth/callback',
    postLogoutRedirect: 'https://api.oommoo.xyz/goodbye', // Correct option for logout redirect
  },
};

const app = express();

// Load SSL certificates
// const privateKey = fs.readFileSync('path/to/key.pem', 'utf8');
// const certificate = fs.readFileSync('path/to/cert.pem', 'utf8');
// const credentials = { key: privateKey, cert: certificate };

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth(config));


app.get('/', async (req, res) => {
  console.log('Auth0 sign-up/login request');
  
  if (req.oidc.isAuthenticated()) {
    // console.log('oidc user', req.oidc.user);
    

    function getKey(header, callback) {
      client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      });
    }

    const client = jwksClient({
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    });

    console.log('fetching user from auth0 token...');
    
    jwt.verify(
      req.oidc.idToken,
      getKey,
      {
        audience: process.env.AUTH0_CLIENT_ID,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ['RS256'],
      },
      async (err, verifiedToken) => {
        if (err) {
          console.log('auth 0: check jwt err', err);
          req.isAuth = false;
          req.error_message = err.message;

          res.status(500).json({ error: err.message });
        }

        const auth0_final_user = await auth0UserCheck(req, verifiedToken);
        
        if (auth0_final_user.error) {
          req.isAuth = false;
          req.error_message = auth0_final_user.error;
          res.status(500).json({ error: err.message });
        }
        
        const user = {
          message: 'Welcome',
          user_id: auth0_final_user.id,
          username: auth0_final_user.username || verifiedToken.nickname,
          auth0_token: req.oidc.idToken,
          social: req.oidc.user.sub,
        };


        const jsonString = JSON.stringify(user);
        const base64Encoded = Buffer.from(jsonString).toString('base64'); // Encode to Base64
        
        let redirectUrl = `https://oommoo.xyz/auth/callback?data=${base64Encoded}`;

        if (process.env.ENV !== 'production') {
          redirectUrl = `http://localhost:3001/auth/callback?data=${base64Encoded}`;
          
        }

        return res.redirect(redirectUrl);
        
      }
    );

  } else {
    console.log('oidc user not authenticated redirect');
    res.redirect('/login');
  }

});


app.get('/profile', requiresAuth(), (req, res) => {
  console.log('Auth0 prof request');
  res.send(JSON.stringify(req.oidc.user));
});

app.get('/goodbye', (req, res) => {
  console.log('Logout request',req.query);

  let redirectUrl = 'https://oommoo.xyz/';
  if (process.env.ENV !== 'production') {
    redirectUrl = 'http://localhost:3001/';
  }
  return res.redirect(redirectUrl);
  // res.send('User logged out. Remove appSession cookie & call graphql/logout'); // Send the response from the resolver

});



// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message); // Log the error for debugging

  if (err.status) {
    res.status(err.status).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.use(isAuth);


app.use(
  '/graphql',
  createHandler({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    context: (req, res) => ({ req, res }),
    onError: (err) => {
      console.error('GraphQL Error:', err.message);
    },
  })
);


db.sequelize.sync().then(() => {

  app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.ENV === 'production' ? 'https://api.oommoo.xyz/graphql' : `http://localhost:${process.env.PORT}/graphql`}`);
  });
});


