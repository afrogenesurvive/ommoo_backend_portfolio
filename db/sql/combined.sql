CREATE TABLE IF NOT EXISTS `activity` (
  `id` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `request` longtext NOT NULL,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `contact` (
  `id` VARCHAR(45) NOT NULL,
  `entity_type` ENUM('USER','PRODUCTION_COMPANY','VENUE','SHOW','EVENT') NOT NULL,
  `entity_id` VARCHAR(45) NOT NULL,
  `primary` BOOLEAN,
  `phone` VARCHAR(255),
  `phone2` VARCHAR(255),
  `email` VARCHAR(255),
  `address` TEXT,
  `address2` TEXT,
  `state` VARCHAR(255),
  `city` VARCHAR(255),
  `country` VARCHAR(255),
  `postal_code` VARCHAR(255),
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `event` (
  `id` VARCHAR(45) NOT NULL,
  `name` TEXT NOT NULL,
  `description` TEXT,
  `type` VARCHAR(255),
  `start_date` DATETIME,
  `end_date` DATETIME,
  `display_image_url` TEXT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `like` (
  `id` VARCHAR(45) NOT NULL,
  `entity_type` ENUM('USER','PRODUCTION_COMPANY','PRODUCTION_COMPANY_USER','VENUE','SHOW','EVENT','REVIEW','WATCHLIST') NOT NULL,
  `entity_id` VARCHAR(45) NOT NULL,
  `value` VARCHAR(1) NOT NULL,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` VARCHAR(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `production_company_user` (
  `id` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `production_company_id` VARCHAR(45) NOT NULL,
  `role` VARCHAR(255),
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `production_company` (
  `id` VARCHAR(45) NOT NULL,
  `name` TEXT NOT NULL,
  `description` TEXT,
  `founded` DATETIME,
  `type` VARCHAR(255),
  `display_image_url` TEXT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `rating` (
  `id` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `show_id` VARCHAR(45) NOT NULL,
  `venue_id` VARCHAR(45) NOT NULL,
  `event_id` VARCHAR(45),
  `review_id` VARCHAR(45),
  `show_user_id` VARCHAR(45),
  `venue_show_id` VARCHAR(45),
  `type` VARCHAR(255) NOT NULL,
  `value` INTEGER NOT NULL,
  `held` BOOLEAN,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `review` (
  `id` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `show_id` VARCHAR(45) NOT NULL,
  `venue_id` VARCHAR(45),
  `event_id` VARCHAR(45),
  `show_user_id` VARCHAR(45) NOT NULL,
  `venue_show_id` VARCHAR(45) NOT NULL,
  `type` ENUM('AUDIENCE','CRITIC'),
  `review` longtext NOT NULL,
  `display_image_url` TEXT,
  `held` BOOLEAN,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `show_user` (
  `id` VARCHAR(45) NOT NULL,
  `show_id` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `venue_show_id` VARCHAR(45) NOT NULL,
  `attendance_type` ENUM('VENUE','PRODUCTION','CAST','CREW','CRITIC','AUDIENCE') NOT NULL,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `show` (
  `id` VARCHAR(45) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `production_company_id` VARCHAR(45),
  `age_recommendation` VARCHAR(255),
  `duration` VARCHAR(255),
  `start_date` DATETIME,
  `end_date` DATETIME,
  `type` ENUM('THEATRE','DANCE','PERFORMANCE_ART','MUSIC'),
  `display_image_url` TEXT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tag` (
  `id` VARCHAR(45) NOT NULL,
  `entity_type` ENUM('USER','PRODUCTION_COMPANY','PRODUCTION_COMPANY_USER','VENUE','SHOW','EVENT','REVIEW','WATCHLIST') NOT NULL,
  `entity_id` VARCHAR(45) NOT NULL,
  `name` TEXT NOT NULL,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user_permission` (
  `id` VARCHAR(45) NOT NULL,
  `name` ENUM('ADD_SHOW','EDIT_SHOW','ADD_USER','EDIT_USER','ADD_VENUE','EDIT_VENUE','ADD_REVIEW','EDIT_REVIEW','ADD_RATING','EDIT_RATING','ADD_EVENT','EDIT_EVENT','ADD_PRODUCTION_COMPANY','EDIT_PRODUCTION_COMPANY') NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `entity_id` VARCHAR(45),
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `user` (
  `id` VARCHAR(45) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `middle_name` VARCHAR(255),
  `full_name` VARCHAR(255),
  `type` VARCHAR(255),
  `subtype` VARCHAR(255),
  `dob` DATETIME NOT NULL,
  `gender` VARCHAR(50),
  `age` INTEGER NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `system_id` VARCHAR(255),
  `notes` TEXT,
  `role` VARCHAR(255),
  `logged_in` BOOLEAN,
  `verified` BOOLEAN,
  `verification_code` VARCHAR(255),
  `verification_type` VARCHAR(255),
  `reset_code` VARCHAR(255),
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `display_image_url` TEXT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

CREATE TABLE IF NOT EXISTS `venue_show` (
  `id` VARCHAR(45) NOT NULL,
  `show_id` VARCHAR(45) NOT NULL,
  `venue_id` VARCHAR(45) NOT NULL,
  `event_id` VARCHAR(45) NOT NULL,
  `venue_event_id` VARCHAR(45),
  `type` VARCHAR(255),
  'name' TEXT,
  'description' TEXT,
  `date` DATETIME NOT NULL,
  `start_time` VARCHAR(255) NOT NULL,
  `end_time` VARCHAR(255),
  `active` BOOLEAN,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `venue_user` (
  `id` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `venue_id` VARCHAR(45) NOT NULL,
  `role` VARCHAR(255),
  `type` TEXT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `venue` (
  `id` VARCHAR(45) NOT NULL,
  `name` TEXT NOT NULL,
  `description` TEXT,
  `type` VARCHAR(255),
  `accessibility` VARCHAR(255),
  `display_image_url` TEXT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `watchlist_item` (
  `id` VARCHAR(45) NOT NULL,
  `watchlist_id` VARCHAR(45) NOT NULL,
  `show_id` VARCHAR(45) NOT NULL,
  `position` INTEGER NOT NULL,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `watchlist` (
  `id` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `name` TEXT NOT NULL,
  `description` TEXT,
  `display_image_url` TEXT,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS `file` (
  `id` VARCHAR(45) NOT NULL,
  `entity_type` ENUM('USER','PRODUCTION_COMPANY','VENUE','SHOW','EVENT','REVIEW','WATCHLIST','WATCHLIST_ITEM') NOT NULL,
  `entity_id` VARCHAR(45) NOT NULL,
  `type` TEXT,
  `filename` TEXT NOT NULL,
  `filetype` TEXT NOT NULL,
  `url` TEXT NOT NULL,
  `path` TEXT NOT NULL,
  `size` DOUBLE,
  `private` BOOLEAN,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;