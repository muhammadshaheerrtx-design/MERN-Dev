import Counter from "./components/counter.jsx";
import TodoList from "./components/todolist.jsx";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>{import.meta.env.VITE_APP_NAME}</h1>

      <Counter />
      <hr />
      <TodoList />
    </div>
  );
}

export default App;
