#!/bin/bash
set -ev

composer transaction submit --card susie_trader@local -d '{
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