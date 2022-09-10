import React, { useState, useEffect, useContext } from "react";

class IoTClient {
  client;
  subscribedChannels;

  constructor(socketClient) {
    let client = socketClient;
    let subscribedChannels = new Map();

    client.on("message", (message, channel) => {
      let handles = subscribedChannels.get(channel);
      if (handles) {
        handles.forEach((handle) => handle(message, channel));
      }
    });

    this.subscribedChannels = subscribedChannels;
    this.client = client;
  }

  subscribe(channel, handle) {
    if (!this.subscribedChannels.has(channel)) {
      this.subscribedChannels.set(channel, new Set([handle]));
    } else this.subscribedChannels.get(channel).add(handle);
    this.client.emit("subscribe", channel);
  }

  unsubscribe(channel, handle) {
    let handles = this.subscribedChannels.get(channel);
    handles.delete(handle);
    if (handles.size === 0) {
      this.client.emit("unsubscribe", channel);
      this.subscribedChannels.delete(channel);
    }
  }
}

const IoTClientContext = React.createContext(null);

function IoTClientProvider({ client, children }) {
  return (
    <IoTClientContext.Provider value={client}>
      {children}
    </IoTClientContext.Provider>
  );
}

function useIoT(channel, options) {
  const IoTClient = useContext(IoTClientContext);

  const { initialData } = options || {};
  const [data, setData] = useState(initialData);

  useEffect(() => {
    function handle(message) {
      setData(message);
    }

    IoTClient.subscribe(channel, handle);

    return () => {
      IoTClient.unsubscribe(channel, handle);
    };
  }, [channel, IoTClient]);

  return { data };
}

export { IoTClient, IoTClientProvider, useIoT };
