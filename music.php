<?php

/**
 * @file music.php
 *
 * This file should _only_ be run from the command line
 */

require_once dirname(__FILE__) . '/inc/config.php';

require_once ROOT_PATH . '/inc/db.php';

// define database schema
$db_schema = array(
  'music' => array(
    'columns' => array(
      array('key' => 'id',            'opt' => 'int(11) unsigned NOT NULL AUTO_INCREMENT'),
      array('key' => 'track',         'opt' => 'int(11) NOT NULL'),
      array('key' => 'time',          'opt' => 'int(11) NOT NULL'),
      array('key' => 'rating',        'opt' => 'tinyint(4) NOT NULL'),
      array('key' => 'title',         'opt' => 'varchar(255) COLLATE utf8_unicode_ci NOT NULL'),
      array('key' => 'artist',        'opt' => 'varchar(255) COLLATE utf8_unicode_ci NOT NULL'),
      array('key' => 'album_artist',  'opt' => 'varchar(255) COLLATE utf8_unicode_ci NOT NULL'),
      array('key' => 'album',         'opt' => 'varchar(255) COLLATE utf8_unicode_ci NOT NULL'),
      array('key' => 'genre',         'opt' => 'varchar(255) COLLATE utf8_unicode_ci NOT NULL'),
      array('key' => 'date',          'opt' => 'varchar(255) COLLATE utf8_unicode_ci NOT NULL'),
      array('key' => 'filename',      'opt' => 'varchar(512) COLLATE utf8_unicode_ci NOT NULL'),
      array('key' => 'format',        'opt' => 'varchar(255) COLLATE utf8_unicode_ci NOT NULL'),
    ),
    'indexes' => array(
      'PRIMARY KEY (`id`)',
      'FULLTEXT KEY `info` (`title`, `artist`, `album`)',
      'FULLTEXT KEY `title` (`title`)',
      'FULLTEXT KEY `artist` (`artist`)',
      'FULLTEXT KEY `album` (`album`)',
    ),
    'opt' => 'ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci',
  ),
);

/**
 * Destroys all data in database and creates clean tables
 * based on schema
 */
function db_destroy_create_database() {
  global $db_schema, $db;

  db_connect();

  // drop all existing tables, and
  // create new, empty ones
  foreach ($db_schema as $table => $table_info) {
    // drop the old table
    $query = "DROP TABLE IF EXISTS `${table}`";
    $drop_result = $db->query($query);

    if (!$drop_result) {
      printf("[FATAL] Error dropping table %s\n", $table);
      
      if (DEBUG_MODE) {
        printf("[DEBUG] The query was:\n%s", $query);
      }

      die;
    }

    $query = "CREATE TABLE `${table}` (\n";

    $query .= array_reduce($table_info['columns'], function($string, $item) {
      return $string . "  `${item['key']}` ${item['opt']},\n";
    });

    $query .= "  " . implode(",\n  ", $table_info['indexes']) . "\n";

    $query .= ") ${table_info['opt']};";

    // create the new table
    $create_result = $db->query($query);

    if (!$create_result) {
      printf("[FATAL] Error creating table %s\n", $table);

      if (DEBUG_MODE) {
        printf("[DEBUG] The query was:\n%s\n", $query);
      }

      die;
    }

    if (DEBUG_MODE) {
      printf("[DEBUG] Re-created clean table: %s\n", $table);
    }
  }

  $db->close();
}

/**
 * Handle command line arguments
 */
if (!isset($argv[1])) {
  printf("Usage: php %s <arg>\n", basename(__FILE__));
  die;
}

switch ($argv[1]) {
case 'dropdb':
  db_destroy_create_database();

  break;
default:
  printf("Invalid argument.\n");
}

