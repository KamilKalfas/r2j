'use strict';
const util = require('util');
const xml2js = require('xml2js');

module.exports = {
  load: url => {
    return new Promise((resolve, reject) => {
      call(url)
        .then(rss => resolve(rss))
        .catch(err => reject(err));
    });
  }
};

function call(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed to load page, status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', chunk => body.push(chunk));
      response.on('end', () => {
        mapper(body.join(''))
        .then(json => resolve(json))
        .catch(err => reject(err));
      });
    });
    request.on('error', err => reject(err));
  });
}

function mapper(body) {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({trim: false, normalize: true, mergeAttrs: true});
    parser.addListener('error', err => reject(err));
    parser.parseString(body, (err, json) => {
      if (err) {
        reject(err);
      }
      resolve(parseFeed(json));
    });
  });
}

function parseFeed(json) {
  let channel = json.rss.channel;
  const rss = {items: []};

  if (util.isArray(json.rss.channel)) {
    channel = json.rss.channel[0];
  }

  if (channel.title) {
    rss.title = channel.title[0];
  }
  if (channel.description) {
    rss.description = channel.description[0];
  }
  if (channel.link) {
    rss.url = channel.link[0];
  }
  if (channel.item) {
    if (!util.isArray(channel.item)) {
      channel.item = [channel.item];
    }
    channel.item.forEach(val => {
      const obj = {};
      obj.title = util.isNullOrUndefined(val.title) ? '' : val.title[0];
      obj.description = util.isNullOrUndefined(val.description) ? '' : stripHtml(val.description[0]);
      obj.url = util.isNullOrUndefined(val.link) ? '' : val.link[0];

      if (val.pubDate) {
        obj.created = Date.parse(val.pubDate[0]);
      }
      if (val.category) {
        obj.category = val.category;
      }
      if (val['content:encoded']) {
        obj.imageUrl = scrubImageUrl(val['content:encoded'][0]);
      }
      if (val['media:content']) {
        obj.media = val.media || {};
        obj.media.content = val['media:content'];
      }
      if (val['media:thumbnail']) {
        obj.media = val.media || {};
        obj.media.thumbnail = val['media:thumbnail'];
      }
      if (val.enclosure) {
        obj.enclosures = [];
        if (!util.isArray(val.enclosure)) {
          val.enclosure = [val.encślosure];
          val.enclosure.forEach(enclosure => {
            const enc = {};
            enclosure.forEach(x => {
              enc[x] = enclosure[x][0];
            });
            obj.enclosures.push(enc);
          });
        }
      }

      rss.items.push(obj);
    });
  }
  return rss;
}

function stripHtml(string) {
  let str = string;
  str = str.replace(/<\s*p>/, '');
  str = str.replace(/<\/p>/, '');
  str = str.replace(/&#8211;/g, '');
  str = str.replace(/&#8230;/, '...');
  str = str.replace(/<\s*br\/*>/gi, '');
  str = str.replace(/<\s*a.*href="(.*?)".*>(.*?)<\/a>/gi, '');
  str = str.replace(/<\s*\/*.+?>/ig, '');
  str = str.replace(/ {2,}/gi, ' ');
  str = str.replace(/\n+\s*/gi, '');
  return unescape(str);
}

function scrubImageUrl(string) {
  const srcTag = 5;
  string = string.substring(string.indexOf('src="') + srcTag);
  string = string.substring(0, string.indexOf('"'));
  return string;
}
