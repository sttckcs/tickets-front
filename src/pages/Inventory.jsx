import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API } from '../services/services';
import { ToastContainer, toast } from 'react-toastify'
import TicketDetailModal from "../components/TicketDetailModal";
import ConfirmBuyModal from "../components/ConfirmBuyModal";
import InventoryItem from '../components/InventoryItem'
import UserModal from '../components/UserModal';
import EditPriceModal from '../components/EditPriceModal';

const Inventory = () => {
    const ITEMS_PER_PAGE = 80;
    const [inventory, setInventory] = useState([]); // Asumiendo que los ítems del inventario se inicializan aquí
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentItem, setCurrentItem] = useState(null);
    const [open, setOpen] = useState(false);

    // TODO REMOVE DETAILOPEN -> UNNECESARY
    const [currentTicket, setCurrentTicket] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false)
    const [confirmBuyOpen, setConfirmBuyOpen] = useState(false)
    const [editPriceOpen, setEditPriceOpen] = useState(false)

    const { user } = useAuth();

    // Filtra los ítems del inventario basándose en el término de búsqueda.
    const filteredInventory = searchTerm
      ? inventory.filter(item =>
          item.marketName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : inventory;

    const pageCount = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);

    useEffect(() => {
      // Asegurar que la página actual no exceda el total de páginas después de filtrar
      if (currentPage >= pageCount) {
        setCurrentPage(0);
      }
    }, [searchTerm]);

    useEffect(() => {
      // Actualizar currentItem al cambiar de página o después de filtrar
      setCurrentItem(filteredInventory[currentPage * ITEMS_PER_PAGE] || null);
    }, [currentPage]);

    const itemsToShow = filteredInventory.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );

    const handleItemClick = (item) => {
      setCurrentItem(item);
    };

    const goToNextPage = () => {
      if (currentPage < pageCount - 1) setCurrentPage(currentPage + 1);
    };

    const goToPreviousPage = () => {
      if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(0); // Resetea a la primera página con cada cambio en el término de búsqueda
    };

    const handleBuyClick = async (e) => {
      e.preventDefault();

      if (!user) {
        setOpen(true);
      } else {
        setConfirmBuyOpen(true);
      }
    };

    const handleBuyConfirm = async () => {
      try {
        const res = await API.post('ticket/add', {
          category: "buy",
          notify: false,
          assetId: currentItem.assetId
        });
        if (res.status === 200) {
          setCurrentTicket(res.data);
          setDetailOpen(true);
        } else {
          toast.error('Error creando el ticket');
        }
        handleClose();
      } catch (error) {
        toast.error(`Error creando el ticket: ${error.response.data.message}`);
      }
    }

    const handleChangePrice = async (e) => {
      e.preventDefault();
      setEditPriceOpen(true);
    }

    const handlePriceConfirm = async (newPrice) => {
      try {
        const res = await API.post('inventory/edit', {
          assetId: currentItem.assetId,
          newPrice: newPrice
        });

        console.log(res)
        if (res.status === 200) {
          toast.success('Precio cambiado exitosamente');
          inventory.find(item => item.assetId === currentItem.assetId).pricePlusPercentege = newPrice;
        } else {
          toast.error('Error cambiando el precio');
        }
      } catch (error) {
        toast.error(`Error cambiando el precio: ${error.response.data.message}`);
      }
    }

    useEffect(() => {
      const fetchInventory = async () => {
        try {
          const res = await API.get('inventory/all');
          setInventory(res.data);
        } catch (error) {
          console.error("Error fetching inventory:", error);
        }
      };
    
      fetchInventory();
    }, []);    

    return (
        <div className='inventory-parent-container'>
            <div className='inventory-pages-container'>
            <div className='inventory-pages-selector'>
              <p onClick={goToPreviousPage} style={{cursor: 'pointer'}}>&lt;</p>
              <span>Page {currentPage + 1}/{pageCount}</span>
              <p onClick={goToNextPage} style={{cursor: 'pointer'}}>&gt;</p>
            </div>
              <div className='inventory-other-info'>
                <input
                  type="text"
                  placeholder="Search item..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="inventory-search"
                />
              </div>
            </div>
            <div className='inventory-container'>
              {filteredInventory.length > 0 ? (
                <div className='items-container'>
                  {itemsToShow.map(item => (
                    <InventoryItem
                      key={item.assetId}
                      item={item}
                      isSelected={currentItem && currentItem.assetId === item.assetId}
                      onClick={handleItemClick}
                    />
                  ))}
                </div>
              ) : (
                <div className='items-container' style={{justifyContent: 'center', alignItems: 'center'}}>
                  <p>No hay resultados para mostrar.</p>
                </div>
              )}
              <div className='item-details-container'>
                  {currentItem && (
                      <div className='item-details'>
                          <div className='inventory-image-container inventory-detailed-image'>
                              <img src={currentItem.previewUrl} alt={currentItem.marketName} className="inventory-item-image" />
                          </div>
                          <div className='inventory-detailed-description'>
                              <h3>{currentItem.marketName}</h3>
                              <hr />
                              <div className='inventory-detailed-info-splitter'>
                                <div className='inventory-detailed-info-splitter-1'>
                                  <p>Wear: {currentItem.wearName}</p>
                                  <p>Price: {currentItem.price != 0 ? currentItem.price * (1 + currentItem.pricePlusPercentege) : "A consultar"}</p>
                                </div>
                                <div className='inventory-detailed-info-splitter-1'>
                                  <p>Float: {currentItem.float}</p>
                                  <p>Paint Seed: {currentItem.paintSeed}</p>
                                  <p>Paint Index: {currentItem.paintIndex}</p>
                                  {currentItem.fade ? <p>Fade: {currentItem.fade}%</p> : <></>}
                                </div>
                              </div>
                              <hr />
                          </div>
                          { user && user.admin ? <a className='item-inspect-button' href={""} onClick={(e) => handleChangePrice(e)}>Editar precio</a> : <></>}
                          <a className='item-inspect-button' href={""} onClick={(e) => handleBuyClick(e) } style={{ backgroundColor: 'green', color: 'white' }} target="_blank" rel="noopener noreferrer">Comprar</a>
                          <a className='item-inspect-button' href={currentItem.actionLink} target="_blank" rel="noopener noreferrer">Inspeccionar in-game</a>
                      </div>
                  )}
              </div>
            </div>
            <UserModal open={open} setOpen={setOpen} mode={'login'} />
            <TicketDetailModal open={detailOpen} setOpen={setDetailOpen} ticket={currentTicket} />
            <ConfirmBuyModal isOpen={confirmBuyOpen} setOpen={setConfirmBuyOpen} onConfirm={() => handleBuyConfirm()} />
            <EditPriceModal isOpen={editPriceOpen} setOpen={setEditPriceOpen} item={currentItem} onConfirm={(newPrice) => handlePriceConfirm(newPrice)} />
            <ToastContainer theme="colored" position="top-center" limit={3} />
        </div>
    )
  }
  
  export default Inventory