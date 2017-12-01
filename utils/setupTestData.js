'use strict';

const fs = require('fs');

// Require the client API
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

// the logical business newtork has an indentifier
const businessNetworkConnection = new BusinessNetworkConnection();
let businessNetworkDefinition;

let serializer;

let userCardName = 'admin@local';
// rather than use console.log use more like a debug fn call
const LOG = {
    info: (string) => {
        console.log(string);
    }
};

// -----------------------------------------------------------------------------
// main code starts here
(async () => {


    try {

        LOG.info('> Deployed network - now Connecting business network connection');
        businessNetworkDefinition = await businessNetworkConnection.connect(userCardName);

        let jsonData = JSON.parse(fs.readFileSync('./data.json','utf-8'));
        serializer = businessNetworkDefinition.getSerializer();

        let namespace = jsonData.namespace;
        for (let reg of jsonData.registries){
            let fqn = namespace+'.'+reg;
            let registry = await businessNetworkConnection.getRegistry(fqn);

            for (let resource of jsonData[reg]) {
                await registry.add(serializer.fromJSON(resource));
            }

        }

        await businessNetworkConnection.disconnect();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

})();