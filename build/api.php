<?php

/**
 * @file htdocs/api.php
 *
 * Handles all requests by the client
 */

require_once dirname(__FILE__) . '/../inc/config.php';

require_once ROOT_PATH . '/inc/db.php';
require_once ROOT_PATH . '/inc/misc.php';

function _search_suggestions_query($compare, $fields, $term) {
  $fields = implode(',', array_map(function($item) {
    return '{' . $item . '}';
  }, $fields));

  $compare = '{' . $compare . '}';

  return db_query("
    SELECT * FROM (
      SELECT
      MATCH($compare) AGAINST (\"%s*\" IN BOOLEAN MODE) AS {rel},
      CASE WHEN (CHAR_LENGTH($compare) < 4) THEN 0 ELSE 1 END as {long},
      $fields
      FROM {music}
      WHERE $compare LIKE \"%%%s%%\"
      GROUP BY {long}, $compare
    ) {matches}
    ORDER BY {rel} DESC
    LIMIT 0, 5
  ", $term, $term);
}

db_connect();

if (!isset($_GET['q'])) {
  http_quit(400, 'Must provide some arguments!');
}
else {

  $_query = explode('/', isset($_GET['q']) ? $_GET['q'] : '');

  switch ($_query[0]) {
  case 'play':
    /**
     * Play a song
     */

    if (!isset($_query[1]) || !is_numeric($_query[1])) {
      http_quit(400);
    }

    $id = intval($_query[1]);

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

  case 'search':
    /**
     * Search for something
     */

    // search for what?
    $which = isset($_query[1]) ? $_query[1] : '';

    switch ($which) {
    case 'suggestions':
      // get search suggestions to put in a drop-down box

      if (!isset($_query[2])) {
        http_quit(400);
      }

      $term = $_query[2];

      $q_artists  = _search_suggestions_query('artist', array('artist'), $term);
      $q_albums   = _search_suggestions_query('album',  array('album'), $term);
      $q_songs    = _search_suggestions_query('title',  array(
        'id', 'title', 'artist', 'album'
      ), $term);

      $artists = array();
      $albums = array();
      $songs = array();

      while (NULL !== ($row = $q_artists->fetch_object())) {
        array_push($artists, $row->artist);
      }
      while (NULL !== ($row = $q_albums->fetch_object())) {
        array_push($albums, $row->album);
      }

      while (NULL !== ($row = $q_songs->fetch_object())) {
        array_push($songs, array(
          $row->id, $row->title, $row->artist, $row->album
        ));
      }

      print json_encode(array(
        'artists' => $artists,
        'albums' => $albums,
        'songs' => $songs,
      ));

      break;

    default:
      http_quit(400);
    }

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
  }
}

$db->close();
