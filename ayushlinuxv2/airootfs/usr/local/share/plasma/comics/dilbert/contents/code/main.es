/*
 *   Copyright (C) 2007 Tobias Koenig <tokoe@kde.org>
 *   Copyright (C) 2010 Matthias Fuchs <mat69@gmx.net>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU Library General Public License version 2 as
 *   published by the Free Software Foundation
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details
 *
 *   You should have received a copy of the GNU Library General Public
 *   License along with this program; if not, write to the
 *   Free Software Foundation, Inc.,
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

const infos = {
    "User-Agent": "Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.6 (like Gecko)",
    "Accept": "text/html, image/jpeg, image/png, text/*, image/*, */*",
    "Accept-Encoding": "functionlate",
    "Accept-Charset": "iso-8859-15, utf-8;q=0.5, *;q=0.5",
    "Accept-Language": "en",
    "Host": "dilbert.com",
    "Connection": "Keep-Alive"
}

function init()
{
    comic.comicAuthor = "Scott Adams";
    comic.firstIdentifier = "1994-01-01";
    comic.websiteUrl = "https://dilbert.com/strip/" + comic.identifier.toString("yyyy-MM-dd");

    //if today is selected find the most current strip on the website (might also be yesterday)
    if (comic.identifier.toString() == date.currentDate().toString()) {
        comic.requestPage("https://dilbert.com/", comic.User, infos);
    } else {
        comic.requestPage(comic.websiteUrl, comic.Page, infos);
    }
}

function getComic(data)
{
    var re = new RegExp('<meta property="og:image" content="([^"]+)"');
    var match = re.exec(data);

    if (match != null) {
        var url = match[1];
        url = url.replace("http:", "https:");
        comic.requestPage(url, comic.Image);
    } else {
        print("Comic not found.");
        comic.error();
    }
}

function pageRetrieved(id, data)
{
    //look at the most recent comic
    if (id == comic.User) {
        var re = new RegExp("data-url=\"https://dilbert.com/strip/(\\d{4}-\\d{2}-\\d{2})[^\"]");
        var match = re.exec(data);
        if (match != null) {
            comic.lastIdentifier = date.fromString(match[1], "yyyy-MM-dd");
            comic.websiteUrl = "https://dilbert.com/strip/" + comic.identifier.toString("yyyy-MM-dd");
            comic.requestPage(comic.websiteUrl, comic.Page, infos);
        } else {
            comic.error();
        }
    } else if (id == comic.Page) {
        getComic(data);
    }
}
