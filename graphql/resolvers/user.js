const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');


const { addUserActivity, canEditExistingEntity } = require('../../middleware/utils/utils');

module.exports = {
  Query: {
    getAllUsers: async (_, {args}, { req }) => {
      console.log("Resolver: getAllUsers...",args);

      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const query = JSON.parse(args);
        // console.log('args:', args);
        // console.log('query:', query);
        let include = [];
        let where_like = [];
        let where = { is_deleted: 'N' };

        query.includes.forEach(incl=> {
          switch (incl) {
            case 'contact':
              include.push({ 
                model: contact, 
                as: 'contacts', 
                foreignKey: 'entity_id' ,
                where: { is_deleted: 'N'},
                required: false,
              });
              break;
            case 'user_permission':
              include.push({ 
                model: user_permission, 
                as: 'user_permissions', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'show_user':
              include.push({ 
                model: show_user, 
                as: 'show_users', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [{
                  model: show, 
                  as: 'show', 
                  foreignKey: 'show_id',
                  where: { is_deleted: 'N' },
                  required: false,
                }]
              });
              break;
            case 'venue_user':
              include.push({ 
                model: venue_user, 
                as: 'venue_users', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [{
                  model: venue, 
                  as: 'venue', 
                  foreignKey: 'venue_id',
                  where: { is_deleted: 'N' },
                  required: false,
                }]
              });
              break;
            case 'production_company_user':
              include.push({ 
                model: production_company_user, 
                as: 'production_company_user', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [{
                  model: production_company, 
                  as: 'production_company', 
                  foreignKey: 'production_company_id',
                  where: { is_deleted: 'N' },
                  required: false,
                }]
              });
              break;
            case 'review':
              include.push({ 
                model: review, 
                as: 'reviews', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'rating':
              include.push({ 
                model: rating, 
                as: 'ratings', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'tag':
              include.push({ 
                model: tag, 
                as: 'tags', 
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
            case 'like':
              include.push({ 
              model: like, 
              as: 'likes', 
              foreignKey: 'entity_id', 
              where: { is_deleted: 'N' }, 
              required: false 
              });
              break;
            case 'file':
              include.push({ 
              model: file, 
              as: 'files', 
              foreignKey: 'entity_id', 
              where: { is_deleted: 'N' }, 
              required: false 
              });
              break;
            case 'watchlist':
              include.push({ 
                model: watchlist, 
                as: 'watchlists', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [{
                  model: watchlist_item, 
                  as: 'watchlist_items', 
                  foreignKey: 'watchlist_id',
                  where: { is_deleted: 'N' },
                  required: false,
                }]
              });
              break
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

        // console.log('where:', where);
        // console.log('include:', include);
        
        
        const users = await user.findAll({
          where: where,
          include: include 
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'getAllUsers',
        });


        return users.map(user => {
          return {
            ...user.dataValues,
            _id: user.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
    getUser: async (_, { id }, { req }) => {
      console.log("Resolver: getUserById...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        const user_ = await user.findOne({
          where: { 
            id: id,
            is_deleted: 'N' 
          },
          include: [
            { 
              model: contact, 
              as: 'contacts', 
              foreignKey: 'entity_id' ,
              where: { is_deleted: 'N'},
              required: false,
            },
            { 
              model: user_permission, 
              as: 'user_permissions', 
              foreignKey: 'user_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            { 
              model: show_user, 
              as: 'show_users', 
              foreignKey: 'user_id',
              where: { is_deleted: 'N' },
              required: false,
              include: [{
                model: show, 
                as: 'show', 
                foreignKey: 'show_id',
                where: { is_deleted: 'N' },
                required: false,
              }]
            },
            { 
              model: venue_user, 
              as: 'venue_users', 
              foreignKey: 'user_id',
              where: { is_deleted: 'N' },
              required: false,
              include: [{
                model: venue, 
                as: 'venue', 
                foreignKey: 'venue_id',
                where: { is_deleted: 'N' },
                required: false,
              }]
            },
            { 
              model: production_company_user, 
              as: 'production_company_user', 
              foreignKey: 'user_id',
              where: { is_deleted: 'N' },
              required: false,
              include: [{
                model: production_company, 
                as: 'production_company', 
                foreignKey: 'production_company_id',
                where: { is_deleted: 'N' },
                required: false,
              }]
            },
            { 
              model: review, 
              as: 'reviews', 
              foreignKey: 'user_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            { 
              model: rating, 
              as: 'ratings', 
              foreignKey: 'user_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            { 
              model: tag, 
              as: 'tags', 
              foreignKey: 'entity_id',
              where: { is_deleted: 'N' },
              required: false,
            },
            { 
              model: like, 
              as: 'likes', 
              foreignKey: 'entity_id', 
              where: { is_deleted: 'N' }, 
              required: false 
            },
            { 
              model: file, 
              as: 'files', 
              foreignKey: 'entity_id', 
              where: { is_deleted: 'N' }, 
              required: false 
            },
            { 
              model: watchlist, 
              as: 'watchlists', 
              foreignKey: 'user_id',
              where: { is_deleted: 'N' },
              required: false,
              include: [{
                model: watchlist_item, 
                as: 'watchlist_items', 
                foreignKey: 'watchlist_id',
                where: { is_deleted: 'N' },
                required: false,
              }]
            }
          ]
        });
        if (!user_) {
          throw new Error('User not found');
        }

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'getUser',
        });

        return {
          ...user_.dataValues,
          _id: user_.id
        };
      } catch (err) {
        throw err;
      }
    },
    getUserByQuery: async (_, {args}, { req }) => {
      console.log("Resolver: getUserByQuery...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const query = JSON.parse(args);
        let include = [];
        let where_like = [];
        let where = { is_deleted: 'N' };

        query.includes.forEach(incl=> {
          switch (incl) {
            case 'contact':
              include.push({ 
                model: contact, 
                as: 'contacts', 
                foreignKey: 'entity_id' ,
                where: { is_deleted: 'N'},
                required: false,
              });
              break;
            case 'user_permission':
              include.push({ 
                model: user_permission, 
                as: 'user_permissions', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'show_user':
              include.push({ 
                model: show_user, 
                as: 'show_users', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [{
                  model: show, 
                  as: 'show', 
                  foreignKey: 'show_id',
                  where: { is_deleted: 'N' },
                  required: false,
                }]
              });
              break;
            case 'venue_user':
              include.push({ 
                model: venue_user, 
                as: 'venue_users', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [{
                  model: venue, 
                  as: 'venue', 
                  foreignKey: 'venue_id',
                  where: { is_deleted: 'N' },
                  required: false,
                }]
              });
              break;
            case 'production_company_user':
              include.push({ 
                model: production_company_user, 
                as: 'production_company_user', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [{
                  model: production_company, 
                  as: 'production_company', 
                  foreignKey: 'production_company_id',
                  where: { is_deleted: 'N' },
                  required: false,
                }]
              });
              break;
            case 'review':
              include.push({ 
                model: review, 
                as: 'reviews', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'rating':
              include.push({ 
                model: rating, 
                as: 'ratings', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break;
            case 'tag':
              include.push({ 
                model: tag, 
                as: 'tags', 
                foreignKey: 'entity_id',
                where: { is_deleted: 'N' },
                required: false,
              });
              break
            case 'like':
              include.push({ 
                model: like, 
                as: 'likes', 
                foreignKey: 'entity_id', 
                where: { is_deleted: 'N' }, 
                required: false 
              });
              break;
            case 'file':
              include.push({ 
                model: file, 
                as: 'files', 
                foreignKey: 'entity_id', 
                where: { is_deleted: 'N' }, 
                required: false 
              });
              break;
            case 'watchlist':
              include.push({ 
                model: watchlist, 
                as: 'watchlists', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [{
                  model: watchlist_item, 
                  as: 'watchlist_items', 
                  foreignKey: 'watchlist_id',
                  where: { is_deleted: 'N' },
                  required: false,
                }]
              });
              break
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
        
        const users = await user.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'getUserByQuery',
        });

        return users.map(user => {
          return {
            ...user.dataValues,
            _id: user.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createUser: async (_, { userInput }, { req }) => {
      console.log("Resolver: createUser...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        const existingUser = await user.findOne({
          where: {
            // username: userInput.username,
            email: userInput.email,
            is_deleted: 'N'
          }
        });
  
        if (existingUser) {
          // throw new Error('User with this username & email already exists');
          throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(userInput.password, 12);
        const user_ = await user.create({
          ...userInput,
          password: hashedPassword,
          create_time: moment().format(),
          created_by: req.raw?.user?.id || uuidv4(),
          is_deleted: 'N'
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'createUser',
        });
        
        return {
          ...user_.dataValues,
          _id: user_.id
        };
      } catch (err) {
        throw err;
      }
    },
    updateUser: async (_, { id, userInput }, { req }) => {
      console.log("Resolver: updateUser...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const access = await canEditExistingEntity(req, {
            entity_type: 'user',
            entity_id: id,
        })
        // console.log('access', access);
        
        if (access.error) {
            throw new Error(access.error);
        }

        const user_ = await user.findOne({
          where: { 
            id: id,
            is_deleted: 'N'
          }
        });
      
        await user_.update({
          ...userInput,
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'updateUser',
        });

        return {
          ...user_.dataValues,
          _id: user_.id
        };
      } catch (err) {
        throw err;
      }
    },
    deleteUser: async (_, { id }, { req }) => {
      console.log("Resolver: deleteUser...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        const user_ = await user.findOne({where: {id: id}});
        if (!user_) {
          throw new Error('User not found');
        }
        if (req.raw.user.role !== 'ADMIN') {
          throw new Error('Edit/Delete Access Denied');
        }
        await user_.update({
          is_deleted: 'Y',
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'deleteUser',
        });

        return {
          ...user_.dataValues,
          _id: user_.id
        };
      } catch (err) {
        throw err;
      }
    },
  },
};