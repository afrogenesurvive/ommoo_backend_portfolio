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

  const modelMapping = require('../../db/config/model_mapping');

const { Op } = require('sequelize');
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');

const https = require("node:https");
const { GetObjectCommand, PutObjectCommand, S3Client, S3 } = require("@aws-sdk/client-s3");
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



const {
  addUserActivity, 
  canEditExistingEntity ,
  getUploadPresignedUrlUtil,
  getDownloadPresignedUrlUtil,
} = require('../../middleware/utils/utils');

module.exports = {
  Query: {
    getAllFiles: async (_, { args }, { req }) => {
      console.log("Resolver: getAllFiles...", args);

      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        const query = JSON.parse(args);
        let include = [];
        let where_like = [];
        let where = { is_deleted: 'N' };

        query.includes.forEach(incl => {
          switch (incl) {
            case 'user':
              include.push({
                model: user,
                as: 'user',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'production_company':
              include.push({
                model: production_company,
                as: 'production_company',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'venue':
              include.push({
                model: venue,
                as: 'venue',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'show':
              include.push({
                model: show,
                as: 'show',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'event':
              include.push({
                model: event,
                as: 'event',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'review':
              include.push({
                model: review,
                as: 'review',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'watchlist':
              include.push({
                model: watchlist,
                as: 'watchlist',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'watchlist_item':
              include.push({
                model: watchlist_item,
                as: 'watchlist_item',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            default:
              break;
          }
        });

        query.where_like?.forEach(whl => {
            // where_like.push({[whl.key]: { [Op.like]: `%${whl.value}%` }});
            where[whl.key] = { [Op.like]: `%${whl.value}%` }
        });

        query.where?.forEach(wh => {
            where[wh.key] = wh.value;
        });

        query.where_in_like?.forEach(whi => {
            where[Op.or] = whi.values.map(value => ({
                [whi.key]: { [Op.like]: `%${value}%` }, // Use LIKE for each value
            }));
        });

        query.where_in?.forEach(whi => {
            where[whi.key] = { [Op.in]: whi.values }; 
        });

        const files = await file.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'getAllFiles',
        });

        return files.map(file => {
          return {
            ...file.dataValues,
            _id: file.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
    getFile: async (_, { id }, { req }) => {
      console.log("Resolver: getFile...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        const file_ = await file.findOne({
          where: {
            id: id,
            is_deleted: 'N'
          },
          include: [
            {
              model: user,
              as: 'user',
              foreignKey: 'entity_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            {
              model: production_company,
              as: 'production_company',
              foreignKey: 'entity_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            {
              model: venue,
              as: 'venue',
              foreignKey: 'entity_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            {
              model: show,
              as: 'show',
              foreignKey: 'entity_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            {
              model: event,
              as: 'event',
              foreignKey: 'entity_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            {
              model: review,
              as: 'review',
              foreignKey: 'entity_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            {
              model: watchlist,
              as: 'watchlist',
              foreignKey: 'entity_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            {
              model: watchlist_item,
              as: 'watchlist_item',
              foreignKey: 'entity_id',
              where: { is_deleted: 'N' },
              required: false,
            }
          ]
        });
        if (!file_) {
          throw new Error('File not found');
        }

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'getFile',
        });

        return {
          ...file_.dataValues,
          _id: file_.id
        };
      } catch (err) {
        throw err;
      }
    },
    getFileByQuery: async (_, { args }, { req }) => {
      console.log("Resolver: getFileByQuery...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        const query = JSON.parse(args);
        let include = [];
        let where_like = [];
        let where = { is_deleted: 'N' };

        query.includes.forEach(incl => {
          switch (incl) {
            case 'user':
              include.push({
                model: user,
                as: 'user',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'production_company':
              include.push({
                model: production_company,
                as: 'production_company',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'venue':
              include.push({
                model: venue,
                as: 'venue',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'show':
              include.push({
                model: show,
                as: 'show',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'event':
              include.push({
                model: event,
                as: 'event',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'review':
              include.push({
                model: review,
                as: 'review',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'watchlist':
              include.push({
                model: watchlist,
                as: 'watchlist',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'watchlist_item':
              include.push({
                model: watchlist_item,
                as: 'watchlist_item',
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            default:
              break;
          }
        });
        

        query.where_like?.forEach(whl => {
            // where_like.push({[whl.key]: { [Op.like]: `%${whl.value}%` }});
            where[whl.key] = { [Op.like]: `%${whl.value}%` }
        });

        query.where?.forEach(wh => {
            where[wh.key] = wh.value;
        });

        query.where_in_like?.forEach(whi => {
            where[Op.or] = whi.values.map(value => ({
                [whi.key]: { [Op.like]: `%${value}%` }, // Use LIKE for each value
            }));
        });

        query.where_in?.forEach(whi => {
            where[whi.key] = { [Op.in]: whi.values }; 
        });

        const files = await file.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'getFileByQuery',
        });

        return files.map(file => {
          return {
            ...file.dataValues,
            _id: file.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
    getUploadPresignedUrl: async (_, { args }, { req }) => {
      console.log("Resolver: getUploadPresignedUrl...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const url = await getUploadPresignedUrlUtil(args);
        
        return url;

      } catch (err) {
        throw err;
      }
    },
    getDownloadPresignedUrl: async (_, { args }, { req }) => {
      console.log("Resolver: getDownloadPresignedUrl...",args);
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        
        const url = await getDownloadPresignedUrlUtil({ filename: args.filename });

        return url;

      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createFile: async (_, { fileInput }, { req }) => {
      console.log("Resolver: createFile...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const entityModel = modelMapping[fileInput.entity_type.toLowerCase()];
        const entityExists = await entityModel.findOne({ where: { id: fileInput.entity_id } });
        if (!entityExists) {
          throw new Error(`Entity: ${fileInput.entity_type} not found`);  
        }

        const uploadUrl = await getUploadPresignedUrlUtil({ filename: fileInput.filename });
        const downloadUrl = await getDownloadPresignedUrlUtil({ filename: fileInput.filename });

        const file_ = await file.create({
          ...fileInput,
          url: downloadUrl,
          create_time: moment().format(),
          created_by: req.raw?.user?.id || uuidv4(),
          is_deleted: 'N'
        });


        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'createFile',
        });

        return {
          ...file_.dataValues,
          _id: file_.id,
          awsUploadUrl: uploadUrl,
        };
      } catch (err) {
        throw err;
      }
    },
    updateFile: async (_, { id, fileInput }, { req }) => {
      console.log("Resolver: updateFile...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const entityModel = modelMapping[fileInput.entity_type.toLowerCase()];
        const entityExists = await entityModel.findOne({ where: { id: fileInput.entity_id } });
        if (!entityExists) {
          throw new Error(`Entity: ${fileInput.entity_type} not found`);  
        }


        const access = await canEditExistingEntity(req, {
            entity_type: 'file',
            entity_id: id,
        })
        // console.log('access', access);
        
        if (access.error) {
            throw new Error(access.error);
        }

        const uploadUrl = await getUploadPresignedUrlUtil({ filename: fileInput.filename });
        const downloadUrl = await getDownloadPresignedUrlUtil({ filename: fileInput.filename });

        const file_ = await file.findOne({
          where: { 
            id: id,
            is_deleted: 'N'
          }
        });

        const newUrl = fileInput.newUrl;

        await file_.update({
          ...fileInput,
          url: newUrl === true ? downloadUrl : file_.url,
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'updateFile',
        });

        return {
          ...file_.dataValues,
          _id: file_.id,
          awsUploadUrl:  newUrl === true ? uploadUrl : null,
        };
      } catch (err) {
        throw err;
      }
    },
    deleteFile: async (_, { id }, { req }) => {
      console.log("Resolver: deleteFile...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const access = await canEditExistingEntity(req, {
            entity_type: 'file',
            entity_id: id,
        })
        // console.log('access', access);
        
        if (access.error) {
            throw new Error(access.error);
        }

        const file_ = await file.findOne({ where: { id: id, is_deleted: 'N' } });
        await file_.update({
          is_deleted: 'Y',
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'deleteFile',
        });

        return {
          ...file_.dataValues,
          _id: file_.id
        };
      } catch (err) {
        throw err;
      }
    },
  },
};



