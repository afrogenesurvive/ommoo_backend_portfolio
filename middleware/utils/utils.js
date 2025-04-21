const moment = require('moment-timezone');
const { 
  user,
  production_company,
  production_company_user,
  contact, 
  user_permission, 
  show_user, 
  venue_user, 
  show, 
  venue,
  event,
  review,
  rating,
  tag,
  like,
  watchlist,
  watchlist_item,
  venue_event,
  venue_show,
  activity,
  file,
} = require('../../db/models'); 
const modelMapping = {
  user,
  production_company,
  production_company_user,
  contact,
  user_permission,
  show_user,
  venue_user,
  show,
  venue,
  event,
  review,
  rating,
  tag,
  like,
  watchlist,
  watchlist_item,
  venue_event,
  venue_show,
  activity,
  file,
};

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const https = require("node:https");
const { GetObjectCommand, PutObjectCommand, S3Client,S3 } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");
const { HttpRequest } = require("@smithy/protocol-http");
const {
  getSignedUrl,
  S3RequestPresigner,
} = require("@aws-sdk/s3-request-presigner");
const { parseUrl } = require("@smithy/url-parser");
const { formatUrl } = require("@aws-sdk/util-format-url");
const { Hash } = require("@smithy/hash-node")
const { fromStatic } = require("@aws-sdk/token-providers");

const token = { token: "TOKEN" };
const staticTokenProvider = fromStatic(token);


const addUserActivity = async (req, args) => {
  console.log('Utils: addUserActivity...',args.user_id, args.request);
  
  try {
    const activity_ = await activity.create({
      user_id: args.user_id,
      request: args.request,
      create_time: moment().format(),
      created_by: req.raw?.user?.id || args.user_id,
      is_deleted: 'N'
    });
  } catch (err) {
    throw err;
  }
};


