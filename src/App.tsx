import { useState, useEffect, FormEvent } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { useWebSocketConnection } from "./hooks/useWebSocketConnection";
import { OrderForm } from "./Components/OrderForm";
import { ResultDisplay } from "./Components/ResultDisplay";
import { Alert } from "./Components/Alert";
import Loading from "./Components/Loading";

const API_URL = "http://localhost:5074/";

function App() {
  const [simbolo, setSimbolo] = useState("");
  const [lado, setLado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");

  const [resultado, setResultado] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const WSConnection = useWebSocketConnection(
    API_URL,
    setResultado,
    setIsLoading
  );

  useEffect(() => {
    if (!WSConnection) {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl(`${API_URL}fixhub`)
          .configureLogging(LogLevel.Information)
          .build();

        connection.on("ReceiveMessage", (message: string) => {
          console.log(message);
          UpdateResult(message);
          setIsLoading(false);
        });

        connection.start();
        setWSConnection(connection);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  function UpdateResult(message: string) {
    setResultado(message);
    setSimbolo("");
    setLado("");
    setQuantidade("");
    setPreco("");
  }

  function triggerError(message: string) {
    setError(message);

    setTimeout(() => {
      setError("");
      setIsLoading(false);
    }, 4000);
  }

  function checkErrors() {
    const qtd = parseInt(quantidade, 10);
    const price = TratarPreco(preco);

    if (qtd < 1 || qtd >= 100000) {
      triggerError("Quantidade precisa ser maior que 0 e menor que 100.000");
      return false;
    }

    if (price <= 0 || price >= 1000) {
      triggerError("Preço precisa ser maior que 0 e menor que 1000");
      return false;
    }

    if (Math.round(price * 100) !== price * 100) {
      triggerError("Não é múltiplo de 0.01");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!checkErrors()) {
      return;
    }

    try {
      const data = {
        Simbolo: simbolo,
        Lado: lado,
        Quantidade: parseInt(quantidade, 10),
        Preco: TratarPreco(preco),
      };
      // console.log(JSON.stringify(data));

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // mode: "cors",
      };

      const url = `${API_URL}OrderGenerator`;
      // console.log(url);
      setIsLoading(true);
      await fetch(url, options);
    } catch (error) {
      console.log("@@@ ", error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-2">
      <Loading isLoading={isLoading} />

      <OrderForm
        simbolo={simbolo}
        setSimbolo={setSimbolo}
        lado={lado}
        setLado={setLado}
        quantidade={quantidade}
        setQuantidade={setQuantidade}
        preco={preco}
        setPreco={setPreco}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <ResultDisplay resultado={resultado} />
      {error && (
        <Alert isVisible={!!error}>
          <span>{error}</span>
        </Alert>
      )}
    </div>
  );
}

export default App;

function TratarPreco(preco: string) {
  const precoTemporario = preco.replace(",", ".");

  return parseFloat(precoTemporario);
}
