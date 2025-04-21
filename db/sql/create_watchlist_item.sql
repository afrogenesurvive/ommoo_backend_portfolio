CREATE TABLE IF NOT EXISTS `watchlist_item` (
  `id` VARCHAR(45) NOT NULL,
  `watchlist_id` VARCHAR(45) NOT NULL,
  `show_id` VARCHAR(45) NOT NULL,
  `position` INTEGER NOT NULL,
  `private` BOOLEAN NOT NULL,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;