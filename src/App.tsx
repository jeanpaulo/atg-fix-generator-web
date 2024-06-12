import { useState, useEffect, FormEvent } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:5074/";

function App() {
  const [WSConnection, setWSConnection] = useState<HubConnection | null>(null);
  const [simbolo, setSimbolo] = useState("");
  const [lado, setLado] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");

  const [resultado, setResultado] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    const qtd = parseInt(quantidade);
    const price = parseFloat(preco);

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
        Quantidade: quantidade,
        Preco: preco,
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
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center w-screen h-screen text-violet-700 bg-[#4f4f4f88] ">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      <form
        className="flex flex-col w-1/3 max-w-md gap-3 p-8 rounded rounded-lg min-w-80 bg-slate-600"
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
            required={true}
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
            required={true}
            onChange={(event) => setLado(event.target.value)}
          >
            <option selected disabled value=""></option>
            <option value="1">Compra</option>
            <option value="2">Venda</option>
          </select>
        </div>

        <div className="flex">
          <label htmlFor="quantidade" className="block w-32">
            Quantidade
          </label>
          <input
            type="number"
            id="quantidade"
            name="quantidade"
            value={quantidade}
            required={true}
            className="flex-1 w-full input input-sm"
            onChange={(event) =>
              setQuantidade(parseInt(event.target.value, 10))
            }
          />
        </div>

        <div className="flex">
          <label htmlFor="quantidade" className="block w-32">
            Preço
          </label>
          <input
            type="text"
            id="preco"
            name="preco"
            value={preco}
            required={true}
            className="flex-1 w-full input input-sm"
            onChange={(event) => setPreco(event.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary btn-wide"
            disabled={isLoading}
          >
            Enviar
          </button>
        </div>
      </form>

      <div className="flex flex-col w-1/2 gap-3 p-6 transition-all duration-200 ease-in-out rounded rounded-lg">
        {resultado == "ExecutionReport" && (
          <div className="flex justify-center alert alert-success">
            <span className="">{resultado}</span>
          </div>
        )}
        {resultado == "OrderReject" && (
          <div className="flex justify-center duration-200 alert alert-error">
            <span className="">{resultado}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col max-w-lg">
        {error.length > 0 && (
          <Alert isVisible={error.length > 0}>
            <span>{error}</span>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default App;

function Alert({
  isVisible,
  children,
}: {
  isVisible: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div role="alert" className="alert alert-warning">
            <WarningSvgIcon />
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WarningSvgIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 stroke-current shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}
