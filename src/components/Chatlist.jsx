import React , { useState, useEffect, useMemo }from 'react'
import defaultUser from "../../public/assets/default.jpg"
import { RiMore2Fill } from 'react-icons/ri'
import SearchModel from './SearchModel'
import chatData from '../data/chats'
import { formatTimestamp } from '../utils/formatTimestamp'
import { listenForChats, auth, db } from '../firebase/firebase'
import {doc, onSnapshot} from "firebase/firestore"
import ProfileSettings from './ProfileSettings'

const Chatlist = ({ setSelectedUser }) => {
    const [chats, setChats] = useState([]);
    const [user, setUser] = useState(null);
    const [showProfileSettings, setShowProfileSettings] = useState(false);

    useEffect(() => {
        const userDocRef = doc(db,"user", auth?.currentUser?.uid);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            setUser(doc.data());
        });

        return unsubscribe;
    },[]);
    

    console.log(user?.fullName)


    useEffect(() => {
        const unsubscribe = listenForChats(setChats);

    
        return () => {
        unsubscribe();
        };
    }, []);
    


    const sortedChats = useMemo(() => {
        return [...chats].sort((a, b) => {
            const aTimestamp = a?.lastMessageTimestamp?.seconds + a?.lastMessageTimestamp?.nanoseconds / 1e9;
            const bTimestamp = b?.lastMessageTimestamp?.seconds + b?.lastMessageTimestamp?.nanoseconds / 1e9;

            return bTimestamp - aTimestamp;
        });
    }, [chats]);


    const startChat = (user) => {
        setSelectedUser(user);
    };



    return (
    <section className='relative hidden lg:flex flex-col item-start justify-start bg-white h-[100vh] w-[100%] md:w-[600px]'>
        <header className="flex items-center justify-between w-[100%] lg:border-b border-b-1 border-[#a5a2a2] p-4 sticky md:static top-0 z-100">
            {showProfileSettings && (
            <div className="fixed top-0 left-0 w-full h-full z-50 bg-white p-4 overflow-y-auto">
    <button onClick={() => setShowProfileSettings(false)} className="mb-4 text-[#01AA85] font-bold">← Back</button>
    <ProfileSettings />
        </div>
)}

            <main className='flex items-center gap-3'>
                <img src={user?.image || defaultUser}  className="w-[44px] h-[44px] object-cover rounded-full" alt="" />
                <span>
                    <h3 className='p-0 font-semibold text-[#2A3D39] md:text-[17px]'>{user?.fullName || "Chatfrik User"}</h3>
                    <p className='p-0 font-light text-[#2A3D39] text-[15px]'>@{user?.username || 'chatfrik'}</p>
                </span>
            </main>
            <button onClick={() => setShowProfileSettings(!showProfileSettings)} className='bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg'>
                <RiMore2Fill color="#01AA85" className='w-[28px] h-[28px]'/>
            </button>
        </header>

        <div className='w-[100%] mt-[10px] px-5'>
            <header className='flex items-center justify-between'>
                <h3 className="text-[16px]">Messages ({chats?.length || 0})</h3>
                <SearchModel startChat={startChat}/>
            </header>
        </div>


        <main className="flex flex-col items-start mt-[1.5rem] pb-3 custom-scrollbar w-[100%] h-[100%]">
                {sortedChats?.map((chat) => (
                    <button key={chat?.id} className="flex items-start justify-between w-[100%] border-b border-[#9090902c] px-5 pb-3 pt-3">
                        {chat?.users
                            ?.filter((user) => user?.email !== auth?.currentUser?.email)
                            ?.map((user) => (
                                <>
                                
                                    <div className="flex items-start gap-3" onClick={() => startChat(user)}>
                                        <img src={user?.image || defaultUser} className="h-[40px] w-[40px] rounded-full object-cover" alt="" />
                                        <span>
                                            <h2 className="p-0 font-semibold text-[#2A3d39] text-left text-[17px]">{user?.fullName || "ChatFrik User"}</h2>
                                            <p className="p-0 font-light text-[#2A3d39] text-left text-[14px]">{chat?.lastMessage}</p>
                                        </span>
                                    </div>
                                    <p className="p-0 font-regular text-gray-400 text-left text-[11px]">{formatTimestamp(chat?.lastMessageTimestamp)}</p>
                                </>
                            ))}
                    </button>
                ))}
            </main>
    </section>
    );
};

export default Chatlist