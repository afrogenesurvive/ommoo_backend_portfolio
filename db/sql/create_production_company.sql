CREATE TABLE IF NOT EXISTS `production_company` (
  `id` VARCHAR(45) NOT NULL,
  `name` TEXT NOT NULL,
  `description` TEXT,
  `founded` DATETIME,
  `type` VARCHAR(255),
  `display_image_url` TEXT,
  `private` BOOLEAN NOT NULL,
  `create_time` DATETIME NOT NULL,
  `update_time` DATETIME,
  `created_by` VARCHAR(45) NOT NULL,
  `updated_by` VARCHAR(45),
  `is_deleted` varchar(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;