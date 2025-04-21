ALTER TABLE `file`
ADD COLUMN `type` TEXT,

ALTER TABLE `file`
ADD COLUMN `private` BOOLEAN;

ALTER TABLE `user`
ADD COLUMN `display_image_url` TEXT;

ALTER TABLE `show`
ADD COLUMN `display_image_url` TEXT;

ALTER TABLE `event`
ADD COLUMN `display_image_url` TEXT;

ALTER TABLE `venue`
ADD COLUMN `display_image_url` TEXT;

ALTER TABLE `review`
ADD COLUMN `display_image_url` TEXT;

ALTER TABLE `watchlist`
ADD COLUMN `display_image_url` TEXT;

ALTER TABLE `production_company`
ADD COLUMN `display_image_url` TEXT;
