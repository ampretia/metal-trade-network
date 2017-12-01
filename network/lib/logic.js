/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/** Creates a new listing on a exchange
 * @param {ampretia.mtn.SubmitListing} listingtx - the trade to be processed
 * @transaction
 * validate broker has the listing.
 */
function submitListing(listingtx){

    var exchangeToListOn = listingtx.exchange;
    var trader = getCurrentParticipant();

    var newListing = getFactory().newResource('ampretia.mtn','CommodityListing',listingtx.newid);

    newListing.commodity = listingtx.commodity;
    newListing.quantity = listingtx.quantity;
    newListing.offerPrice = listingtx.offerPrice;
    newListing.offeringHouse = trader.employer;

    exchangeToListOn.listedCommodities.push(newListing);

    var exchangeRegistry;
    var listingRegsitry;

    return getAssetRegistry('ampretia.mtn.CommodityListing')
      .then(function (result){
          listingRegsitry = result;
          return getAssetRegistry('ampretia.mtn.Exchange');
      })
      .then(function(result){
          exchangeRegistry = result;
      })
      .then(function(){
          return listingRegsitry.add(newListing);
      })
      .then(function(){
          return exchangeRegistry.update(exchangeToListOn);
      });

}

/**
 * Track the trade of a commodity from one trader to another
 * @param {ampretia.mtn.Trade} trade - the trade to be processed
 * @transaction
 */
function tradeCommodity(trade) {

    // get details of the trade
    var symbol = trade.line.tradingSymbol;
    var cost = trade.line.quantity;

    var exchange = trade.exchange;
    // get details of the trader
    var trader = trade.trader;

    var newHolding;
    var listing;
    var exchange = trade.exchange;
    var brokage = trade.trader.employer;

    var regisitries = {};

    return getAssetRegistry('ampretia.mtn.CommodityHolding')
    .then(function (result){
        regisitries['ampretia.mtn.CommodityHolding']=result;
        return getAssetRegistry('ampretia.mtn.CommodityListing');
    })
    .then(function (result){
        regisitries['ampretia.mtn.CommodityListing']=result;
        return getAssetRegistry('ampretia.mtn.Exchange');
    })
    .then(function (result){
        regisitries['ampretia.mtn.Exchange']=result;
        return getAssetRegistry('ampretia.mtn.Brokage');
    })
    .then(function (result){
        regisitries['ampretia.mtn.Brokage']=result;
        return getParticipantRegistry('ampretia.mtn.Trader');
    })
    .then(function (result){
        regisitries['ampretia.mtn.Trader']=result;
        // need to see if the exchange has the commodity listed,
        var possibleListings = exchange.listedCommodities.filter(function(e) {
            // look for listings that match the requested symbol
            return (e.commodity.tradingSymbol === symbol) &&
               (e.quantity >= trade.line.quantity);
        });

        if (!possibleListings){
            throw new Error('Commodity is not currently listed for trade');
        }

            // find a suitable listing... asserting that the purchase has to come from
        // only one listing  and is the price acceptable
        // TODO

        listing = possibleListings[0];
        newHolding = getFactory().newResource('ampretia.mtn','CommodityHolding',trade.mytradeid);

        newHolding.commodity = listing.commodity;
        newHolding.quantity = trade.line.quantity;
        newHolding.purchasePrice = listing.offerPrice;
        newHolding.tradedBy = trader;

        listing.quantity -= trade.line.quantity;

        if ((listing.offerPrice * trade.line.quantity) > trader.fundLimit){
            // TODO emit event
            throw new Error('You can not afford that');
        }
        trader.fundLimit -= (listing.offerPrice * trade.line.quantity);
        // TODO if zero need to remove listing.

        brokage.portfolio.push(newHolding);
    }).then(function(){
        // put the assets back
        return regisitries['ampretia.mtn.CommodityHolding'].add(newHolding);
    })
    .then(function(){
        // put the assets back
        return regisitries['ampretia.mtn.CommodityListing'].update(listing);
    }).then(function(){
        return regisitries['ampretia.mtn.Brokage'].update(brokage);
    }).then(function(){
        return regisitries['ampretia.mtn.Exchange'].update(exchange);
    }).then(function(){
        return regisitries['ampretia.mtn.Trader'].update(trader);
    }).then(function(){
       // var url = "https://hooks.slack.com/services/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";
       // return post(url, listing);
    });

}






