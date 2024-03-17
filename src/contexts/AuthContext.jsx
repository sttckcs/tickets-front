import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { API } from "../services/services";
import "../index.css";

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
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState(null);
  const [notis, setNotis] = useState([]);
  const [inChat, setInChat] = useState(false);

  useEffect(() => {
    getTickets();
    isAuth();
  }, [auth, ticket, inChat]);

  useEffect(() => {
    mapNotis();
  }, [auth, tickets]);

  const isAuth = async () => {
    try {
      const res = await API.get("user/current");
      if (user !== res.data) setUser(res.data);
      setAuth(true);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
    if (ticket) setTicket(false);
  };

  const getTickets = async () => {
    if (user && user.admin) {
      try {
        const res = await API.post("ticket/all");
        if (res.data !== tickets) setTickets(res.data);
      } catch (error) {
        setTickets([]);
      }
    }
  };

  const mapNotis = useCallback(() => {
    let newNotis = [];
    if (user) {
      if (!user.idNeverlate && !user.admin) newNotis.push("xx21");
      if (!inChat) {
        console.log("tickets", tickets);
        if (!user.admin)
          user.tickets.map((ticket) => {
            if (ticket.adminLast && ticket.open)
              return newNotis.push(ticket._id);
          });
        else if (user.admin)
          tickets.map((ticket) => {
            if (!ticket.adminLast && ticket.open)
              return newNotis.push(ticket._id);
          });
        setNotis(newNotis);
      }
    }
  }, [auth, ticket, user, tickets]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        setTicket,
        isAuth,
        getTickets,
        tickets,
        setTickets,
        setInChat,
        user,
        setUser,
        loading,
        notis,
        setNotis,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
