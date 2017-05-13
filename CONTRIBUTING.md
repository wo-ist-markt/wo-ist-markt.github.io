# Contribution guide

This contribution guide aims to help you with the optimal way to get involved with this project.

## Table of contents

* [Market data contributions](#market-data-contributions)
* [Code contributions](#code-contributions)
* [How to use Git](#how-to-use-git)
* [General advices](#general-advices)

Please do not hesitate to contact us if you need help or have ideas on how to improve this guide.


## Market data contributions

You can add market data for your city in a few steps. All you need to do is to **add one file** (_city.json_)
and to **modify two existing** ones (_cities.json_, _README.md_). Here is how you start:

![city.json][icon-city-json] ![cities.json][icon-cities-json] ![README.md][icon-readme-md]

1. Add the market data for your _city.json_ as a [GeoJSON][geojson-org] file.
   You might want to use **German spelling** with Umlauts for city names which is supported.
2. Edit [*cities/cities.json*](cities/cities.json) to add your city to the list of cities.
3. Edit the [*README.md*](README.md) to add your city to the list of **supported cities**.


### Consistent formatting

* It would be great if you could apply **automatic formatting** for the GeoJSON file using the editor of your choice.
* Please stick to the formatting when editing existing files.


### Market data format specification

This section describes the file format which is used to store the market data for an individual city.

* The market data is stored in [GeoJSON format][geojson-org].
  Have a look at *[cities/karlsruhe.json](cities/karlsruhe.json?short_path=e135580)* to learn about the general structure of the file.
* Each market entry in the file basically consists of `coordinates`, and `properties` as shown in this example excerpt:

  ``` json
  {
      "geometry": {
          "coordinates": [
              8.4050009,
              48.9713553
          ],
          "type": "Point"
      },
      "properties": {
          "location": "Vor der Christ-König-Kirche",
          "opening_hours": "We, Sa 07:30-14:00",
          "opening_hours_unclassified": null,
          "title": "Rüppurr"
      },
      "type": "Feature"
  }
  ```

* The opening hours use the [OpenStreetMap opening hours format][osm-openinghours].
* Opening hours which cannot be expressed in that format can use the `opening_hours_unclassified`
  property. In that case set the `opening_hours` property to `null`.
* Besides the actual market data the file contains a `metadata` block as shown in this example excerpt:

  ``` json
  "metadata": {
      "data_source": {
          "title": "Stadt Karlsruhe",
          "url": "http://www.karlsruhe.de/b3/maerkte/wochenmarkte.de"
      }
  },
  ```

* You need to provide the `data_source` so it can be shown in the legend overlay.


### Market data validation

* The GeoJSON file will automatically be checked by a validation script when you push your
  branch to the server. Please resolve any issues detected by the validator.
* The validation script can be executed locally with the following command:

  ``` bash
  $ npm test
  ```

* Further, a valid GeoJSON file is automatically rendered by GitHub. This is a convenient way
  for you to get a [quick preview](cities/karlsruhe.json) of the market data.


## Code contributions

* Always try to answer the question **"Why?"** in your commit message.
* State a **brief summary** in the first line, feel free to explain details
  under a blank line in the description part. See [Git Commit Messages][git-commit-messages].
* Check for **lint** errors.
* Create and run **tests**.

## How to use Git

The following sections describe how to use Git locally and the branching model preferred by this project.
Most of the commands only work on the shell. GitHub and UI clients do not necessarily support all commands mentioned here.


### Basic setup

The following steps describe how to clone aka. fork the repository to your computer.
This repository and your GitHub clone will be linked to your local clone to being able to retrieve updates.

1. Create a copy of the repository in your GitHub account.
   This can easily be done by pressing the <kbd>Fork</kbd> button.
2. Create a copy of your fork on your local machine.
   The following command will clone the repository to your computer:

    ``` bash
    $ git clone git@github.com:{GITHUB_USER}/wo-ist-markt.github.io.git
    ```
3. Add this repository as a 2nd `remote` so you can always pull the latest changes.
   Here is the command to add this repository with the "wo-ist-markt" alias:

   ``` bash
   $ git remote add wo-ist-markt git@github.com:wo-ist-markt/wo-ist-markt.github.io.git
  ```

### Working on a feature branch

The following steps describe how to prepare a contribution using a branch.

1. Update your local `master` branch with the latest commits from the `wo-ist-markt` remote:

   ``` bash
   $ git pull wo-ist-markt master
   ```
2. Create a new feature branch to work on. Choose a branch name which summarizes the purpose of the
   branch such as `market-data-berlin`.

   ``` bash
   $ git checkout -b market-data-berlin
   ```

   In the following the branch will be referred to as `feature` branch to keep it more general.

3. Start working, putting finished work into separate commits:

   ``` bash
   $ git add .
   $ git commit
   ```

### Submitting your contribution

1. Before you submit your work make sure you have the latest changes which might have happened on
   the original repository in the meantime. You left your local `master` branch untouched. This
   allows to easily `pull` down commits from the `wo-ist-mark` remote with the following command:

    ``` bash
    $ git checkout master
    $ git pull wo-ist-markt master
    ```

  Now your local `feature` branch might be behind. If there are new commits on `master` your branch
  does not integrate them. This might look like this:

  ```
        C---D---E feature
       /
  A---B---F---G---H master
  ```

  In this case it is time to `rebase` your branch on top of the lastest commit on `master`. This can
  easily done with one command:

  ```
  $ git rebase master feature
  ```

  Afterwards, the branch tree looks like this:

  ```
                    C---D---E feature
                   /
  A---B---F---G---H master
  ```

  Any conflicts which might be detected during the `rebase` should be resolved by you.

  When you are done it is a good time to test if everything still works.

2. When you are up-to-date with `master` and finished your work on the `feature` branch you can push to
   your remote repository.
   This has to be done for both the `master` and your `feature` branch.

   ``` bash
   $ git checkout master
   $ git push origin master
   $ git checkout feature
   $ git push origin feature
   ```

3. Now you can visit https://github.com/wo-ist-markt/wo-ist-markt.github.io in your browser once
   again. GitHub should automatically detect the new `feature` branch in your fork and offer to
  create a new pull request. Go ahead a do so.


### Updating your branch

You might be asked to update the work on your branch. There are a couple of reasons for this such as:

* Fragments of your code can be improved.
* Data files have errors.
* You forgot to update your local `master` branch and to `rebase` your `feature` branch.

This is not a problem. Since your branch is still **your** branch you can just fix things and `push`
it once again. The following commands come in handy. Please refer to the Git documentation to learn
how to use them. Alternatively, feel free to ask for help. In order to update the remote branch in
your GitHub repository while also updating the pull request you **cannot** change the name of the branch.

``` bash
$ git checkout feature
$ git add .
$ git commit --amend
```

```
$ git cherry-pick a1b2c3
```

``` bash
$ git checkout feature
$ git rebase --interactive master
```

``` bash
$ git checkout feature
$ git push --force origin feature
```



## General advices

* Do **not** commit on the *master* branch. Always create a **feature branch**
  which branches off the **latest** commit (*HEAD*) on *master*. Pull requests are
  being merged to the *master* branch.

  ```
        C---D---E feature
       /         \
  A---B-----------F master
  ```

* Keep your *master* branch clean. This will allow to pull upstream changes
  **without** conflicts or the need to merge.
* Put changes into atomic (context-wise) commits. Clean up your branch
  before you open a pull request. Feel free to rebase **your** work on **your**
  branch and force push it. **Never** rebase work which has been pushed to *master*.
* Pull *master* before you open a pull request. If *master* changed in the meantime,
  **rebase your branch** onto the latest commit on *master*. This will ensure
  that your changes do **not conflict** with other changes which have been made
  on *master*. It is your job to sort out any conflicts before your branch is merged.





[geojson-org]: http://geojson.org
[git-commit-messages]: http://cl.ly/text/18400R3c3v1W
[icon-cities-json]: gfx/icon-cities-json.png
[icon-city-json]: gfx/icon-city-json.png
[icon-readme-md]: gfx/icon-readme-md.png
[osm-openinghours]: https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification
