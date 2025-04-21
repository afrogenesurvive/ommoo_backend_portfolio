const { 
  user,
  review,
  rating,
  activity, 
} = require('../../db/models'); 
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');

const db = require("../../db/models");
const { is } = require('express/lib/request');
const { v4: uuidv4 } = require('uuid');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const req = require('express/lib/request');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const options = {
  salt: '2f0ijf2039j23r09j2fg45o9ng98um4o',
  iterations: 1000,
  keySize: 256, // Specify key size in bits
  outputEncoding: 'base64url'
};
const StringCrypto = require('string-crypto');
const { where } = require('sequelize');


const sc = new StringCrypto(options);

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();


async function googleVerify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID,
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];

  if (userid) {
    return true;
  }
  else {
    return false;
  }
}

const { auth } = require('express-oauth2-jwt-bearer');

const Auth0 = auth({
  issuer: `https://${process.env.AUTH0_DOMAIN}`,
  audience: `${process.env.AUTH0_AUDIENCE}`,
  secret: 'YOUR SECRET',
  tokenSigningAlg: 'HS256',
})

const { addUserActivity, canEditExistingEntity } = require('../../middleware/utils/utils');

const sendEmail = async (msg) => {

  try {
    const mail = await sgMail.send(msg);
    console.log('mail', mail);
    
  } catch (error) {
    // console.error(error);
    console.log(error);

    if (error.response) {
      // console.error(error.response.body)
      console.log(error.response.body)
    }
  }

};

