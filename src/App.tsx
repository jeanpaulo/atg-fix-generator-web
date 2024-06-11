import { useState, useEffect } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const URL = "https://localhost:7146/";

function App() {
  const [WSConnection, setWSConnection] = useState(null);
  const [simbolo, setSimbolo] = useState("");
  const [lado, setLado] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [preco, setPreco] = useState("");

  const [resultado, setResultado] = useState("");

  useEffect(() => {
    if (!WSConnection) {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl(`${URL}fixhub`)
          .configureLogging(LogLevel.Information)
          .build();

        connection.on("ReceiveMessage", (message) => {
          console.log(message);
          setResultado(message);
        });

        connection.start();
        setWSConnection(connection);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const data = {
        Simbolo: simbolo,
        Lado: lado,
        Quantidade: quantidade,
        Preco: preco,
      };
      console.log(JSON.stringify(data));

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // mode: "cors",
      };

      const url = `${URL}OrderGenerator`;
      console.log(url);
      await fetch(url, options);
    } catch (error) {
      console.log("@@@ ", error);
    }
  }

  return (
    <>
      <form onSubmit={async (e) => await handleSubmit(e)}>
        <div>
          <label htmlFor="simbolo">Simbolo</label>
          <input
            type="text"
            id="simbolo"
            name="simbolo"
            value={simbolo}
            onChange={(event) => setSimbolo(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="lado">Lado</label>
          <input
            type="text"
            id="lado"
            name="lado"
            value={lado}
            onChange={(event) => setLado(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="quantidade">Quantidade</label>
          <input
            type="text"
            id="quantidade"
            name="quantidade"
            value={quantidade}
            onChange={(event) => setQuantidade(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="quantidade">Preço</label>
          <input
            type="text"
            id="preco"
            name="preco"
            value={preco}
            onChange={(event) => setPreco(event.target.value)}
          />
        </div>

        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
      <div>{resultado}</div>
    </>
  );
}

export default App;
