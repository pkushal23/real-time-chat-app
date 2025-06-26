import React, {useState, useEffect} from 'react';
import {auth, db} from "../firebase/firebase";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import defaultUser from "../../public/assets/default.jpg";


const ProfileSettings = () => {
    const [userData, setUserData] = useState({
        fullName: "",
        bio: '',
        image: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            const userRef = doc(db,'user',auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
            if(userSnap.exists()){
                setUserData(userSnap.data());
            }
        };
        fetchUser();
    },[]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };


    const handleSave = async () => {
        const userRef = doc(db,'user',auth.currentUser.uid);
        await updateDoc(userRef, {
            fullName: userData.fullName,
            bio: userData.bio,
            image: userData.image,
        });
        alert('Profile updated!');
    };


    return (
        <div className='p-5 bg-white rounded-md shadow-md w-[90%] max-w-md mx-auto' >
            <h2 className='text-xl font-bold mb-4'>Edit Profile</h2>
            <img
                src={userData.image || defaultUser}
                alt='avatar'
                className='h-24 w-24 rounded-full object-cover mx-auto mb-4'/>

            <input
                type='text'
                name='image'
                value={userData.image}
                onChange={handleChange}
                placeholder='Image URL'
                className='w-full mb-3 border p-2 rounded'
            />

            <input 
                type='text'
                name='fullName'
                value={userData.fullName}
                onChange={handleChange}
                placeholder='Full Name'

                className='w-full mb-3 border p-2 rounded'
            />

            <textarea
                name='bio'
                value={userData.bio}
                onChange={handleChange}
                placeholder='Short Bio'
                className='w-full mb-3 border p-2 rounded'
            />

            <button onClick={handleSave}  className='bg-[#01AA85] text-white py-2 px-4 rounded'>
                Save Changes </button>


        </div>
    );
};

export default ProfileSettings;