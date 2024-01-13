const Profile = ({ user }) => {
  return (
    <div>
      <strong style={{ fontSize: '3rem', color: 'rgb(200, 200, 255)' }}>Perfil</strong>
      <div className="profile">
        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
          <h2><b>Avatar:</b></h2>
          <img src={user.picture} alt={user.nick} style={{ margin: '10px', width: '100px'}} />
        </div> */}
        <h2><b>Nick:</b> <span>{user.nick}</span></h2>
        <h2><b>Nombre:</b> <span>{user.name}</span></h2>
        <h2><b>Steam:</b> <span style={{ color: 'green' }}><a href={user.steam.startsWith('https://steamcommunity.com') ? user.steam : `https://steamcommunity.com/id/${user.steam}`} target="_blank">{user.steam.split('/')[4] ? user.steam.split('/')[4] : user.steam}</a></span></h2>
        {user.nif && <h2><b>NIF:</b> <span>{user.nif}</span></h2>}
        <h2><b>Correo:</b> <span>{user.email}</span></h2>
        <h2><b>Cuenta creada el:</b> <span>{new Date(user.createdAt).toLocaleDateString('es-ES')}</span></h2>
      </div>
    </div>
  )
}

export default Profile