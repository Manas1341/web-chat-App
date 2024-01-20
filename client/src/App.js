import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import ChatProvider from "./Context/ChatProvider";
function App() {
  return (
    <div className="App">
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chats" element={<Chatpage />} />
        </Routes>
      </ChatProvider>
    </div>
  );
}

export default App;