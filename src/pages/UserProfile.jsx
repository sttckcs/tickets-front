import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../services/services";
import { Waveform } from "@uiball/loaders";
import Profile from "../components/Profile";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.post(
          'user/id',
          { id }
        );
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
      setLoading(false)
    };

    fetchUser();
  }, [id]);

  return (
    <>
      {loading ?
        <div className="loader">
          <Waveform />
        </div> :
        user ?
          <>
            <Profile user={user} />
            <h2><b>Tickets:</b></h2>
            <div className="tickets">
            {[...user.tickets].reverse().map((ticket) => 
              <div 
                key={ticket._id} 
                className="ticket" 
                style={{ backgroundColor: !ticket.open ? 'red' : ticket.adminLast ? 'gray' : 'green' }} 
              >
                <strong>{ticket._id.substring(0,8)}</strong>
              </div>
            )}
          </div>
          </>
           : 
          <strong>Error 404: Usuario no encontrado</strong>
      }
    </>
  )
}

export default UserProfile