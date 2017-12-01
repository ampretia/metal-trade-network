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

/**
 * Track the trade of a commodity from one trader to another
 * @param {org.acme.trading.Trade} trade - the trade to be processed
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
    
    return getAssetRegistry('org.acme.trading.CommodityHolding')
    .then(function (result){
        regisitries['org.acme.trading.CommodityHolding']=result;
        return getAssetRegistry('org.acme.trading.CommodityListing')
    })
    .then(function (result){
        regisitries['org.acme.trading.CommodityListing']=result;
        return getAssetRegistry('org.acme.trading.Exchange')
    })
    .then(function (result){
        regisitries['org.acme.trading.Exchange']=result;
        return getAssetRegistry('org.acme.trading.Brokage')
    })
    .then(function (result){
        regisitries['org.acme.trading.Brokage']=result;
        return;
    })
    .then(function (result){
        // need to see if the exchange has the commodity listed,
        var possibleListings = exchange.listedCommodities.filter(function(e) {
            // look for listings that match the requested symbol
            return (e.commodity.tradingSymbol === symbol)
               && (e.quantity >= trade.line.quantity);        
        });

        if (!possibleListings){
            throw new Error('Commodity is not currently listed for trade');
        }

            // find a suitable listing... asserting that the purchase has to come from
        // only one listing  and is the price acceptable
        // TODO

        listing = possibleListings[0];
        newHolding = getFactory().newResource('org.amce.trading','CommodityHolding',xxxx);
        
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
        return regisitries['org.acme.trading.CommodityHolding'].add(newHoldling);
    })
    .then(function(){
        // put the assets back
        return regisitries['org.acme.trading.CommodityListing'].update(listing);
    }).then(function(){
        return regisitries['org.acme.trading.Brokage'].update(brokage);
    }).then(function(){
        return regisitries['org.acme.trading.Exchange'].update(exchange);
    })

 
}





/**
 * Remove all high volume commodities
 * @param {org.acme.trading._demoSetup} remove - the remove to be processed
 * @transaction
 */
function setup(){
    var factory = getFactory();
 	var NS = 'org.acme.trading';
    var traders = [
      factory.newResource(NS,'Trader','CAROLINE'),
      factory.newResource(NS,'Trader','TRACY'),
      factory.newResource(NS,'Trader','TOM'),
      factory.newResource(NS,'Trader','WHOLESALER')
    ];
    
                          
    var commodities = [
      factory.newResource(NS,'Commodity','Ag'),
      factory.newResource(NS,'Commodity','Pb'),
      factory.newResource(NS,'Commodity','Fe'),
      factory.newResource(NS,'Commodity','Cu')
      ];
 
    /* add the resource and the traders */
    return getParticipantRegistry(NS+'.Trader')
  .then(function(traderRegistry){
            traders.forEach(function(trader) {
         
          trader.firstName = trader.getIdentifier().toLowerCase();
          trader.lastName = 'Trader';
      });
      return traderRegistry.addAll(traders);
    })
  .then(function(){
    	return getAssetRegistry(NS+'.Commodity');
    })
  .then(function(assetRegistry){
      var qty=5;
      commodities.forEach(function(commodity) {
        commodity.description='A lot of '+commodity.getIdentifier();
        commodity.mainExchange='Hursley';
        commodity.quantity = (qty);
        commodity.owner = factory.newRelationship(NS,'Trader','WHOLESALER');
        qty+=10;
      })
      return assetRegistry.addAll(commodities);
    });
  
}
