import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setuser] = useState();
  const [SelectedChat, setSelectedChat] = useState();
  const [chats, setchats] = useState([]);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
      setuser(userInfo);
      if (!userInfo) {
        navigate("/");
      }
    };
    fetchUserData();
  }, [navigate])

  return (
    <ChatContext.Provider
      value={{
        user,
        setuser,
        SelectedChat,
        setSelectedChat,
        chats,
        setchats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;