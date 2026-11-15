-- FrameFusion Production MySQL Dump
-- Target: MySQL 5.7+ / 8.0+ / MariaDB 10.3+
-- Generated on 2026-11-15 04:47:59

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- Table structure for `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `status` varchar(50) NOT NULL DEFAULT 'active',
  `social_links` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `username`, `avatar_url`, `bio`, `role`, `status`, `social_links`) VALUES ('1', 'FrameFusion Admin', 'admin@framefusion.com', NULL, '$2y$12$tJYZesRD.VFh8cYOyZpN8u1afwrFrOLR0Zkxt7MuP3bmDQbNorMjC', NULL, '2026-11-14 13:02:39', '2026-11-14 13:02:39', 'admin', NULL, 'Official platform administrator for FrameFusion.', 'admin', 'active', NULL);
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `username`, `avatar_url`, `bio`, `role`, `status`, `social_links`) VALUES ('2', 'Rahim Creative Studio', 'creator@framefusion.com', NULL, '$2y$12$hZxUQrqXN9Ytmhk1/HomrOa0CYEm4c7ZMzu7GOS/shGMNsb4pkyC2', NULL, '2026-11-14 13:02:40', '2026-11-14 13:02:40', 'rahim_studio', NULL, 'Visual artist and campaign designer crafting viral twibbons.', 'creator', 'active', NULL);
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `username`, `avatar_url`, `bio`, `role`, `status`, `social_links`) VALUES ('3', 'Ayesha Khan', 'user@framefusion.com', NULL, '$2y$12$4McEw3YZ00GMEA2G65xAheri9uTSr9Taj2fncrYta3QfEoobAUOqa', NULL, '2026-11-14 13:02:41', '2026-11-14 13:02:41', 'ayesha_k', NULL, 'Student activist and design enthusiast.', 'user', 'active', NULL);

-- Table structure for `password_reset_tokens`
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `sessions`
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `sessions`
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('ru20zk0OLcxTngVBmQRGuIwAy7gnExMwLwHxhEQN', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiJjWHBtZlhCVm95dFhJYW1DTlVMQnpSUlJyVUU4Z1YyNklTeThrS2VLIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1794662339');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('4eDdvZLjx8Gpw3NUZUDdxLNV2yDzMECkUWi79gMi', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiJ1V2VuNmVVRXlTWk9vQ3pIa3dQT2YwMU9jbEkzTUlGMVh4MDFiN1ZMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9leHBsb3JlIiwicm91dGUiOiJjYW1wYWlnbnMuZXhwbG9yZSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', '1794662353');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('BfqlIKN7n5T75gBK8BmBhZE84OnTZb3AmC9JKYHi', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiIwN0swNkJnRWdzcmhnYnVFNkJ1NGxpMjJNQnUzTm9DcmNrazV5Y2RNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC90cmVuZGluZyIsInJvdXRlIjoiY2FtcGFpZ25zLnRyZW5kaW5nIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', '1794662354');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('e2LzNRffD3aopVvup3SNyyTpR5ALRSxQrUhjAEx1', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiJIcjY0WEhiUWRtSVlGNU5lNmZaUUNXWkJXeXFweTRxTmJ4S080dm4wIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9jYXRlZ29yaWVzIiwicm91dGUiOiJjYW1wYWlnbnMuY2F0ZWdvcmllcyJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', '1794662355');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('ZqGkH48eBskTDV2KJ8Bz1EHB0fT8lIYlkCoQTn6e', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiI0RkMyRzlQZVRYWjJIME9YQTlSWExKQzlXZTkyT1R0OWRCQnl5dlhJIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9jYW1wYWlnbnNcL2JhbmdsYWRlc2gtaW5kZXBlbmRlbmNlLWRheSIsInJvdXRlIjoiY2FtcGFpZ25zLnNob3cifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1794662356');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('akTrBlF2zaBteGXmEvD5ZOlykJFe0pVA6Bfc2ixc', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiJKVUJzN2RPRDl4a1E2MEdtYWtUNmxlaURielM5cENUeXowdVBQRXl2IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9jYW1wYWlnbnNcL2JhbmdsYWRlc2gtaW5kZXBlbmRlbmNlLWRheVwvZWRpdG9yIiwicm91dGUiOiJjYW1wYWlnbnMuZWRpdG9yIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', '1794662356');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('nqg1f7a4cxsvk64Zkeijs7MwGio0JTXbq7NQWIuJ', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiJZMndtY2EwVGZucmhiNE8yRFFGb1hXQTBJWURibzdhUXF2MGFiMDh5IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9ob3ctaXQtd29ya3MiLCJyb3V0ZSI6Imhvdy1pdC13b3JrcyJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', '1794662357');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('AZatmAHvgMfq5Edxqqp5wErU99sDFZc2rvF40YMo', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiJRR3d0aDlJeTRuODQ4YWY5TTh1eFluYnNBWlRxblZtMlN3Y2RnYWdwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9hYm91dCIsInJvdXRlIjoiYWJvdXQifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1794662358');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('vEaglaNoeUbaDNFnQpojHU1L3azPZd84G3G5o6W9', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiJXY3lsTjJCVTB0TlNIem9DM1dEU1E5SnZEQlloZEpwUnRRZExVc3pnIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9jb250YWN0Iiwicm91dGUiOiJjb250YWN0In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', '1794662358');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('Ny6TZc4lghtucQcmF8qlfqZjLiDycNMYiFKu2izL', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiIxdmhGc0tOVXJ3YUxxcE5vSEFkcUEyVTg1S216bEdaa0wzME51VmJFIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9wcml2YWN5Iiwicm91dGUiOiJwcml2YWN5In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', '1794662359');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('e7pB1Z2gDD7jCbpb0mJ7NvzUbkWVzA4o7jNqwKTn', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiIxajhmUUcwZjhodzV3SFZjV2tNa0hUaXF3a1U0TUxlYmVLemh1VVJJIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC90ZXJtcyIsInJvdXRlIjoidGVybXMifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1794662360');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('tIsiAFBK0l3kZgMcbPwTgUpXDLruZxu5isW9W6vB', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiJYcXZvREhEczdybE5BbFhGTWFCQ2xCd1lyMVU2MWJqaW52d01zTktuIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1794662360');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('0jeM1YecaX0PSDTO0qLsIOvTYkdlSK7qIZ2INGFa', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.7844', 'eyJfdG9rZW4iOiJJcHFRQW1zV2RUM1ZsbkFnZ1Z4UXBOOVRMZ2wwTlJUczlVWWRwQkZSIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1794662383');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('3UjWaevSKzE7dNLJzxKD7R3Aab7A3uXVh5GblLIQ', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiJ5SjFZbFhNWWdrdWhqU0YwTkhLTFhyanJEQk5hU092VHlaMXFKUlBVIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1794662553');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('dvxDrlauGHW8DQFIPaB4hiQsIMstf8sxDMkXlsv7', NULL, '127.0.0.1', 'curl/8.13.0', 'eyJfdG9rZW4iOiJXVDVKU0gzY0NYRTc2MXVuNEJ5b2xIOFA0dGR5S2VSZXNWZmZKTnBRIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1794662574');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('0L35784hgEh6kIHYcbUHZCKshPx2f0OCiO7HPbFP', '1', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJDa25qMG5yU0ZvYTVzNzNaekVBMzhDelA0a3VUZVkyYVMwQnMzMnlTIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjEsInBhc3N3b3JkX2hhc2hfd2ViIjoiYzg5OWZmMmU1M2M5MGFhNzkwZTE3ZTg3ZjU5ZTc5YmU3OWYyZDc3ZDY0NTRkZjEwY2UzOTkyZTM5MmU2ZDhlZiJ9', '1794663323');

-- Table structure for `cache`
DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `cache`
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES ('framefusion-cache-admin@shubban.org|127.0.0.1:timer', 'i:1794662842;', '1794662842');
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES ('framefusion-cache-admin@shubban.org|127.0.0.1', 'i:1;', '1794662842');

-- Table structure for `cache_locks`
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `jobs`
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `job_batches`
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `failed_jobs`
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `categories`
DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `name_bn` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_bn` text DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `categories`
INSERT INTO `categories` (`id`, `name`, `name_bn`, `slug`, `icon`, `description`, `description_bn`, `is_featured`, `order`, `created_at`, `updated_at`) VALUES ('1', 'National & Festivals', 'জাতীয় ও উৎসব', 'national-festivals', 'Flag', 'Celebrate national holidays, independence, and joyous cultural festivals.', 'জাতীয় দিবস, স্বাধীনতা এবং আনন্দময় সাংস্কৃতিক উৎসব উদযাপন করুন।', '1', '1', '2026-11-14 13:02:41', '2026-11-14 13:02:41');
INSERT INTO `categories` (`id`, `name`, `name_bn`, `slug`, `icon`, `description`, `description_bn`, `is_featured`, `order`, `created_at`, `updated_at`) VALUES ('2', 'Education & University', 'শিক্ষা ও বিশ্ববিদ্যালয়', 'education-university', 'GraduationCap', 'Convocation, university batches, admission, and school spirit frames.', 'সমাবর্তন, বিশ্ববিদ্যালয় ব্যাচ, ভর্তি এবং শিক্ষা প্রতিষ্ঠানের ক্যাম্পেইন ফ্রেম।', '1', '2', '2026-11-14 13:02:41', '2026-11-14 13:02:41');
INSERT INTO `categories` (`id`, `name`, `name_bn`, `slug`, `icon`, `description`, `description_bn`, `is_featured`, `order`, `created_at`, `updated_at`) VALUES ('3', 'Technology & Innovation', 'প্রযুক্তি ও উদ্ভাবন', 'technology-innovation', 'Cpu', 'Tech conferences, AI meetups, hackathons, and developer rallies.', 'প্রযুক্তি সম্মেলন, এআই মিটআপ, হ্যাকাথন এবং ডেভেলপারদের ক্যাম্পেইন।', '1', '3', '2026-11-14 13:02:42', '2026-11-14 13:02:42');
INSERT INTO `categories` (`id`, `name`, `name_bn`, `slug`, `icon`, `description`, `description_bn`, `is_featured`, `order`, `created_at`, `updated_at`) VALUES ('4', 'Social Awareness', 'সামাজিক সচেতনতা', 'social-awareness', 'HeartHandshake', 'Health awareness, climate action, charity drives, and community causes.', 'স্বাস্থ্য সচেতনতা, জলবায়ু সুরক্ষা, দান ও জনকল্যাণমূলক সামাজিক উদ্যোগ।', '1', '4', '2026-11-14 13:02:42', '2026-11-14 13:02:42');
INSERT INTO `categories` (`id`, `name`, `name_bn`, `slug`, `icon`, `description`, `description_bn`, `is_featured`, `order`, `created_at`, `updated_at`) VALUES ('5', 'Sports & Gaming', 'খেলাধুলা ও গেমিং', 'sports-gaming', 'Trophy', 'World cup fever, premier leagues, esports tournaments, and team cheers.', 'বিশ্বকাপ উত্তেজনা, প্রিমিয়ার লিগ, ই-স্পোর্টস এবং প্রিয় দলের সমর্থন।', '1', '5', '2026-11-14 13:02:43', '2026-11-14 13:02:43');
INSERT INTO `categories` (`id`, `name`, `name_bn`, `slug`, `icon`, `description`, `description_bn`, `is_featured`, `order`, `created_at`, `updated_at`) VALUES ('6', 'Business & Branding', 'ব্যবসা ও ব্র্যান্ডিং', 'business-branding', 'Briefcase', 'Corporate milestones, webinars, hiring announcements, and company pride.', 'কর্পোরেট মাইলফলক, ওয়েবিনার, নিয়োগ বিজ্ঞপ্তি এবং প্রতিষ্ঠানের প্রচার।', '0', '6', '2026-11-14 13:02:43', '2026-11-14 13:02:43');

