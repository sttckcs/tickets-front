import { Waveform } from "@uiball/loaders";
import { useAuth } from "../contexts/AuthContext";
import { Button } from '@chakra-ui/react'
import { API } from "../services/services";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";
import { useState } from "react";
import UserModal from "../components/UserModal";
import BillsModal from "../components/BillsModal";
import { ToastContainer, toast } from "react-toastify";
import DeleteModal from "../components/DeleteModal";

const MyProfile = () => {
  const { user, loading, setAuth } = useAuth();
  const [open, setOpen] = useState(false)
  const [openFact, setOpenFact] = useState(false)
  const [openBills, setOpenBills] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await API.post('user/logout');
      setAuth(false);
      navigate('/');
    } catch (error) {
      toast.error('Error cerrando sesión');
    }
  }

  const handleDelete = async () => {
    try {
      await API.delete('user/delete');
      logout();
    } catch (error) {
      toast.error('Error eliminando tu cuenta');
    }
  }


  return (
    <>
      {loading ?
        <div className="loader">
          <Waveform color="white" />
        </div> :
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {user.banned ?
            <div className='banned-container'>
              <h1 className='banned'>Estás baneado</h1>
              <Button style={{ margin: '10px' }} onClick={logout}>Salir</Button>
            </div>
            :
            <>
              <Profile user={user} />
              {!user.admin && <Button style={{ margin: '10px', width: '230px' }} onClick={() => setOpenFact(true)}>Datos de facturación</Button>}
              {!user.admin && user.facturas.length > 0 && <Button style={{ margin: '10px', width: '230px' }} onClick={() => setOpenBills(true)}>Ver transacciones</Button>}
              <div>
                <Button style={{ margin: '10px' }} onClick={() => setOpen(true)}>Editar</Button>
                <Button style={{ margin: '10px' }} onClick={() => setOpenDelete(true)}>Eliminar</Button>
                <Button style={{ margin: '10px' }} onClick={logout}>Salir</Button>
              </div>
              <UserModal open={open} setOpen={setOpen} mode={'edit'} />
              <UserModal open={openFact} setOpen={setOpenFact} mode={'billing'} />
              <BillsModal open={openBills} setOpen={setOpenBills} />
              <DeleteModal open={openDelete} setOpen={setOpenDelete} handleDelete={handleDelete} />
            </>
          }
        </div>
      }
      <ToastContainer theme="colored" position="top-center" limit={3} />
    </>
  )
}

export default MyProfile