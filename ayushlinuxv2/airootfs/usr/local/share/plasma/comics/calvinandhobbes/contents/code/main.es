/***************************************************************************
 *   Copyright (C) 2018 Matthias Fuchs <mat69@gmx.net>                     *
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 *   This program is distributed in the hope that it will be useful,       *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the         *
 *   GNU General Public License for more details.                          *
 *                                                                         *
 *   You should have received a copy of the GNU General Public License     *
 *   along with this program; if not, write to the                         *
 *   Free Software Foundation, Inc.,                                       *
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA .        *
 ***************************************************************************/

//NOTE only this part needs to be changed to support different comics
const author = "Bill Watterson";
const websitePart = "calvinandhobbes"; //e.g. the "garfield" in "https://www.gocomics.com/garfield/"
const firstIdentifier = "1985-11-18";
const shopUrl = "";

const infos = {
        "User-Agent": "Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.6 (like Gecko)",
        "Accept": "text/html, image/jpeg, image/png, text/*, image/*, */*",
        "Accept-Encoding": "functionlate",
        "Accept-Charset": "iso-8859-15, utf-8;q=0.5, *;q=0.5",
        "Accept-Language": "en",
        "referrer": "https://www.gocomics.com/",
        "Connection": "Keep-Alive"
}

function init()
{
    comic.comicAuthor = author;
    comic.firstIdentifier = firstIdentifier;
    comic.websiteUrl = "https://www.gocomics.com/" + websitePart + '/';
    comic.shopUrl = shopUrl;

    comic.requestPage(comic.websiteUrl, comic.User, infos);
}

function pageRetrieved(id, data)
{
    //find lastIdentifier
    if (id == comic.User) {
        var exp = new RegExp('data-link="comics" href="[^"]+(\\d{4}/\\d{2}/\\d{2})"');
        var match = exp.exec(data);
        if (match != null) {
            comic.lastIdentifier = date.fromString(match[1], "yyyy/MM/dd");
            comic.websiteUrl += comic.identifier.toString("yyyy/MM/dd");
            comic.requestPage(comic.websiteUrl, comic.Page, infos);
        } else {
            print("Could not find last identifier.");
            comic.error();
            return;
        }
    }

    //find comic strip and next/previous identifier
    if (id == comic.Page) {
        var exp = new RegExp("<a role='button' href='/" + websitePart + "/(\\d{4}/\\d{2}/\\d{2})' class='[^']+fa-caret-right");
        var match = exp.exec(data);
        if (match != null) {
            comic.nextIdentifier = date.fromString(match[1], "yyyy/MM/dd");
        }

        exp = new RegExp("<a role='button' href='/" + websitePart + "/(\\d{4}/\\d{2}/\\d{2})' class='[^']+fa-caret-left");
        match = exp.exec(data);
        if (match != null) {
            comic.previousIdentifier = date.fromString(match[1], "yyyy/MM/dd");
        }

        // try large strip first
        exp = new RegExp("data-image=\"([^\"]+)\"");
        match = exp.exec(data);
        if (match != null) {
            comic.requestPage(match[1], comic.Image, infos);
        } else {
            // no large strip, try small one
            exp = new RegExp("class=\"strip\" src=\"([^\"]+)\"");
            match = exp.exec(data);
            if (match != null) {
                comic.requestPage(match[1], comic.Image, infos);
            } else {
                print("Could not find comic image.");
                comic.error();
                return;
            }
        }
    }
}
