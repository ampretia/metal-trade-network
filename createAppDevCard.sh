#!/bin/bash
set -ev

composer participant add --card admin@mtn-local --data '{
  "$class": "ampretia.mtn.AppDev",
  "id": "8522",
  "email": "nick@ampretia.co.uk",
  "firstName": "Nick",
  "lastName": "Lincoln"
}
'

composer identity issue --card admin@mtn-local -u nick -a ampretia.mtn.AppDev#8522 --file nick@mtn-local.card
