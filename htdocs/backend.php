<?php

/**
 * @file htdocs/backend.php
 *
 * Handles all requests by the client
 */


require_once dirname(__FILE__) . '/../inc/config.php';

require_once ROOT_PATH . '/inc/db.php';
require_once ROOT_PATH . '/inc/misc.php';

db_connect();

$task = isset($_GET['t']) ? $_GET['t'] : '';

switch ($task) {
case 'play':

  if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    http_quit(400);
  }

  $id = intval($_GET['id']);

  $query = db_query('SELECT filename FROM {music} WHERE id = %d', $id)
    or http_quit(500, 'Database error');

  if (!$query->num_rows) {
    http_quit(404, 'Nonexistent ID!');
  }

  $result = $query->fetch_object();

  $path = $result->filename;

  if (!file_exists($path)) {
    http_quit(500, 'File not found!');
  }

  $path = substr($path, strlen(MUSIC_DIR));

  $url = '/music' . $path;

  $db->close();

  header('Location: ' . $url);
  die;

  break;

case 'list-artist-album-songs':
  if (!isset($_GET['artist']) || !isset($_GET['album'])) {
    http_quit(400);
  }

  $artist = urldecode($_GET['artist']);
  $album = urldecode($_GET['album']);

  $query = db_query('
    SELECT id, track, title, artist, date, time
    FROM {music}
    WHERE {artist} = "%s" AND {album} = "%s"',
    $artist, $album) or http_quit(500, 'Database error');

  $songs = array();

  while (NULL !== ($row = $query->fetch_assoc())) {
    array_push($songs, array(
      'id'      => (int)$row['id'],
      'track'   => (int)$row['track'],
      'title'   => $row['title'],
      'artist'  => $row['artist'],
      'date'    => $row['date'],
      'time'    => time_format((int)$row['time']),
    ));
  }

  print json_encode($songs);

  break;

case 'list-artist-albums':
  if (!isset($_GET['artist'])) {
    http_quit(400);
  }

  $artist = urldecode($_GET['artist']);

  $query = db_query('
    SELECT DISTINCT {album} FROM {music}
    WHERE {artist} = "%s"
    ORDER BY {album}', $artist)
    or http_quit(500, 'Database error');

  $albums = array();

  while (NULL !== ($row = $query->fetch_assoc())) {
    array_push($albums, $row['album']);
  }

  print json_encode($albums);

  break;

case 'list-artists':

  $query = db_query('SELECT DISTINCT {artist} FROM {music} ORDER BY {artist}')
    or http_quit(500, 'Database error');

  $artists = array();

  while (NULL !== ($row = $query->fetch_assoc())) {
    array_push($artists, $row['artist']);
  }

  print json_encode($artists);

  break;

default:
  http_quit(400);
}

$db->close();