const authResolver = {
  Query: {
    login: async (_, { loginInput }, { req }) => {
      console.log("Resolver: login...");
      const user_ = await user.findOne({ 
        where: { 
          username: loginInput.username, 
          is_deleted: 'N' 
        },
      });
      // if (!user_) {
      //   throw new Error('User not found');
      // }

      if (!user_) {
        console.log('User does not exist!');
        return{
          activityId: 0,
          token:"",
          tokenExpiration:0 ,
          error: 'User does not exist!'
        }
      }


      if (loginInput.auth_type === 'oommoo') {


        if (!user_.password === '...**...**...' ) {

          console.log('User signed up w/ google! Request password reset to login without google');
          return{
            activityId: 0,
            token:"",
            tokenExpiration:0 ,
            error: 'User signed up w/ google! Request password reset to login without google'
          }
        }

        const isEqual = await bcrypt.compare(loginInput.password, user_.password);

        if (!isEqual) {
          return{
            activityId: 0,
            token:"",
            tokenExpiration:0 ,
            error: 'Password is incorrect!'
          }
        }


        if (user_.verified !== true) {

          const encrypted_verif_code = sc.encryptString(user_.dataValues.verification_code, user_.dataValues.id);
          const encoded = encodeURIComponent(encrypted_verif_code);
            
          const msg = {
            to: user_.dataValues.email,
            from: 'no-reply@em311.oommoo.xyz', // Use the email address or domain you verified above
            subject: 'OommoO Registration Verification',
            text: `Verify your registration at oommoo.xyz/verify/${encrypted_verif_code} using this code: ${encrypted_verif_code}`,
            html: `<strong>Verify your registration at oommoo.xyz/verify/${encrypted_verif_code} using this code: ${encrypted_verif_code}</strong>`,
          };

          sendEmail(msg);

          console.log('Please  verify user 1st!');
          return{
            activityId:user_.id,
            token:"",
            tokenExpiration:0 ,
            error: 'Please  verify user 1st! Verify Email Sent'}
        }

      }

      
      const token = jwt.sign({ 
        userId: user_.dataValues.id, 
        username: user_.dataValues.username,
        email: user_.dataValues.email,
        role: user_.dataValues.role,
       },process.env.JWT_TOKEN,{expiresIn: '4h'});
       

      await user_.update({
        // id: user_.id,
        logged_in: true,
      })

      addUserActivity(req, {
        user_id: user_.id,
        request: 'login',
      });


      return {
        activityId: user_.id,
        token: token,
        tokenExpiration: 4,
      };
    },
    verify: async (_, { verifyInput }, { req }) => {
      
      
      const preUser = await user.findOne({
        where: {
          username: verifyInput.username,
          email: verifyInput.email,
          is_deleted: 'N',
        }
      });
      if (!preUser) {
        console.log('User not found! Check your details & try again!');
        throw new Error('User not found! Check your details & try again!')
      }
      // console.log('preUser',preUser.dataValues);

      if (preUser.verified === true) {
        console.log('User already verified!');
        return {
          user_id: preUser.dataValues.id,
          type: '',
          code: '',
          response: 'User already Verified!'
        };
      }
      
      const decoded = decodeURIComponent(verifyInput.code);
      const decrypted_challenge_code = sc.decryptString(decoded, preUser.dataValues.id);

      const challenge = {
        type: verifyInput.type,
        code: decrypted_challenge_code,
      }

      const response = {
        type: preUser.dataValues.verification_type,
        code: preUser.dataValues.verification_code,
      };
      // console.log('challenge',challenge);
      // console.log('response',response);
      
      

      let match = challenge.type === response.type && challenge.code === response.code;
      if (match === false) {
        throw new Error('challenge and response do not match. Check the type and code sent in the verification email and try again');
      }
      if (match === true) {
        console.log("verify success");;
      }


      const ratings = await rating.findAll({
        where: {
            user_id: preUser.id,
            is_deleted: 'N',
            held: true
        }
      });


      console.log('Realeasing held reviews and ratings for oommoo user:');
      
      await review.update(
          { update_time: moment().format(), updated_by: preUser.id, held: false },
          { where: { user_id: preUser.id, held: true, is_deleted: 'N' } }
      );
      await rating.update(
          { update_time: moment().format(), updated_by: preUser.id, held: false },
          { where: { user_id: preUser.id, held: true, is_deleted: 'N' } }
      );
      

      // UPDATE SHOW AVERAGE RATING FOR EACH SHOW USER HAS REVIEWED

      if (ratings.length > 0) {
        console.log('User has held ratings: Update average rating each show user has rated');
        
          const new_average_rating = 0;
          let total_rating = 0;
          ratings.forEach(r => async () => {
              total_rating += r.value;
              const show_ = await show.findOne({
                  where: {
                      id: r.show_id,
                      is_deleted: 'N'
                  }
              });

              const show_ratings = await rating.findAll({
                  where: {
                      show_id: r.show_id,
                      is_deleted: 'N'
                  }
              });

              new_average_rating = total_rating / show_ratings.length;

              show_.update({
                average_rating: new_average_rating.toFixed(2),
                update_time: moment().format(),
                updated_by: req.raw.user.id,
              });
          });
          
      }
      

      await preUser.update({
        verified: true,
        verification_code: null,
        verification_type: null,
      })

      addUserActivity(req, {
        user_id: preUser.id,
        request: 'verify',
      });


      return {
        user_id: preUser.dataValues.id,
        type: verifyInput.type,
        code: verifyInput.code,
        // DON'T TOUCH MEEEE
        response: 'Verification successful'
      };
    },
    requestPasswordReset: async (_, { passwordResetInput }, { req }) => {
      const user_ = await user.findOne({ 
        where: { 
          email: passwordResetInput.email,
          username: passwordResetInput.username,
          is_deleted: 'N',
        } });
      if (!user_) {
        throw new Error('User not found');
      }

      const today = new Date().toISOString();
      const resetCode = 'pwreset'+Math.floor(Math.random() * 1000000)+today+user_.username.charAt(0)+user_.username.charAt(user_.username.length-1);


      await user_.update({
        reset_code: resetCode,
      });

      const encrypted_reset_code = sc.encryptString(resetCode, user_.id);
      const encoded = encodeURIComponent(encrypted_reset_code);

      const msg = {
        to: user_.dataValues.email,
        from: 'no-reply@em311.oommoo.xyz',  // Use the email address or domain you verified above
        subject: 'OommoO Password Reset Verification',
        text: 'Verify your password reset at oommoo.xyz using this code: '+encoded,
        html: `<strong>Verify your password reset at oommoo.xyz using this code: ${encoded}</strong>`,
      };

      sendEmail(msg);

      addUserActivity(req, {
        user_id: user_.id,
        request: 'requestPasswordReset',
      });

      // return 'Password reset code sent';
      return {
        email: user_.dataValues.email,
        code: encrypted_reset_code,
        newPassword: null,
        response: 'Password reset requested'
      };
    },
    logout: async (_, {id}, { req }) => {
      console.log("Resolver: Logout...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }

      const user_ = await user.findOne({
        where: {
          id: id,
          is_deleted: 'N',
        }
      });
      if (!user_) {
        throw new Error('User not found');
      }
      if (user_.logged_in === false) {
        throw new Error('User is already logged out');
        
      }
      await user_.update({
        logged_in: false,
      });

      addUserActivity(req, {
        user_id: user_.id,
        request: 'logout',
      });

      return 'User logged out';
    },
    resendVerifyEmail: async (_, { username, email}, { req }) => {
      console.log("Resolver: resendVerifyEmail...");
      // if (!req.raw.isAuth) {
      //   throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      // }

      const user_ = await user.findOne({
        where: {
          username: username,
          email: email,
          is_deleted: 'N',
        }
      });
      if (!user_) {
        throw new Error('User not found');
      }

      const today = new Date().toISOString();
      const verif_code = 'register'+Math.floor(Math.random() * 1000000)+today+user_.username.charAt(0)+user_.username.charAt(user_.username.length-1);
      const encrypted_verif_code = sc.encryptString(verif_code, user_.dataValues.id);
      const encoded = encodeURIComponent(encrypted_verif_code);
      
        
      const msg = {
        to: user_.dataValues.email,
        from: 'no-reply@em311.oommoo.xyz',  // Use the email address or domain you verified above
        subject: 'OommoO Registration Verification',
        text: `Verify your registration at oommoo.xyz/verify/${encoded} using this code: ${encoded}`,
        html: `<strong>Verify your registration at oommoo.xyz/verify/${encoded} using this code: ${encoded}</strong>`,
      };
      

      sendEmail(msg);

      await user_.update({
        verification_code: verif_code,
        verification_type: 'signup_email',
        update_time: moment().format(),
        updated_by: req.raw.user?.id || user_.id,
      });


      addUserActivity(req, {
        user_id: user_.id,
        request: 'resendVerifyEmail',
      });

      return 'Success! Verification Email Resent.';
    },
    resendPasswordResetEmail: async (_, { username, email}, { req }) => {
      console.log("Resolver: resendPasswordResetEmail...");
      // if (!req.raw.isAuth) {
      //   throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      // }

      const user_ = await user.findOne({
        where: {
          username: username,
          email: email,
          is_deleted: 'N',
        }
      });
      if (!user_) {
        throw new Error('User not found');
      }

      const today = new Date().toISOString();
      const resetCode = 'pwreset'+Math.floor(Math.random() * 1000000)+today+user_.username.charAt(0)+user_.username.charAt(user_.username.length-1);

      const encrypted_reset_code = sc.encryptString(resetCode, user_.id);
      const encoded = encodeURIComponent(encrypted_reset_code);

      await user_.update({
        reset_code: resetCode,
        update_time: moment().format(),
        updated_by: req.raw.user?.id || user_.id,
      });

      const msg = {
        to: user_.dataValues.email,
        from: 'no-reply@em311.oommoo.xyz',  // Use the email address or domain you verified above
        subject: 'OommoO Password Reset Verification',
        text: 'Verify your password reset at oommoo.xyz using this code: '+encoded,
        html: `<strong>Verify your password reset at oommoo.xyz using this code: ${encoded}</strong>`,
      };

      sendEmail(msg);


      addUserActivity(req, {
        user_id: user_.id,
        request: 'resendPasswordResetEmail',
      });

      return 'Success! Password Reset Email Resent.';
    },
  },
  Mutation: {
    passwordReset: async (_, { passwordResetInput }, { req }) => {
      console.log("Resolver: passwordReset...");
      
      const user_ = await user.findOne({ 
        where: {
          email: passwordResetInput.email,
          username: passwordResetInput.username,
          is_deleted: 'N'
        }
      });
      // console.log('user_',user_);
      
      if (!user_) {
        throw new Error('User not found');
      }

      const decoded = decodeURIComponent(passwordResetInput.code);
      const decrypted_code = sc.decryptString(decoded, user_.dataValues.id);

      if (
        decrypted_code === user_.reset_code
      ) {
          const hashedPassword = await bcrypt.hash(passwordResetInput.newPassword, 12);
          await user_.update({ password: hashedPassword });

          addUserActivity(req, {
            user_id: user_.id,
            request: 'passwordReset',
          });

          return {
            email: user_.dataValues.email,
            code: null,
            newPassword: passwordResetInput.newPassword,
            response: 'Password reset successful'
          };
      }
      else {
        throw new Error('Reset code is incorrect');
      }
    },
    register: async (_, { registerInput }, { req }) => {
      const existingUser = await user.findOne({
        where: {
          // username: registerInput.username,
          email: registerInput.email,
          is_deleted: 'N'
        }
      });

      if (existingUser) {
        // throw new Error('User with this username & email already exists');
        throw new Error('User with this email already exists');
      }

      const adminUser = await user.findOne({
        where: {
          role: 'ADMIN',
          is_deleted: 'N'
        },
        order: [['create_time', 'ASC']]
      });
    
      if (!adminUser) {
        throw new Error('No admin user found');
      }
      // console.log('registerInput',registerInput);
      // console.log('adminUser',adminUser);
      

      const today = new Date().toISOString();

      let verif_code = '';
      let encrypted_verif_code = '';
      let encoded = '';
      let hashedPassword = '';
      let user_; 
      let verif_type = 'signup_email';

      if (registerInput.auth_type === 'oommoo') {
        
        verif_code = 'register'+Math.floor(Math.random() * 1000000)+today+registerInput.username.charAt(0)+registerInput.username.charAt(registerInput.username.length-1);
        hashedPassword = await bcrypt.hash(registerInput.password, 12);

        

        user_ = await user.create({
          username: registerInput.username,
          password: hashedPassword,
          email: registerInput.email,
          first_name: registerInput.first_name,
          last_name: registerInput.last_name,
          age: registerInput.age,
          gender: registerInput.gender,
          dob: moment(registerInput.dob),
          verified: false,
          private: false,
          create_time: moment().format(),
          created_by: adminUser?.dataValues?.id || uuidv4(),
          system_id: null,
          is_deleted: 'N'
        });
        // console.log('user_',user_);
        

        await user_.update({
          verification_code: verif_code,
          verification_type: verif_type,
        });

        encrypted_verif_code = sc.encryptString(verif_code, user_.dataValues.id);
        encoded = encodeURIComponent(encrypted_verif_code);


        
        // console.log('encrypted_verif_code',encrypted_verif_code);
        
        const msg = {
          to: user_.dataValues.email,
          from: 'no-reply@em311.oommoo.xyz',
          subject: 'OommoO Registration Verification',
          text: `Verify your registration at oommoo.xyz/verify/${encoded} using this code: ${encoded}`,
          html: `<strong>Verify your registration at oommoo.xyz/verify/${encoded} using this code: ${encoded}</strong>`,
        };

        sendEmail(msg);

      }
      // console.log('user',user_);


      if (registerInput.auth_type === 'google') {

        verif_type = 'google';

        try {
          const gVerified = await googleVerify(loginInput.password);
        } catch (error) {
          console.log('Google verification failed!', error);
          
          throw new Error('Google verification failed',error);
        }

        user_ = await user.create({
          username: registerInput.username,
          password: '...**...**...',
          email: registerInput.email,
          first_name: registerInput.first_name,
          last_name: registerInput.last_name,
          age: registerInput.age,
          gender: registerInput.gender,
          dob: moment(registerInput.dob),
          verified: false,
          verification_code: '',
          verification_type: verif_type,
          create_time: moment().format(),
          created_by: adminUser?.dataValues?.id || uuidv4(),
          system_id: null,
          is_deleted: 'N'
        });
        

      }

      
      
      addUserActivity(req, {
        user_id: user_.id,
        request: 'register',
      });
      

      return {
        user_id: user_.dataValues.id,
        type: verif_type,
        code: encrypted_verif_code,
        response: 'User registered successfully',
        auth_type: registerInput.auth_type,
      };
    },
  }
};

module.exports = authResolver;

