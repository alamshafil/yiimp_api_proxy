const express = require('express')
const request = require('request');
const app = express()
const port = 3000

var baseAPI = "http://arctic-crypto.com:4000/api/pools";
var poolAPI = "http://135.125.235.154/api/";
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
                    "id": key,
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
                    "poolFeePercent": e.fees,
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
            request(baseAPI, options, (error, result, body) => {
                if (error) {
                    return console.log(error)
                };
        
                if (!error && result.statusCode == 200) {
                    var baseJSON = JSON.parse(JSON.stringify(body));
                    for (var i = 0; i < coins.length; i++) {
                        baseJSON["pools"].push(coins[i]);
                    }
                    res.send(baseJSON);
                }
            });
        }
    });
})

app.get('/api/pools/:id/performance', (req, res) => {
    request(baseAPI + `pools/${req.params.id}/performance`, options, (error, result, body) => {
        if (error) {
            return console.log(error)
        };

        if (!error && result.statusCode == 200) {
            res.send(body);
        }
    });
})

app.get('/api/pools/:id/blocks', (req, res) => {
    request(baseAPI + `pools/${req.params.id}/blocks`, options, (error, result, body) => {
        if (error) {
            return console.log(error)
        };

        if (!error && result.statusCode == 200) {
            res.send(body);
        }
    });
})

app.get('/api/pools/:id/payments', (req, res) => {
    request(baseAPI + `pools/${req.params.id}/payments`, options, (error, result, body) => {
        if (error) {
            return console.log(error)
        };

        if (!error && result.statusCode == 200) {
            res.send(body);
        }
    });
})

app.get('/api/pools/:id/miners/:addr', (req, res) => {
    request(baseAPI + `pools/${req.params.id}/miners/${req.params.addr}`, options, (error, result, body) => {
        if (error) {
            return console.log(error)
        };

        if (!error && result.statusCode == 200) {
            res.send(body);
        }
    });
})

app.get('/api/pools/:id/miners/:addr/settings', (req, res) => {
    request(baseAPI + `pools/${req.params.id}/miners/${req.params.addr}/settings`, options, (error, result, body) => {
        if (error) {
            return console.log(error)
        };

        if (!error && result.statusCode == 200) {
            res.send(body);
        }
    });
})

app.get('/api/pools/:id/miners/:addr/performance', (req, res) => {
    request(baseAPI + `pools/${req.params.id}/miners/${req.params.addr}/performance`, options, (error, result, body) => {
        if (error) {
            return console.log(error)
        };

        if (!error && result.statusCode == 200) {
            res.send(body);
        }
    });
})

app.listen(port, () => {
    console.log(`API Proxy listening on ${port}`)
})
