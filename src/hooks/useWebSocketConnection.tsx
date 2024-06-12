import { useEffect, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

export const useWebSocketConnection = (
  apiUrl: string,
  setResultado: (message: string) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  const [WSConnection, setWSConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    if (!WSConnection) {
      const connection = new HubConnectionBuilder()
        .withUrl(`${apiUrl}fixhub`)
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveMessage", (message: string) => {
        console.log(message);
        setResultado(message);
        setIsLoading(false);
      });

      connection.start().catch(console.error);
      setWSConnection(connection);
    }
  }, [WSConnection, apiUrl, setResultado, setIsLoading]);

  return WSConnection;
};
