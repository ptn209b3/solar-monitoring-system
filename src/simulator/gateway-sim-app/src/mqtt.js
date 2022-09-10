const mqtt = require("mqtt");

let client;

class MQTT {
  static connect(mqttBrokerUrl) {
    if (client) return;
    client = mqtt.connect(mqttBrokerUrl);
    client.on("connect", onConnectCallback);
    client.on("message", onMessageCallback);
  }

  static publish(topic, message) {
    let messageString =
      typeof message === "string" ? message : JSON.stringify(message);

    client.publish(topic, messageString, (error) => {
      if (error) return console.error(error);
      console.log("published to", topic);
    });
  }

  static subscribe(topic) {
    client.subscribe(topic, (error) => {
      if (error) return console.error(error);
      console.log("subscribed to", topic);
    });
  }

  static unsubscribe(topic) {
    client.unsubscribe(topic, (error) => {
      if (error) return console.error(error);
      console.log("unsubscribed from", topic);
    });
  }
}

async function onConnectCallback() {
  console.log("connected to mqtt-broker");
}

function onMessageCallback(topic, message) {
  // message is a buffer, so convert it to string
  const messageString = message.toString();

  console.log(topic);
  console.log(messageString);
}

module.exports = MQTT;
