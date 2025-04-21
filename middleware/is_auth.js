const { 
  user,
  review,
  rating,
  activity, 
} = require('../db/models'); 

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');

const { requiresAuth } = require('express-openid-connect');
const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: `${process.env.AUTH0_AUDIENCE}`,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  algorithms: ['RS256'],
});

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});


function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const {
  auth0UserCheck,
} = require('../middleware/utils/utils');

module.exports = (req, res, next) => {
  

  const openRoutes = [
    { path: '/graphql', method: 'POST', operationName: 'register' },
    { path: '/graphql', method: 'POST', operationName: 'login' },
    { path: '/graphql', method: 'POST', operationName: 'verify' },
    { path: '/graphql', method: 'POST', operationName: 'requestPasswordReset' },
    { path: '/graphql', method: 'POST', operationName: 'passwordReset' },
    { path: '/graphql', method: 'POST', operationName: 'resendVerifyEmail' },
    { path: '/graphql', method: 'POST', operationName: 'getAllPublicShows' },
    { path: '/graphql', method: 'POST', operationName: 'createGuestReview' },
    { path: '/graphql', method: 'POST', operationName: 'createGuestRating' },
  ];


  const isOpenRoute = openRoutes.some(route => {
    return (
      req.path === route.path &&
      req.method === route.method &&
      req.body.operationName === route.operationName
    );
  });

  if (isOpenRoute) {
    console.log(`Open Route: ${req.method} ${req.path} ${req.body.operationName}`);
    
    return next();
  }

  if (!isOpenRoute) {
    console.log(`Protected Route: ${req.method} ${req.path} ${req.body.operationName}`);
  }

  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.isAuth = false;
    req.error_message = 'Authorization header missing';
    return next();
  }

  const token = authHeader.split(' ')[1];

  if (!token || token === '') {
    req.isAuth = false;
    req.error_message = 'Token missing or empty';
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.decode(token, { complete: true });
  } catch (err) {
    console.log('err', err);
    req.isAuth = false;
    req.error_message = 'Invalid token';
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    req.error_message = 'Token verification failed';
    return next();
  }
  
  // -----------------------
  const issuer = decodedToken.payload?.iss;

  if (issuer && issuer.includes(process.env.AUTH0_DOMAIN)) {
    console.log('is_auth -- Auth0 Token');

    // checkJwt(req, res, async (err) => {
    //   if (err) {
    //     console.log('auth 0: check jwt err', err);
    //     req.isAuth = false;
    //     req.error_message = err.message;
    //     return next();
    //   }


    //   req.isAuth = true;
    //   req.user = {
    //     id: user_.id,
    //     username: user_.username,
    //     email: user_.email,
    //     role: user_.role,
    //   };
    //   req.body.isAuth = true;
    //   console.log('is_auth -- Auth0: Authorized!',req.user);

    //   next();
    // });


    
    jwt.verify(
      token,
      getKey,
      {
        audience: process.env.AUTH0_CLIENT_ID,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ['RS256'],
      },
      async (err, verifiedToken) => {
        if (err) {
          console.log('is_auth -- auth 0: check jwt err', err);
          req.isAuth = false;
          req.error_message = err.message;
          return next();
        }

        const auth0_final_user = await auth0UserCheck(req, verifiedToken);
        // console.log('is_auth -- auth0_final_user id', auth0_final_user?.id);
        
        if (auth0_final_user.error) {
          req.isAuth = false;
          req.error_message = auth0_final_user.error;
          return next();
        }
        

        req.isAuth = true;
        req.user = {
          id: auth0_final_user.id, //verifiedToken.sub,
          username: auth0_final_user.username || verifiedToken.nickname,
          email: auth0_final_user.email || verifiedToken.email,
          role: 'user',
        };
        req.body.isAuth = true;

        console.log('is_auth -- Auth0: Authorized!');

        next();
      }
    );

  } else {
    console.log('is_auth -- Non-Auth0 Token');

    try {
      decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    } catch (err) {
      req.isAuth = false;
      req.error_message = err.message;
      
      // throw new Error(`Unauthorised: ${JSON.stringify(err) || ''}`);
      
      return next();
    }

    if (!decodedToken) {
      req.isAuth = false;
      req.error_message = err.message;
      return next();
    }
    
    req.isAuth = true;
    req.user = {
      id: decodedToken.userId,
      username: decodedToken.username,
      email: decodedToken.email,
      role: decodedToken.role,
    };
    req.body.isAuth = true;
    console.log('is_auth -- Oommoo Request: Authorized!');

    next();
  }
};
