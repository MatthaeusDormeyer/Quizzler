function Home({ user, onLogout }) {
  return (
    <div>
      <h2>👋 Willkommen, {user?.name}!</h2>
      <p>
        Du bist mit <strong>{user?.email}</strong> eingeloggt.
      </p>

      <button onClick={onLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}

export default Home;
