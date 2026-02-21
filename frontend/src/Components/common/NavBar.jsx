import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <nav style={{ padding: "10px", display: "flex", justifyContent: "space-between" }}>
      <h3>CleanStreet</h3>

      <div
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/profile")}
      >
        {user.name}
      </div>
    </nav>
  );
}