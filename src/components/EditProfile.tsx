import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile: React.FC = () => {
  interface Profile {
    firstName: string;
    lastName: string;
    // Add other fields with their respective types
  }
  
  const [profile, setProfile] = useState<Profile>({
    firstName: '',
    lastName: ''
  });
  
  useEffect(() => {
    axios.get('/api/user/1').then((response) => {
      setProfile(response.data);
    });
  }, []);

  const handleUpdate = async () => {
    await axios.put(`/api/user/1`, profile);
    alert('Profile updated!');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-bold text-lg">First Name</label>
          <input
            type="text"
            className="border py-2 px-3 text-grey-darkest"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="mb-2 font-bold text-lg">Last Name</label>
          <input
            type="text"
            className="border py-2 px-3 text-grey-darkest"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
          />
        </div>
        
        <button
          onClick={handleUpdate}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
