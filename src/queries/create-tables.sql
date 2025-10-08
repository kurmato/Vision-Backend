-- Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `image` VARCHAR(255) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);

-- Contacts Table
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--Requirement Table
CREATE TABLE requirements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eventId INT NULL,
  categoryId INT NULL,
  occasions VARCHAR(255) NOT NULL,
  eventDate DATE NOT NULL,
  city VARCHAR(100) NOT NULL,
  budget DECIMAL(10,2) NULL,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobileNumber VARCHAR(20) NOT NULL,
  additionalInfo TEXT NULL,
  isEmailVerified BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_eventDate (eventDate),
  INDEX idx_city (city),
  CONSTRAINT fk_requirement_event FOREIGN KEY (eventId) REFERENCES events(id),
  CONSTRAINT fk_requirement_category FOREIGN KEY (categoryId) REFERENCES categories(id)
);

-- events Table
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoryId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categoryId (categoryId),
  CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES categories(id)
);

-- actor Table
CREATE TABLE `actors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `categoryId` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `shortDescription` TEXT NULL,
  `profileImage` VARCHAR(255) NULL,
  `tier` ENUM('Premium', 'Standard', 'Basic') NOT NULL DEFAULT 'Standard',
  `eventTiming` VARCHAR(100) NULL,
  `languages` VARCHAR(100) NULL,
  `city` VARCHAR(100) NULL,
  `gender` VARCHAR(50) NULL,
  `genre` VARCHAR(100) NULL,
  `eventType` VARCHAR(100) NULL,
  `storyHeading` VARCHAR(255) NULL,
  `storySubheading` VARCHAR(255) NULL,
  `storyDescription` TEXT NULL,
  `performanceMembers` VARCHAR(100) NULL,
  `performanceTiming` VARCHAR(100) NULL,
  `travelAvailability` TINYINT(1) DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `actors_categoryId_idx` (`categoryId` ASC),
  INDEX `actors_tier_idx` (`tier` ASC),
  INDEX `actors_city_idx` (`city` ASC),
  INDEX `actors_languages_idx` (`languages` ASC),
  INDEX `actors_genre_idx` (`genre` ASC),
  CONSTRAINT `fk_actors_categories`
    FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Actor Gallary Table
CREATE TABLE IF NOT EXISTS actor_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actorId INT NOT NULL,
    imageId INT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_actorId (actorId),
    INDEX idx_imageId (imageId),
    CONSTRAINT fk_actor FOREIGN KEY (actorId) REFERENCES actors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `actor_reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `actorId` INT NOT NULL,
  `userName` VARCHAR(255) NOT NULL,
  `rating` INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  `comment` TEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_actorId` (`actorId`),
  INDEX `idx_rating` (`rating`),
  CONSTRAINT `fk_actor_review_actor` FOREIGN KEY (`actorId`) REFERENCES `actors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(500) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
