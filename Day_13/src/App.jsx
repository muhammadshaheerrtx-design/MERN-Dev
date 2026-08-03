import Card from "./components/Card";
import { items } from "./data/items";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>{import.meta.env.VITE_APP_NAME}</h1>
      <h1>Games Releases Sheduled For 2026</h1>
      <div className="card-list">
        {items.map((item) => (
          <Card
            key={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
