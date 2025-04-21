ALTER TABLE `show_user`
ADD COLUMN `venue_show_id` VARCHAR(45) NOT NULL;

ALTER TABLE `venue_show`
ADD COLUMN `venue_event_id` VARCHAR(45);

ALTER TABLE `review`
ADD COLUMN `show_user_id` VARCHAR(45);

ALTER TABLE `review`
ADD COLUMN `venue_show_id` VARCHAR(45);

ALTER TABLE `rating`
ADD COLUMN `show_user_id` VARCHAR(45);

ALTER TABLE `rating`
ADD COLUMN `venue_show_id` VARCHAR(45);


