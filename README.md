# server
backend


Some database model guidelines/conventions

- show_user is a user attending a show

- a show_user must have a venue_show_id

- a venue_show is a show that happens at a venue

- a venue_show can have a venue_event_id

- a venue event is an event happening at a venue

- a venue_show with a venue_event_id is a show that happens at a venue as part of an event

- a venue user is a non show attendee user such as staff

- when listing shows that can be attended, show venue_shows

- when looking at one venue show, one may see a single associated venue_event

- a review must have a show_user_id AND a venue_show_id

- a rating w/o a review_id must have a show_user_id AND a venue_show_id

- *** In cases where bridge model ids overlap w/ existing model props. The bridge model should dictate the ids of the other properties

- - e.g a review or ratings venue_id should be the same as the review's venue_show.venue_id