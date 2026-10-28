[![Build Status](https://app.travis-ci.com/wo-ist-markt/wo-ist-markt.github.io.svg?branch=master)](https://app.travis-ci.com/github/wo-ist-markt/wo-ist-markt.github.io) [![Netlify Status](https://api.netlify.com/api/v1/badges/41da0c15-3862-4cb8-8467-3226aba2cd87/deploy-status)](https://app.netlify.com/sites/wo-ist-markt/deploys)

# Wo ist Markt?

A small visualization of the weekly markets in different cities. Available at: http://wo-ist-markt.de

- [Five minutes talk about the project at 33C3 (12/2016)][wo-ist-markt-33c3-talk]
- [Short project summary in a Konrad Adenauer Stiftung publication (02/2017)][wo-ist-markt-kas-publication] (last page, in German)


## Project description

_Wo ist Markt?_ aims at providing an easy to use website for market information. Visitors of the website
should be able to intuitively get answers to the following questions:

- Where does a market take place?
- When does a market take place?

Therefore, the website shows the position of markets as markers on a map. Each marker can be clicked or
tapped to reveal the detail information associated with this market - most important, the opening hours.
This can been seen on the following screenshot.

![Screenshot of the website (Showing Karlsruhe)][website-karlsruhe-screenshot]


### Kinds of markets

The project is not limited to specific kinds of markets. Typical markets in cities are:

- Farmer markets (selling vegetable, fruits, fish, plants, ...)
- Flea markets (selling used stuff, antique goods, ...)


### Market data

The actual information (title, location, opening hours, ...) about the markets can be provided by anyone.
In the optimal case it is provided by a city as _open data_. If not, any volunteer can collect such data
and contribute it to the project. Market data must be maintained individually. There is no central project
team to take care of updating data of multiple cities. This is a distributed project. This is also the
reason why cities are missing. It needs someone to retrieve and add the data. It is of your choice if
you collect the data manually or if you automate it with a script. If you need inspiration on how to
automate this have a look at the [preprocessing](preprocessing) folder.


### Project history

The project has been started by [@torfsen][torfsen-github] as part of the
[Open Knowledge Lab Karlsruhe][oklab-karlsruhe] in February 2015. To support more cities the code has
been refactored by [@johnjohndoe][johnjohndoe-github] as part of the [Open Knowledge Lab Berlin][oklab-berlin]
in February 2016.


## Navigation

* The individual market data for supported cities is displayed when the city name is given in the
  address bar of the browser.

  Example: http://wo-ist-markt.de/#karlsruhe.

  By default or on error *Karlsruhe* is rendered.


## Contributing

* You are very welcome to **get involved** in the project. Therefore, we prepared a
  [contribution guide](CONTRIBUTING.md) which explains how to **add market data** and how
  to **start coding** on the project.


## Communication

* Please use the [GitHub issue tracker][github-issue-tracker] to discuss new and existing ideas.
* Come join the converation about this project in our [Slack channel][slack-wo-ist-markt].
  Write to _tobias DOT preuss AT googlemail DOT com_ if you need an invitation for the Slack group.


## Supported cities

|City name|Data source|
|:---|:---|
|[Bad Homburg][bad-homburg-wikipedia]|[City of Bad Homburg][bad-homburg-markets]|
|[Baden-Baden][baden-baden-wikipedia]|[City of Baden-Baden][baden-baden-markets]|
|[Basel][basel-wikipedia]|[City of Basel][basel-markets]|
|[Berlin][berlin-wikipedia]|[City of Berlin][berlin-markets]|
|[Bielefeld][bielefeld-wikipedia]|[City of Bielefeld][bielefeld-markets]|
|[Bochum][bochum-wikipedia]|[City of Bochum][bochum-markets]|
|[Bonn][bonn-wikipedia]|[City of Bonn][bonn-markets]|
|[Bottrop][bottrop-wikipedia]|[City of Bottrop][bottrop-markets]|
|[Braunschweig][braunschweig-wikipedia]|[City of Braunschweig][braunschweig-markets]|
|[Bremen][bremen-wikipedia]|[City of Bremen][bremen-markets]|
|[Bremerhaven][bremerhaven-wikipedia]|[City of Bremerhaven][bremerhaven-markets]|
|[Bretten][bretten-wikipedia]|[City of Bretten][bretten-markets]|
|[Bruchköbel][bruchkoebel-wikipedia]|[Stadtmarketing Bruchköbel GmbH][bruchkoebel-markets]|
|[Brühl][bruehl-wikipedia]|[Stadt Brühl][bruehl-markets]|
|[Chemnitz][chemnitz-wikipedia]|[City of Chemnitz][chemnitz-markets]|
|[Cottbus][cottbus-wikipedia]|[City of Cottbus][cottbus-markets]|
|[Cuxhaven][cuxhaven-wikipedia]|[City of Cuxhaven][cuxhaven-markets]|
|[Donaueschingen][donaueschingen-wikipedia]|[City of Donaueschingen][donaueschingen-markets]|
|[Dortmund][dortmund-wikipedia]|[City of Dortmund][dortmund-markets]|
|[Dresden][dresden-wikipedia]|[City of Dresden][dresden-markets]|
|[Duisburg][duisburg-wikipedia]|[Duisburg Kontor GmbH][duisburg-markets]|
|[Düsseldorf][duesseldorf-wikipedia]|[City of Düsseldorf][duesseldorf-markets]|
|[Erlangen][erlangen-wikipedia]|[City of Erlangen][erlangen-markets]|
|[Essen][essen-wikipedia]|[EVB][essen-markets]|
|[Frankfurt am Main][frankfurtmain-wikipedia]|[City of Frankfurt am Main][frankfurtmain-markets]|
|[Freiburg][freiburg-wikipedia]|[City of Freiburg][freiburg-markets]|
|[Friedrichsdorf][friedrichsdorf-wikipedia]|[City of Friedrichsdorf][friedrichsdorf-markets]|
|[Fürth][fuerth-wikipedia]|[City of Fürth (Bavaria)][fuerth-markets]|
|[Gelsenkirchen][gelsenkirchen-wikipedia]|[Gelsendienste][gelsenkirchen-markets]|
|[Hagen][hagen-wikipedia]|[City of Hagen][hagen-markets]|
|[Hamburg][hamburg-wikipedia]|[City of Hamburg][hamburg-markets]|
|[Hamm][hamm-wikipedia]|[City of Hamm][hamm-markets]|
|[Hanau][hanau-wikipedia]|[City of Hanau][hanau-markets]|
|[Hannover][hannover-wikipedia]|[City of Hannover][hannover-markets]|
|[Heidelberg][heidelberg-wikipedia]|[City of Heidelberg][heidelberg-markets]|
|[Herne][herne-wikipedia]|[City of Herne][herne-markets]|
|[Hilden][hilden-wikipedia]|[City of Hilden][hilden-markets]|
|[Hofheim am Taunus][hofheimamtaunus-wikipedia]|[City of Hofheim][hofheimamtaunus-markets]|
|[Kaiserslautern][kaiserslautern-wikipedia]|[City of Kaiserslautern][kaiserslautern-markets]|
|[Karlsruhe][karlsruhe-wikipedia]|[City of Karlsruhe][karlsruhe-markets]|
|[Kassel][kassel-wikipedia]|[City of Kassel][kassel-markets]|
|[Kiel][kiel-wikipedia]|[City of Kiel][kiel-markets]|
|[Kleve][kleve-wikipedia]|[City of Kleve][kleve-markets]|
|[Köln][koeln-wikipedia]|[City of Köln][koeln-markets]|
|[Konstanz][konstanz-wikipedia]|[City of Konstanz][konstanz-markets]|
|[Langenfeld (Rhld.)][langenfeld-rhld-wikipedia]|[City of Langenfeld (Rhld.)][langenfeld-rhld-markets]|
|[Laupheim][laupheim-wikipedia]|[City of Laupheim][laupheim-markets]|
|[Leipzig][leipzig-wikipedia]|[City of Leipzig][leipzig-markets]|
|[Loxstedt][loxstedt-wikipedia]|[City of Loxstedt][loxstedt-markets]|
|[Lübeck][luebeck-wikipedia]|[City of Lübeck][luebeck-markets]|
|[Ludwigsburg][ludwigsburg-wikipedia]|[City of Ludwigsburg][ludwigsburg-markets]|
|[Mallorca][mallorca-wikipedia]|[Island of Mallorca][mallorca-markets]|
|[Marl][marl-wikipedia]|[City of Marl][marl-markets]|
|[Moers][moers-wikipedia]|[City of Moers][moers-markets]|
|[Mülheim an der Ruhr][muelheim-ad-ruhr-wikipedia]|[City of Mülheim an der Ruhr][muelheim-ad-ruhr-markets]|
|[München][muenchen-wikipedia]|[City of München][muenchen-markets]|
|[Münster][muenster-wikipedia]|[City of Münster][muenster-markets]|
|[Nersingen][nersingen-wikipedia]|[City of Nersingen][nersingen-markets]|
|[Neu-Anspach][neu-anspach-wikipedia]|[City of Neu-Anspach][neu-anspach-markets]
|[Neu-Ulm][neu-ulm-wikipedia]|[City of Neu-Ulm][neu-ulm-markets]|
|[Oberursel][oberursel-wikipedia]|[City of Oberursel][oberursel-markets]
|[Oldenburg][oldenburg-wikipedia]|[City of Oldenburg (Oldb)][oldenburg-markets]|
|[Osnabrueck][osnabrueck-wikipedia]|[City of Osnabrueck][osnabrueck-markets]|
|[Paderborn][paderborn-wikipedia]|[City of Paderborn][paderborn-markets]|
|[Passau][passau-wikipedia]|[City of Passau][passau-markets]|
|[Potsdam][potsdam-wikipedia]|[City of Potsdam][potsdam-markets]|
|[Rastatt][rastatt-wikipedia]|[City of Rastatt][rastatt-markets]|
|[Rheinstetten][rheinstetten-wikipedia]|[City of Rheinstetten][rheinstetten-markets]|
|[Rostock][rostock-wikipedia]|[City of Rostock][rostock-markets]|
|[Rothenburg ob der Tauber][rothenburg-wikipedia]|[City of Rothenburg ob der Tauber][rothenburg-markets]|
|[Saarbrücken][saarbruecken-wikipedia]|[Landeshauptstadt Saarbrücken][saarbruecken-markets]|
|[Salzkotten][salzkotten-wikipedia]|[City of Salzkotten][salzkotten-markets]|
|[Schleswig][schleswig-wikipedia]|[City of Schleswig][schleswig-markets]|
|[Schwerin][schwerin-wikipedia]|[City of Schwerin][schwerin-markets]|
|[Siegen][siegen-wikipedia]|[City of Siegen][siegen-markets]|
|[Solingen][solingen-wikipedia]|[City of Solingen][solingen-markets]|
|[Stralsund][stralsund-wikipedia]|[City of Stralsund][stralsund-markets]|
|[Stuttgart][stuttgart-wikipedia]|[Stuttgarter Wochenmärkte][stuttgart-markets]|
|[Suhl][suhl-wikipedia]|[City of Suhl][suhl-markets]|
|[Trier][trier-wikipedia]|[City of Trier][trier-markets]|
|[Tübingen][tübingen-wikipedia]|[Wochenmarkt - Universitätsstadt Tübingen][tübingen-markets]|
|[Ulm][ulm-wikipedia]|[City of Ulm][ulm-markets]|
|[Usingen][usingen-wikipedia]|[City of Usingen][usingen-markets]|
|[Wiesbaden][wiesbaden-wikipedia]|[City of Wiesbaden][wiesbaden-markets]|
|[Witten][witten-wikipedia]|[Stadtmarketing Witten][witten-markets]|
|[Wolfenbüttel][wolfenbuettel-wikipedia]|[Stadt Wolfenbüttel][wolfenbuettel-markets]|
|[Wuppertal][wuppertal-wikipedia]|[City of Wuppertal][wuppertal-markets]|
|[Zwickau][zwickau-wikipedia]|[Kultour Z.][zwickau-markets]|


## Development

Tests can be run using [npm][npm]:

    $ npm install  # Just once after you've cloned the repo

    $ npm test     # Whenever you want to run the tests

Please see also [CONTRIBUTING.md](./CONTRIBUTING.md#how-to-run-this-project-locally) on how to start development.


## Deployment

This website is hosted on [Netlify](https://netlify.com).

When a commit is added to the `master` branch then Netlify automatically publishes this
state as the new version of the website available under [https://wo-ist-markt.de](https://wo-ist-markt.de).



[fabric]: https://fabfile.org
[github-issue-tracker]: https://github.com/wo-ist-markt/wo-ist-markt.github.io/issues
[johnjohndoe-github]: https://github.com/johnjohndoe
[npm]: https://www.npmjs.com
[oklab-berlin]: http://codefor.de/berlin
[oklab-karlsruhe]: http://codefor.de/karlsruhe
[slack-wo-ist-markt]: https://openknowledgegermany.slack.com/messages/wo-ist-markt/
[torfsen-github]: https://github.com/torfsen
[website-karlsruhe-screenshot]: gfx/website-karlsruhe-screenshot.jpg
[wo-ist-markt-33c3-talk]: https://www.youtube.com/watch?v=IurOWCek7V4
[wo-ist-markt-kas-publication]: http://www.kas.de/wf/doc/kas_47864-544-1-30.pdf

[bad-homburg-wikipedia]: https://en.wikipedia.org/wiki/Bad_Homburg_vor_der_Höhe
[bad-homburg-markets]: https://www.bad-homburg.de/de/erleben/geniessen/shopping/wochenmarkt
[baden-baden-wikipedia]: https://de.wikipedia.org/wiki/Baden-Baden
[baden-baden-markets]: https://www.baden-baden.de/stadtportrait/aktuelles/wochenmaerkte/
[basel-wikipedia]: https://en.wikipedia.org/wiki/Basel
[basel-markets]: https://www.bs.ch/pd/marketing/messenundmaerkte
[berlin-wikipedia]: https://en.wikipedia.org/wiki/Berlin
[berlin-markets]: https://www.visitberlin.de/de/wochenmaerkte
[bielefeld-wikipedia]: https://en.wikipedia.org/wiki/Bielefeld
[bielefeld-markets]: https://www.bielefeld.de/node/5829
[bochum-wikipedia]: https://en.wikipedia.org/wiki/Bochum
[bochum-markets]: https://bochum.treffpunkt-wochenmarkt.de/
[bonn-wikipedia]: https://en.wikipedia.org/wiki/Bonn
[bonn-markets]: https://www.bonn.de/vv/produkte/Wochenmarkt-Bewerbung.php
[bottrop-wikipedia]: https://en.wikipedia.org/wiki/Bottrop
[bottrop-markets]: https://www.bottrop.de/vv/produkte/dezernat3/30/Wochenmaerkte.php
[braunschweig-wikipedia]: https://de.wikipedia.org/wiki/Braunschweig
[braunschweig-markets]: https://www.braunschweig.de/leben/einkaufen_maerkte/wochenmaerkte/index.php
[bremen-wikipedia]: https://de.wikipedia.org/wiki/Bremen
[bremen-markets]: https://www.bremen.de/leben-in-bremen/shopping/wochenmaerkte
[bremerhaven-wikipedia]: https://de.wikipedia.org/wiki/Bremerhaven
[bremerhaven-markets]: https://www.bremerhaven.de/de/tourismus/shopping-gastronomie/wochenmaerkte-in-bremerhaven.22120.html
[bretten-wikipedia]: https://de.wikipedia.org/wiki/Bretten
[bretten-markets]: https://www.bretten.de/tourismus-kultur-freizeit/wochenmarkt
[bruchkoebel-wikipedia]: https://de.wikipedia.org/wiki/Bruchk%C3%B6bel
[bruchkoebel-markets]: https://www.bruchkoebel.de/kultur-einkaufen-genuss/einkaufen-genuss/wochenmarkt
[bruehl-wikipedia]: https://de.wikipedia.org/wiki/Br%C3%BChl_(Rheinland)
[bruehl-markets]: https://www.bruehl.de/veranstaltungskalender/veranstaltungen/hauptkalender/wochenmarkt.php
[chemnitz-wikipedia]: https://en.wikipedia.org/wiki/Chemnitz
[chemnitz-markets]: https://www.chemnitz.de/de/rathaus/ausschreibungen/marktausschreibungen/wochenmaerkte
[cottbus-wikipedia]: https://de.wikipedia.org/wiki/Cottbus
[cottbus-markets]: https://www.cottbuser-wochenmarkt.de/wochenm%C3%A4rkte/
[cuxhaven-wikipedia]: https://de.wikipedia.org/wiki/Cuxhaven
[cuxhaven-markets]: https://www.cuxhaven.de/magazin/artikel.php?artikel=2801&type=2&menuid=686&topmenu=16
[donaueschingen-wikipedia]: https://de.wikipedia.org/wiki/Donaueschingen
[donaueschingen-markets]: https://www.donaueschingen.de/Wochenmarkt
[dortmund-wikipedia]: https://en.wikipedia.org/wiki/Dortmund
[dortmund-markets]: https://www.dortmund.de/themen/einkaufen-und-city/wochenmaerkte/
[dresden-wikipedia]: https://en.wikipedia.org/wiki/Dresden
[dresden-markets]: https://www.dresden.de/de/leben/sport-und-freizeit/maerkte-in-dresden.php
[duisburg-wikipedia]: https://en.wikipedia.org/wiki/Duisburg
[duisburg-markets]: https://www.duisburgkontor.de/frischemaerkte/wochenmaerkte/
[duesseldorf-wikipedia]: https://de.wikipedia.org/wiki/D%C3%BCsseldorf
[duesseldorf-markets]: https://www.duesseldorf.de/umweltamt/umwelt-und-verbraucherthemen-von-a-z/marktmanagement/wochenmaerkte/termine/
[erlangen-wikipedia]: https://en.wikipedia.org/wiki/Erlangen
[erlangen-markets]: https://erlangen.de/themenseite/thema/maerkten-kirchweihen
[essen-wikipedia]: https://en.wikipedia.org/wiki/Essen
[essen-markets]: https://essener-wochenmaerkte.de
[frankfurtmain-wikipedia]: https://de.wikipedia.org/wiki/Frankfurt_am_Main
[frankfurtmain-markets]: https://frankfurt.de/frankfurt-entdecken-und-erleben/maerkte-und-einkaufsstrassen/maerkte-und-flohmaerkte/wochenmaerkte
[freiburg-wikipedia]: https://en.wikipedia.org/wiki/Freiburg_im_Breisgau
[freiburg-markets]: https://visit.freiburg.de/entdecken/kulinarik/kulinarik-highlights
[friedrichsdorf-wikipedia]: https://de.wikipedia.org/wiki/Friedrichsdorf
[friedrichsdorf-markets]: https://www.friedrichsdorf.de/leben/ueber-friedrichsdorf/einkaufen
[fuerth-wikipedia]: https://en.wikipedia.org/wiki/F%C3%BCrth
[fuerth-markets]: https://www.fuerthwiki.de/wiki/index.php/Kategorie:M%C3%A4rkte
[Gelsenkirchen-wikipedia]: https://en.wikipedia.org/wiki/Gelsenkirchen
[Gelsenkirchen-markets]: https://www.gelsendienste.de/privathaushalte/maerkte/
[hagen-wikipedia]: https://de.wikipedia.org/wiki/Hagen
[hagen-markets]: https://www.hagen.de/aus-dem-rathaus/fachbereiche-und-aemter/fachbereiche-a-z/fachbereich-oeffentliche-sicherheit-und-ordnung/gewerbestelle/#jahr--und-wochenmaerkte
[hamburg-wikipedia]: https://de.wikipedia.org/wiki/Hamburg
[hamburg-markets]: https://www.hamburg.de/freizeit/maerkte-und-messen/wochenmaerkte
[hamm-wikipedia]: https://de.wikipedia.org/wiki/Hamm
[hamm-markets]: https://www.hamm.de/tourismus/freizeit/einkaufen/wochenmaerkte
[hannover-wikipedia]: https://de.wikipedia.org/wiki/Hannover
[hannover-markets]: https://www.hannover.de/Veranstaltungskalender/M%C3%A4rkte/Wochenm%C3%A4rkte-in-der-Stadt-Hannover/(offset)/20
[hanau-wikipedia]: https://de.wikipedia.org/wiki/Hanau
[hanau-markets]: https://www.hanau.de/freizeit/maerkte/wochenmarkt/artikel/index.html
[heidelberg-wikipedia]: https://de.wikipedia.org/wiki/Heidelberg
[heidelberg-markets]: https://www.heidelberg.de/hd/HD/Leben/Wochenmaerkte.html
[herne-wikipedia]: https://de.wikipedia.org/wiki/Herne
[herne-markets]: https://www.herne.de/Rathaus/Buergerservice/Wochenm%C3%A4rkte/index.html
[hilden-wikipedia]: https://de.wikipedia.org/wiki/Hilden
[hilden-markets]: https://www.hilden.de/de/wirtschaft-bauen/citymanagement/wochenmaerkte/
[hofheimamtaunus-wikipedia]: https://de.wikipedia.org/wiki/Hofheim_am_Taunus
[hofheimamtaunus-markets]: https://www.hofheim.de/veranstaltung/wochenmarkt/
[koeln-wikipedia]: https://en.wikipedia.org/wiki/Cologne
[koeln-markets]: https://www.offenedaten-koeln.de/dataset/wochenmaerkte-koeln
[konstanz-wikipedia]: https://en.wikipedia.org/wiki/Konstanz
[konstanz-markets]: https://www.konstanz-info.com/erleben-entdecken/shopping/maerkte/wochenmaerkte
[Kaiserslautern-wikipedia]: https://en.wikipedia.org/wiki/Kaiserslautern
[Kaiserslautern-markets]: https://www.wochenmarkt-kl.de
[karlsruhe-wikipedia]: https://en.wikipedia.org/wiki/Karlsruhe
[karlsruhe-markets]: https://www.karlsruhe.de/kultur-freizeit/maerkte/wochenmaerkte
[kassel-wikipedia]: https://en.wikipedia.org/wiki/Kassel
[kassel-markets]: https://www.kassel.de/service/produkte/kassel/ordnungsamt/ordnungs--und-aufsichtsangelegenheiten/wochenmaerkte.php
[kiel-wikipedia]: https://en.wikipedia.org/wiki/Kiel
[kiel-markets]: https://kiel.de/de/wirtschaft_arbeit/maerkte/wochenmarkt.php
[kleve-wikipedia]: https://en.wikipedia.org/wiki/Kleve
[kleve-markets]: https://www.kleve.de/stadt-kleve/freizeit-und-kultur/veranstaltungen/wochenmaerkte-kleve
[langenfeld-rhld-wikipedia]: https://de.wikipedia.org/wiki/Langenfeld_(Rheinland)
[langenfeld-rhld-markets]: https://www.langenfeld.de/city_info/display/dokument/show.cfm?region_id=138&id=4240&design_id=3340&type_id=0&titletext=1
[laupheim-wikipedia]: https://de.wikipedia.org/wiki/Laupheim
[laupheim-markets]: https://www.laupheim.de/fileadmin/Dateien/Dateien/Freizeit_und_Kultur/Marktkalender_2017.pdf
[leipzig-wikipedia]: https://en.wikipedia.org/wiki/Leipzig
[leipzig-markets]: https://www.leipzig.de/freizeit-kultur-und-tourismus/einkaufen-und-ausgehen/maerkte/
[loxstedt-wikipedia]: https://en.wikipedia.org/wiki/Loxstedt
[loxstedt-markets]: https://www.loxstedt.de/kultur-freizeit/maerkte/wochenmarkt/
[luebeck-wikipedia]: https://de.wikipedia.org/wiki/L%C3%BCbeck
[luebeck-markets]: https://www.luebeck.de/de/stadtleben/freizeit/wochenmaerkte/wochenmaerkte
[ludwigsburg-wikipedia]: https://de.wikipedia.org/wiki/Ludwigsburg
[ludwigsburg-markets]: https://visit.ludwigsburg.de/start/events/ludwigsburger+wochenmarkt.html
[mallorca-wikipedia]: https://en.wikipedia.org/wiki/Mallorca
[mallorca-markets]: https://www.mallorca.com/en/guide/activities/free-time/markets-mallorca
[marl-wikipedia]: https://de.wikipedia.org/wiki/Marl
[marl-markets]: https://marl.de/leben-wohnen/einkaufen/wochenmaerkte/
[moers-wikipedia]: https://en.wikipedia.org/wiki/Moers
[moers-markets]: https://www.moers.de/rathaus-politik/rathaus/dienstleistungen/maerkte
[muelheim-ad-ruhr-wikipedia]: https://en.wikipedia.org/wiki/Mülheim
[muelheim-ad-ruhr-markets]: https://www.muelheim-ruhr.de/cms/muelheimer_wochenmaerkte1.html
[muenchen-wikipedia]: https://en.wikipedia.org/wiki/M%C3%BCnchen
[muenchen-markets]: https://maerkte-muenchen.de/unsere-maerkte/wochenmaerkte.html
[muenster-wikipedia]: https://en.wikipedia.org/wiki/M%C3%BCnster
[muenster-markets]: https://www.stadt-muenster.de/maerkte/startseite.html
[nersingen-wikipedia]: https://de.wikipedia.org/wiki/Nersingen
[nersingen-markets]: https://www.nersingen.de/wir-fuer-sie/nersinger-wochenmarkt.html
[neu-anspach-wikipedia]: https://en.wikipedia.org/wiki/Neu_Anspach
[neu-anspach-markets]: https://www.neu-anspach.de/leben-in-neu-anspach/bildung-kultur/veranstaltungskalender/
[neu-ulm-wikipedia]: https://en.wikipedia.org/wiki/Neu-Ulm
[neu-ulm-markets]: https://nu.neu-ulm.de/neu-ulm-erleben/veranstaltungen/feste-maerkte/wochenmarkt/
[oberursel-wikipedia]: https://en.wikipedia.org/wiki/Oberursel_(Taunus)
[oberursel-markets]: https://www.oberursel.de/de/erleben-entdecken/oberursel-erleben/handel-wochenmarkt/wochenmaerkte/
[oldenburg-wikipedia]: https://en.wikipedia.org/wiki/Oldenburg
[oldenburg-markets]: https://www.oldenburg.de/startseite/kultur/veranstaltungen/wochenmaerkte.html
[osnabrueck-wikipedia]: https://en.wikipedia.org/wiki/Osnabrueck
[osnabrueck-markets]: https://erleben.osnabrueck.de/de/
[paderborn-wikipedia]: https://en.wikipedia.org/wiki/Paderborn
[paderborn-markets]: https://www.paderborn.de/microsite/wochenmarkt/
[passau-wikipedia]: https://en.wikipedia.org/wiki/Passau
[passau-markets]: https://www.passau.de/stadtleben/sport-freizeit/regionales-vom-wochenmarkt/
[potsdam-wikipedia]: https://en.wikipedia.org/wiki/Potsdam
[potsdam-markets]: https://www.potsdam.de/de/kategorie/einkaufen-schenken
[rastatt-wikipedia]: https://de.wikipedia.org/wiki/Rastatt
[rastatt-markets]: https://www.rastatt.de/kultur-und-freizeit/freizeit-und-einkaufen/wochenmarkt
[rheinstetten-wikipedia]: https://de.wikipedia.org/wiki/Rheinstetten
[rheinstetten-markets]: https://www.rheinstetten.de/de/nachrichten/wochenmarkt-in-der-neuen-stadtmitte-2
[rostock-wikipedia]: https://en.wikipedia.org/wiki/Rostock
[rostock-markets]: https://www.rostocker-wochenmaerkte.de/standorte-angebote/
[rothenburg-wikipedia]: https://en.wikipedia.org/wiki/Rothenburg_ob_der_Tauber
[rothenburg-markets]: https://www.rothenburg.de/erleben/einkaufen
[saarbruecken-wikipedia]: https://de.wikipedia.org/wiki/Saarbr%C3%BCcken
[saarbruecken-markets]: https://www.saarbruecken.de/leben_in_saarbruecken/einkaufen/maerkte
[salzkotten-wikipedia]: https://de.wikipedia.org/wiki/Salzkotten
[salzkotten-markets]: https://www.salzkotten.de/de/freizeit-tourismus/einkaufen-geniessen/wochenmarkt.php?highlight=wochenmarkt
[schleswig-wikipedia]: https://en.wikipedia.org/wiki/Schleswig,_Schleswig-Holstein
[schleswig-markets]: https://www.schleswig.de
[schwerin-wikipedia]: https://en.wikipedia.org/wiki/Schwerin
[schwerin-markets]: https://marketing.schwerin.info/stadtmarketing/aufgaben/Flaeche_Maerkte.html
[siegen-wikipedia]: https://en.wikipedia.org/wiki/Siegen
[siegen-markets]: https://www.siegen.de/rathaus-politik/stadtverwaltung/dienstleistungen-a-bis-z/detailseite/marktwesen-wochenmaerkte-in-siegen
[solingen-wikipedia]: https://en.wikipedia.org/wiki/Solingen
[solingen-markets]: https://www.solingerwochenmarkt.de
[stralsund-wikipedia]: https://en.wikipedia.org/wiki/Stralsund
[stralsund-markets]: https://www.rostocker-wochenmaerkte.de/standorte-angebote/
[stuttgart-wikipedia]: https://en.wikipedia.org/wiki/Stuttgart
[stuttgart-markets]: https://www.stuttgarter-wochenmaerkte.de/maerkte-staende/uebersicht/
[suhl-wikipedia]: https://en.wikipedia.org/wiki/Suhl
[suhl-markets]: https://www.suhl.eu/maerkte-feste
[trier-wikipedia]: https://de.wikipedia.org/wiki/Trier
[trier-markets]: https://www.trier.de/leben-in-trier/wirtschaft/einzelhandel/6154.Maerkte-Wochenmarkt--staendiger-Markt.html
[tübingen-wikipedia]: https://en.wikipedia.org/wiki/T%C3%BCbingen
[tübingen-markets]: https://www.tuebingen.de/wochenmarkt
[ulm-wikipedia]: https://en.wikipedia.org/wiki/Ulm
[ulm-markets]: https://www.ulm.de/leben-in-ulm/umwelt-energie-entsorgung/energie-und-klimaschutz/tipps/wochenmarkt
[usingen-wikipedia]: https://de.wikipedia.org/wiki/Usingen
[usingen-markets]: https://www.usingen.de/pdfs/stadtrecht/marktordnung-der-stadt-usingen.pdf?cid=3c
[wiesbaden-wikipedia]: https://en.wikipedia.org/wiki/Wiesbaden
[wiesbaden-markets]: https://www.wiesbaden.de/microsite/wochenmarkt-wiesbaden/
[witten-wikipedia]: https://en.wikipedia.org/wiki/Witten
[witten-markets]: https://stadtmarketing-witten.de/einkaufen-geniessen/wochenmaerkte
[wolfenbuettel-wikipedia]: https://de.wikipedia.org/wiki/Wolfenb%C3%BCttel
[wolfenbuettel-markets]: https://www.wolfenbuettel.de/index.php?NavID=2672.372
[wuppertal-wikipedia]: https://en.wikipedia.org/wiki/Wuppertal
[wuppertal-markets]: https://www.wuppertal.de/tourismus-freizeit/einkaufen/wochenmarkt.php
[zwickau-wikipedia]: https://en.wikipedia.org/wiki/Zwickau
[zwickau-markets]: https://www.zwickautourist.de/neuigkeiten.php?uid=97802eee-e49e-11f0-b8e1-08606eed2892
