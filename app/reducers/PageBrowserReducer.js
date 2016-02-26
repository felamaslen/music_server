/**
 * @file app/reducers/PageBrowserReducer.js
 * Browser (page 1) reducers
 */

import { Map, List, fromJS } from 'immutable';

import buildMessage from '../MessageBuilder';

import {
  calculateScrollOffset,
  formatLeadingZeros
} from '../common';

import {
  ajaxCacheMaxAge
} from '../config';

import {
  API_LIST_ARTISTS,
  API_LIST_ALBUMS,
  API_BROWSER_LIST_TRACKS
} from '../constants/effects';

export const insertListSongs = (reduction, param) => {
  let newReduction = reduction;

  const clearList = param && param.response === null;

  if (clearList) {
    newReduction = newReduction
      .setIn(['appState', 'browser', 'songs'], List.of())
      .setIn(['appState', 'browser', 'selectedSong'], -1);
  }
  else {
    const badResponse = !param ||
      !param.response || !param.response.data || param.response.status !== 200;

    if (!badResponse) {
      const data = fromJS(param.response.data);

      newReduction = newReduction
        .setIn(['appState', 'browser', 'songs'], data)
        .setIn(['appState', 'browser', 'selectedSong'], 0);

      // update cache with the result
      newReduction = newReduction.setIn([
        'appState', 'browser', 'songCache', param.artist, param.album
      ], Map({
        data: data,
        time: new Date().getTime()
      }));
    }
    else {
      console.error('[ERROR] API error fetching songs');
    }
  }

  return newReduction;
};

export const requestAndInsertListArtists = (reduction, param) => {
  let newReduction = reduction;

  const oldArtists = reduction.getIn(['appState', 'browser', 'artists']);

  if (typeof param.response === 'undefined') {
    // request
    const effects = reduction.get('effects').push(buildMessage(API_LIST_ARTISTS));

    newReduction = reduction.set('effects', effects);
  }
  else {
    // response
    const badResponse = !param.response || param.response.status !== 200 ||
      !param.response.data;

    if (!badResponse) {
      newReduction = newReduction.setIn(
        ['appState', 'browser', 'artists'], fromJS(param.response.data.artists)
      )
      .setIn(['appState', 'browser', 'allTime'], parseInt(param.response.data.time))
      .setIn(['appState', 'browser', 'selectedArtist'], param.response.data.artists.length > 0 ? 0 : -1)
      .setIn(['appState', 'browser', 'selectedAlbum'], -1);
    }
    else {
      console.error('[ERROR] API error fetching artists');
    }
  }

  return newReduction;
}

export const requestAndInsertListAlbums = (reduction, param) => {
  let newReduction = reduction;

  const toggleHidden = !!param.toggleHidden;

  const artist = toggleHidden ? reduction.getIn(
    ['appState', 'browser', 'artists', reduction.getIn(
      ['appState', 'browser', 'selectedArtist']
    )]
  ) : param.artist;

  if (typeof param.response === 'undefined') {
    // request
    const albums = reduction.getIn(['appState', 'browser', 'albums', artist]);

    let effects = reduction.get('effects');
    if (!albums) {
      // make new AJAX request
      effects = effects.push(buildMessage(API_LIST_ALBUMS, artist));

      newReduction = newReduction.set('effects', effects);
    }
    else {
      const currentlyHidden = albums.get('hidden');

      const shouldHide = param.toggleHidden ? !currentlyHidden : false;

      newReduction = newReduction.setIn(
        ['appState', 'browser', 'albums', artist, 'hidden'], shouldHide
      );

      // if we're hiding the albums of the currently selected artist,
      // then reset the selectedAlbum index
      if (shouldHide) {
        newReduction = newReduction.setIn(
          ['appState', 'browser', 'selectedAlbum'], -1
        ).setIn(
          ['appState', 'browser', 'songs'], List.of()
        );
      }
    }
  }
  else {
    // response
    const badResponse = !param.response || param.response.status !== 200 ||
      !param.response.data;

    if (!badResponse) {
      newReduction = newReduction.setIn(
        ['appState', 'browser', 'albums', artist], fromJS({
          hidden: false,
          list: param.response.data
        })
      ).setIn(['appState', 'browser', 'selectedAlbum'], -1);
    }
  }

  newReduction = calculateScrollOffset(newReduction);

  return newReduction;
}

const getArtistAlbums = (albums, artist) => {
  const artistAlbums = albums.get(artist);

  return !!artistAlbums && !artistAlbums.get('hidden') ? artistAlbums.get('list') : List.of();
}

