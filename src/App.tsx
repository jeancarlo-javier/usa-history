import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>USA History</h1>
        <p>Welcome to the USA History React App</p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
