    import { useState } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';
    import { InfinitySpin } from 'react-loader-spinner';
    import { Socket } from "socket.io-client";
    import HowItWorks from './HowItWorks';
    import Footer from './Footer';
    import Illustration from "../assets/Images/illustration.png"
    import Background from "../assets/Images/background-pattern.png"
    import Avatar from "../assets/Images/avatar-female.png"
    import { Navbar } from './Navbar';

    const SLUG_WORKS = ["car", "dog", "computer", "person", "inside", "word", "for", "please", "to", "cool", "open", "source"];
    const SERVICE_URL = "http://localhost:3001";

    function getRandomSlug() {
        let slug = "";
        for (let i = 0; i < 3; i++) {
            slug += SLUG_WORKS[Math.floor(Math.random() * SLUG_WORKS.length)];
        }
        return slug;
    }

    export const Dashboard = ({socket}: {socket: Socket}) => {
        const [language, setLanguage] = useState("node-js");
        const [replId, setReplId] = useState(getRandomSlug());
        const [showModal, setShowModal] = useState(false);
        const [showImportModal, setShowImportModal] = useState(false);
        const [githubRepoLink, setGithubRepoLink] = useState("");
        const [loaded, setLoaded] = useState(false);
        const navigate = useNavigate();

        const handleCardClick = () => {
            setShowModal(true);
        };

        const handleCreateRepl = async () => {
            setLoaded(true);
            await axios.post(`${SERVICE_URL}/project`, { replId, language });
            navigate(`/coding/?replId=${replId}`);
            setLoaded(false);
        };

        const handleImportFromGitHub = async (langEm: string) => {
            try {
                await axios.post(`${SERVICE_URL}/project`, { replId, language: langEm });
                await socket?.emit('importFromGitHub', githubRepoLink);
                navigate(`/coding/?replId=${replId}`);
            } catch (error) {
                console.error("Error creating project or importing from GitHub:", error);
                setLoaded(false);
                setShowImportModal(true);  // Optionally show the modal again in case of an error
                alert("Error importing from GitHub: ");
            }
        };

        const handleOpenVsCode = async () => {
            setShowModal(true)
            alert("Opening in vs code");
            await axios.post(`${SERVICE_URL}/OpenVsCode`, { replId, language });
            setShowModal(false)
        }

        if (loaded) {
            return (
                <div className='flex justify-center items-center h-screen'>
                    <InfinitySpin
                        //@ts-expect-error
                        visible={true}
                        width="200"
                        color="#4fa94d"
                        ariaLabel="infinity-spin-loading"
                    />
                </div>
            );
        }

        // const handleLanguage = async (lang: string) => {
        //     setLoaded(true);
        //     await axios.post(`${SERVICE_URL}/project`, { replId, language: lang });
        //     navigate(`/coding/?replId=${replId}`);
        //     setLoaded(false);
        // };

        return (
            <div className="bg-gray-50 h-screen w-screen flex flex-col">
                <Navbar />

                <section className="relative py-12 sm:py-16 lg:pb-6 flex-grow ">
                    <div className="absolute bottom-0 right-0 overflow-hidden -mt-10">
                        <img className="w-full h-auto origin-bottom-right transform scale-150 lg:w-auto lg:mx-auto lg:object-cover lg:scale-75" src={Background} alt="" />
                    </div>
                    <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-y-4 lg:items-center lg:grid-cols-2 xl:grid-cols-2">
                            <div className="text-center xl:col-span-1 lg:text-left md:px-16 lg:px-0 xl:pr-20">
                                <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-2xl sm:leading-tight lg:text-3xl lg:leading-tight font-pj">
                                An online IDE that lets you code, collaborate and deploy software projects in your browser, all without any setup.
                                </h1>
                                <p className="mt-2 text-lg text-gray-600 sm:mt-6 font-inter">
                                Allows users to write, run, and share code directly from their browser, offering features such as real-time collaboration, and an integrated development experience without the need for local setup.
                                </p>

                                <div className="flex flex-row mt-4 space-x-4 justify-center lg:justify-start">
                                    <div className="card" onClick={handleCardClick}>
                                        <h2 className="w-[200px] text-center px-8 py-2 mt-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded sm:mt-4 font-pj hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                                        font-mono"
                                    role="button">Create Repl</h2>
                                    </div>
                                    {/* <div className="card" onClick={() => handleLanguage('node-js')}>
                                        <h2 className='bg-green-500 hover:bg-gray-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded w-[130px] text-center'>Create JS</h2>
                                    </div>
                                    <div className="card" onClick={() => handleLanguage('react-js')}>
                                        <h2 className='bg-green-500 hover:bg-gray-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded w-[130px] text-center'>Create React</h2>
                                    </div> */}
                                    <div className="card" onClick={() => setShowImportModal(true)}>
                                        <h2 className='hover:bg-gray-600 hover:cursor-pointer text-white transition-all duration-200 bg-gray-900 border border-transparent  sm:mt-4  font-bold py-2 px-4 rounded w-[250px] text-center font-mono text-[20px]'>Import from GitHub</h2>
                                    </div>
                                </div>
                                <div className="mt-8 sm:mt-8">
                                    <div className="flex items-center justify-center lg:justify-start">
                                        <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                        <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                        <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                        <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                        <svg className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                    </div>

                                    <blockquote className="mt-6">
                                        <p className="text-lg font-bold text-gray-900 font-pj">Best code editor in market!</p>
                                        <p className="mt-3 text-base leading-7 text-gray-600 font-inter">
                                        It has many features and is easy to use, and has a clean interface so that everyone can code easily. This platform's main advantage is that it can code in several languages and supports all programming languages.
                                        </p>
                                    </blockquote>

                                    <div className="flex items-center justify-center mt-3 lg:justify-start">
                                        <img className="flex-shrink-0 object-cover w-6 h-6 overflow-hidden rounded-full" src={Avatar} alt="" />
                                        <p className="ml-2 text-base font-bold text-gray-900 font-pj">Danish Khan</p>
                                    </div>
                                </div>
                            </div>

                            <div className="xl:col-span-1 -mt-[200px]">
                                <img className="w-[90%] mx-auto" src={Illustration} alt="" />
                            </div>
                        </div>
                    </div>
                </section>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <div className="modal bg-white border border-gray-300 p-4 w-100
                        rounded-md text-center ">
                            <h2 className='text-[30px] m-4 font-bold mb-4 font-mono'>Choose Environment</h2>
                            <input
                                type="text"
                                placeholder="Repl Name"
                                value={replId}
                                onChange={(e) => setReplId(e.target.value)}
                                className="mb-4 p-3 border border-gray-300 rounded text-black font-mono w-[90%] text-[20px] font-semibold"
                            />
                            <select
                                name="language"
                                id="language"
                                onChange={(e) => setLanguage(e.target.value)}
                                className="mb-4 p-3 border border-gray-300 rounded text-black font-mono w-[90%] text-[20px] font-semibold"
                            >
                                <option value="node-js">Node.js</option>
                                <option value="python">Python</option>
                                <option value="react-js">React.js</option>
                            </select>
                            
                            <button onClick={handleCreateRepl} className="bg-gray-900 text-white hover:bg-black border border-gray-900 font-bold py-2 px-4 rounded mt-2 mb-4 font-mono w-[90%] text-[25px]">Create Repl</button>
                            <button onClick={handleOpenVsCode} className="bg-gray-900 text-white hover:bg-black border border-gray-900 font-bold py-2 px-4 rounded mt-2 mb-4 font-mono w-[90%] text-[25px]">Open in vs code</button>
                            <button onClick={() => setShowModal(false)} className="bg-gray-300 text-black hover:bg-gray-400 border border-gray-300 font-bold py-2 px-4 rounded mt-2 mb-10 font-mono w-[90%] text-[25px]">Close</button>
                        </div>
                    </div>
                )}

                {showImportModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <div className="modal bg-white border border-gray-300 p-8 w-100 rounded-md text-center">
                            <h2 className='text-[30px] m-2 -mt-2  mb-6 font-mono font-semibold'>Import from GitHub</h2>
                            <input
                                type="text"
                                placeholder="GitHub Repository Link"
                                value={githubRepoLink}
                                onChange={(e) => setGithubRepoLink(e.target.value)}
                                className="mb-2 text-[20px] p-3  border border-gray-300 rounded text-black font-mono w-full"
                            />
                            <button onClick={() => handleImportFromGitHub('empty')} className="bg-gray-900 text-white hover:bg-black border border-gray-900 font-bold py-2 px-4 rounded mt-4 font-mono w-full text-[20px] mb-2 ">Import</button>
                            <button onClick={() => setShowImportModal(false)} className="bg-gray-300 text-black hover:bg-gray-400 border border-gray-300 font-bold py-2 px-4 rounded mt-2 font-mono w-full text-[20px] mb-2">Cancel</button>
                        </div>
                    </div>
                )}

                <HowItWorks />
                <Footer />
            </div>
        );
    };
