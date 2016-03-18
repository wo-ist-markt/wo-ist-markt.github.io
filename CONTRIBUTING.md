# Contributing guide

* Please read the following **before** you create an **issue** or send a **pull request**.


## General advice

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


## Content contributions (market data)

* Add a GeoJSON file for your city containing the market data and a `metadata` block.
* Please apply **automatic formatting** for the GeoJSON file using the editor of your choice.
* You might wanna use **German spelling** with Umlauts for city names which is supported.
* Add your city to the list of **supported cities** in the *README.md*.


## Code contributions

* Always try to answer the question **"Why?"** in your commit message.
* State a **brief summary** in the first line, feel free to explain details
  under a blank line in the description part. See [Git Commit Messages][git-commit-messages].
* Check for **lint** errors.
* Create and run **tests**.



[git-commit-messages]: http://cl.ly/text/18400R3c3v1W