-- Table structure for `campaigns`
DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `creator_id` bigint(20) unsigned NOT NULL,
  `category_id` bigint(20) unsigned DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `title_bn` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `description_bn` text DEFAULT NULL,
  `campaign_type` varchar(50) NOT NULL DEFAULT 'frame',
  `frame_url` varchar(255) NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `background_url` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'published',
  `visibility` varchar(50) NOT NULL DEFAULT 'public',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_trending` tinyint(1) NOT NULL DEFAULT 0,
  `supporters_count` int(11) NOT NULL DEFAULT 0,
  `views_count` int(11) NOT NULL DEFAULT 0,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `campaigns_slug_unique` (`slug`),
  KEY `campaigns_creator_id_foreign` (`creator_id`),
  KEY `campaigns_category_id_foreign` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `campaigns`
INSERT INTO `campaigns` (`id`, `creator_id`, `category_id`, `title`, `title_bn`, `slug`, `description`, `description_bn`, `campaign_type`, `frame_url`, `thumbnail_url`, `background_url`, `status`, `visibility`, `is_featured`, `is_trending`, `supporters_count`, `views_count`, `start_date`, `end_date`, `tags`, `created_at`, `updated_at`) VALUES ('1', '2', '1', 'Bangladesh Independence Day 2026', 'মহান স্বাধীনতা ও জাতীয় দিবস ২০২৬', 'bangladesh-independence-day', 'Commemorate the heroic sacrifice of our martyrs and celebrate 55 years of proud freedom and unity with our official national frame.', 'আমাদের বীর শহীদদের আত্মত্যাগের প্রতি শ্রদ্ধা নিবেদন করে ও গর্বিত স্বাধীনতার ৫৫ বছর উদযাপন করতে যুক্ত হন আমাদের অফিসিয়াল ফ্রেমে।', 'frame', '/storage/frames/bangladesh-independence.png', '/storage/frames/bangladesh-independence.png', NULL, 'published', 'public', '1', '1', '14251', '38901', '2026-11-04 13:02:43', '2027-01-13 13:02:43', 'independence,bangladesh,26march,freedom,victory', '2026-11-14 13:02:43', '2026-11-14 13:22:53');
INSERT INTO `campaigns` (`id`, `creator_id`, `category_id`, `title`, `title_bn`, `slug`, `description`, `description_bn`, `campaign_type`, `frame_url`, `thumbnail_url`, `background_url`, `status`, `visibility`, `is_featured`, `is_trending`, `supporters_count`, `views_count`, `start_date`, `end_date`, `tags`, `created_at`, `updated_at`) VALUES ('2', '2', '2', 'Class of 2026 Graduation Pride', 'ক্লাস অফ ২০২৬ গ্র্যাজুয়েশন সেলিব্রেশন', 'class-of-2026-graduation-pride', 'You did it! Wear your graduation cap proudly, customize your convocation photo, and share your milestone with friends and family.', 'আপনার গ্র্যাজুয়েশন অর্জনকে স্মরণীয় করে রাখুন এবং সমাবর্তনের আনন্দ বন্ধুদের সাথে শেয়ার করুন।', 'frame', '/storage/frames/graduation-2026.png', '/storage/frames/graduation-2026.png', NULL, 'published', 'public', '1', '1', '9820', '24100', '2026-11-04 13:02:45', '2027-01-13 13:02:45', 'graduation,convocation,classof2026,university,achievement', '2026-11-14 13:02:45', '2026-11-14 13:02:45');
INSERT INTO `campaigns` (`id`, `creator_id`, `category_id`, `title`, `title_bn`, `slug`, `description`, `description_bn`, `campaign_type`, `frame_url`, `thumbnail_url`, `background_url`, `status`, `visibility`, `is_featured`, `is_trending`, `supporters_count`, `views_count`, `start_date`, `end_date`, `tags`, `created_at`, `updated_at`) VALUES ('3', '2', '3', 'Future AI & Global Tech Summit', 'ফিউচার এআই ও গ্লোবাল টেক সামিট', 'future-ai-tech-summit-2026', 'Official attendee, speaker, and delegate badge frame for the premier Artificial Intelligence and Cloud Innovation conference.', 'বিশ্বসেরা এআই ও প্রযুক্তি সম্মেলনের প্রতিনিধি ও ডেলিগেটদের অফিসিয়াল ফ্রেম।', 'frame', '/storage/frames/tech-summit-2026.png', '/storage/frames/tech-summit-2026.png', NULL, 'published', 'public', '1', '1', '6430', '18700', '2026-11-04 13:02:47', '2027-01-13 13:02:47', 'ai,tech,conference,developer,summit', '2026-11-14 13:02:47', '2026-11-14 13:02:47');
INSERT INTO `campaigns` (`id`, `creator_id`, `category_id`, `title`, `title_bn`, `slug`, `description`, `description_bn`, `campaign_type`, `frame_url`, `thumbnail_url`, `background_url`, `status`, `visibility`, `is_featured`, `is_trending`, `supporters_count`, `views_count`, `start_date`, `end_date`, `tags`, `created_at`, `updated_at`) VALUES ('4', '2', '4', 'Earth Hour & Climate Action Champion', 'ধরিত্রী রক্ষা ও জলবায়ু সচেতনতা আন্দোলন', 'earth-hour-climate-champion', 'Stand up for renewable energy, environmental justice, and reforestation. Join thousands of youth pledging for our green planet.', 'একটি সবুজ ও বাসযোগ্য পৃথিবীর প্রত্যয়ে জলবায়ু সুরক্ষা আন্দোলনে একাত্মতা প্রকাশ করুন।', 'frame', '/storage/frames/earth-day.png', '/storage/frames/earth-day.png', NULL, 'published', 'public', '1', '0', '5210', '13400', '2026-11-04 13:02:49', '2027-01-13 13:02:49', 'earth,green,climate,nature,environment', '2026-11-14 13:02:49', '2026-11-14 13:02:49');
INSERT INTO `campaigns` (`id`, `creator_id`, `category_id`, `title`, `title_bn`, `slug`, `description`, `description_bn`, `campaign_type`, `frame_url`, `thumbnail_url`, `background_url`, `status`, `visibility`, `is_featured`, `is_trending`, `supporters_count`, `views_count`, `start_date`, `end_date`, `tags`, `created_at`, `updated_at`) VALUES ('5', '2', '5', 'Champions Football League Carnival', 'চ্যাম্পিয়ন্স ফুটবল ফ্যান কার্নিভাল', 'champions-football-carnival', 'Unite with your fellow supporters, gear up for the grand finals, and show your team devotion with this stadium frame.', 'ফুটবল উন্মাদনায় মেতে উঠুন এবং আপনার প্রিয় ক্লাবের সমর্থনে প্রোফাইল ছবি সাজিয়ে নিন।', 'frame', '/storage/frames/champions-league.png', '/storage/frames/champions-league.png', NULL, 'published', 'public', '0', '1', '8740', '29800', '2026-11-04 13:02:52', '2027-01-13 13:02:52', 'football,soccer,champions,matchday,sports', '2026-11-14 13:02:52', '2026-11-14 13:02:52');
INSERT INTO `campaigns` (`id`, `creator_id`, `category_id`, `title`, `title_bn`, `slug`, `description`, `description_bn`, `campaign_type`, `frame_url`, `thumbnail_url`, `background_url`, `status`, `visibility`, `is_featured`, `is_trending`, `supporters_count`, `views_count`, `start_date`, `end_date`, `tags`, `created_at`, `updated_at`) VALUES ('6', '2', '1', 'Eid Mubarak Festive Greetings', 'ঈদ মোবারক শুভেচ্ছা ও আনন্দবার্তা', 'eid-mubarak-festive-greetings', 'Spread festive love, harmony, and warm smiles with our elegant crescent and lantern greeting frame.', 'পবিত্র ঈদের আনন্দ ছড়িয়ে দিন সবার মাঝে আমাদের নান্দনিক ফ্রেমের মাধ্যমে।', 'frame', '/storage/frames/eid-mubarak.png', '/storage/frames/eid-mubarak.png', NULL, 'published', 'public', '1', '1', '11200', '31500', '2026-11-04 13:02:55', '2027-01-13 13:02:55', 'eid,mubarak,celebration,festive,islamic', '2026-11-14 13:02:55', '2026-11-14 13:02:55');
INSERT INTO `campaigns` (`id`, `creator_id`, `category_id`, `title`, `title_bn`, `slug`, `description`, `description_bn`, `campaign_type`, `frame_url`, `thumbnail_url`, `background_url`, `status`, `visibility`, `is_featured`, `is_trending`, `supporters_count`, `views_count`, `start_date`, `end_date`, `tags`, `created_at`, `updated_at`) VALUES ('7', '1', '2', 'dsff', 'াুিা', 'dsff', 'dsfsd', 'ুািা', 'frame', '/storage/frames/1794663061_dsff.png', '/storage/frames/1794663061_dsff.png', NULL, 'published', 'public', '0', '0', '1', '2', '2026-11-14 13:31:02', NULL, 'sdff', '2026-11-14 13:31:02', '2026-11-14 13:31:03');

-- Table structure for `campaign_frames`
DROP TABLE IF EXISTS `campaign_frames`;
CREATE TABLE IF NOT EXISTS `campaign_frames` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint(20) unsigned NOT NULL,
  `frame_url` varchar(255) NOT NULL,
  `canvas_width` int(11) NOT NULL DEFAULT 1080,
  `canvas_height` int(11) NOT NULL DEFAULT 1080,
  `aspect_ratio` varchar(50) NOT NULL DEFAULT '1:1',
  `photo_area_config` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `campaign_frames_campaign_id_foreign` (`campaign_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `campaign_frames`
INSERT INTO `campaign_frames` (`id`, `campaign_id`, `frame_url`, `canvas_width`, `canvas_height`, `aspect_ratio`, `photo_area_config`, `created_at`, `updated_at`) VALUES ('1', '1', '/storage/frames/bangladesh-independence.png', '1080', '1080', '1:1', '{\"x\":0,\"y\":0,\"width\":1080,\"height\":1080,\"zoom\":1,\"rotation\":0,\"style\":\"center-fill\"}', '2026-11-14 13:02:44', '2026-11-14 13:02:44');
INSERT INTO `campaign_frames` (`id`, `campaign_id`, `frame_url`, `canvas_width`, `canvas_height`, `aspect_ratio`, `photo_area_config`, `created_at`, `updated_at`) VALUES ('2', '2', '/storage/frames/graduation-2026.png', '1080', '1080', '1:1', '{\"x\":0,\"y\":0,\"width\":1080,\"height\":1080,\"zoom\":1,\"rotation\":0,\"style\":\"center-fill\"}', '2026-11-14 13:02:46', '2026-11-14 13:02:46');
INSERT INTO `campaign_frames` (`id`, `campaign_id`, `frame_url`, `canvas_width`, `canvas_height`, `aspect_ratio`, `photo_area_config`, `created_at`, `updated_at`) VALUES ('3', '3', '/storage/frames/tech-summit-2026.png', '1080', '1080', '1:1', '{\"x\":0,\"y\":0,\"width\":1080,\"height\":1080,\"zoom\":1,\"rotation\":0,\"style\":\"center-fill\"}', '2026-11-14 13:02:48', '2026-11-14 13:02:48');
INSERT INTO `campaign_frames` (`id`, `campaign_id`, `frame_url`, `canvas_width`, `canvas_height`, `aspect_ratio`, `photo_area_config`, `created_at`, `updated_at`) VALUES ('4', '4', '/storage/frames/earth-day.png', '1080', '1080', '1:1', '{\"x\":0,\"y\":0,\"width\":1080,\"height\":1080,\"zoom\":1,\"rotation\":0,\"style\":\"center-fill\"}', '2026-11-14 13:02:50', '2026-11-14 13:02:50');
INSERT INTO `campaign_frames` (`id`, `campaign_id`, `frame_url`, `canvas_width`, `canvas_height`, `aspect_ratio`, `photo_area_config`, `created_at`, `updated_at`) VALUES ('5', '5', '/storage/frames/champions-league.png', '1080', '1080', '1:1', '{\"x\":0,\"y\":0,\"width\":1080,\"height\":1080,\"zoom\":1,\"rotation\":0,\"style\":\"center-fill\"}', '2026-11-14 13:02:53', '2026-11-14 13:02:53');
INSERT INTO `campaign_frames` (`id`, `campaign_id`, `frame_url`, `canvas_width`, `canvas_height`, `aspect_ratio`, `photo_area_config`, `created_at`, `updated_at`) VALUES ('6', '6', '/storage/frames/eid-mubarak.png', '1080', '1080', '1:1', '{\"x\":0,\"y\":0,\"width\":1080,\"height\":1080,\"zoom\":1,\"rotation\":0,\"style\":\"center-fill\"}', '2026-11-14 13:02:55', '2026-11-14 13:02:55');
INSERT INTO `campaign_frames` (`id`, `campaign_id`, `frame_url`, `canvas_width`, `canvas_height`, `aspect_ratio`, `photo_area_config`, `created_at`, `updated_at`) VALUES ('7', '7', '/storage/frames/1794663061_dsff.png', '1080', '1080', '1:1', '{\"zoom\":1}', '2026-11-14 13:31:02', '2026-11-14 13:31:02');

