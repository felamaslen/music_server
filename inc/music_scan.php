<?php

/**
 * @file inc/music_scan.php
 * @depends inc/db.php
 *
 * adds new music to database from directory
 */

require_once ROOT_PATH . '/lib/getid3/getid3.php';
$getID3 = new getID3;

/**
 * gets an array of every single music file in the directory
 * (recursively)
 */
function get_music_files($dir, &$files, $level = 0) {
  notice(0, 'Scan: %s', $dir);

  $handle = opendir($dir);

  if (!$handle) {
    notice(3, 'Failed opening directory: %s', $dir);
    return 1;
  }

  // get the number of files in the top-level directory,
  // so we can estimate the progress
  if ($level === 0) {
    $num_files = 0;
    while (FALSE !== $file = readdir($handle)) {
      if ($file != '.' && $file != '..') {
        $num_files++;
      }
    }
    
    $k = 1;
  }


  rewinddir($handle);

  while (FALSE !== ($file = readdir($handle))) {
    if ($file != '.' && $file != '..') {
      if ($level === 0) {
        progress_bar($k, $num_files, 30);
        
        $k++;
      }

      $path = $dir . '/' . $file;

      if (is_dir($path)) {
        get_music_files($path, $files, $level + 1);
      }
      else {
        $extension = get_file_extension($path);

        if (strpos(MUSIC_FORMATS, $extension) !== FALSE) {
          array_push($files, $path);
        }
      }
    }
  }

  closedir($handle);

  return 0;
}

/**
 * gets an array of every single music file in the database
 */
function get_db_files() {
  $result = db_query('SELECT {filename} FROM {music}');

  if (!$result) {
    notice(4, 'Error fetching information from the database!');
    exit(1);
  }

  $files = array();

  while ($row = $result->fetch_assoc()) {
    array_push($files, $row['filename']);
  }

  return $files;
}

/**
 * Gets track info such as artist, album, duration etc.
 */
function get_track_info($file) {
  if (!file_exists($file)) {
    return NULL;
  }

  global $getID3;

  $extension = get_file_extension($file);

  $info = array(
    'track'         => 0,
    'time'          => 0,
    'filesize'      => filesize($file),
    'title'         => 'Untitled Track',
    'artist'        => 'Unknown Artist',
    'album_artist'  => '',
    'album'         => 'Unknown Album',
    'genre'         => '',
    'date'          => '',
    'format'        => $extension,
  );

  switch ($extension) {
  case 'ogg':
    $id3_info = $getID3->analyze($file);

    if (isset($id3_info['tags']) && isset($id3_info['tags']['vorbiscomment'])) {
      $vc = $id3_info['tags']['vorbiscomment'];

      if (isset($vc['tracknumber'])) {
        $info['track'] = format_track_number($vc['tracknumber'][0]);
      }

      if (isset($vc['title'])) {
        $info['title'] = $vc['title'][0];
      }

      if (isset($vc['artist'])) {
        $info['artist'] = $vc['artist'][0];
      }
      
      if (isset($vc['albumartist'])) {
        $info['album_artist'] = $vc['albumartist'][0];
      }
      
      if (isset($vc['album'])) {
        $info['album'] = $vc['album'][0];
      }

      if (isset($vc['genre'])) {
        $info['genre'] = $vc['genre'][0];
      }

      if (isset($vc['date'])) {
        $info['date'] = $vc['date'][0];
      }
    }

    $info['format'] = 'ogg';

    if (isset($id3_info['playtime_seconds'])) {
      $info['time'] = (int)(round($id3_info['playtime_seconds']));
    }

    break;

  case 'mp3':
    // to be implemented

    break;
  }

  return $info;
}

/**
 * Deletes files from the database which are no longer
 * present on the file system
 */
function delete_extraneous_db_entries($db_files, $music_files) {
  $db_delete = array_diff($db_files, $music_files);

  $query = 'DELETE FROM {music} WHERE ' .
    implode(' OR ', array_map(function($item) {
      return "{filename} = '%s'";
    }, $db_delete));

  db_query($query, $db_delete);

  return 0;
}

/**
 * Scans the filesystem for new music files, and
 * deletes files from the database which no longer exist
 */
function db_music_scan() {
  global $db;

  db_connect();

  notice(1, '[%s] Scanning music directory...', date(DATE_FORMAT));
  $music_files = array();
  get_music_files(MUSIC_DIR, $music_files);

  notice(1, '[%s] Scanning music database...', date(DATE_FORMAT));
  $db_files = get_db_files();

  // find files in the database which do not exist
  notice(1, '[%s] Finding extraneous DB entries...', date(DATE_FORMAT));
  delete_extraneous_db_entries($db_files, $music_files);

  $db->close();
}

