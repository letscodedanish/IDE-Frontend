import React, { useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Legend
} from 'recharts';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';
import { Navbar } from './Navbar';

interface LeetCodeData {
  username: string;
  name: string;
  birthday: string;
  avatar: string;
  ranking: number;
  reputation: number;
  gitHub: string;
  twitter: string | null;
  linkedIN: string;
  website: string[];
  country: string;
  company: string;
  school: string;
  skillTags: string[];
  about: string;
  totalSolved: number;
  totalSubmissions: {
    difficulty: string;
    count: number;
    submissions: number;
  }[];
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  recentSubmissions: {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
    __typename: string;
  }[];
}

const LeetCodeDashboard: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<{ data: LeetCodeData }>('http://localhost:3001/api/leetcode', { username });
      if (response) {
        setData(response.data.data);
        console.log(response.data.data)
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(username);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const solvedData = data ? [
    { name: 'Easy', value: data.easySolved },
    { name: 'Medium', value: data.mediumSolved },
    { name: 'Hard', value: data.hardSolved },
  ] : [];

  const submissionData = data ? data.recentSubmissions.map(submission => ({
    title: submission.title,
    timestamp: new Date(parseInt(submission.timestamp, 10) * 1000).toLocaleDateString(),
    status: submission.statusDisplay,
  })) : [];

  return (
    <div className="bg-gray-50 h-screen w-screen flex flex-col">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">Coming sooon....</h1>
      <form onSubmit={handleSubmit} className="mb-6 flex">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter LeetCode username"
          className="p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600">
          Fetch Data
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && (
        <div>

          <div className="flex justify-around w-full">
          <div className="flex items-center mb-6">
            <img src={data.avatar || 'default-avatar.png'} alt={`${data.name}'s avatar`} className="w-24 h-24 rounded-full mr-6" />
            <div>
              <p className="text-lg font-bold">{data.name}</p>
              <p className="text-lg text-gray-500">Ranking: {data.ranking || 'N/A'}</p>
              <div className="flex mt-2">
                {data.gitHub && (
                  <a href={data.gitHub} target="_blank" rel="noopener noreferrer" className="text-2xl mr-4">
                    <FaGithub />
                  </a>
                )}
                {data.linkedIN && (
                  <a href={data.linkedIN} target="_blank" rel="noopener noreferrer" className="text-2xl">
                    <FaLinkedin />
                  </a>
                )}
              </div>
            </div>
          </div>
            <div className="p-4 w-[300px] bg-white rounded-lg shadow">
              <p className="text-lg font-bold">Total Solved</p>
              <p className="text-2xl">{data.totalSolved || 'N/A'}</p>
            </div>
            <div className="p-4 w-[300px] bg-white rounded-lg shadow">
              <p className="text-lg font-bold">Total Questions</p>
              <p className="text-2xl">{data.totalQuestions || 'N/A'}</p>
            </div>
            <div className="p-4 w-[300px] bg-white rounded-lg shadow">
              <p className="text-lg font-bold">Ranking</p>
              <p className="text-2xl">{data.ranking || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className='mt-16'>
              <ResponsiveContainer width="100%" height={300} className="mb-6">
                <PieChart>
                  <Pie
                    data={solvedData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {solvedData.map((entry, index) => (
                        console.log(entry),
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='relative -left-20 mt-20'>
              <ResponsiveContainer width="100%" height={300} className="mb-6">
                <LineChart data={submissionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="status" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className='relative right-10 h-[400px] mt-5'>
              <h2 className="text-2xl font-bold mb-4">Recent Submissions:</h2>
              <ul className="bg-white rounded-lg shadow p-4 overflow-y-scroll h-[400px]">
                {data.recentSubmissions.length > 0 ? (
                  data.recentSubmissions.map((submission, index) => (
                    <li key={index} className="mb-2">
                      <p className="font-bold">{submission.title} ({submission.lang}) - {submission.statusDisplay}</p>
                      <p className="text-sm text-gray-500">Time: {new Date(parseInt(submission.timestamp, 10) * 1000).toLocaleString()}</p>
                    </li>
                  ))
                ) : (
                  <li>No recent submissions</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeetCodeDashboard;



//advance component
// import React, { useState } from 'react';
// import axios from 'axios';
// import {
//   PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
//   LineChart, Line, CartesianGrid, XAxis, YAxis, Legend
// } from 'recharts';
// import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa';
// import 'tailwindcss/tailwind.css';

// // Define the LeetCodeData interface
// interface LeetCodeData {
//   username: string;
//   solvedProblems: number;
//   ranking: number;
// }

// // Example usage of LeetCodeData
// const exampleData: LeetCodeData = {
//   username: 'exampleUser',
//   solvedProblems: 100,
//   ranking: 50,
// };

// // Now you can use LeetCodeData in your component

// const LeetCodeDashboard: React.FC = () => {
//   const [username, setUsername] = useState<string>('');
//   const [data, setData] = useState<LeetCodeData | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = async (username: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post<{ data: LeetCodeData }>('http://localhost:3001/api/leetcode', { username });
//       if (response) {
//         setData(response.data.data);
//         console.log(response.data.data);
//       }
//     } catch (err) {
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchData(username);
//   };

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   const solvedData = data ? [
//     { name: 'Easy', value: data.easySolved },
//     { name: 'Medium', value: data.mediumSolved },
//     { name: 'Hard', value: data.hardSolved },
//   ] : [];

//   const submissionData = data ? data.recentSubmissions.map(submission => ({
//     title: submission.title,
//     timestamp: new Date(parseInt(submission.timestamp, 10) * 1000).toLocaleDateString(),
//     status: submission.statusDisplay,
//   })) : [];

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen grid grid-cols-12 gap-4">
//       {/* Sidebar */}
//       <div className="col-span-3 bg-white rounded-lg shadow p-6">
//         <div className="flex flex-col items-center mb-4">
//           <img src={data?.avatar || 'default-avatar.png'} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
//           <p className="text-xl font-semibold">{data?.name || 'Name'}</p>
//           <p className="text-sm text-gray-600">@{data?.username || 'Username'}</p>
//         </div>
//         <div className="mb-4">
//           <button className="w-full bg-green-500 text-white py-2 rounded-md">Edit Profile</button>
//         </div>
//         <div className="space-y-2">
//           <p className="text-gray-500 flex items-center"><FaGlobe className="mr-2" /> {data?.website || 'N/A'}</p>
//           <p className="text-gray-500 flex items-center"><FaGithub className="mr-2" /> {data?.gitHub || 'N/A'}</p>
//           <p className="text-gray-500 flex items-center"><FaLinkedin className="mr-2" /> {data?.linkedIN || 'N/A'}</p>
//           <p className="text-gray-500 flex items-center"><FaTwitter className="mr-2" /> {data?.twitter || 'N/A'}</p>
//           <p className="text-gray-500 flex items-center"><FaGlobe className="mr-2" /> {data?.website || 'N/A'}</p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="col-span-9 grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* Total Questions */}
//         <div className="col-span-1 bg-white rounded-lg shadow p-6 text-center">
//           <p className="text-lg font-semibold">Total Questions</p>
//           <p className="text-3xl font-bold">{data?.totalQuestions || 'N/A'}</p>
//         </div>

//         {/* Total Active Days */}
//         <div className="col-span-1 bg-white rounded-lg shadow p-6 text-center">
//           <p className="text-lg font-semibold">Total Active Days</p>
//           <p className="text-3xl font-bold">{data?.totalActiveDays || 'N/A'}</p>
//         </div>

//         {/* Activity Calendar */}
//         <div className="col-span-1 bg-white rounded-lg shadow p-6">
//           <p className="text-lg font-semibold">Activity Calendar</p>
//           {/* Your activity calendar component here */}
//         </div>

//         {/* Rating Graph */}
//         <div className="col-span-3 bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Rating</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={submissionData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="timestamp" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="status" stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Problems Solved */}
//         <div className="col-span-1 bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Problems Solved</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={solvedData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
//                 {solvedData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Contest Rankings */}
//         <div className="col-span-2 bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Contest Rankings</h2>
//           {/* Contest rankings content here */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeetCodeDashboard;
