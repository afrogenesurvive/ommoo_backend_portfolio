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

const modelMapping = require('../../db/config/model_mapping');


const { addUserActivity, canEditExistingEntity } = require('../../middleware/utils/utils');

module.exports = {
  Query: {
    getAllContacts: async (_, {args}, { req }) => {
      console.log("Resolver: getAllContacts...");
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
                required: false 
              });
              break;
            case 'production_company':
              include.push({ 
                model: production_company, 
                as: 'production_company', 
                foreignKey: 'entity_id', 
                where: { is_deleted: 'N' }, 
                required: false 
              });
              break;
            case 'venue':
              include.push({ 
                model: venue, 
                as: 'venue', 
                foreignKey: 'entity_id', 
                where: { is_deleted: 'N' }, 
                required: false 
              });
              break;
            case 'event':
              include.push({ 
                model: event, 
                as: 'event', 
                foreignKey: 'entity_id', 
                where: { is_deleted: 'N' }, 
                required: false 
              });
              break;
            case 'show':
              include.push({ 
                model: show, 
                as: 'show', 
                foreignKey: 'entity_id', 
                where: { is_deleted: 'N' }, 
                required: false 
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

        const contacts = await contact.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'getAllContacts',
        });

        return contacts.map(contact => {
          return {
            ...contact.dataValues,
            _id: contact.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
    getContact: async (_, { id }, { req }) => {
      console.log("Resolver: getContactById...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        const contact_ = await contact.findOne({
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
              required: false 
            },
            { 
              model: production_company, 
              as: 'production_company', 
              foreignKey: 'entity_id', 
              where: { is_deleted: 'N' }, 
              required: false 
            },
            { 
              model: venue, 
              as: 'venue', 
              foreignKey: 'entity_id', 
              where: { is_deleted: 'N' }, 
              required: false 
            },
            { 
              model: event, 
              as: 'event', 
              foreignKey: 'entity_id', 
              where: { is_deleted: 'N' }, 
              required: false 
            },
            { 
              model: show, 
              as: 'show', 
              foreignKey: 'entity_id', 
              where: { is_deleted: 'N' }, 
              required: false 
            }
          ]
        });
        if (!contact_) {
          throw new Error('Contact not found');
        }

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'getContact',
        });

        return {
          ...contact_.dataValues,
          _id: contact_.id
        };
      } catch (err) {
        throw err;
      }
    },
    getContactByQuery: async (_, {args}, { req }) => {
      console.log("Resolver: getContactByQuery...");
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
                required: false 
              });
              break;
            case 'production_company':
              include.push({ 
                model: production_company, 
                as: 'production_company', 
                foreignKey: 'entity_id', 
                where: { is_deleted: 'N' }, 
                required: false 
              });
              break;
            case 'venue':
              include.push({ 
                model: venue, 
                as: 'venue', 
                foreignKey: 'entity_id', 
                where: { is_deleted: 'N' }, 
                required: false 
              });
              break;
            case 'event':
              include.push({ 
                model: event, 
                as: 'event', 
                foreignKey: 'entity_id', 
                where: { is_deleted: 'N' }, 
                required: false 
              });
              break;
            case 'show':
              include.push({ 
                model: show, 
                as: 'show', 
                foreignKey: 'entity_id', 
                where: { is_deleted: 'N' }, 
                required: false 
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

        const contacts = await contact.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'getContactByQuery',
        });

        return contacts.map(contact => {
          return {
            ...contact.dataValues,
            _id: contact.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createContact: async (_, { contactInput }, { req }) => {
      console.log("Resolver: createContact...");
      if (!req.raw.isAuth) {
          throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
        }
      try {

        const entityModel = modelMapping[contactInput.entity_type.toLowerCase()];
        const entityExists = await entityModel.findOne({ where: { id: contactInput.entity_id } });
        if (!entityExists) {
          throw new Error(`Entity: ${contactInput.entity_type} not found`);  
        }

        const contact_ = await contact.create({
          ...contactInput,
          create_time: moment().format(),
          created_by: req.raw.user.id,
          is_deleted: 'N'
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'createContact',
        });

        return {
          ...contact_.dataValues,
          _id: contact_.id
        };
      } catch (err) {
        throw err;
      }
    },
    updateContact: async (_, { id, contactInput }, { req }) => {
      console.log("Resolver: updateContact...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const entityModel = modelMapping[contactInput.entity_type.toLowerCase()];
        const entityExists = await entityModel.findOne({ where: { id: contactInput.entity_id } });
        if (!entityExists) {
          throw new Error(`Entity: ${contactInput.entity_type} not found`);  
        }

        const access = await canEditExistingEntity(req, {
          entity_type: 'contact',
          entity_id: id,
      })
      // console.log('access', access);
      
      if (access.error) {
          throw new Error(access.error);
      }
        
        const contact_ = await contact.findOne({
          where: { 
            id: id,
            is_deleted: 'N'
          }
        });

        await contact_.update({
          ...contactInput,
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'updateContact',
        });

        return {
          ...contact_.dataValues,
          _id: contact_.id
        };
      } catch (err) {
        throw err;
      }
    },
    deleteContact: async (_, { id }, { req }) => {
      console.log("Resolver: deleteContact...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const access = await canEditExistingEntity(req, {
            entity_type: 'contact',
            entity_id: id,
        })
        // console.log('access', access);
        
        if (access.error) {
            throw new Error(access.error);
        }

        const contact_ = await contact.findOne({ where: { id: id, is_deleted: 'N' } });
        
        await contact_.update({
          is_deleted: 'Y',
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
          user_id: req.raw?.user?.id,
          request: 'deleteContact',
        });

        return {
          ...contact_.dataValues,
          _id: contact_.id
        };
      } catch (err) {
        throw err;
      }
    },
  }
};