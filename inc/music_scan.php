<?php

/**
 * @file inc/music_scan.php
 * @depends inc/db.php
 *
 * adds new music to database from directory
 */

/**
 * gets an array of every single music file in the directory
 * (recursively)
 */
function get_music_files($dir, &$files, $level = 0) {
  notice(0, "Scan: %s", $dir);

  $handle = opendir($dir);

  if (!$handle) {
    return 1;
  }

  while (FALSE !== ($file = readdir($handle))) {
    if ($file != '.' && $file != '..') {
      $path = $dir . '/' . $file;

      if (is_dir($path)) {
        get_music_files($path, $files, $level + 1);
      }
      else {
        $extension = strtolower(substr($file, strrpos($file, '.') + 1));

        if (strpos(MUSIC_FORMATS, $extension) !== FALSE) {
          array_push($files, $path);
        }
      }
    }
  }

  closedir($handle);

  return 0;
}

function db_music_scan() {
  $music_files = array();
  get_music_files(MUSIC_DIR, $music_files);

  // print_r($music_files);
}

