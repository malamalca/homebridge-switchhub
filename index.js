'use strict';

var Service;
var Characteristic;
var request = require('request');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-switchhub', 'SwitchHub', SwitchHub);
};

function SwitchHub(log, config) {
    this.log = log;

    this.name            = config.name             || 'SwitchHub';
    this.type            = config.type;           
    
    this.host            = config.host             || '';
    this.httpMethod      = config.http_method      || 'GET';
    this.username        = config.username         || '';
    this.password        = config.password         || '';
    this.sendImmediately = config.send_immediately || '';

    this.manufacturer    = config.manufacturer     || 'ARHIM d.o.o.';
    this.model           = config.model            || 'SwitchHub 1.0';

    this.switches        = config.switches;
}

SwitchHub.prototype = {

    httpRequest: function(url, body, method, username, password, sendimmediately, callback) {
        request({
            url: url,
            body: body,
            method: method,
            rejectUnauthorized: false,
            auth: {
                user: username,
                pass: password,
                sendImmediately: sendimmediately
            }
        },
        function(error, response, body) {
            callback(error, response, body);
        });
    },

    setPowerState: function(targetService, powerState, callback, context) {
        let funcContext = 'fromSetPowerState';
        var reqUrl = '', reqBody = '';

        if (context == funcContext) { // callback safety
            if (callback) callback();
            return;
        }


        this.services.forEach(function (switchService, i) {
            if (i === 0) return; // skip informationService at index 0

            if (targetService.subtype === switchService.subtype) { // turn on
                reqUrl = this.host + '?' + this.switches[i-1].pin;
                switchService.getCharacteristic(Characteristic.On).setValue(true, undefined, funcContext);
            } else { // turn off
                switchService.getCharacteristic(Characteristic.On).setValue(false, undefined, funcContext);
            }
        }.bind(this));

        this.httpRequest(reqUrl, reqBody, this.httpMethod, this.username, this.password, this.sendImmediately, function(error, response, responseBody) {
            if (error) {
                this.log.error('setPowerState failed: ' + error.message);
                this.log('response: ' + response + '\nbody: ' + responseBody);
            
                callback(error);
            } else {
                this.log('==> ' + targetService.subtype);
                callback();
            }
        }.bind(this));
    },

    identify: function (callback) {
        this.log('Identify me Senpai!');
        callback();
    },

    getServices: function () {
        this.services = [];

        let informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(Characteristic.Model, this.model);
        this.services.push(informationService);

        this.log.warn('[SwitchHub]: ' + this.name);

        this.switches.forEach(function(switchItem, i) {
            switch(i) {
                case 0:
                    this.log.warn('---+--- ' + switchItem.name); break;
                case this.switches.length-1:
                    this.log.warn('   +--- ' + switchItem.name); break;
                default:
                    this.log.warn('   |--- ' + switchItem.name);
            }

            let switchService = new Service.Switch(switchItem.name, switchItem.name);

            // Bind a copy of the setPowerState function that sets 'this' to the accessory and the first parameter
            // to the particular service that it is being called for. 
            let boundSetPowerState = this.setPowerState.bind(this, switchService);
            switchService
                .getCharacteristic(Characteristic.On)
                .on('set', boundSetPowerState);

            this.services.push(switchService);
        }.bind(this));

        
        return this.services;
    }
};
