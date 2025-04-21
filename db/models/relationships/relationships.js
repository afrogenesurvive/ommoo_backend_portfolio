// db/models/relationships.js

module.exports = (db) => {
  const {
    user,
    contact,
    production_company,
    production_company_user,
    venue,
    event,
    show,
    user_permission,
    show_user,
    venue_user,
    venue_show,
    venue_event,
    review,
    rating,
    tag,
    like,
    watchlist,
    watchlist_item,
    activity,
    file
  } = db;

  // user and activity relationships
   user.hasMany(activity, { foreignKey: "user_id", as: "activity" });
   activity.belongsTo(user, { foreignKey: "user_id", as: "user" });

  // user and contact relationships
  user.hasMany(contact, { foreignKey: "entity_id", as: "contacts" });
  contact.belongsTo(user, { foreignKey: "entity_id", as: "user" });

  // production_company and contact relationships
  production_company.hasMany(contact, { foreignKey: "entity_id", as: "contacts" });
  contact.belongsTo(production_company, { foreignKey: "entity_id", as: "production_company" });

  // venue and contact relationships
  venue.hasMany(contact, { foreignKey: "entity_id", as: "contacts" });
  contact.belongsTo(venue, { foreignKey: "entity_id", as: "venue" });

  // event and contact relationships
  event.hasMany(contact, { foreignKey: "entity_id", as: "contacts" });
  contact.belongsTo(event, { foreignKey: "entity_id", as: "event" });

  // show and contact relationships
  show.hasMany(contact, { foreignKey: "entity_id", as: "contacts" });
  contact.belongsTo(show, { foreignKey: "entity_id", as: "show" });



  // user and user_permission relationships
  user.hasMany(user_permission, { foreignKey: "user_id", as: "user_permissions" });
  user_permission.belongsTo(user, { foreignKey: "user_id", as: "user" });


  // user and show_user relationships
  user.hasMany(show_user, { foreignKey: "user_id", as: "show_users" });
  show_user.belongsTo(user, { foreignKey: "user_id", as: "user" });

  // show and show_user relationships
  show.hasMany(show_user, { foreignKey: "show_id", as: "show_users" });
  show_user.belongsTo(show, { foreignKey: "show_id", as: "show" });



  // user and venue_user relationships
  user.hasMany(venue_user, { foreignKey: "user_id", as: "venue_users" });
  venue_user.belongsTo(user, { foreignKey: "user_id", as: "user" });

  // venue and venue_user relationships
  venue.hasMany(venue_user, { foreignKey: "venue_id", as: "venue_users" });
  venue_user.belongsTo(venue, { foreignKey: "venue_id", as: "venue" });



  // production_company and show relationships
  production_company.hasMany(show, { foreignKey: "production_company_id", as: "shows" });
  show.belongsTo(production_company, { foreignKey: "production_company_id", as: "production_company" });



  // venue and venue_show relationships
  venue.hasMany(venue_show, { foreignKey: "venue_id", as: "venue_shows" });
  venue_show.belongsTo(venue, { foreignKey: "venue_id", as: "venue" });

  // show and venue_show relationships
  show.hasMany(venue_show, { foreignKey: "show_id", as: "venue_shows" });
  venue_show.belongsTo(show, { foreignKey: "show_id", as: "show" });
  
  event.hasMany(venue_show, { foreignKey: "event_id", as: "venue_shows" });
  venue_show.belongsTo(event, { foreignKey: "event_id", as: "event" });



  // venue and venue_event relationships
  venue.hasMany(venue_event, { foreignKey: "venue_id", as: "venue_events" });
  venue_event.belongsTo(venue, { foreignKey: "venue_id", as: "venue" });

  // event and venue_event relationships
  event.hasMany(venue_event, { foreignKey: "event_id", as: "venue_events" });
  venue_event.belongsTo(event, { foreignKey: "event_id", as: "event" });
  
  show.hasMany(venue_event, { foreignKey: "show_id", as: "venue_event_shows" });
  venue_event.belongsTo(show, { foreignKey: "show_id", as: "show" });



  // user and review relationships
  user.hasMany(review, { foreignKey: "user_id", as: "reviews" });
  review.belongsTo(user, { foreignKey: "user_id", as: "user" });

  // show and review relationships
  show.hasMany(review, { foreignKey: "show_id", as: "reviews" });
  review.belongsTo(show, { foreignKey: "show_id", as: "show" });

  // venue and review relationships
  venue.hasMany(review, { foreignKey: "venue_id", as: "reviews" });
  review.belongsTo(venue, { foreignKey: "venue_id", as: "venue" });

  // event and review relationships
  event.hasMany(review, { foreignKey: "event_id", as: "reviews" });
  review.belongsTo(event, { foreignKey: "event_id", as: "event" });



  // user and rating relationships
  user.hasMany(rating, { foreignKey: "user_id", as: "ratings" });
  rating.belongsTo(user, { foreignKey: "user_id", as: "user" });

  // event and rating relationships
  event.hasMany(rating, { foreignKey: "event_id", as: "ratings" });
  rating.belongsTo(event, { foreignKey: "event_id", as: "event" });

  // venue and rating relationships
  venue.hasMany(rating, { foreignKey: "venue_id", as: "ratings" });
  rating.belongsTo(venue, { foreignKey: "venue_id", as: "venue" });

  // show and rating relationships
  show.hasMany(rating, { foreignKey: "show_id", as: "ratings" });
  rating.belongsTo(show, { foreignKey: "show_id", as: "show" });

  // review and rating relationships
  review.hasMany(rating, { foreignKey: "review_id", as: "ratings" });
  rating.belongsTo(review, { foreignKey: "review_id", as: "review" });



  // user and tag relationships
  user.hasMany(tag, { foreignKey: "entity_id", as: "tags" });
  tag.belongsTo(user, { foreignKey: "entity_id", as: "user" });

  // event and tag relationships
  event.hasMany(tag, { foreignKey: "entity_id", as: "tags" });
  tag.belongsTo(event, { foreignKey: "entity_id", as: "event" });

  // venue and tag relationships
  venue.hasMany(tag, { foreignKey: "entity_id", as: "tags" });
  tag.belongsTo(venue, { foreignKey: "entity_id", as: "venue" });

  // show and tag relationships
  show.hasMany(tag, { foreignKey: "entity_id", as: "tags" });
  tag.belongsTo(show, { foreignKey: "entity_id", as: "show" });

  // production_company and tag relationships
  production_company.hasMany(tag, { foreignKey: "entity_id", as: "tags" });
  tag.belongsTo(production_company, { foreignKey: "entity_id", as: "production_company" });
  
  // production_company and production_company_user relationships
  production_company.hasMany(production_company_user, { foreignKey: "production_company_id", as: "production_company_user" });
  production_company_user.belongsTo(production_company, { foreignKey: "production_company_id", as: "production_company" });

  // user and production_company_user relationships
  user.hasMany(production_company_user, { foreignKey: "user_id", as: "production_company_user" });
  production_company_user.belongsTo(user, { foreignKey: "user_id", as: "user" });
  
  // production_company_user and tag relationships
  // production_company_user.hasMany(tag, { foreignKey: "entity_id", as: "tags" });
  // tag.belongsTo(production_company_user, { foreignKey: "entity_id", as: "production_company_user" });

  // review and tag relationships
  review.hasMany(tag, { foreignKey: "entity_id", as: "tags" });
  tag.belongsTo(review, { foreignKey: "entity_id", as: "review" });


  // New Relationships

  // user and watchlist relationships
  user.hasMany(watchlist, { foreignKey: "user_id", as: "watchlists" });
  watchlist.belongsTo(user, { foreignKey: "user_id", as: "user" });

  // watchlist and watchlist_item relationships
  watchlist.hasMany(watchlist_item, { foreignKey: "watchlist_id", as: "watchlist_items" });
  watchlist_item.belongsTo(watchlist, { foreignKey: "watchlist_id", as: "watchlist" });

  // watchlist_item and show relationships
  watchlist_item.belongsTo(show, { foreignKey: "show_id", as: "show" });
  show.hasMany(watchlist_item, { foreignKey: "show_id", as: "watchlist_items" });

  // watchlist and tag relationships
  watchlist.hasMany(tag, { foreignKey: "entity_id", as: "tags" });
  tag.belongsTo(watchlist, { foreignKey: "entity_id", as: "watchlist" });

  // user and like relationships
  user.hasMany(like, { foreignKey: "entity_id", as: "likes" });
  like.belongsTo(user, { foreignKey: "entity_id", as: "user" });

  // show and like relationships
  show.hasMany(like, { foreignKey: "entity_id", as: "likes" });
  like.belongsTo(show, { foreignKey: "entity_id", as: "show" });

  // venue and like relationships
  venue.hasMany(like, { foreignKey: "entity_id", as: "likes" });
  like.belongsTo(venue, { foreignKey: "entity_id", as: "venue" });

  // event and like relationships
  event.hasMany(like, { foreignKey: "entity_id", as: "likes" });
  like.belongsTo(event, { foreignKey: "entity_id", as: "event" });

  // production_company and like relationships
  production_company.hasMany(like, { foreignKey: "entity_id", as: "likes" });
  like.belongsTo(production_company, { foreignKey: "entity_id", as: "production_company" });

  // production_company_user and like relationships
  // production_company_user.hasMany(like, { foreignKey: "entity_id", as: "likes" });
  // like.belongsTo(production_company_user, { foreignKey: "entity_id", as: "production_company_user" });

  // review and like relationships
  review.hasMany(like, { foreignKey: "entity_id", as: "likes" });
  like.belongsTo(review, { foreignKey: "entity_id", as: "review" });

  // watchlist and like relationships
  watchlist.hasMany(like, { foreignKey: "entity_id", as: "likes" });
  like.belongsTo(watchlist, { foreignKey: "entity_id", as: "watchlist" });


  // Files Relationships

  // user and file relationships
  user.hasMany(file, { foreignKey: "entity_id", as: "files" });
  file.belongsTo(user, { foreignKey: "entity_id", as: "user" });

  // show and file relationships
  show.hasMany(file, { foreignKey: "entity_id", as: "files" });
  file.belongsTo(show, { foreignKey: "entity_id", as: "show" });

  // venue and file relationships
  venue.hasMany(file, { foreignKey: "entity_id", as: "files" });
  file.belongsTo(venue, { foreignKey: "entity_id", as: "venue" });

  // event and file relationships
  event.hasMany(file, { foreignKey: "entity_id", as: "files" });
  file.belongsTo(event, { foreignKey: "entity_id", as: "event" });

  // production_company and file relationships
  production_company.hasMany(file, { foreignKey: "entity_id", as: "files" });
  file.belongsTo(production_company, { foreignKey: "entity_id", as: "production_company" });

  // review and file relationships
  review.hasMany(file, { foreignKey: "entity_id", as: "files" });
  file.belongsTo(review, { foreignKey: "entity_id", as: "review" });

  // watchlist and file relationships
  watchlist.hasMany(file, { foreignKey: "entity_id", as: "files" });
  file.belongsTo(watchlist, { foreignKey: "entity_id", as: "watchlist" });

  // watchlist_item and file relationships
  watchlist_item.hasMany(file, { foreignKey: "entity_id", as: "files" });
  file.belongsTo(watchlist_item, { foreignKey: "entity_id", as: "watchlist_item" });




  show_user.hasMany(review, { foreignKey: "show_user_id", as: "reviews" });
  review.belongsTo(show_user, { foreignKey: "show_user_id", as: "show_user" });
  
  venue_show.hasMany(review, { foreignKey: "venue_show_id", as: "reviews" });
  review.belongsTo(venue_show, { foreignKey: "venue_show_id", as: "venue_show" });
  
  show_user.hasMany(rating, { foreignKey: "show_user_id", as: "ratings" });
  rating.belongsTo(show_user, { foreignKey: "show_user_id", as: "show_user" });
  
  venue_show.hasMany(rating, { foreignKey: "venue_show_id", as: "ratings" });
  rating.belongsTo(venue_show, { foreignKey: "venue_show_id", as: "venue_show" });
  
  
  venue_show.hasMany(show_user, { foreignKey: "venue_show_id", as: "show_users" });
  show_user.belongsTo(venue_show, { foreignKey: "venue_show_id", as: "venue_show" });
  
  venue_event.hasMany(venue_show, { foreignKey: "venue_event_id", as: "venue_shows" });
  venue_show.belongsTo(venue_event, { foreignKey: "venue_event_id", as: "venue_event" });

};

