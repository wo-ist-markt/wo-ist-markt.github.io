#!/usr/bin/env bash
set -euf -o pipefail

if [[ $TRAVIS_PULL_REQUEST == "false" &&  $TRAVIS_BRANCH == "master" ]]; then
  # Decrypt the SSH key that is used for authentication at our server
  openssl aes-256-cbc -K $encrypted_02f86fe65d47_key -iv $encrypted_02f86fe65d47_iv -in markt_deploy_id_rsa.enc -out markt_deploy_id_rsa -d
  # Deploy to our server using Fabric
  fab deploy -i markt_deploy_id_rsa -H deploy@kiesinger.okfn.de:2207
else
  echo "not a push to master, so not deploying"
  exit 0
fi

