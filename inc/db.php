<?php

/**
 * @file inc/db.php
 * @depends inc/config.php
 *
 * handles all database (MySQL) stuff
 */

$db = NULL;

/**
 * Connects to MySQL database
 */
function db_connect() {
  global $db, $db_info;

  $db = new mysqli(
    $db_info['hostname'],
    $db_info['username'],
    $db_info['password'],
    $db_info['database']
  );

  if ($db->connect_errno > 0) {
    die('Unable to connect to database [' . $db->connect_error . ']');
  }

  return NULL;
}