-- Table structure for `generated_photos`
DROP TABLE IF EXISTS `generated_photos`;
CREATE TABLE IF NOT EXISTS `generated_photos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `campaign_id` bigint(20) unsigned NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `format` varchar(20) NOT NULL DEFAULT 'png',
  `quality` varchar(20) NOT NULL DEFAULT 'standard',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `generated_photos_user_id_foreign` (`user_id`),
  KEY `generated_photos_campaign_id_foreign` (`campaign_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `saved_campaigns`
DROP TABLE IF EXISTS `saved_campaigns`;
CREATE TABLE IF NOT EXISTS `saved_campaigns` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `campaign_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `saved_campaigns_user_id_campaign_id_unique` (`user_id`,`campaign_id`),
  KEY `saved_campaigns_campaign_id_foreign` (`campaign_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `campaign_supporters`
DROP TABLE IF EXISTS `campaign_supporters`;
CREATE TABLE IF NOT EXISTS `campaign_supporters` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `supporter_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `campaign_supporters_campaign_id_foreign` (`campaign_id`),
  KEY `campaign_supporters_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `campaign_supporters`
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('1', '1', '3', 'Supporter #1', '2026-11-14 13:02:44', '2026-11-14 13:02:44');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('2', '1', '3', 'Supporter #2', '2026-11-14 13:02:45', '2026-11-14 13:02:45');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('3', '1', '3', 'Supporter #3', '2026-11-14 13:02:45', '2026-11-14 13:02:45');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('4', '2', '3', 'Supporter #1', '2026-11-14 13:02:46', '2026-11-14 13:02:46');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('5', '2', '3', 'Supporter #2', '2026-11-14 13:02:47', '2026-11-14 13:02:47');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('6', '2', '3', 'Supporter #3', '2026-11-14 13:02:47', '2026-11-14 13:02:47');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('7', '3', '3', 'Supporter #1', '2026-11-14 13:02:48', '2026-11-14 13:02:48');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('8', '3', '3', 'Supporter #2', '2026-11-14 13:02:48', '2026-11-14 13:02:48');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('9', '3', '3', 'Supporter #3', '2026-11-14 13:02:49', '2026-11-14 13:02:49');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('10', '4', '3', 'Supporter #1', '2026-11-14 13:02:50', '2026-11-14 13:02:50');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('11', '4', '3', 'Supporter #2', '2026-11-14 13:02:51', '2026-11-14 13:02:51');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('12', '4', '3', 'Supporter #3', '2026-11-14 13:02:52', '2026-11-14 13:02:52');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('13', '5', '3', 'Supporter #1', '2026-11-14 13:02:53', '2026-11-14 13:02:53');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('14', '5', '3', 'Supporter #2', '2026-11-14 13:02:54', '2026-11-14 13:02:54');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('15', '5', '3', 'Supporter #3', '2026-11-14 13:02:54', '2026-11-14 13:02:54');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('16', '6', '3', 'Supporter #1', '2026-11-14 13:02:55', '2026-11-14 13:02:55');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('17', '6', '3', 'Supporter #2', '2026-11-14 13:02:56', '2026-11-14 13:02:56');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('18', '6', '3', 'Supporter #3', '2026-11-14 13:02:56', '2026-11-14 13:02:56');
INSERT INTO `campaign_supporters` (`id`, `campaign_id`, `user_id`, `supporter_name`, `created_at`, `updated_at`) VALUES ('19', '1', NULL, 'Anonymous Supporter', '2026-11-14 13:22:54', '2026-11-14 13:22:54');

