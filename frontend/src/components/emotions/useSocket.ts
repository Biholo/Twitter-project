import { socket } from "@/lib/socket";
import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any[]) => void;

type EventDictionary = {
  [eventName: string]: AnyFunction;
};

export const useSocket = (events: EventDictionary) => {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    for (const [eventName, handler] of Object.entries(events)) {
      socket.on(eventName, handler);
    }

    return () => {
      for (const [eventName, handler] of Object.entries(events)) {
        socket.off(eventName, handler);
      }
    };
  }, [events]);

  return socket;
};
