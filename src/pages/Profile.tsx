import Navbar from "../components/General/Navbar";
import ProfilePage from "../components/Profile/ProfilePage";
import { userAuth } from "../stores/useAuth";

function Profile() {
  const { user } = userAuth();
  console.log("Isi user dari store:", user);
  const idUser = user ? Number(user.id) : 0;

  return (
    <div>
      <Navbar />

      {idUser !== 0 ? (
        <ProfilePage userId={idUser} />
      ) : (
        <div>
          <p>Please login</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
