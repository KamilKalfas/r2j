# r2j
> RSS to json parser with support for https://lowcygier.pl/
> + supports parsing _categories_ and _content:encoded_
> + removes HTML tags and special chars

[![Build Status](https://travis-ci.org/KamilKalfas/r2j.svg?branch=master)](https://travis-ci.org/KamilKalfas/r2j)
[![npm](https://img.shields.io/npm/dt/r2j.svg)](https://www.npmjs.com/package/r2j)
[![npm](https://img.shields.io/npm/v/r2j.svg)](https://www.npmjs.com/package/r2j)

## Install

```
$ npm install r2j
```

## Usage

```javascript
const r2j = require('r2j');
r2j.load('https://lowcygier.pl/promocje/mobilne/feed/')
  .then(json => doSomething(json))
  .catch(err => handleError(err));
```
## Output
```json
{
  "items": [
    {
      "title": "Promocja na wybrane gry Disneya w Gamesplanet",
      "description": "-50% Indiana Jones and the Fate of Atlantis – £1.20 (5,77 zł) Steam -50% Indiana Jones and the Last Crusade – £1.20 (5,77 zł) Steam -72% LEGO Indiana Jones: The Original Adventures – £3.75 (18,02 zł) Steam -72% LEGO Indiana Jones 2: The Adventure Continues – £3.75 (18,02 ... ",
      "link": "https://lowcygier.pl/promocje-cyfrowe/promocja-na-wybrane-gry-disneya-w-gamesplanet/",
      "url": "https://lowcygier.pl/promocje-cyfrowe/promocja-na-wybrane-gry-disneya-w-gamesplanet/",
      "created": 1497610099000,
      "category": [
        "Promocje cyfrowe",
        "Gamesplanet",
        "Steam"
      ],
      "imageUrl": "https://lowcygier.pl/wp-content/uploads/2016/08/Monkey-Island-2-80x80.jpg"
    },
    {
      "title": "Prey na PS4 za ok. 123 złote z wysyłką do Polski w Base",
      "description": "Prey (PS4) £23.85 (115,44 zł) Wysyłka do Polski kosztuje £1.49 (7,21 zł).",
      "link": "https://lowcygier.pl/promocje-pudelkowe/prey-na-ps4-za-ok-123-zlote-z-wysylka-do-polski-w-base/",
      "url": "https://lowcygier.pl/promocje-pudelkowe/prey-na-ps4-za-ok-123-zlote-z-wysylka-do-polski-w-base/",
      "created": 1497609107000,
      "category": [
        "Promocje pudełkowe"
      ],
      "imageUrl": "https://lowcygier.pl/wp-content/uploads/2017/03/3080800-91gqr89ilil._sl1500_1-80x80.jpg"
    }
  ]
}

```
