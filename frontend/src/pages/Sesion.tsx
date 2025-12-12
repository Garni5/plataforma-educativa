

function Sesion() {
    const getUserInfo = () => {
        const nombres = localStorage.getItem("userName") || localStorage.getItem("userEmail") || "Usuario";
        const apellidos = localStorage.getItem("userLastName") || "";
        const role = localStorage.getItem("userRole") || "usuario";
        return { nombres, apellidos, role };
    };

    const { nombres, apellidos, role } = getUserInfo();
    const token = localStorage.getItem("token");

    const Logout = async () => {
        try{
           await fetch("http://localhost:5000/auth/logout", {
           method: "POST",
           credentials: "include" // <--- muy importante
         });

            localStorage.clear();
            window.location.href = "/login";

        }catch(error){
            console.log(error);
        }
    }

    const handleGoToEditor = () => {
        window.location.href = "/profesor-editor";
    };

    const handleGoToAdmin = () => {
        window.location.href = "/admin";
    };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
            <h1>¡Bienvenido!</h1>
            <p style={styles.subtitle}>Sesión iniciada</p>
        </div>

        {token ? (
            <div style={styles.content}>
                <div style={styles.userInfo}>
                    <p style={styles.userLabel}>Estás conectado como:</p>
                    <p style={styles.userName}>👤 {nombres} {apellidos}</p>
                    <p style={styles.userRole}>Rol: <strong>{role.charAt(0).toUpperCase() + role.slice(1)}</strong></p>
                </div>

                <div style={styles.buttonsContainer}>
                    {role === "editor" && (
                        <button 
                            onClick={handleGoToEditor}
                            style={styles.primaryButton}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
                            }}
                        >
                            📚 Editor de Contenido
                        </button>
                    )}
                    
                    {role === "administrador" && (
                        <button 
                            onClick={handleGoToAdmin}
                            style={styles.primaryButton}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
                            }}
                        >
                            ⚙️ Panel de Administración
                        </button>
                    )}

                    <button 
                        onClick={Logout}
                        style={styles.secondaryButton}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#dee2e6";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#e9ecef";
                        }}
                    >
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </div>
        ) : (
            <div style={styles.content}>
                <p style={styles.noSessionMessage}>No hay sesión activa</p>
                <button 
                    onClick={() => window.location.href = "/login"}
                    style={styles.primaryButton}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
                    }}
                >
                    🔗 Ir al Login
                </button>
            </div>
        )}
      </div>
    </div>
   
  )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px'
    } as React.CSSProperties,
    card: {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '40px',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center' as const
    } as React.CSSProperties,
    header: {
        marginBottom: '30px'
    } as React.CSSProperties,
    subtitle: {
        color: '#666',
        marginTop: '8px',
        fontSize: '14px'
    } as React.CSSProperties,
    content: {
        marginTop: '30px'
    } as React.CSSProperties,
    userInfo: {
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px'
    } as React.CSSProperties,
    userLabel: {
        color: '#888',
        fontSize: '12px',
        marginBottom: '8px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        margin: '0 0 8px 0'
    } as React.CSSProperties,
    userName: {
        fontSize: '18px',
        fontWeight: 'bold' as const,
        color: '#333',
        marginBottom: '8px',
        margin: '0 0 8px 0'
    } as React.CSSProperties,
    userRole: {
        color: '#666',
        fontSize: '14px',
        margin: '0'
    } as React.CSSProperties,
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '12px'
    } as React.CSSProperties,
    primaryButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold' as const,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
    } as React.CSSProperties,
    secondaryButton: {
        background: '#e9ecef',
        color: '#333',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold' as const,
        cursor: 'pointer',
        transition: 'background 0.2s'
    } as React.CSSProperties,
    noSessionMessage: {
        color: '#e74c3c',
        fontSize: '16px',
        marginBottom: '20px'
    } as React.CSSProperties
};

export default Sesion