ALTER TABLE `venue_show`
DROP COLUMN `start_time`;

ALTER TABLE `venue_show`
DROP COLUMN `end_time`;

ALTER TABLE `venue_show`
ADD COLUMN `start_time` VARCHAR(255) NOT NULL;

ALTER TABLE `venue_show`
ADD COLUMN `end_time` VARCHAR(255);



ALTER TABLE `venue_event`
ADD COLUMN `type` VARCHAR(255);

ALTER TABLE `venue_event`
ADD COLUMN `name` TEXT;

ALTER TABLE `venue_event`
ADD COLUMN `description` TEXT;

ALTER TABLE `venue_show`
ADD COLUMN `name` TEXT;

ALTER TABLE `venue_show`
ADD COLUMN `description` TEXT;

ALTER TABLE `venue_user`
ADD COLUMN `type` TEXT;



ALTER TABLE `venue_show`
ADD COLUMN `event_id` VARCHAR(45) NOT NULL;



ALTER TABLE `review`
ADD COLUMN `held` BOOLEAN;

ALTER TABLE `rating`
ADD COLUMN `held` BOOLEAN;