import { useState, useEffect } from "react";
import axios from "axios";
import { userAuth } from "../../stores/useAuth";
import { useNavigate } from "react-router";

function ProfileEdit () {
    const {user, login} = userAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            if (user.profilePic) {
                setPreviewUrl(user.profilePic);
            }
        }
    }, [user]);
    
    {/*HANDLE PERUBAHAN GAMBAR*/}
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(file);
            setPreviewUrl(URL.createObjectURL(file))
        }
    };

    {/*FUNGSI FORM DISUBMIT*/}
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setMessage("Please login first");
            return;
        }

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);

        if (avatar) {
            formData.append("profilePic", avatar);
        }
        
        try {
            const response = await axios.patch(
                `http://localhost:8000/users/${user.id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        const updatedUser = response.data.data || response.data;
        login(updatedUser);
        setMessage("Profile successfuly updated.");
        navigate("/profile")
        } catch (error: any) {
            console.error("Failed to update profile", error);
            setMessage(error.response?.data?.message || "Something wrong")
        } finally {
            setLoading(false)
        }
    }; 

    return (
        <div>
            <div>
                <h1>Edit Profile</h1>

                {message && (
                    <div>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/*PREVIEW IMAGE*/}
                    <div>
                        {previewUrl ? (<img src={previewUrl} alt="preview" />
                        ) : (
                        <div>No image</div>
                        )}
                        <label htmlFor="avatarInput">
                            Select profile picture
                            <input
                            id="avatarInput" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="hidden" />
                        </label>
                    </div>

                    {/*INPUT NAMA*/}
                    <div>
                        <label>Name</label>
                        <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required />
                    </div>

                    {/*INPUT EMAIL*/}
                    <div>
                        <label>Email</label>
                        <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    </div>      

                    {/*SUBMIT BUTTON*/}
                    <div>
                        <button
                        type="submit"
                        disabled={loading}
                        >
                            {loading ? "Saving changes..." : "Save changes"}
                        </button>
                    </div>  
                </form>
            </div>
        </div>
    )
};

export default ProfileEdit;