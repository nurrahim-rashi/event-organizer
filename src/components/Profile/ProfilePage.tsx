import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

interface Coupon {
    id: number;
    userId: number;
    discount: number;
    createdAt: string;
    expiredAt: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    profilePic: string | null;
    referralCode: string;
    totalPoints: number;
    coupons: Coupon[];
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
        <div className="px-6 py-24 flex items-center justify-center">
            <div className="w-full max-w-md bg-[#2C0051] rounded-2xl p-8 border border-purple-900/40 shadow-xl flex flex-col items-center">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400 mb-6 tracking-wide">My Profile</h1>

                {/*FOTO PROFIL DARI CLOUDINARY*/}
                <div className="relative mb-6 group">
                    {user.profilePic ? (
                        <img 
                        src={user.profilePic || ""} 
                        alt="profile-picture"
                        className="relative w-32 h-32 rounded-full object-cover border-4 border-purple-600/50 shadow-md" />
                    ) : (<div className="relative w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center shadow-md">
                        <p className="text-xs text-gray-400">No profile picture</p>
                    </div>
                )}
                </div>
                
                <div className="flex flex-col gap-5">
                    <div className="flex justify-between items-center border-b border-purple-950/50 pb-2 gap-2.5">
                        <p className="text-gray-400 text-sm font-medium">Name: {user.name}</p>
                        <p className="text-gray-400 text-sm font-medium">Email: {user.email}</p>
                    </div>

                    <div className="flex flex-col gap-1 p-3 bg-purple-950/40 border border-purple-900/30 rounded-xl items-center justify-center">
                        <p className="text-[11px] uppercase tracking-wider text-purple-300 font-semibold">Your referral code</p>
                        <p className="text-lg font-mono font-bold text-white tracking-widest uppercase">{user.referralCode}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="p-4 bg-purple-950/30 border border-purple-900/20 rounded-xl flex flex-col justify-between">
                            <p className="text-xs text-purple-300 font-medium">Active Points</p>
                            <p className="text-2xl font-black text-yellow-400 mt-2">
                                {user.totalPoints?.toLocaleString("id-ID") || 0} <span className="text-xs font-normal text-gray-400">Pts</span>
                            </p>
                        </div>

                        <div className="p-4 bg-purple-950/30 border border-purple-900/20 rounded-xl">
                            <p className="text-xs text-purple-300 font-medium mb-2">Active Coupons</p>

                            {!user.coupons || user.coupons.length === 0 ? (
                                <p className="text-xs text-gray-500 italic">No active coupons availabe.</p>
                            ) : (
                                <div className="flex flex-col gap-2 max-h-20 overflow-y-auto pr-1">
                                    {user.coupons.map((coupon) => (
                                        <div key={coupon.id} className="p-2 bg-purple-900/40 border border-purple-600/30 rounded-lg flex flex-col">
                                            <p className="text-xs font-bold text-white">Disc Rp {coupon.discount.toLocaleString("id-ID")}</p>
                                            <p className="text-[9px] text-purple-300 mt-0.5">
                                                Exp: {new Date(coupon.expiredAt).toLocaleDateString("id-ID", {day: 'numeric', month: 'short'})}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    <Link to="/profile/edit">
                        <button className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:cursor-pointer hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-900/30 active:scale-[0.98] transition-all duration-200">
                            Edit Your Profile
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;