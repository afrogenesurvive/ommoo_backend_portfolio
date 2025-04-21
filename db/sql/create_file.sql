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