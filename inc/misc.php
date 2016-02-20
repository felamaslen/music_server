<?php

/**
 * @file inc/misc.php
 * @depends inc/config.php
 *
 * Miscellaneous functions
 */

function notice() {
  $args = func_get_args();

  $levels = array('DEBUG', 'NOTICE', 'WARN', 'ERROR', 'FATAL');
  
  $level = $args[0];

  $printf_args = array_merge(
    array("[%s] ${args[1]}\n", $levels[$level]),
    array_slice($args, 2)
  );

  if ($level >= DEBUG_LEVEL) {
    call_user_func_array('printf', $printf_args);
  }

  return 0;
}

function get_file_extension($file) {
  return strtolower(substr($file, strrpos($file, '.') + 1));
}

function format_track_number($raw) {
  $number = $raw;
  if (strpos($raw, '/') !== FALSE) {
    $number = substr($number, 0, strpos($raw, '/'));
  }

  return (int)$number;
}
