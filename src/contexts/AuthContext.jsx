import { createContext, useContext, useEffect, useState } from 'react';
import { API } from '../services/services';
import '../index.css';

const AuthContext = createContext({
  auth: null,
  setAuth: () => {},
  user: null,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);
  const [notis, setNotis] = useState([]);
  const [inChat, setInChat] = useState(false);

  useEffect(() => {
    const isAuth = async () => {
      try {
        const res = await API.get(
          'user/current'
        );
        let newNotis = [];
        if (!inChat) {
          if (res.data.admin) res.data.chats.map((chat) => {
            if (!chat.adminLast && chat.open) return newNotis.push(chat._id)
          })
    
          else res.data.tickets.map((ticket) => {
            if (ticket.adminLast && ticket.open) return newNotis.push(ticket._id)
          })
          setNotis(newNotis)
        }
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
      setLoading(false)
      if (ticket) setTicket(false);
    };

    isAuth();

  }, [auth, ticket, inChat]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, setTicket, setInChat, user, loading, notis, setNotis, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;