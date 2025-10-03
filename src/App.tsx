import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const minPrimes = 1;
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [primes, setPrimes] = useState(minPrimes);
  const [isLoading, setIsLoading] = useState(false);
  const [maxN, setMaxN] = useState(0);
  const [converged, setConverged] = useState(0);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name, primes }));
  }

  async function converge() {
    setIsLoading(true);
    setConverged(await invoke("convergent_inverse_squares", { maxN }));
    setIsLoading(false);
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <p>Use the form below to give your name and the first N prime numbers.</p>
      <p>N must be between 1 and 10.</p>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <br></br>
        <input
          id="first-n-primes"
          type="number"
          min={minPrimes}
          max={10}
          onChange={(e) => setPrimes(Number(e.currentTarget.value))}
          placeholder={`${minPrimes}`}
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
      <div>
        <p>
          Select a maximum N for the approximation of the sum of inverse
          squares.
        </p>
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            converge();
          }}
        >
          <label htmlFor="million">1,000,000</label>
          <input
            id="million"
            type="radio"
            name="maxN"
            value={1000000}
            onChange={(e) => setMaxN(Number(e.target.value))}
          />
          <label htmlFor="billion">1,000,000,000</label>
          <input
            id="billion"
            type="radio"
            name="maxN"
            value={1000000000}
            onChange={(e) => setMaxN(Number(e.target.value))}
          />
          <button type="submit" disabled={maxN === 0}>
            Calculate
          </button>
        </form>
        {isLoading && <div className="loader" />}
        <p hidden={converged === 0 || isLoading}>
          The convergent sum of inverse squares is {converged}
        </p>
      </div>
    </main>
  );
}

export default App;
