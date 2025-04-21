CREATE TABLE IF NOT EXISTS `venue_event` (
  `id` VARCHAR(45) NOT NULL,
  `venue_id` VARCHAR(45) NOT NULL,
  `event_id` VARCHAR(45) NOT NULL,
  `show_id` VARCHAR(45),
  `active` BOOLEAN,
  'type' VARCHAR(255),
  'name' TEXT,
  'description' TEXT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;