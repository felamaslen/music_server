<?php

/**
 * global constants
 */

/****************************
 * configurable constants ***
 ***************************/

define('MUSIC_DIR',     '/data/user/music/ogg');
define('MUSIC_FORMATS', 'ogg|mp3');

define('DEBUG_MODE', TRUE);

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

