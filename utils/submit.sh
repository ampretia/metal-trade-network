#!/bin/bash
set -v

DEST=local

ADMIN_CARD=admin@mtn-${DEST}
USER_CARD=susie@mtn-${DEST}

composer identity issue --card $ADMIN_CARD -u susie_id -a ampretia.mtn.Trader#6515 --file susie.card
composer card import --file susie.card --name $USER_CARD

composer transaction submit --card $USER_CARD -d '{
            "$class": "ampretia.mtn.SubmitListing",
            "commodity": {
              "$class": "ampretia.mtn.Commodity",
              "tradingSymbol": "Fe",
              "description": "Lead"
            },
            "quantity": 100000,
            "offerPrice": 20,
            "exchange": "resource:ampretia.mtn.Exchange#2751",
            "newid": "fe02"
          }'

composer transaction submit --card $USER_CARD -d '{
            "$class": "ampretia.mtn.SubmitListing",
            "commodity": {
              "$class": "ampretia.mtn.Commodity",
              "tradingSymbol": "Au",
              "description": "Gold"
            },
            "quantity": 100000,
            "offerPrice": 20,
            "exchange": "resource:ampretia.mtn.Exchange#2751",
            "newid": "au01"
          }'          

composer transaction submit --card $USER_CARD -d '{
            "$class": "ampretia.mtn.SubmitListing",
            "commodity": {
              "$class": "ampretia.mtn.Commodity",
              "tradingSymbol": "Ag",
              "description": "Gold"
            },
            "quantity": 1000,
            "offerPrice": 2000,
            "exchange": "resource:ampretia.mtn.Exchange#2751",
            "newid": "ag01"
          }'       

composer transaction submit --card $USER_CARD -d '{
            "$class": "ampretia.mtn.Trade",
            "line": {
              "$class": "ampretia.mtn.TradeLine",
              "tradingSymbol": "Ag",
              "quantity": 100
            },
            "trader": "resource:ampretia.mtn.Trader#6515",
            "exchange": "resource:ampretia.mtn.Exchange#2751",
            "mytradeid": "susie_003"
          }'

composer transaction submit --card $USER_CARD -d '{
            "$class": "ampretia.mtn.Trade",
            "line": {
              "$class": "ampretia.mtn.TradeLine",
              "tradingSymbol": "Ag",
              "quantity": 2
            },
            "trader": "resource:ampretia.mtn.Trader#6515",
            "exchange": "resource:ampretia.mtn.Exchange#2751",
            "mytradeid": "susie_003"
          }'          