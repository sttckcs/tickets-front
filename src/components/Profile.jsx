const Profile = ({ user }) => {
  return (
    <div>
      <strong style={{ fontSize: '3rem' }}>Perfil</strong>
      <div style={{ margin: '10px 0 10px 0', fontSize: '1.75rem', lineHeight: '35px', userSelect: 'text' }}>
        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
          <h2><b>Avatar:</b></h2>
          <img src={user.picture} alt={user.nick} style={{ margin: '10px', width: '100px'}} />
        </div> */}
        <h2><b>Nick:</b> {user.nick}</h2>
        <h2><b>Nombre:</b> {user.name}</h2>
        <h2><b>Steam:</b> {user.steam}</h2>
        {user.nif && <h2><b>NIF:</b> {user.nif}</h2>}
        <h2><b>Correo:</b> {user.email}</h2>
        <h2><b>Cuenta creada el:</b> {new Date(user.createdAt).toLocaleDateString('es-ES')}</h2>
    </div>
  </div>
  )
}

export default Profile