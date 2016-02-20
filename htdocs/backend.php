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
default:
  http_quit(400);
}

$db->close();
