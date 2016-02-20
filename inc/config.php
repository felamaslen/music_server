<?php

/**
 * global constants
 */

/****************************
 * configurable constants ***
 ***************************/

define('MUSIC_DIR',     '/data/user/music/ogg');
define('MUSIC_FORMATS', 'ogg,mp3');

// 0: debug, 1: notice, 2: warn, 3: error, 4: fatal
define('DEBUG_LEVEL', 0);

$db_info = array(
  'hostname' => 'localhost',
  'username' => 'music',
  'password' => 'VPmCJ3UGNZHe8GnG',
  'database' => 'music',
);

/******************************
 * non-configurable constants *
 *****************************/
define('ROOT_PATH', dirname(dirname(__FILE__)));