const auth0UserCheck = async (req, verifiedToken) => {
  console.log('Utils: auth0UserCheck...');
  
  try {

    const user_ = await user.findOne({ 
      where: { 
        email: verifiedToken.email,
        // username: verifiedToken.nickname, 
        is_deleted: 'N' 
      } ,
      attributes: { exclude: ['password'] },
    });


    if (!user_) {

      console.log('is_auth -- Auth0 User does not exist! Creating new user...');

      const adminUser = await user.findOne({
        where: {
          role: 'ADMIN',
          is_deleted: 'N'
        },
        order: [['create_time', 'ASC']]
      });

      const hashedPassword = await bcrypt.hash(`${verifiedToken.sub}-${verifiedToken.nickname}`, 12);
      new_user = await user.create({
        username: verifiedToken.nickname,
        password: hashedPassword,
        email: verifiedToken.email,
        first_name: verifiedToken.given_name,
        last_name: verifiedToken.family_name,
        age: 0,
        gender: '',
        dob: moment(),
        verified: true,
        verification_code: '',
        verification_type: '',
        logged_in: true,
        create_time: moment().format(),
        created_by: adminUser?.dataValues?.id || uuidv4(),
        system_id: null,
        is_deleted: 'N',
        private: false,
      });

      if (new_user) {
        console.log('is_auth -- Auth0 User created!');
        auth0_final_user = new_user;

        addUserActivity(req, {
          user_id: adminUser?.dataValues?.id || '...',
          request: 'create Auth0 User',
        });

      }
      else {
        return {error: 'Auth0 User creation failed'};
      }


    }
    else {
      console.log('is_auth -- Auth0 existing user found:');
      await user_.update({ 
        logged_in: true,
        verified: true,
       });

      auth0_final_user = user_;
    }


    addUserActivity(req, {
      user_id: auth0_final_user.id,
      request: 'Auth0 User signup/login',
    });

    const ratings = await rating.findAll({
      where: {
          user_id: auth0_final_user.id,
          is_deleted: 'N',
          held: true
      }
    });

    console.log('Realeasing held reviews and ratings for auth0 user:', auth0_final_user.id);

    await review.update(
        { update_time: moment().format(), updated_by: auth0_final_user.id, held: false },
        { where: { user_id: auth0_final_user.id, held: true, is_deleted: 'N' } }
    );
    await rating.update(
        { update_time: moment().format(), updated_by: auth0_final_user.id, held: false },
        { where: { user_id: auth0_final_user.id, held: true, is_deleted: 'N' } }
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

    return auth0_final_user;
    
  } catch (error) {
    throw error; 
  }


}

const canEditExistingEntity = async (req, args) => {
  console.log("Utils: canEditExistingEntity...");
  try {
    
    const entityModel = modelMapping[args.entity_type.toLowerCase()];
    const entity = await entityModel.findOne({ where: { 
        id: args.entity_id,
        is_deleted: 'N'
     }
    });
     
    if (!entity) {
        return {error: `${args.entity_type} not found`};
    }
    if (
        req.raw.user.role === 'ADMIN' || 
        (req.raw.user.id === entity.dataValues.created_by) ||
        (req.raw.user.id === entity.created_by)
    ) {
      return {result: true};
    }
    else {
        return {error: 'Edit/Delete Access Denied'};
    }

  } catch (err) {
    throw err;
  }
};

const getUploadPresignedUrlUtil = async (args) => {
  console.log("Utils: getUploadPresignedUrl...");
  try {
    
    const clientParams = {
      region: process.env.DO_STORE_REGION,
      endpoint: process.env.DO_STORE_ENDPOINT,
      credentials: fromEnv(), // or any other credential provider
    };

    const putObjectParams = {
      Bucket: process.env.DO_STORE_BUCKET,
      Key: args.filename, // The key (file name) should be provided in the args Optional: specify the content type
      ACL: 'public-read', // Make the object publicly accessible
    };

    if (args.private === true) {
      putObjectParams.ACL = 'private';
    }

    const client = new S3Client(clientParams);
    const put_command = new PutObjectCommand(putObjectParams);
    const uploadurl = await getSignedUrl(client, put_command, { expiresIn: 3600 });

    
    const getObjectParams = {
      Bucket: process.env.DO_STORE_BUCKET,
      Key: args.filename, // The key (file name) should be provided in the args Optional: specify the content type
    };

    let direct_url = `https://${process.env.DO_STORE_BUCKET}.${process.env.DO_STORE_ENDPOINT.split('//')[1]}/${args.filename}`;
    let signed_download_url = 'no signed url for public download';
    if (args.private === true) {
      const get_command = new GetObjectCommand(getObjectParams);
    // const url = await getSignedUrl(client, get_command, { expiresIn: 3600 }); // 1 Hour
      signed_download_url = await getSignedUrl(client, get_command, { expiresIn: 604800 }); // 1 week
      direct_url = 'no direct url for private download';
    }
    
    
    
    return {
      upload_url: uploadurl,
      signed_download_url: signed_download_url,
      direct_download_url: direct_url,
    };

  } catch (err) {
    throw err;
  }
};

const getDownloadPresignedUrlUtil = async (args) => {
  console.log("Utils: geDownloadPresignedUrl...");
  try {
    
    const clientParams = {
      region: process.env.DO_STORE_REGION,
      endpoint: process.env.DO_STORE_ENDPOINT,
      credentials: fromEnv(), // or any other credential provider
    };

    const getObjectParams = {
      Bucket: process.env.DO_STORE_BUCKET,
      Key: args.filename, // The key (file name) should be provided in the args Optional: specify the content type
    };

    const get_command = new GetObjectCommand(getObjectParams);
    const uploadurl = await getSignedUrl(client, put_command, { expiresIn: 3600 }); // 1 Hour
    const url = await getSignedUrl(client, get_command, { expiresIn: 604800 }); // 1 week
    
    return {
      signed_download_url: args.uploadurl,
      direct_download_url: url,
    };

  } catch (err) {
    throw err;
  }
};

module.exports = {
  addUserActivity,
  canEditExistingEntity,
  getUploadPresignedUrlUtil,
  getDownloadPresignedUrlUtil,
  auth0UserCheck,
};