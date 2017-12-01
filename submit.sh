#!/bin/bash
set -ev

composer transaction submit --card susie_trader@local -d '{
            "$class": "ampretia.mtn.SubmitListing",
            "commodity": {
              "$class": "ampretia.mtn.Commodity",
              "tradingSymbol": "Fe",
              "description": "Lead"
            },
            "quantity": 100000,
            "offerPrice": 20,
            "exchange": "resource:ampretia.mtn.Exchange#2751",
            "newid": "fe01"
          }'