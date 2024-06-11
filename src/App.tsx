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
    <div className="flex flex-col gap-2 w-full h-screen justify-center items-center">
      <form
        className="w-1/2 gap-3 flex flex-col bg-slate-600 p-8 rounded rounded-lg"
        onSubmit={async (e) => await handleSubmit(e)}
      >
        <div className="flex items-center">
          <label htmlFor="simbolo" className="w-32">
            Simbolo
          </label>
          <select
            className="flex-1 select select-bordered select-sm"
            id="simbolo"
            name="simbolo"
            value={simbolo}
            onChange={(event) => setSimbolo(event.target.value)}
          >
            <option selected disabled value=""></option>
            <option value="PETR4">PETR4</option>
            <option value="VALE3">VALE3</option>
            <option value="VIIA4">VIIA4</option>
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="lado" className="w-32">
            Lado
          </label>
          <select
            className="flex-1 select select-bordered select-sm"
            id="lado"
            name="lado"
            value={lado}
            onChange={(event) => setLado(event.target.value)}
          >
            <option selected disabled value=""></option>
            <option value="1">Compra</option>
            <option value="2">Venda</option>
          </select>
        </div>

        <div className="flex">
          <label htmlFor="quantidade" className="w-32">
            Quantidade
          </label>
          <input
            type="text"
            id="quantidade"
            name="quantidade"
            value={quantidade}
            className="flex-1 input input-sm max-w-xs"
            onChange={(event) => setQuantidade(event.target.value)}
          />
        </div>

        <div className="flex">
          <label htmlFor="quantidade" className="w-32">
            Preço
          </label>
          <input
            type="text"
            id="preco"
            name="preco"
            value={preco}
            className="flex-1 input input-sm max-w-xs"
            onChange={(event) => setPreco(event.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <button type="submit" className="btn btn-primary btn-wide">
            Enviar
          </button>
        </div>
      </form>

      <div className="w-1/2 gap-3 flex flex-col p-6 rounded rounded-lg transition-all duration-200 ease-in-out">
        {resultado == "ExecutionReport" && (
          <div className="alert alert-success flex justify-center">
            <span className="">{resultado}</span>
          </div>
        )}
        {resultado == "OrderReject" && (
          <div className="alert alert-error duration-200 flex justify-center">
            <span className="">{resultado}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
