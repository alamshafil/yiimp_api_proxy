const express = require('express')
const request = require('request');
const app = express()
const port = 3000

var baseAPI = "https://arctic-crypto.com/api/pools";
var poolAPI = "https://minersmine.com/api/";
let options = { json: true };

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/pools', (req, res) => {
    request(poolAPI + "currencies", options, (error, result, body) => {
        if (error) {
            return console.log(error)
        };

        if (!error && result.statusCode == 200) {
            var api = JSON.parse(JSON.stringify(body));
            var coins = [];
            Object.keys(api).forEach(function (key) {
                var e = api[key];
                var obj = {
                    "id": e.name,
                    "coin": {
                        "type": key,
                        "name": e.name,
                        "symbol": key,
                        "family": key,
                        "algorithm": e.algo,
                        "canonicalName": null
                    },
                    "ports": {
                        [e.port]: {
                            "listenAddress": "0.0.0.0",
                            "name": null,
                            "difficulty": e.difficulty,
                            "tcpProxyProtocol": null,
                            "tls": false,
                            "tlsPfxFile": "/var/lib/certs/mycert.pfx"
                        }
                    },
                    "paymentProcessing": {
                        "enabled": true,
                        "minimumPayment": 0.01,
                        "payoutScheme": "PROP",
                        "extra": {}
                    },
                    "shareBasedBanning": null,
                    "clientConnectionTimeout": 600,
                    "jobRebroadcastTimeout": 10,
                    "blockRefreshInterval": 400,
                    "poolFeePercent": 1.0,
                    "address": "NULL",
                    "addressInfoLink": "NULL",
                    "poolStats": {
                        "lastPoolBlockTime": e.timesincelast,
                        "connectedMiners": e.workers,
                        "poolHashrate": e.hashrate,
                        "sharesPerSecond": 0
                    },
                    "networkStats": {
                        "networkType": "Main",
                        "networkHashrate": e.network_hashrate,
                        "networkDifficulty": e.difficulty,
                        // "lastNetworkBlockTime": e.timesincelast,
                        "blockHeight": e.height,
                        "connectedPeers": 0,
                        "rewardType": "POW"
                    },
                    "topMiners": [],
                    "totalPaid": 0,
                    "totalBlocks": e["24h_blocks"],
                    "lastPoolBlockTime": e.timesincelast
                }
                coins.push(obj);
            });
            var baseJSON = { "pools": [] };
            for (var i = 0; i < coins.length; i++) {
                baseJSON["pools"].push(coins[i]);
            }
            res.send(baseJSON);
        }
    });
})

app.listen(port, () => {
    console.log(`API Proxy listening on ${port}`)
})