-- Table structure for `gallery_posts`
DROP TABLE IF EXISTS `gallery_posts`;
CREATE TABLE IF NOT EXISTS `gallery_posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `caption` text DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'published',
  `likes_count` int(11) NOT NULL DEFAULT 0,
  `comments_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gallery_posts_campaign_id_foreign` (`campaign_id`),
  KEY `gallery_posts_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `comments`
DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `gallery_post_id` bigint(20) unsigned NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_user_id_foreign` (`user_id`),
  KEY `comments_gallery_post_id_foreign` (`gallery_post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `likes`
DROP TABLE IF EXISTS `likes`;
CREATE TABLE IF NOT EXISTS `likes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `gallery_post_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `likes_user_id_gallery_post_id_unique` (`user_id`,`gallery_post_id`),
  KEY `likes_gallery_post_id_foreign` (`gallery_post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `reports`
DROP TABLE IF EXISTS `reports`;
CREATE TABLE IF NOT EXISTS `reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `reporter_id` bigint(20) unsigned DEFAULT NULL,
  `campaign_id` bigint(20) unsigned NOT NULL,
  `reason` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reports_reporter_id_foreign` (`reporter_id`),
  KEY `reports_campaign_id_foreign` (`campaign_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table structure for `platform_settings`
DROP TABLE IF EXISTS `platform_settings`;
CREATE TABLE IF NOT EXISTS `platform_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'string',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `platform_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `platform_settings`
INSERT INTO `platform_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('1', 'site_name', 'FrameFusion', 'string', '2026-11-14 13:02:35', '2026-11-14 13:02:35');
INSERT INTO `platform_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('2', 'site_tagline', 'Create. Customize. Celebrate.', 'string', '2026-11-14 13:02:35', '2026-11-14 13:02:35');
INSERT INTO `platform_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('3', 'primary_color', '#635BFF', 'string', '2026-11-14 13:02:36', '2026-11-14 13:02:36');
INSERT INTO `platform_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('4', 'secondary_color', '#8B5CF6', 'string', '2026-11-14 13:02:36', '2026-11-14 13:02:36');
INSERT INTO `platform_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('5', 'accent_color', '#FF6B8A', 'string', '2026-11-14 13:02:37', '2026-11-14 13:02:37');
INSERT INTO `platform_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('6', 'allow_guest_downloads', '1', 'boolean', '2026-11-14 13:02:37', '2026-11-14 13:02:37');
INSERT INTO `platform_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('7', 'enable_moderation', '', 'boolean', '2026-11-14 13:02:37', '2026-11-14 13:02:37');
INSERT INTO `platform_settings` (`id`, `key`, `value`, `type`, `created_at`, `updated_at`) VALUES ('8', 'contact_email', 'support@framefusion.io', 'string', '2026-11-14 13:02:38', '2026-11-14 13:02:38');

-- Table structure for `migrations`
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `migrations`
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('1', '0001_01_01_000000_create_users_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('2', '0001_01_01_000001_create_cache_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('3', '0001_01_01_000002_create_jobs_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('4', '2026_11_14_000001_add_profile_and_role_fields_to_users_table', '2');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('5', '2026_11_14_000002_create_categories_table', '2');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('6', '2026_11_14_000003_create_campaigns_table', '2');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('7', '2026_11_14_000004_create_campaign_frames_and_interactions_tables', '2');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('8', '2026_11_14_000005_create_gallery_reports_settings_tables', '2');

SET FOREIGN_KEY_CHECKS = 1;
