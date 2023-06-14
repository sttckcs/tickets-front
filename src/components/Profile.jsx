const Profile = ({ user }) => {
  return (
    <>
      <strong>Perfil</strong>
      <div style={{ margin: '10px 0 20px 0' }}>
      <h2><b>Nick:</b> {user.nick}</h2>
      <h2><b>Nombre:</b> {user.name}</h2>
      <h2><b>Correo:</b> {user.email}</h2>
      <h2><b>Cuenta creada el:</b> {new Date(user.createdAt).toLocaleDateString('es-ES')}</h2>
      {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
        <h2><b>Avatar:</b></h2>
        <img src={user.picture} alt={user.nick} style={{ margin: '10px', width: '100px'}} />
      </div> */}
    </div>
  </>
  )
}

export default Profile