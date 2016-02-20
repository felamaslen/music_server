<?php

/**
 * @file inc/misc.php
 * @depends inc/config.php
 *
 * Miscellaneous functions
 */

/**
 * errors and other logging
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

/**
 * Send headers for error codes (to browser)
 */
function http_quit($code, $msg = '') {
  $codes = array(
    400 => 'Bad Request',
    403 => 'Access Denied',
    404 => 'Not Found',
    500 => 'Internal Server Error',
  );

  header("HTTP/1.1 ${code} ${codes[$code]}");

  die($msg);
}

/**
 * gets the file extension from a path
 */
function get_file_extension($file) {
  return strtolower(substr($file, strrpos($file, '.') + 1));
}

/**
 * formats a track number, say 04/30, into an integer (4 in this case)
 */
function format_track_number($raw) {
  $number = $raw;
  if (strpos($raw, '/') !== FALSE) {
    $number = substr($number, 0, strpos($raw, '/'));
  }

  return (int)$number;
}

/**
 * progress bar for the CLI
 */
function progress_bar($done, $total, $size = 30) {
  static $start_time;

  if ($done > $total) {
    return 0;
  }

  if (empty($start_time)) {
    $start_time = time();
  }

  $now = time();

  if ($done <= 0) {
    $done = 1;
  }

  $ratio = (double)($done / $total);

  $num_segments = floor($ratio * $size);

  $status = "\r[" . str_repeat("=", $num_segments);

  if ($num_segments < $size) {
    $status .= str_repeat('-', $size - $num_segments);
  }

  $status .= ']';

  $percent = number_format($ratio * 100, 2);

  $rate = ($now - $start_time) / $done;

  $todo = $total - $done;

  $eta = round($rate * $todo, 2);

  $time_elapsed = $now - $start_time;

  $status .= ' eta: ' . number_format($eta) . 's, elapsed: '
    . number_format($time_elapsed) . 's';

  echo $status;

  flush();

  if ($done == $total) {
    echo "\n";
  }
}

