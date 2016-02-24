<?php

/**
 * @file htdocs/api.php
 *
 * Handles all requests by the client
 */

require_once dirname(__FILE__) . '/../inc/config.php';

require_once ROOT_PATH . '/inc/db.php';
require_once ROOT_PATH . '/inc/misc.php';

// this has to be something that will *never* occur in something like
// an artist's or album's name
define('URI_SEPARATOR', '__@@__');

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

function _get_songs_from_query($query, &$songs) {
  while (NULL !== ($row = $query->fetch_object())) {
    array_push($songs, array(
      $row->id,
      $row->track,
      $row->title,
      $row->artist,
      $row->album,
      $row->genre,
      $row->date,
    ));
  }

  return 0;
}

function _list_songs_from_browser($_query) {
  $artist_changed = isset($_GET['artistChanged']) && $_GET['artistChanged'] === 'true';

  $sub_query = isset($_query[2]) ? $_query[2] : NULL;

  switch ($sub_query) {
  case 'artists':
    $req_artists  = isset($_query[3]) && strlen($_query[3]) > 0 ? $_query[3] : NULL;
    $req_albums   = isset($_query[4]) && strlen($_query[4]) > 0 ? $_query[4] : NULL;

    break;
  case 'albums':
  default:
    $req_artists  = NULL;
    $req_albums   = isset($_query[3]) && strlen($_query[3]) > 0 ? $_query[3] : NULL;
  }

  $have_artists = !is_null($req_artists);
  $have_albums  = !is_null($req_albums);

  $all_songs = !$have_artists && !$have_albums;

  if ($all_songs) {
    // Don't serve all songs at once; there are too many and it
    // would slow the client down
    //
    // One idea would be pagination, but that has other drawbacks
    if (GET_ALL_SONGS) {
      $query_songs = db_query('
        SELECT {id}, {track}, {title}, {artist}, {album}, {date}, {genre}
        FROM {music}
      ') or http_quit(500, 'Database error');
      
      $songs = array();
      _get_songs_from_query($query_songs, $songs);
    }
    else {
      $songs = array();
    }

    $query_albums = db_query('
      SELECT DISTINCT {album}
      FROM {music}
    ') or http_quit(500, 'Database error');

    $albums = array();

    while (NULL !== ($row = $query_albums->fetch_object())) {
      array_push($albums, $row->album);
    }

    print json_encode(array(
      'songs' => $songs,
      'albums' => $albums,
      'selectedAlbums' => array(-1),
    ));
  }
  else {
    $artists  = $have_artists ? explode(URI_SEPARATOR, $req_artists) : array();
    $albums   = $have_albums  ? explode(URI_SEPARATOR, $req_albums)  : array();

    $fields = '{id}, {track}, {title}, {artist}, {album}, {genre}, {date}';

    $args_songs_query = array();

    $songs_query = 'SELECT ' . $fields . ' FROM {music} WHERE ';

    $and = array();

    if ($have_artists) {
      $and[] = '(' . implode(' OR ', array_map(function($artist) {
        return '{artist} = "%s"';
      }, $artists)) . ')';

      $args_songs_query = array_merge($args_songs_query, $artists);
    }

    if ($have_albums && !$artist_changed) {
      $and[] = '(' . implode(' OR ', array_map(function($album) {
        return '{album} = "%s"';
      }, $albums)) . ')';

      $args_songs_query = array_merge($args_songs_query, $albums);
    }

    $songs_query .= implode(' AND ', $and);

    $songs_query .= ' ORDER BY {artist}, {album}, {track}';

    array_unshift($args_songs_query, $songs_query);

    $songs_query = call_user_func_array('db_query', $args_songs_query)
      or http_quit(500, 'Database error');

    $songs = array();
    _get_songs_from_query($songs_query, $songs);

    if ($artist_changed) {
      $args_browser_query = array();

      $browser_query = 'SELECT DISTINCT {album} FROM {music}';

      if ($have_artists) {
        $browser_query .= ' WHERE (' . implode(' OR ', array_map(function($artist) {
          return '{artist} = "%s"';
        }, $artists)) . ')';

        $args_browser_query = array_merge($args_browser_query, $artists);
      }

      $browser_query .= ' ORDER BY {album}';

      array_unshift($args_browser_query, $browser_query);

      $browser_query = call_user_func_array('db_query', $args_browser_query)
        or http_quit(500, 'Database error');

      $browser_albums = array();
      while (NULL !== ($row = $browser_query->fetch_object())) {
        array_push($browser_albums, $row->album);
      }

      $selected_albums = array();

      foreach ($browser_albums as $key => $album) {
        if (in_array($album, $albums)) {
          array_push($selected_albums, $key);
        }
      }

      print json_encode(array(
        'songs' => $songs,
        'albums' => $browser_albums,
        'selectedAlbums' => count($selected_albums) > 0
          ? $selected_albums : array(-1),
      ));
    }
    else {
      print json_encode($songs);
    }
  }

  return 0;
}

db_connect();

if (!isset($_GET['q'])) {
  http_quit(400, 'Must provide some arguments!');
}
else {
  $_query = array_map(function($item) {
    // return urldecode(str_replace(',', URI_SEPARATOR, $item)); // from a previous age
    return urldecode($item);
  }, explode('/', isset($_GET['q']) ? $_GET['q'] : ''));

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
      $q_albums   = _search_suggestions_query('album',  array('artist', 'album'), $term);
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
        array_push($albums, array('artist' => $row->artist, 'album' => $row->album));
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

  case 'list':
    /**
     * Get a list of something
     */

    // list what?
    $which = isset($_query[1]) ? $_query[1] : '';

    switch ($which) {
    case 'songs':
      // get a list of songs
      _list_songs_from_browser($_query);

      break;

    case 'artists':
      // get a list of (all) artists
      $query = db_query('
        SELECT DISTINCT {artist}
        FROM {music}
        ORDER BY {artist}
        ') or http_quit(500, 'Database error');

      $artists = array();
      while (NULL !== ($row = $query->fetch_object())) {
        array_push($artists, $row->artist);
      }

      print json_encode($artists);

      break;

    case 'artist_albums':
      // get a list of albums of a particular artist
      if (!isset($_query[2])) {
        http_quit(400, 'Must provide artist!');
      }

      $query = db_query('
        SELECT DISTINCT {album}
        FROM {music}
        WHERE {artist} = "%s"
        ORDER BY {album}
      ', $_query[2]);

      $albums = array();
      while (NULL !== ($row = $query->fetch_object())) {
        array_push($albums, $row->album);
      }

      print json_encode($albums);

      break;

    default:
      http_quit(400, 'Invalid list argument');
    }

    break;

  default:
    http_quit(400, 'Invalid argument');
  }
}

$db->close();
