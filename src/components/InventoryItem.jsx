const InventoryItem = ({ item, isSelected, onClick }) => {

  const itemStyle = isSelected 
    ? { borderColor: 'blue', borderWidth: '1px', borderStyle: 'solid', boxShadow: '0px 0px 15px rgba(0, 0, 255, 0.5)' } 
    : {};

  const getPhase = (paintSeed) => {
    const phaseMatch = paintSeed.match(/Phase \d/);
    return phaseMatch ? phaseMatch[0] : null;
  };

  // Determine what to display: fade or phase
  const overlayText = item.fade || getPhase(item.paintSeed);

  return (
    <div onClick={() => onClick(item)} style={itemStyle} className='inventory-item-container'>
      <div className='inventory-image-container'>
        <img src={item.previewUrl} alt={item.marketName} className="inventory-item-image"/>
        {overlayText ? <span className="overlay-text">{overlayText}</span> : <></>}
      </div>
      <div className='inventory-item-description'>
        <p>{item.marketName}</p>
        {item.price != 0 ? <p>Price: {item.price * (1 + item.pricePlusPercentege)}</p> : <></>}
        <p>{item.wearName}</p>
        <p>{item.float}</p>
      </div>
    </div>
  );
}

export default InventoryItem;
