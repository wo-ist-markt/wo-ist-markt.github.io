[![Build Status](https://travis-ci.org/wo-ist-markt/wo-ist-markt.github.io.svg?branch=master)](https://travis-ci.org/wo-ist-markt/wo-ist-markt.github.io)

# A map of farmer markets

A small visualization of the weekly markets in different cities. Available at: http://wo-ist-markt.de


## Navigation

* The individual market data for supported cities is displayed when the city name is given in the
  address bar of the browser.

  Example: http://wo-ist-markt.de/#karlsruhe.

  By default or on error *Karlsruhe* is rendered.


## Contributing

* You are very welcome to **get involved** in the project. Therefore, we prepared a
  [contribution guide](CONTRIBUTING.md) which explains how to **add market data** and how
  to **start coding** on the project.


## Supported cities

|City name|Data source|
|:---|:---|
|[Berlin][berlin-wikipedia]|[City of Berlin][berlin-markets]|
|[Bochum][bochum-wikipedia]|[City of Bochum][bochum-markets]|
|[Bonn][bonn-wikipedia]|[City of Bonn][bonn-markets]|
|[Bottrop][bottrop-wikipedia]|[City of Bottrop][bottrop-markets]|
|[Braunschweig][braunschweig-wikipedia]|[City of Braunschweig][braunschweig-markets]|
|[Bruchköbel][bruchköbel-wikipedia]|[Stadtmarketing Bruchköbel GmbH][bruchköbel-markets]|
|[Chemnitz][chemnitz-wikipedia]|[City of Chemnitz][chemnitz-markets]|
|[Dortmund][dortmund-wikipedia]|[City of Dortmund][dortmund-markets]|
|[Dresden][dresden-wikipedia]|[City of Dresden][dresden-markets]|
|[Duisburg][duisburg-wikipedia]|[Duisburg Kontor GmbH][duisburg-markets]|
|[Düsseldorf][duesseldorf-wikipedia]|[City of Düsseldorf][duesseldorf-markets]|
|[Erlangen][erlangen-wikipedia]|[City of Erlangen][erlangen-markets]|
|[Essen][essen-wikipedia]|[EVB][essen-markets]|
|[Freiburg][freiburg-wikipedia]|[City of Freiburg][freiburg-markets]|
|[Gelsenkirchen][gelsenkirchen-wikipedia]|[Gelsendienste][gelsenkirchen-markets]|
|[Hagen][hagen-wikipedia]|[City of Hagen][hagen-markets]|
|[Hanau][hanau-wikipedia]|[City of Hanau][hanau-markets]|
|[Herne][herne-wikipedia]|[City of Herne][herne-markets]|
|[Hilden][hilden-wikipedia]|[City of Hilden][hilden-markets]|
|[Karlsruhe][karlsruhe-wikipedia]|[City of Karlsruhe][karlsruhe-markets]|
|[Kassel][kassel-wikipedia]|[City of Kassel][kassel-markets]|
|[Kiel][kiel-wikipedia]|[City of Kiel][kiel-markets]|
|[Köln][koeln-wikipedia]|[City of Köln][koeln-markets]|
|[Langenfeld (Rhld.)][langenfeld-rhld-wikipedia]|[City of Langenfeld (Rhld.)][langenfeld-rhld-markets]|
|[Leipzig][leipzig-wikipedia]|[City of Leipzig][leipzig-markets]|
|[Moers][moers-wikipedia]|[City of Moers][moers-markets]|
|[Mülheim an der Ruhr][muelheim-ad-ruhr-wikipedia]|[City of Mülheim an der Ruhr][muelheim-ad-ruhr-markets]|
|[München][muenchen-wikipedia]|[City of München][muenchen-markets]|
|[Münster][muenster-wikipedia]|[City of Münster][muenster-markets]|
|[Nersingen][nersingen-wikipedia]|[City of Nersingen][nersingen-markets]|
|[Neu-Ulm][neu-ulm-wikipedia]|[City of Neu-Ulm][neu-ulm-markets]|
|[Paderborn][paderborn-wikipedia]|[City of Paderborn][paderborn-markets]|
|[Potsdam][potsdam-wikipedia]|[City of Potsdam][potsdam-markets]|
|[Rostock][rostock-wikipedia]|[City of Rostock][rostock-markets]|
|[Schwerin][schwerin-wikipedia]|[City of Schwerin][schwerin-markets]|
|[Siegen][siegen-wikipedia]|[City of Siegen][siegen-markets]|
|[Ulm][ulm-wikipedia]|[City of Ulm][ulm-markets]|
|[Wiesbaden][wiesbaden-wikipedia]|[City of Wiesbaden][wiesbaden-markets]|
|[Witten][witten-wikipedia]|[Stadtmarketing Witten][witten-markets]|
|[Wuppertal][wuppertal-wikipedia]|[City of Wuppertal][wuppertal-markets]|



## Development

Tests can be run using [npm][npm]:

    $ npm install  # Just once after you've cloned the repo

    $ npm test     # Whenever you want to run the tests


## Deployment

When new code is pushed to master Travis CI runs a test suite against it. If those test
pass [fabric][fabric] is used to deploy the new version to the server running
under https://wo-ist-markt.de.

The command that Travis CI executes is `fab deploy -i markt_deploy_id_rsa -H deploy@kiesinger.okfn.de:2207`
where `markt_deploy_id_rsa` is an ssh key to log into the server. It is commited to this repository in
a encrypted format that Travis CI decrypts in the `before_install` section.

You can run the deployment locally if your ssh key is added to the `deploy` user on the server. Since
Travis CI does it automatically there should be no need to do this though.
The command to deploy manually is: `fab deploy -H deploy@kiesinger.okfn.de:2207`.



[fabric]: https://fabfile.org
[npm]: https://www.npmjs.com

[berlin-wikipedia]: https://en.wikipedia.org/wiki/Berlin
[berlin-markets]: http://daten.berlin.de/datensaetze/wochen-und-tr%C3%B6delm%C3%A4rkte
[bochum-wikipedia]: https://en.wikipedia.org/wiki/Bochum
[bochum-markets]: https://www.bochum.de/amt32/wochenmaerkte
[bonn-wikipedia]: https://en.wikipedia.org/wiki/Bonn
[bonn-markets]: http://opendata.bonn.de/dataset/veranstaltungskalender-komplett%C3%BCbersicht
[bottrop-wikipedia]: https://en.wikipedia.org/wiki/Bottrop
[bottrop-markets]: https://www.bottrop.de/vv/produkte/dezernat3/30/30-2/Wochenmaerkte.php
[braunschweig-wikipedia]: https://de.wikipedia.org/wiki/Braunschweig
[braunschweig-markets]: http://www.braunschweig.de/leben/einkaufen_maerkte/wochenmaerkte/index.html
[bruchköbel-wikipedia]: https://de.wikipedia.org/wiki/Bruchk%C3%B6bel
[bruchköbel-markets]: http://www.stadtmarketing-bruchkoebel.de/einkaufen-geniessen/wochenmarkt-bruchkoebel/
[chemnitz-wikipedia]: https://en.wikipedia.org/wiki/Chemnitz
[chemnitz-markets]: http://chemnitz.de/chemnitz/de/aktuelles/ausschreibungen/marktausschreibung/index.html
[dortmund-wikipedia]: https://en.wikipedia.org/wiki/Dortmund
[dortmund-markets]: https://www.dortmund.de/de/leben_in_dortmund/stadtportraet/einkaufen/wochenmaerkte/
[dresden-wikipedia]: https://en.wikipedia.org/wiki/Dresden
[dresden-markets]: https://www.dresden.de/de/leben/sport-und-freizeit/maerkte-in-dresden.php
[duisburg-wikipedia]: https://en.wikipedia.org/wiki/Duisburg
[duisburg-markets]: https://www.duisburg.de/leben/maerkte_in_duisburg/index.php
[duesseldorf-wikipedia]: https://de.wikipedia.org/wiki/D%C3%BCsseldorf
[duesseldorf-markets]: https://www.duesseldorf.de/verbraucherschutz/marktverwaltung/wochen.shtml
[erlangen-wikipedia]: https://en.wikipedia.org/wiki/Erlangen
[erlangen-markets]: http://www.erlangen.de
[essen-wikipedia]: https://en.wikipedia.org/wiki/Essen
[essen-markets]: https://www.essen.de/rathaus/aemter/ordner_32/Wochenmaerkte.de.html
[freiburg-wikipedia]: https://en.wikipedia.org/wiki/Freiburg_im_Breisgau
[freiburg-markets]: http://www.freiburg.de/pb/,Lde/226390.html
[Gelsenkirchen-wikipedia]: https://en.wikipedia.org/wiki/Gelsenkirchen
[Gelsenkirchen-markets]: https://www.essen.de/rathaus/aemter/ordner_32/Wochenmaerkte.de.html
[hagen-wikipedia]: https://de.wikipedia.org/wiki/Hagen
[hagen-markets]: https://www.hagen.de/web/de/fachbereiche/fb_32/fb_32_07/fb_32_0707/wochenmaerkte.html
[hanau-wikipedia]: https://de.wikipedia.org/wiki/Hanau
[hanau-markets]: http://www.hanau.de/lih/sport/maerkte/woma/010241/
[herne-wikipedia]: https://de.wikipedia.org/wiki/Herne
[herne-markets]: http://www.herne.de/kommunen/herne/ttw.nsf/id/DE_Wochenmaerkte
[hilden-wikipedia]: https://de.wikipedia.org/wiki/Hilden
[hilden-markets]: http://www.hilden.de/sv_hilden/Unsere%20Stadt/Rathaus/Ortsrecht/II-04%20Festsetzung%20Wochenm%C3%A4rkte.pdf
[koeln-wikipedia]: https://en.wikipedia.org/wiki/Cologne
[koeln-markets]: http://www.offenedaten-koeln.de/dataset/wochenmaerkte-koeln
[karlsruhe-wikipedia]: https://en.wikipedia.org/wiki/Karlsruhe
[karlsruhe-markets]: http://www.karlsruhe.de/b3/maerkte/wochenmarkte.de
[kassel-wikipedia]: https://en.wikipedia.org/wiki/Kassel
[kassel-markets]: http://www.serviceportal-kassel.de/cms05/dienstleistungen/029907/index.html
[kiel-wikipedia]: https://en.wikipedia.org/wiki/Kiel
[kiel-markets]: https://www.kiel.de/touristik/maerkte/wochenmarkt.php
[langenfeld-rhld-wikipedia]: https://de.wikipedia.org/wiki/Langenfeld_(Rheinland)
[langenfeld-rhld-markets]: http://langenfeld.active-city.net/city_info/display/dokument/show.cfm?region_id=138&id=4240&design_id=3340&type_id=0&titletext=1
[leipzig-wikipedia]: https://en.wikipedia.org/wiki/Leipzig
[leipzig-markets]: https://www.leipzig.de/freizeit-kultur-und-tourismus/einkaufen-und-ausgehen/maerkte/
[moers-wikipedia]: https://en.wikipedia.org/wiki/Moers
[moers-markets]: https://www.moers.de/de/stichwoerter/maerkte-7688193/
[muelheim-ad-ruhr-wikipedia]: https://en.wikipedia.org/wiki/Mülheim
[muelheim-ad-ruhr-markets]: https://www.muelheim-ruhr.de/cms/muelheimer_wochenmaerkte1.html
[muenchen-wikipedia]: https://en.wikipedia.org/wiki/M%C3%BCnchen
[muenchen-markets]: https://www.opengov-muenchen.de/dataset/maerkte
[muenster-wikipedia]: https://en.wikipedia.org/wiki/M%C3%BCnster
[muenster-markets]: http://www.muenster.de/stadt/maerkte/markt.html
[nersingen-wikipedia]: https://de.wikipedia.org/wiki/Nersingen
[nersingen-markets]: http://www.nersingen.de/buerger_information/maerkte/_Nersinger-Wochenmarkt_84.html
[neu-ulm-wikipedia]: https://en.wikipedia.org/wiki/Neu-Ulm
[neu-ulm-markets]: http://nu.neu-ulm.de/de/neu-ulm-erleben/veranstaltungen/feste-maerkte/wochenmarkt/
[paderborn-wikipedia]: https://en.wikipedia.org/wiki/Paderborn
[paderborn-markets]: http://www.paderborn.de/microsite/wochenmarkt/marktinfos/109010100000079411.php?p=5,1
[potsdam-wikipedia]: https://en.wikipedia.org/wiki/Potsdam
[potsdam-markets]: https://www.potsdam.de/kategorie/maerkte
[rostock-wikipedia]: https://en.wikipedia.org/wiki/Rostock
[rostock-markets]: http://www.rostocker-wochenmaerkte.de/standorte-angebote/
[schwerin-wikipedia]: https://en.wikipedia.org/wiki/Schwerin
[schwerin-markets]: http://marketing.schwerin.info/stadtmarketing/aufgaben/Flaeche_Maerkte.html
[siegen-wikipedia]: https://en.wikipedia.org/wiki/Siegen
[siegen-markets]: http://www.siegen.de/ols/dienstleistungen-a-bis-z/?tx_ricools_showtasks%5Baufgabe%5D=597&tx_ricools_showtasks%5Baction%5D=show&tx_ricools_showtasks%5Bcontroller%5D=Aufgabe&cHash=45090d0fafa93fbd51bc3839bfefabe5
[ulm-wikipedia]: https://en.wikipedia.org/wiki/Ulm
[ulm-markets]: http://www.ulm-messe.de/marktwesen/wochenmarkt_ulm_soeflingen.97943.21332,97940,97943.htm
[wiesbaden-wikipedia]:https://en.wikipedia.org/wiki/Wiesbaden
[wiesbaden-markets]:http://www.wiesbaden.de/wiesbadener-wochenmarkt/
[witten-wikipedia]:https://en.wikipedia.org/wiki/Witten
[witten-markets]:http://www.stadtmarketing-witten.de/einkaufen/wochenmaerkte.html
[wuppertal-wikipedia]:https://en.wikipedia.org/wiki/Wuppertal
[wuppertal-markets]:https://www.wuppertal.de/tourismus-freizeit/einkaufen/102370100000204430.php


