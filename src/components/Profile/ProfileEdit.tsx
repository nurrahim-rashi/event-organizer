import { useState, useEffect } from "react";
import axios from "axios";
import { userAuth } from "../../stores/useAuth";
import { useNavigate } from "react-router";

function ProfileEdit() {
  const { user, login } = userAuth();
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

  {
    /*HANDLE PERUBAHAN GAMBAR*/
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  {
    /*FUNGSI FORM DISUBMIT*/
  }
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
        `https://event-organizer-backend-ten.vercel.app/users/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const updatedUser = response.data.data || response.data;
      login(updatedUser);
      setMessage("Profile successfuly updated.");
      navigate("/profile");
    } catch (error: any) {
      console.error("Failed to update profile", error);
      setMessage(error.response?.data?.message || "Something wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-24 flex items-center justify-center">
      <div className="w-full max-w-md bg-[#2C0051] rounded-2xl p-8 border border-purple-900/40 shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400 mb-6 tracking-wide">
          Edit Profile
        </h1>

        {message && (
          <div
            className={`p-3 mb-5 rounded-xl text-sm font-medium text-center border transition-all duration-200 ${
              message.toLowerCase().includes("berhasil") ||
              message.toLowerCase().includes("success")
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/*PREVIEW IMAGE*/}
          <div className="relative group flex flex-col gap-2 items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="preview"
                className="relative w-32 h-32 rounded-full object-cover border-4 border-purple-600/50 shadow-md"
              />
            ) : (
              <div className="relative w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center text-gray-400 text-xs shadow-md">
                No image
              </div>
            )}
            <label
              htmlFor="avatarInput"
              className="cursor-pointer text-xs font-semibold bg-purple-600/20 hover:bg-purple-600 border border-purple-500/40 hover:border-purple-500 text-purple-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-200"
            >
              Select profile picture
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/*INPUT NAMA*/}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-purple-300/80 uppercase tracking-wider pl-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              className="w-full px-4 py-3 bg-[#1e1932] border border-purple-950/60 focus:border-purple-500 rounded-xl text-gray-200 text-sm placeholder-gray-600 focus:outline-none transition-all duration-200 shadow-inner"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/*INPUT EMAIL*/}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-purple-300/80 uppercase tracking-wider pl-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              className="w-full px-4 py-3 bg-[#1e1932] border border-purple-950/60 focus:border-purple-500 rounded-xl text-gray-200 text-sm placeholder-gray-600 focus:outline-none transition-all duration-200 shadow-inner"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/*SUBMIT BUTTON*/}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-700 disabled:to-gray-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-900/20 active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEdit;
