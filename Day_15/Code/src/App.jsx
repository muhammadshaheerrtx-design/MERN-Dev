import "./App.css";
import BookList from "./components/BookLists";

export default function App() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      <BookList />
    </main>
  );
}
