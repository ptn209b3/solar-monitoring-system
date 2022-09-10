# Provision

## Provision Topic:

`606ff2e222c1752264934dbb/upstream`

`606ff2e222c1752264934dbb`: unique id of every distinct gateway.

## Provision Message:

An JSON of beblow Object:

```javascript
{
    type: "provision",
    payload: {
      v: { type: "number", alias: "Voltage" },
      i: { type: "number", alias: "Current" },
      p: { type: "number", alias: "RealPower" },
      q: { type: "number", alias: "ReactivePower" },
    }
```

## Telemetry

## Telemetry Topic:

`606ff2e222c1752264934dbb/upstream`

## Telemetry Message:

```javascript
{
    type: "telemetry",
    payload: {
      v: [{ time: timeStampInStringOrNum, value: somevalue1 }],
      i: [{ time: timeStampInStringOrNum, value: somevalue2 }],
      p: [{ time: timeStampInStringOrNum, value: somevalue3 }],
      q: [{ time: timeStampInStringOrNum, value: somevalue4 }],
    },
  }
```

v, i, p, q: name of provisioned channel.

## Command

```javascript
{
  "CH1_NODE1_REL1": 1,
  "CH1_NODE1_REL2": "on",
  "CH1_NODE1_REL3": true,
  "CH1_NODE1_REL4": 209,
}
```