const _getTrackList = (reduction, artist, album) => {
  // check if this song list has already been downloaded
  const cacheItem = reduction.getIn(['appState', 'browser', 'songCache', artist, album]);
  let cacheItemStale = false;

  if (!!cacheItem) {
    // check if the cached item is below the maximum cache age
    const cacheItemAge = (new Date().getTime() - cacheItem.get('time')) / 1000;

    cacheItemStale = cacheItemAge > ajaxCacheMaxAge;
  }

  const fetchNew = !cacheItem || cacheItemStale;

  let newReduction = reduction;

  if (fetchNew) {
    newReduction = newReduction.set('effects', newReduction.get('effects').push(
      buildMessage(
        API_BROWSER_LIST_TRACKS, {
          artist,
          album
        }
      )
    ));
  }
  else {
    newReduction = newReduction.setIn(['appState', 'browser', 'songs'], cacheItem.get('data'));
  }

  return newReduction;
}

export const selectArtistListItem = (reduction, direction) => {
  const artists = reduction.getIn(['appState', 'browser', 'artists']);
  const albums = reduction.getIn(['appState', 'browser', 'albums']);

  const selectedArtist  = reduction.getIn(['appState', 'browser', 'selectedArtist']);
  const selectedAlbum   = reduction.getIn(['appState', 'browser', 'selectedAlbum']);

  let newSelectedArtist = selectedArtist;
  let newSelectedAlbum = selectedAlbum;

  let _albums = getArtistAlbums(albums, artists.get(selectedArtist));

  let steps = 0;
  const numSteps = Math.abs(direction);
  const dir = direction < 0 ? -1 : 1;

  while (steps < numSteps) {
    if (dir < 0) {
      if (newSelectedAlbum > -1) {
        newSelectedAlbum--;
      }
      else {
        if (newSelectedArtist === 0) {
          break;
        }

        newSelectedArtist--;

        _albums = getArtistAlbums(albums, artists.get(newSelectedArtist));

        newSelectedAlbum = _albums.size - 1;
      }
    }
    else {
      if (newSelectedAlbum < _albums.size - 1) {
        newSelectedAlbum++;
      }
      else {
        if (newSelectedArtist === artists.size - 1) {
          break;
        }

        newSelectedArtist++;

        _albums = getArtistAlbums(albums, artists.get(newSelectedArtist));

        newSelectedAlbum = -1;
      }
    }

    steps++;
  }

  let newReduction = reduction
    .setIn(['appState', 'browser', 'artistsListLastScrollDir'], dir)
    .setIn(['appState', 'browser', 'selectedArtist'], newSelectedArtist)
    .setIn(['appState', 'browser', 'selectedAlbum'], newSelectedAlbum)
  ;

  if (newSelectedAlbum > -1) {
    const artist  = artists.get(newSelectedArtist);
    const album   = albums.getIn([artist, 'list', newSelectedAlbum]);

    newReduction = _getTrackList(newReduction, artist, album);
  }
  else {
    // clear the list of songs
    newReduction = newReduction.setIn(['appState', 'browser', 'songs'], List.of());
  }

  newReduction = calculateScrollOffset(newReduction);

  return newReduction;
}

export const selectTrackListItem = (reduction, direction) => {
  let newReduction = reduction;

  const currentSelectedSong = reduction.getIn(['appState', 'browser', 'selectedSong']);
  const numSongs = reduction.getIn(['appState', 'browser', 'songs']).size;

  const newSelectedSong = Math.min(
    numSongs - 1,
    Math.max(0, currentSelectedSong + direction)
  );

  newReduction = newReduction.setIn(['appState', 'browser', 'selectedSong'], newSelectedSong);

  return newReduction;
}

export const switchToNextSection = reduction => {
  let newReduction = reduction;

  const sections = List.of(
    'artistsList',
    'trackList'
  );

  const currentSection = reduction.getIn(['appState', 'browser', 'typeFocus']);
  const currentSectionIndex = sections.findIndex(item => item === currentSection);

  if (currentSectionIndex > -1) {
    const newSection = sections.get((currentSectionIndex + 1) % sections.size);

    let shouldSwitch;

    switch (newSection) {
      case 'trackList':
        // only switch to track list if there are tracks displayed
        shouldSwitch = reduction.getIn(['appState', 'browser', 'songs']).size > 0;
        break;
      default:
        shouldSwitch = true;
    }

    if (shouldSwitch) {
      newReduction = newReduction.setIn(['appState', 'browser', 'typeFocus'], newSection);
    }
  }

  return newReduction;
}

export const playCurrentTrackListItem = reduction => {
  let newReduction = reduction;

  const currentSelectedSong = reduction.getIn(['appState', 'browser', 'selectedSong']);

  const song = reduction.getIn(['appState', 'browser', 'songs', currentSelectedSong]);

  if (!!song) {
    newReduction = newReduction.setIn(
      ['appState', 'player', 'source'], '/api/play/' + song.get(0)
    ).setIn(
      ['appState', 'player', 'info'],
      Map({
        track:  formatLeadingZeros(song.get(1)),
        title:  song.get(2),
        time:   song.get(3),
        artist: song.get(4),
        album:  song.get(5),
        genre:  song.get(6),
        date:   song.get(7)
      })
    ).setIn(
      ['appState', 'player', 'playing'], true
    );
  }

  return newReduction;
}
