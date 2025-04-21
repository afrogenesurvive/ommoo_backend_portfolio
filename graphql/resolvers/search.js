const { Op, where } = require('sequelize');
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
const { is } = require('express/lib/request');


const checkSearchFieldAccess = (field, userType) => {

  let access = false;
  switch (userType) {
    case 'admin':
      access = true;
      break;
    case 'member':
      field.userType === 'member' || field.userType === 'all' ? access = true : access = false;
      break;
    case 'guest':
      field.userType === 'all' ? access = true : access = false;
    default:
      break;
  }

  return access;

}

const searchResolver = {
  Query: {
    search: async (_, { searchInput }, { req }) => {

      console.log('Searching all entities... :', searchInput);

      // if (searchInput.userType === 'guest' && !req.raw.isAuth) {
      //   throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      // }

      // CHECK DB USER RECORDS AGAINST SEARCHINPUT USER TYPE
      if (searchInput.userType !== 'guest') {

        if (!req.raw.isAuth) {
          throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
        }

        if (searchInput.userType === 'member') {
          const confirmedUser = await user.findOne({
            where: {
              id: req.raw.user.id,
              verified: true,
              is_deleted: 'N',
            },
          });

          if (!confirmedUser) {
            throw new Error(`Unauthorised: member user not found or not verified}`);
          }
        }

        if (searchInput.userType === 'admin') {
          const confirmedUser = await user.findOne({
            where: {
              id: req.raw.user.id,
              verified: true,
              role: {
                [Op.in]: ['admin', 'ADMIN'],
              },
              is_deleted: 'N',
            },
          });

          if (!confirmedUser) {
            throw new Error(`Unauthorised: admin user not found or not verified}`);
          }
        }
      }

      try {

        const searchTerm = `%${searchInput.term}%`;

        const defaultFields = {
          user: [
            { field: 'id', userType: 'admin' },
            { field: 'username', userType: 'member' },
            { field: 'first_name', userType: 'member' },
            { field: 'last_name', userType: 'admin' },
            { field: 'middle_name', userType: 'admin' },
            { field: 'full_name', userType: 'admin' },
            { field: 'email', userType: 'all' },
            { field: 'type', userType: 'all' },
            { field: 'subtype', userType: 'all' },
            { field: 'dob', userType: 'admin' },
            { field: 'age', userType: 'admin' },
            { field: 'gender', userType: 'admin' },
            { field: 'system_id', userType: 'admin' },
            { field: 'role', userType: 'admin' },
            { field: 'logged_in', userType: 'admin' },
            { field: 'verified', userType: 'admin' },
            { field: 'private', userType: 'admin' },
          ],
          show: [
            { field: 'id', userType: 'admin' },
            { field: 'title', userType: 'all' },
            { field: 'description', userType: 'all' },
            { field: 'production_company_id', userType: 'admin' },
            { field: 'age_recommendation', userType: 'all' },
            { field: 'duration', userType: 'all' },
            { field: 'start_date', userType: 'all' },
            { field: 'end_date', userType: 'all' },
            { field: 'type', userType: 'all' },
            { field: 'average_rating', userType: 'all' },
            { field: 'private', userType: 'admin' },
          ],
          venue: [
            { field: 'id', userType: 'admin' },
            { field: 'name', userType: 'all' },
            { field: 'description', userType: 'all' },
            { field: 'type', userType: 'all' },
            { field: 'accessibility', userType: 'all' },
            { field: 'private', userType: 'admin' },
          ],
          event: [
            { field: 'id', userType: 'admin' },
            { field: 'name', userType: 'all' },
            { field: 'description', userType: 'all' },
            { field: 'type', userType: 'all' },
            { field: 'start_date', userType: 'all' },
            { field: 'end_date', userType: 'all' },
            { field: 'private', userType: 'admin' },
          ],
          review: [
            { field: 'id', userType: 'admin' },
            { field: 'user_id', userType: 'member' },
            { field: 'show_id', userType: 'member' },
            { field: 'venue_id', userType: 'member' },
            { field: 'event_id', userType: 'member' },
            { field: 'show_user_id', userType: 'member' },
            { field: 'venue_show_id', userType: 'member' },
            { field: 'type', userType: 'all' },
            { field: 'review', userType: 'all' },
            { field: 'held', userType: 'all' },
            { field: 'private', userType: 'admin' },
          ],
          rating: [
            { field: 'id', userType: 'admin' },
            { field: 'user_id', userType: 'member' },
            { field: 'show_id', userType: 'member' },
            { field: 'venue_id', userType: 'member' },
            { field: 'event_id', userType: 'member' },
            { field: 'show_user_id', userType: 'member' },
            { field: 'venue_show_id', userType: 'member' },
            { field: 'review_id', userType: 'member' },
            { field: 'type', userType: 'all' },
            { field: 'value', userType: 'all' },
            { field: 'held', userType: 'all' },
            { field: 'private', userType: 'admin' },
          ],
          tag: [
            { field: 'id', userType: 'admin' },
            { field: 'entity_type', userType: 'all' },
            { field: 'entity_id', userType: 'member' },
            { field: 'tag', userType: 'all' },
            { field: 'private', userType: 'admin' },
          ],
          like: [
            { field: 'id', userType: 'admin' },
            { field: 'entity_type', userType: 'all' },
            { field: 'entity_id', userType: 'admin' },
            { field: 'value', userType: 'all' },
            { field: 'private', userType: 'admin' },
          ],
          watchlist: [
            { field: 'id', userType: 'admin' },
            { field: 'user_id', userType: 'member' },
            { field: 'name', userType: 'member' },
            { field: 'description', userType: 'member' },
            { field: 'private', userType: 'admin' },
          ],
          watchlistItem: [
            { field: 'id', userType: 'admin' },
            { field: 'watchlist_id', userType: 'admin' },
            { field: 'show_id', userType: 'member' },
            { field: 'position', userType: 'member' },
            { field: 'private', userType: 'admin' },
          ],
          productionCompany: [
            { field: 'id', userType: 'admin' },
            { field: 'name', userType: 'all' },
            { field: 'description', userType: 'all' },
            { field: 'founded', userType: 'all' },
            { field: 'type', userType: 'all' },
            { field: 'private', userType: 'admin' },
          ]
        };

        let whereObjects = {
          user: {},
          productionCompany: {},
          show: {},
          venue: {},
          event: {},
          review: {},
          rating: {},
          tag: {},
          like: {},
          watchlist: {},
          watchlistItem: {},
        };


        // THESEW WILL BE USED TO BUILD THE WHERE CLAUSES FOR EACH ENTITY
        const whereClauses = {
          user: [],
          productionCompany: [],
          show: [],
          venue: [],
          event: [],
          review: [],
          rating: [],
          tag: [],
          like: [],
          watchlist: [],
          watchlistItem: [],
        };


        // const customSearchFieldExample = {
        //   entity: 'user', //productionCompany, show, venue, event, review, rating, tag, like, watchlist, watchlistItem
        //   field: 'username',
        // }
        // userTypes: admin, member, guest, all


        // CUSTOM FIELDS
        if (searchInput.useCustomFields === true) {
          if (searchInput.customFields.length > 0) {
            
            // THE FIELD/ENTITY OBJECTS IN THE CUSTOM FIELDS SPECIFIED IN THE SEARCH INPUT
            searchInput.customFields.forEach(field => {

              // THIS WILL BE POPULATED WITH THE FIELDS THAT ARE ALLOWED FOR SEARCH BASED ON ACCESS
              allowedFields = [];

              // DEFAULT FIELDS HAS ALL FIELDS FOR EACH ENTITY
              defaultFields[field.entity].forEach(defaultField => {
                // field.entity = user, show, venue etc
                const userTypeAccess = checkSearchFieldAccess(defaultField, searchInput.userType);
                if (userTypeAccess && field.field === defaultField.field) {
                  console.log('field:', field);
                  console.log('defaultField:', defaultField);
                  
                  // THESE ARE THE FIELDS THAT ARE ALLOWED FOR SEARCH BASED ON ACCESS
                  whereClauses[field.entity].push({ [defaultField.field]: { [Op.like]: searchTerm } });
                  console.log('whereClauses:', whereClauses);
                  
                }
              });


            });
                

            // EACH ENTITY WILL HAVE A WHERE CLAUSE OBJECT
            for (const [key, value] of Object.entries(whereClauses)) {
              

              console.log('set where object -- key: ',key);
              console.log('set where object -- value: ',value);

              // WHERE OBJECTS WILL BE USED TO BUILD THE QUERY
              whereObjects[key] = value;
            }
            
          }
          else {
            throw new Error(`No custom fields provided: ${req.raw.error_message || ''}`);
          }
        }

        // CustomFields Notes:

        // if searchInupt.useCustomFields is true,
        //   filter default fields for each entity based on searchInput.userType
        //   set vars for the where object for each entity baased on searchInput.customFields
        
        // else,
        //   filter default fields for each entity based on searchInput.userType
        //   set vars for the where object for each entity based defaultUserFIelds, defaultShowFIelds etc


        // DEFAULT FIELDS ONLY
        else {

          // ONLY ITERATE THOUGH DEFAULT FIELDS
          for (const [key, value] of Object.entries(defaultFields)) {
            value.forEach(defaultField => {
              // console.log('defaultField:', defaultField);
              
                const userTypeAccess = checkSearchFieldAccess(defaultField, searchInput.userType);
                if (userTypeAccess) {
                  whereClauses[key].push({ [defaultField.field]: { [Op.like]: searchTerm } });
                }
              });
          }
          for (const [key, value] of Object.entries(whereClauses)) {
            // console.log(`set where object: ${key}: ${value}`);
            // value.forEach(v => {
            //   console.log('value', v);
            // });
            
            whereObjects[key] = value;
          }

        }

        // DEBUG LOGGING
        // console.log('whereObjects:', whereObjects);
        // for (const [key, value] of Object.entries(whereObjects)) {
        //   console.log(`A: ${key}: ${value}`);
        //   for (const [key2, value2] of Object.entries(value)) {
        //     console.log(`B: ${key2}: ${value2}`);
        //     for (const [key3, value3] of Object.entries(value2)) {
        //       console.log(`C: ${key3}: ${value3}`);
        //       console.log('value',{...value3});
        //     }
        //   }
        // }


        // INCLUDES FOR EACH ENTITY

        const includes = {
          user: [
            {
              associated_enity_name: 'contact',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'phone', userType: 'admin' },
                { field: 'phone2', userType: 'admin' },
                { field: 'email', userType: 'member' },
                { field: 'address', userType: 'admin' },
                { field: 'address2', userType: 'admin' },
                { field: 'state', userType: 'member' },
                { field: 'city', userType: 'member' },
                { field: 'country', userType: 'member' },
                { field: 'postal_code', userType: 'admin' },
              ],
              include: { 
                model: contact, 
                as: 'contacts', 
                foreignKey: 'entity_id' ,
                where: { 
                  is_deleted: 'N',
                },
                required: false,
              },
            },
            { 
              associated_enity_name: 'show_user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'title', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'age_recommendation', userType: 'member' },
                { field: 'duration', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'type', userType: 'member' },
              ],
              include: {
                model: show_user, 
                as: 'show_users', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [
                  {
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
                    where: { 
                      is_deleted: 'N',
                    },
                    required: false,
                  }
                ],
              }
            },
            {
              associated_enity_name: 'venue_user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'accessibility', userType: 'member' },
              ],
              include: { 
                model: venue_user, 
                as: 'venue_users', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [
                  {
                    model: venue, 
                    as: 'venue', 
                    foreignKey: 'venue_id',
                    where: { 
                      is_deleted: 'N',
                    },
                    required: false,
                  }
                ]
              },
            },
            {
              associated_enity_name: 'production_company_user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'founded', userType: 'member' },
                { field: 'type', userType: 'member' },
              ],
              include: { 
                model: production_company_user, 
                as: 'production_company_user', 
                foreignKey: 'user_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [
                  {
                    model: production_company, 
                    as: 'production_company', 
                    foreignKey: 'production_company_id',
                    where: { 
                      is_deleted: 'N',
                    },
                    required: false,
                  }
                ]
              },
            },
            {
              associated_enity_name: 'review',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'review', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: review, 
                as: 'reviews', 
                foreignKey: 'user_id',
                where: { 
                  is_deleted: 'N',
                },
                required: false,
              },
            },
            {
              associated_enity_name: 'rating',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'value', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: rating, 
                as: 'ratings', 
                foreignKey: 'user_id',
                where: { 
                  is_deleted: 'N',
                },
                required: false,
              },
            },
            {
              associated_enity_name: 'like',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'value', userType: 'member' },
              ],
              include: { 
                model: like, 
                as: 'likes', 
                foreignKey: 'entity_id', 
                where: { 
                  is_deleted: 'N',
                }, 
                required: false 
              }
            },
            {
              associated_enity_name: 'file',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'type', userType: 'member' },
                { field: 'filename', userType: 'member' },
                { field: 'filetype', userType: 'member' },
              ],
              include: { 
                model: file, 
                as: 'files', 
                foreignKey: 'entity_id', 
                where: { 
                  is_deleted: 'N',
                }, 
                required: false 
              }
            },
            {
              associated_enity_name: 'tag',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'tag', userType: 'member' },
              ],
              include: {
                model: tag,
                as: 'tags',
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              }
            },
            {
              associated_enity_name: 'watchlist',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
              ],
              include: { 
                model: watchlist, 
                as: 'watchlists', 
                foreignKey: 'user_id',
                where: { 
                  is_deleted: 'N',
                },
                required: false,
                include: [
                  {
                    model: watchlist_item, 
                    as: 'watchlist_items', 
                    foreignKey: 'watchlist_id',
                    where: { is_deleted: 'N' },
                    required: false,
                  }
                ]
              }
            }
          ],
          productionCompany: [
            {
              associated_enity_name: 'contact',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'phone', userType: 'admin' },
                { field: 'phone2', userType: 'admin' },
                { field: 'email', userType: 'member' },
                { field: 'address', userType: 'admin' },
                { field: 'address2', userType: 'admin' },
                { field: 'state', userType: 'member' },
                { field: 'city', userType: 'member' },
                { field: 'country', userType: 'member' },
                { field: 'postal_code', userType: 'admin' },
              ],
              include: { 
                model: contact, 
                as: 'contacts', 
                foreignKey: 'entity_id' ,
                where: { 
                  is_deleted: 'N',
                },
                required: false,
              },
            },
            {
              associated_enity_name: 'production_company_user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'role', userType: 'member' },
              ],
              include: { 
                model: production_company_user, 
                as: 'production_company_user', 
                foreignKey: 'production_company_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'title', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'age_recommendation', userType: 'member' },
                { field: 'duration', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'average_rating', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: show, 
                as: 'shows', 
                foreignKey: 'production_company_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'tag',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'tag', userType: 'member' },
              ],
              include: { 
                model: tag, 
                as: 'tags', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'like',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'value', userType: 'member' },
              ],
              include: { 
                model: like, 
                as: 'likes', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'file',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'filename', userType: 'member' },
                { field: 'filetype', userType: 'member' },
                { field: 'url', userType: 'member' },
              ],
              include: { 
                model: file, 
                as: 'files', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
          ],
          show: [
            {
              associated_enity_name: 'contact',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'phone', userType: 'admin' },
                { field: 'phone2', userType: 'admin' },
                { field: 'email', userType: 'member' },
                { field: 'address', userType: 'admin' },
                { field: 'address2', userType: 'admin' },
                { field: 'state', userType: 'member' },
                { field: 'city', userType: 'member' },
                { field: 'country', userType: 'member' },
                { field: 'postal_code', userType: 'admin' },
              ],
              include: { 
                model: contact, 
                as: 'contacts', 
                foreignKey: 'entity_id' ,
                where: { 
                  is_deleted: 'N',
                },
                required: false,
              },
            },
            {
              associated_enity_name: 'review',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'review', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: review, 
                as: 'reviews', 
                foreignKey: 'show_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'rating',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'review_id', userType: 'admin' },
                { field: 'show_user_id', userType: 'admin' },
                { field: 'venue_show_id', userType: 'admin' },
                { field: 'value', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: rating, 
                as: 'ratings', 
                foreignKey: 'show_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'tag',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'tag', userType: 'member' },
              ],
              include: { 
                model: tag, 
                as: 'tags', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'like',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'value', userType: 'member' },
              ],
              include: { 
                model: like, 
                as: 'likes', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'file',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'filename', userType: 'member' },
                { field: 'filetype', userType: 'member' },
                { field: 'url', userType: 'member' },
              ],
              include: { 
                model: file, 
                as: 'files', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'watchlist_item',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'watchlist_id', userType: 'admin' },
                { field: 'position', userType: 'member' },
              ],
              include: { 
                model: watchlist_item, 
                as: 'watchlist_items', 
                foreignKey: 'show_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'production_company',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'founded', userType: 'member' },
                { field: 'type', userType: 'member' },
              ],
              include: { 
                model: production_company, 
                as: 'production_company', 
                foreignKey: 'production_company_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'show_user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'user_id', userType: 'admin' },
                { field: 'venue_show_id', userType: 'admin' },
                { field: 'attendance_type', userType: 'member' },
              ],
              include: { 
                model: show_user, 
                as: 'show_users', 
                foreignKey: 'show_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue_show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'venue_event_id', userType: 'admin' },
                { field: 'type', userType: 'member' },
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'date', userType: 'member' },
                { field: 'start_time', userType: 'member' },
                { field: 'end_time', userType: 'member' },
                { field: 'active', userType: 'admin' },
              ],
              include: { 
                model: venue_show, 
                as: 'venue_shows', 
                foreignKey: 'show_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
          ],
          venue: [
            {
              associated_enity_name: 'contact',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'phone', userType: 'admin' },
                { field: 'phone2', userType: 'admin' },
                { field: 'email', userType: 'member' },
                { field: 'address', userType: 'admin' },
                { field: 'address2', userType: 'admin' },
                { field: 'state', userType: 'member' },
                { field: 'city', userType: 'member' },
                { field: 'country', userType: 'member' },
                { field: 'postal_code', userType: 'admin' },
              ],
              include: { 
                model: contact, 
                as: 'contacts', 
                foreignKey: 'entity_id' ,
                where: { 
                  is_deleted: 'N',
                },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue_user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'venue_id', userType: 'admin' },
                { field: 'user_id', userType: 'admin' },
                { field: 'type', userType: 'member' },
                { field: 'role', userType: 'member' },
              ],
              include: { 
                model: venue_user, 
                as: 'venue_users', 
                foreignKey: 'venue_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue_show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'venue_event_id', userType: 'admin' },
                { field: 'type', userType: 'member' },
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'date', userType: 'member' },
                { field: 'start_time', userType: 'member' },
                { field: 'end_time', userType: 'member' },
                { field: 'active', userType: 'admin' },
              ],
              include: { 
                model: venue_show, 
                as: 'venue_shows', 
                foreignKey: 'venue_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue_event',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'type', userType: 'member' },
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'active', userType: 'admin' },
              ],
              include: { 
                model: venue_event, 
                as: 'venue_events', 
                foreignKey: 'venue_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'review',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'review', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: review, 
                as: 'reviews', 
                foreignKey: 'venue_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'rating',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'review_id', userType: 'admin' },
                { field: 'show_user_id', userType: 'admin' },
                { field: 'venue_show_id', userType: 'admin' },
                { field: 'value', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: rating, 
                as: 'ratings', 
                foreignKey: 'venue_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'tag',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'tag', userType: 'member' },
              ],
              include: { 
                model: tag, 
                as: 'tags', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'like',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'value', userType: 'member' },
              ],
              include: { 
                model: like, 
                as: 'likes', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'file',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'filename', userType: 'member' },
                { field: 'filetype', userType: 'member' },
                { field: 'url', userType: 'member' },
              ],
              include: { 
                model: file, 
                as: 'files', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
          ],
          event: [
            {
              associated_enity_name: 'venue_show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'venue_event_id', userType: 'admin' },
                { field: 'type', userType: 'member' },
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'date', userType: 'member' },
                { field: 'start_time', userType: 'member' },
                { field: 'end_time', userType: 'member' },
                { field: 'active', userType: 'admin' },
              ],
              include: { 
                model: venue_show, 
                as: 'venue_shows', 
                foreignKey: 'event_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue_event',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'type', userType: 'member' },
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'active', userType: 'admin' },
              ],
              include: { 
                model: venue_event, 
                as: 'venue_events', 
                foreignKey: 'event_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'contact',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'phone', userType: 'admin' },
                { field: 'phone2', userType: 'admin' },
                { field: 'email', userType: 'member' },
                { field: 'address', userType: 'admin' },
                { field: 'address2', userType: 'admin' },
                { field: 'state', userType: 'member' },
                { field: 'city', userType: 'member' },
                { field: 'country', userType: 'member' },
                { field: 'postal_code', userType: 'admin' },
              ],
              include: { 
                model: contact, 
                as: 'contacts', 
                foreignKey: 'entity_id' ,
                where: { 
                  is_deleted: 'N',
                },
                required: false,
              },
            },
            {
              associated_enity_name: 'review',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'review', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: review, 
                as: 'reviews', 
                foreignKey: 'event_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'rating',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'review_id', userType: 'admin' },
                { field: 'show_user_id', userType: 'admin' },
                { field: 'venue_show_id', userType: 'admin' },
                { field: 'value', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: rating, 
                as: 'ratings', 
                foreignKey: 'event_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'tag',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'tag', userType: 'member' },
              ],
              include: { 
                model: tag, 
                as: 'tags', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'like',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'value', userType: 'member' },
              ],
              include: { 
                model: like, 
                as: 'likes', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'file',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'filename', userType: 'member' },
                { field: 'filetype', userType: 'member' },
                { field: 'url', userType: 'member' },
              ],
              include: { 
                model: file, 
                as: 'files', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
          ],
          review: [
            {
              associated_enity_name: 'show_user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'user_id', userType: 'admin' },
                { field: 'venue_show_id', userType: 'admin' },
                { field: 'attendance_type', userType: 'member' },
              ],
              include: { 
                model: show_user, 
                as: 'show_user', 
                foreignKey: 'show_user_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue_show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'venue_event_id', userType: 'admin' },
                { field: 'type', userType: 'member' },
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'date', userType: 'member' },
                { field: 'start_time', userType: 'member' },
                { field: 'end_time', userType: 'member' },
                { field: 'active', userType: 'admin' },
              ],
              include: { 
                model: venue_show, 
                as: 'venue_show', 
                foreignKey: 'show_user_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'username', userType: 'member' },
                { field: 'first_name', userType: 'member' },
                { field: 'last_name', userType: 'member' },
                { field: 'email', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'subtype', userType: 'member' },
                { field: 'dob', userType: 'member' },
                { field: 'age', userType: 'member' },
                { field: 'gender', userType: 'admin' },
                { field: 'logged_in', userType: 'admin' },
                { field: 'verified', userType: 'admin' },
                { field: 'private', userType: 'admin' },
                { field: 'role', userType: 'admin' },
              ],
              include: { 
                model: user, 
                as: 'user', 
                foreignKey: 'user_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'title', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'age_recommendation', userType: 'member' },
                { field: 'duration', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'average_rating', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: show, 
                as: 'show', 
                foreignKey: 'show_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'accessibility', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: venue, 
                as: 'venue', 
                foreignKey: 'venue_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'event',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: event, 
                as: 'event', 
                foreignKey: 'event_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'rating',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'review_id', userType: 'admin' },
                { field: 'show_user_id', userType: 'admin' },
                { field: 'venue_show_id', userType: 'admin' },
                { field: 'value', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: rating, 
                as: 'ratings', 
                foreignKey: 'review_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'tag',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'tag', userType: 'member' },
              ],
              include: { 
                model: tag, 
                as: 'tags', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'like',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'value', userType: 'member' },
              ],
              include: { 
                model: like, 
                as: 'likes', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'file',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'filename', userType: 'member' },
                { field: 'filetype', userType: 'member' },
                { field: 'url', userType: 'member' },
              ],
              include: { 
                model: file, 
                as: 'files', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
          ],
          rating: [
            {
              associated_enity_name: 'show_user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'user_id', userType: 'admin' },
                { field: 'venue_show_id', userType: 'admin' },
                { field: 'attendance_type', userType: 'member' },
              ],
              include: { 
                model: show_user, 
                as: 'show_user', 
                foreignKey: 'show_user_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue_show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'venue_event_id', userType: 'admin' },
                { field: 'type', userType: 'member' },
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'date', userType: 'member' },
                { field: 'start_time', userType: 'member' },
                { field: 'end_time', userType: 'member' },
                { field: 'active', userType: 'admin' },
              ],
              include: { 
                model: venue_show, 
                as: 'venue_show', 
                foreignKey: 'venue_show_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'username', userType: 'member' },
                { field: 'first_name', userType: 'member' },
                { field: 'last_name', userType: 'member' },
                { field: 'email', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'subtype', userType: 'member' },
                { field: 'dob', userType: 'member' },
                { field: 'age', userType: 'member' },
                { field: 'gender', userType: 'admin' },
                { field: 'logged_in', userType: 'admin' },
                { field: 'verified', userType: 'admin' },
                { field: 'private', userType: 'admin' },
                { field: 'role', userType: 'admin' },
              ],
              include: { 
                model: user, 
                as: 'user', 
                foreignKey: 'user_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'title', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'age_recommendation', userType: 'member' },
                { field: 'duration', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'average_rating', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: show, 
                as: 'show', 
                foreignKey: 'show_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'accessibility', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: venue, 
                as: 'venue', 
                foreignKey: 'venue_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'event',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: event, 
                as: 'event', 
                foreignKey: 'event_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'review',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'review_id', userType: 'admin' },
                { field: 'show_user_id', userType: 'admin' },
                { field: 'venue_show_id', userType: 'admin' },
                { field: 'value', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: review, 
                as: 'review', 
                foreignKey: 'review_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
          ],
          tag: [
            {
              associated_enity_name: 'user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'username', userType: 'member' },
                { field: 'first_name', userType: 'member' },
                { field: 'last_name', userType: 'member' },
                { field: 'email', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'subtype', userType: 'member' },
                { field: 'dob', userType: 'member' },
                { field: 'age', userType: 'member' },
                { field: 'gender', userType: 'admin' },
                { field: 'logged_in', userType: 'admin' },
                { field: 'verified', userType: 'admin' },
                { field: 'private', userType: 'admin' },
                { field: 'role', userType: 'admin' },
              ],
              include: { 
                model: user, 
                as: 'user', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'title', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'age_recommendation', userType: 'member' },
                { field: 'duration', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'average_rating', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: show, 
                as: 'show', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'accessibility', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: venue, 
                as: 'venue', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'event',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: event, 
                as: 'event', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'review',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'review_id', userType: 'admin' },
                { field: 'show_user_id', userType: 'admin' },
                { field: 'venue_show_id', userType: 'admin' },
                { field: 'value', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: review, 
                as: 'review', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'production_company',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'founded', userType: 'member' },
                { field: 'type', userType: 'member' },
              ],
              include: { 
                model: production_company, 
                as: 'production_company', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'watchlist',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
              ],
              include: { 
                model: watchlist, 
                as: 'watchlist', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
          ],
          like: [
            {
              associated_enity_name: 'user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'username', userType: 'member' },
                { field: 'first_name', userType: 'member' },
                { field: 'last_name', userType: 'member' },
                { field: 'email', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'subtype', userType: 'member' },
                { field: 'dob', userType: 'member' },
                { field: 'age', userType: 'member' },
                { field: 'gender', userType: 'admin' },
                { field: 'logged_in', userType: 'admin' },
                { field: 'verified', userType: 'admin' },
                { field: 'private', userType: 'admin' },
                { field: 'role', userType: 'admin' },
              ],
              include: { 
                model: user, 
                as: 'user', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'title', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'age_recommendation', userType: 'member' },
                { field: 'duration', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'average_rating', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: show, 
                as: 'show', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'venue',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'accessibility', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: venue, 
                as: 'venue', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'event',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: event, 
                as: 'event', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'review',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'show_id', userType: 'admin' },
                { field: 'venue_id', userType: 'admin' },
                { field: 'event_id', userType: 'admin' },
                { field: 'review_id', userType: 'admin' },
                { field: 'show_user_id', userType: 'admin' },
                { field: 'venue_show_id', userType: 'admin' },
                { field: 'value', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'held', userType: 'member' },
              ],
              include: { 
                model: review, 
                as: 'review', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'production_company',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'founded', userType: 'member' },
                { field: 'type', userType: 'member' },
              ],
              include: { 
                model: production_company, 
                as: 'production_company', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'watchlist',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
              ],
              include: { 
                model: watchlist, 
                as: 'watchlist', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
          ],
          watchlist: [
            {
              associated_enity_name: 'user',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'username', userType: 'member' },
                { field: 'first_name', userType: 'member' },
                { field: 'last_name', userType: 'member' },
                { field: 'email', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'subtype', userType: 'member' },
                { field: 'dob', userType: 'member' },
                { field: 'age', userType: 'member' },
                { field: 'gender', userType: 'admin' },
                { field: 'logged_in', userType: 'admin' },
                { field: 'verified', userType: 'admin' },
                { field: 'private', userType: 'admin' },
                { field: 'role', userType: 'admin' },
              ],
              include: { 
                model: user, 
                as: 'user', 
                foreignKey: 'user_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'tag',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'tag', userType: 'member' },
              ],
              include: { 
                model: tag, 
                as: 'tags', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'like',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'value', userType: 'member' },
              ],
              include: { 
                model: like, 
                as: 'likes', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'file',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'filename', userType: 'member' },
                { field: 'filetype', userType: 'member' },
                { field: 'url', userType: 'member' },
              ],
              include: { 
                model: file, 
                as: 'files', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'watchlist_item',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'show_id', userType: 'admin' },
                { field: 'position', userType: 'member' },
              ],
              include: { 
                model: watchlist_item, 
                as: 'watchlist_items', 
                foreignKey: 'watchlist_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
          ],
          watchlistItem: [
            {
              associated_enity_name: 'show',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'title', userType: 'member' },
                { field: 'description', userType: 'member' },
                { field: 'age_recommendation', userType: 'member' },
                { field: 'duration', userType: 'member' },
                { field: 'start_date', userType: 'member' },
                { field: 'end_date', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'average_rating', userType: 'member' },
                { field: 'private', userType: 'admin' },
              ],
              include: { 
                model: show, 
                as: 'show', 
                foreignKey: 'show_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'file',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'entity_type', userType: 'member' },
                { field: 'type', userType: 'member' },
                { field: 'filename', userType: 'member' },
                { field: 'filetype', userType: 'member' },
                { field: 'url', userType: 'member' },
              ],
              include: { 
                model: file, 
                as: 'files', 
                foreignKey: 'entity_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
            {
              associated_enity_name: 'watchlist',
              userType: 'member',
              userType_fieldAccess: [
                { field: 'user_id', userType: 'admin' },
                { field: 'name', userType: 'member' },
                { field: 'description', userType: 'member' },
              ],
              include: { 
                model: watchlist, 
                as: 'watchlist', 
                foreignKey: 'watchlist_id',
                where: { 
                  is_deleted: 'N',
                 },
                required: false,
              },
            },
          ],
        };

        let finalIncludes = {
          user: [],
          productionCompany: [],
          show: [],
          venue: [],
          event: [],
          review: [],
          rating: [],
          tag: [],
          like: [],
          watchlist: [],
          watchlistItem: [],
        };





        
        // SET INCLUDES w/ CUSTOM SUBFIELDS
        // searchInput.customSubfields = [
        //   { entity: 'user', associated_entity: 'contact', field: 'phone', value: 'subfield_searchterm' },
        // ]

        if (searchInput.useCustomSubfields === true) {
          console.log('Search input has custom subfields');
          
          if (searchInput.customSubfields.length > 0) {
            searchInput.customSubfields.forEach(subfield => {

              const subfield_object = includes[subfield.entity].find((includes_entity) => includes_entity.associated_enity_name === subfield.associated_entity);
              const field_access_userType = subfield_object.userType_fieldAccess.find((field) => field.field === subfield.field)?.userType;
              const userTypeAccess = checkSearchFieldAccess({ userType: field_access_userType }, searchInput.userType);
              if (userTypeAccess) {
                const where_to_set = subfield_object.include.where;
                where_to_set[subfield.field] = { [Op.like]: `%${searchInput.term}%` };
                where_to_set.required = true ;

                // includes[subfield.entity].find((includes_entity) => includes_entity.associated_enity_name === subfield.associated_entity)?.include.where = where_to_set;
                
              }

              // console.log(`subfield: ${subfield}`);
              // console.log(`subfield.entity: ${subfield.entity}`);
              // console.log(`subfield.field: ${subfield.field}`);
              // console.log(`subfield.value: ${subfield.value}`);
              // console.log(`subfield.userType: ${subfield.userType}`);
            });
            
          }
          else {
            throw new Error(`No custom sub fields provided: ${req.raw.error_message || ''}`);
          }
        }


        // POPULATE FINAL INCLUDES
        for (const [key, value] of Object.entries(includes)) {
          console.log(`final includes key: ${key}: value: ${value}`);
          value.forEach(entity_include => {
            if (
              entity_include.associated_enity_name === 'file' || 
              entity_include.associated_enity_name === 'watchlist' ||
              entity_include.associated_enity_name === 'contact'
            ) {
              if (entity_include.include?.where && searchInput.userType !== 'admin') {
                entity_include.include.where.private = false;
              }
            }

            const userTypeAccess = checkSearchFieldAccess({ userType: entity_include.userType }, searchInput.userType);
            if (userTypeAccess) {
              finalIncludes[key].push(entity_include.include);
            }

          });
          
        }


        // GET RECORDS FOR EACH ENTITY BASED ON WHERE OBJECTS

        // TO FIX: ADD ATTRIBUTES TO EXCLUDE BASED ON USER TYPE?

        let final_user_where_objects = {
          user: {
            [Op.or]: whereObjects.user,
            is_deleted: 'N',
          },
          productionCompany: {
            [Op.or]: whereObjects.productionCompany,
            is_deleted: 'N',
          },
          show: {
            [Op.or]: whereObjects.show,
            is_deleted: 'N',
          },
          venue: {
            [Op.or]: whereObjects.venue,
            is_deleted: 'N',
          },
          event: {
            [Op.or]: whereObjects.event,
            is_deleted: 'N',
          },
          review: {
            [Op.or]: whereObjects.review,
            is_deleted: 'N',
          },
          rating: {
            [Op.or]: whereObjects.rating,
            is_deleted: 'N',
          },
          tag: {
            [Op.or]: whereObjects.tag,
            is_deleted: 'N',
          },
          like: {
            [Op.or]: whereObjects.like,
            is_deleted: 'N',
          },
          watchlist: {
            [Op.or]: whereObjects.watchlist,
            is_deleted: 'N',
          },
          watchlistItem: {
            [Op.or]: whereObjects.watchlistItem,
            is_deleted: 'N',
          },
        };
        for (const [key, value] of Object.entries(final_user_where_objects)) {
          // console.log(`final user where objects key: ${key}: value: ${value}`);
          if (
            searchInput.userType !== 'admin' &&
            searchInput.userType !== 'ADMIN'
          ) {
            value.private = false;
          }
        }

        const users = await user.findAll({
          where: {
          [Op.or]: whereObjects.user,
          is_deleted: 'N',
          },
          include: finalIncludes.user,
        });
        const productionCompanies = await production_company.findAll({
          where: {
            [Op.or]: whereObjects.productionCompany,
            is_deleted: 'N',
          },
          include: finalIncludes.productionCompany,
        });
        const shows = await show.findAll({
          where: {
            [Op.or]: whereObjects.show,
            is_deleted: 'N',
          },
          include: finalIncludes.show,
        });
        const venues = await venue.findAll({
          where: {
            [Op.or]: whereObjects.venue,
            is_deleted: 'N',
          },
          include: finalIncludes.venue,
        });
        const events = await event.findAll({
          where: {
            [Op.or]: whereObjects.event,
            is_deleted: 'N',
          },
          include: finalIncludes.event,
        });
        const reviews = await review.findAll({
          where: {
            [Op.or]: whereObjects.review,
            is_deleted: 'N',
          },
          include: finalIncludes.review,
        });
        const ratings = await rating.findAll({
          where: {
            [Op.or]: whereObjects.rating,
            is_deleted: 'N',
          },
          include: finalIncludes.rating,
        });
        const tags = await tag.findAll({
          where: {
            [Op.or]: whereObjects.tag,
            is_deleted: 'N',
          },
          include: finalIncludes.tag,
        });
        const likes = await like.findAll({
          where: {
            [Op.or]: whereObjects.like,
            is_deleted: 'N',
          },
          include: finalIncludes.like,
        });
        const watchlists = await watchlist.findAll({
          where: {
            [Op.or]: whereObjects.watchlist,
            is_deleted: 'N',
          },
          include: finalIncludes.watchlist,
        });
        const watchlistItems = await watchlist_item.findAll({
          where: {
            [Op.or]: whereObjects.watchlistItem,
            is_deleted: 'N',
          },
          include: finalIncludes.watchlistItem,
        });


        // For union type result/entities

        const convertToPlainObject = (instances) => instances.map(instance => instance.get({ plain: true }));

        let entities = null;
        let resultData = [];
        if (searchInput.format === 'grouped') {
          resultData = [
            { label: 'users', value: convertToPlainObject(users) }, // { label: 'users', value: users }  
            { label: 'productionCompanies', value: convertToPlainObject(productionCompanies) },
            { label: 'shows', value: convertToPlainObject(shows) },
            { label: 'venues', value: convertToPlainObject(venues) },
            { label: 'events', value: convertToPlainObject(events) },
            { label: 'reviews', value: convertToPlainObject(reviews) },
            { label: 'ratings', value: convertToPlainObject(ratings) },
            { label: 'tags', value: convertToPlainObject(tags) },
            { label: 'likes', value: convertToPlainObject(likes) },
            { label: 'watchlists', value: convertToPlainObject(watchlists) },
            { label: 'watchlistItems', value: convertToPlainObject(watchlistItems) },
          ];
        }
        
        if (searchInput.format === 'flat') {
          resultData = [
            ...convertToPlainObject(users), //..users
            ...convertToPlainObject(productionCompanies),
            ...convertToPlainObject(shows),
            ...convertToPlainObject(venues),
            ...convertToPlainObject(events),
            ...convertToPlainObject(reviews),
            ...convertToPlainObject(ratings),
            ...convertToPlainObject(tags),
            ...convertToPlainObject(likes),
            ...convertToPlainObject(watchlists),
            ...convertToPlainObject(watchlistItems),
          ];
          // return [{ label: 'flat', value: resultData }];
        }
        // console.log('union Result data:', resultData);
        // entities = resultData:

        // For union type result/entities
        
        const non_union_result = {
          users: users,
          productionCompanies: productionCompanies,
          shows: shows,
          venues: venues,
          events: events,
          reviews: reviews,
          ratings: ratings,
          tags: tags,
          likes: likes,
          watchlists: watchlists,
          watchlistItems: watchlistItems,
        };
        // console.log('Non-union result data:', non_union_result);
        

        return {
          entities: entities,
          data: non_union_result,
        };
        
      } catch (error) {
        throw error;
      }

    },
  },
  SearchEntity: {
    __resolveType: (obj, context, info) => {
      console.log('Resolving type for object:', obj);
      if (obj.username) {
        return 'User';
      }
      if (obj.title) {
        return 'Show';
      }
      if (obj.name && obj.date) {
        return 'Event';
      }
      if (obj.review) {
        return 'Review';
      }
      if (obj.value && obj.user_id) {
        return 'Rating';
      }
      if (obj.tag) {
        return 'Tag';
      }
      if (obj.like) {
        return 'Like';
      }
      if (obj.name && obj.user_id) {
        return 'Watchlist';
      }
      if (obj.position) {
        return 'WatchlistItem';
      }
      if (obj.name && obj.location) {
        return 'Venue';
      }
      if (obj.name && obj.founded) {
        return 'ProductionCompany';
      }
      return null;
    },
  },
  // User: {
  //   isTypeOf: (obj) => obj.username !== undefined,
  // },
  // Show: {
  //   isTypeOf: (obj) => obj.title !== undefined,
  // },
  // Event: {
  //   isTypeOf: (obj) => obj.name !== undefined && obj.date !== undefined,
  // },
  // Review: {
  //   isTypeOf: (obj) => obj.review !== undefined,
  // },
  // Rating: {
  //   isTypeOf: (obj) => obj.value !== undefined && obj.user_id !== undefined,
  // },
  // Tag: {
  //   isTypeOf: (obj) => obj.tag !== undefined,
  // },
  // Like: {
  //   isTypeOf: (obj) => obj.like !== undefined,
  // },
  // Watchlist: {
  //   isTypeOf: (obj) => obj.name !== undefined && obj.user_id !== undefined,
  // },
  // WatchlistItem: {
  //   isTypeOf: (obj) => obj.position !== undefined,
  // },
  // Venue: {
  //   isTypeOf: (obj) => obj.name !== undefined && obj.location !== undefined,
  // },
  // ProductionCompany: {
  //   isTypeOf: (obj) => obj.name !== undefined && obj.founded !== undefined,
  // },
};

module.exports = searchResolver;