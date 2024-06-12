import React from "react";

interface OrderFormProps {
  simbolo: string;
  setSimbolo: React.Dispatch<React.SetStateAction<string>>;
  lado: string;
  setLado: React.Dispatch<React.SetStateAction<string>>;
  quantidade: string;
  setQuantidade: React.Dispatch<React.SetStateAction<string>>;
  preco: string;
  setPreco: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  simbolo,
  setSimbolo,
  lado,
  setLado,
  quantidade,
  setQuantidade,
  preco,
  setPreco,
  handleSubmit,
  isLoading,
}) => {
  return (
    <>
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
            onChange={(event) => setQuantidade(event.target.value)}
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
    </>
  );
};
