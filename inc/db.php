<?php

/**
 * @file inc/db.php
 * @depends inc/config.php
 *
 * handles all database (MySQL) stuff
 */

define('DB_QUERY_REGEXP', '/(%d|%s|%%|%f|%b|%n)/');

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

/**
 * Database query methods
 */
function db_query($query) {
  $args = func_get_args();
  array_shift($args);
  
  if (isset($args[0]) && is_array($args[0])) { // 'All arguments in one array' syntax
    $args = $args[0];
  }

  _db_query_callback($args, TRUE);
  
  $query = preg_replace_callback(DB_QUERY_REGEXP, '_db_query_callback', $query);
  
  return _db_query($query);
}

function _db_query($query, $debug = 0) {
  global $db;

  $result = $db->query($query);

  return !$db->errno ? $result : FALSE;
}

function _db_query_callback($match, $init = FALSE) {
  static $args = NULL;
  if ($init) {
    $args = $match;
    return;
  }

  if (is_null($match[1])) return 'null';

  switch ($match[1]) {
    case '%d': // We must use type casting to int to convert FALSE/NULL/(TRUE?)
      $value = array_shift($args);
      // Do we need special bigint handling?
      if ($value > PHP_INT_MAX) {
        $precision = ini_get('precision');
        @ini_set('precision', 16);
        $value = sprintf('%.0f', $value);
        @ini_set('precision', $precision);
      }
      else {
        $value = (int) $value;
      }
      // We don't need db_escape_string as numbers are db-safe.
      return $value;
    case '%s':
      return db_escape_string(array_shift($args));
    case '%n':
      // Numeric values have arbitrary precision, so can't be treated as float.
      // is_numeric() allows hex values (0xFF), but they are not valid.
      $value = trim(array_shift($args));
      return is_numeric($value) && !preg_match('/x/i', $value) ? $value : '0';
    case '%%':
      return '%';
    case '%f':
      return (float) array_shift($args);
    case '%b': // binary data
      return db_encode_blob(array_shift($args));
  }
}

function db_escape_string($string) {
  global $db;
  return $db->real_escape_string($string);
}

function db_encode_blob($string) {
  return '%b';
}

