import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

interface User {
    id: number,
    name: string,
    email: String,
    profilePic: string | null;
}



function ProfilePage ({userId} : {userId : number}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${userId}`);
                console.log("COnsole penuh dari backend", response.data)

                setUser(response.data.data || response.data)
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) return <div className="text-white">Loading profile</div>
    if (!user) return <div className="text-white">No user found</div>


    return (
        <div>
            <div>
                <h1>My Profile</h1>

                {/*FOTO PROFIL DARI CLOUDINARY*/}
                <div>
                    {user.profilePic ? (
                        <img src={user.profilePic || ""} alt="profile-picture" />
                    ) : (<div>
                        <p>No profile picture</p>
                    </div>
                )}
                </div>

                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                </div>

                <Link to="/profile/edit">
                    <button>Edit Your Profile</button>
                </Link>
            </div>
        </div>
    )
}

export default ProfilePage;