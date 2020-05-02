var express = require('express');
var router = express.Router();
var bip32 = require("bip32");
var bip39 = require("bip39");
var bitcoin = require("bitcoinjs-lib");
const https = require('https');

var found = false;
var wrong = [];

function Main() {
    console.log("--- NEW ---");
    generatePermutations();
}

var counter = 0;
const words = [
    ["sílaba"], //1
    ["terco"], //2 
    ["existir"], //3
	
    ["ola", "onda"], //4
    ["gacela"], //5
    ["salir", "palabra", "ganar"], //6

    ["satán"], //7
    ["mambo"], // 8
    ["barro", "maíz"], //9

    ["cabeza"], //10
    ["morir", "rezar"], //11
    ["ánimo", "chiste"]  //12
];

function generatePermutations() {
    for (var i = 0; i < words[0].length; i++)
        for (var j = 0; j < words[1].length; j++)
            for (var k = 0; k < words[2].length; k++)
                for (var l = 0; l < words[3].length; l++)
                    for (var m = 0; m < words[4].length; m++)
                        for (var n = 0; n < words[5].length; n++)
                            for (var o = 0; o < words[6].length; o++)
                                for (var p = 0; p < words[7].length; p++)
                                    for (var q = 0; q < words[8].length; q++)
                                        for (var r = 0; r < words[9].length; r++)
                                            for (var s = 0; s < words[10].length; s++)
                                                for (var t = 0; t < words[11].length; t++)
                                                    if (!found)
                                                        test(
                                                            words[0][i],
                                                            words[1][j],
                                                            words[2][k],
                                                            words[3][l],
                                                            words[4][m],
                                                            words[5][n],
                                                            words[6][o],
                                                            words[7][p],
                                                            words[8][q],
                                                            words[9][r],
                                                            words[10][s],
                                                            words[11][t],
                                                        );
}

function test(w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12, ) {
    var mnemonic = w1 + " " + w2 + " " + w3 + " " + w4 + " " + w5 + " " + w6 + " " + w7 + " " + w8 + " " + w9 + " " + w10 + " " + w11 + " " + w12;

	var bytesSeed = bip39.mnemonicToSeedSync(mnemonic);
    var interface = bitcoin.bip32.fromSeed(bytesSeed);

    const { address } = bitcoin.payments.p2pkh({ pubkey: interface.publicKey });

	if (address == "1E542cw531KUThrba2TVEqQ3BDEuHNHDDR") console.log("-- THIS --", console.log(mnemonic));
    counter += 1000;
    setTimeout(httpreq, counter, address, mnemonic);
}

function httpreq(address, mnemonic) {
    https.get('https://blockchain.info/balance?active=' + address, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            // console.log(chunk);
            data += chunk;
        });

        resp.on('end', () => {
            try {
                var adata = JSON.parse(data);
            } catch (e) {
                console.log("-- ERROR --");
                console.log(data);
                console.log(e);
                console.log("-- END --");
                return;
            }

            if (adata["1CAxTEBUxZBiCgRbTfJ2gEQoA2aoM358dZ"])
                found = true;

            console.log("--- FOUND ---");
            console.log(adata);
            console.log(mnemonic);
            console.log("--- END ---");

            if (found)
                console.log("!!!!!! SUP !!!!!!");
        });
    }).on("error", (e) => console.log(e));
}

module.exports = {
    router: router,
    Main: Main
};
