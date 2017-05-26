[![npm version](https://badge.fury.io/js/homebridge-switchhub.svg)](https://badge.fury.io/js/homebridge-switchhub)

# homebridge-switchhub
User defined switches for http requests. Useful for lights, A/V systems, home automation, whatever


## Switch Hub

Define your `switches` with whatever `name` you want to appear as the input title on Homekit controls. Then, the appropriate endpoint `pin` to call. Complete http endpoints are constructed as `host` + '?' + `pin`.
Currently only built to support one http method per switch service, meaning, all endpoint calls will be either `GET` (default) or `POST` etc.
```
{
    "accessory": "SwitchHub",
    "name": "My SwitchHub",
    "host": "http://192.168.0.10X:8080",   // don't forget to specify a port, if necessary
    "switches": [
       { "name" : "Living Room Light"  , "pin" : 11 },
       { "name" : "Bathroom Light"     , "pin" : 12 },
       { "name" : "Bedroom Light"      , "pin" : 13 },
       { "name" : "Garden Light"       , "pin" : 14 },
       { "name" : "Hall Light"         , "pin" : 15 }
    ]
}
```


## Configuration Params

|        Parameter       |                                     Description                                     | Required |
| -----------------------| ----------------------------------------------------------------------------------- |:--------:|
| `name`                 | name of the accessory                                                               |     ✓    |
| `host`                 | url for whatever is receiving these requests                                        |     ✓    |
| `switches`             | list of inputs - `name` and `pin`                                                   |     ✓    |
| `http_method`          | `GET` (default), `POST`,  `PUT`, `DELETE`                                           |          |
| `username`             | username for request                                                                |          |
| `password`             | password for request                                                                |          |
| `send_immediately`     | option for request                                                                  |          |
| `manufacturer`         | will show in Home app description of this Homekit accessory, ex. 'LG'               |          |
| `model`                | will show in Home app description of this Homekit accessory, ex. 'HD 2000'          |          |


## Debug logging

Running `homebridge` manually will allow you to see the SwitchHub console logs.

## Tips

  - Run Homebridge on startup and have it restart if crashed,
  - Make sure specify a port in the if necessary. (i.e. `"base_url" : "http://192.168.0.XXX:2000"`)
  - Must prepend 'http://' to your host
  - Verify the correct `http_method` is begin used. SwitchHub defaults to `GET`

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install homebridge-http using: `npm install -g homebridge-switchhub`
3. Update your config file
