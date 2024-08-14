import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Navbar } from './Navbar';
import { FaCode, FaLink } from 'react-icons/fa';
import { SiCodeforces, SiGeeksforgeeks, SiLeetcode } from "react-icons/si";

const localizer = momentLocalizer(moment);

interface ContestEvent extends Event {
    platform: string;
    name: string;
    startDate: Date;
    endDate: Date;
    phase: string;
    duration: number;
    durationSeconds: number;
    relativeTimeSeconds: number;
    url: string;
}

const ContestCalendar: React.FC = () => {
    const [events, setEvents] = useState<ContestEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<ContestEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState<string>('');

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await axios.get('/data/contests.json');
                console.log('Fetched contest data:', response.data);
    
                const contests = response.data.data;
                
                if (Array.isArray(contests)) {
                    const data = contests.map((contest: Contest) => ({
                        title: `${contest.contestName} (${contest.platform})`,
                        start: new Date(contest.contestStartDate),
                        end: new Date(contest.contestEndDate),
                        allDay: false,
                        platform: contest.platform,
                        name: contest.contestName,
                        startDate: new Date(contest.contestStartDate),
                        endDate: new Date(contest.contestEndDate),
                        phase: contest.contestType,
                        duration: contest.contestDuration / 60,
                        durationSeconds: contest.contestDuration,
                        relativeTimeSeconds: 0,
                        url: contest.contestUrl || '' // Ensure URL field is available
                    }));
                    setEvents(data);
                } else {
                    console.error('Response data is not an array:', contests);
                }
                
                interface Contest {
                    contestName: string;
                    platform: string;
                    contestStartDate: string;
                    contestEndDate: string;
                    contestType: string;
                    contestDuration: number;
                    contestUrl?: string;
                }
            } catch (error) {
                console.error('Error fetching contests:', error);
            }
        };
    
        fetchContests();
    }, []);

    const handleEventClick = (event: ContestEvent, e: React.SyntheticEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setModalPosition({ top: rect.top + window.scrollY + 20, left: rect.left + window.scrollX });
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const formatGoogleCalendarDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        const hours = (`0${date.getHours()}`).slice(-2);
        const minutes = (`0${date.getMinutes()}`).slice(-2);
        const seconds = (`0${date.getSeconds()}`).slice(-2);
        return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };

    const handleAddToCalendar = () => {
        if (selectedEvent) {
            const startDate = formatGoogleCalendarDate(selectedEvent.startDate);
            const endDate = formatGoogleCalendarDate(selectedEvent.endDate);
            const eventTitle = encodeURIComponent(selectedEvent.name);

            const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDate}/${endDate}`;

            window.open(url, '_blank');
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlatform(e.target.value);
    };

    const filteredEvents = events.filter((event) =>
        (selectedPlatform === '' || event.platform === selectedPlatform) &&
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'leetcode':
                // return <SiLeetcode className="text-lg mr-2" />;
                return <span><SiLeetcode className='text-[18px]'/></span>
            case 'codeforces':
                return <span><SiCodeforces className='text-[18px]' /></span>
            // Add cases for other platforms and their corresponding icons
            case 'geeksforgeeks':
                return <span><SiGeeksforgeeks className='text-[18px]' /></span>;
            default:
                return <span><FaCode className='text-[18px]' /></span>; // Default icon
        }
    };
    
    type EventProps = {
        event: ContestEvent;
    };
    
    const CustomEvent: React.FC<EventProps> = ({ event }) => {
        return (
            <span className="flex items-center p-[3px] gap-[4px]">
                {getPlatformIcon(event.platform)}
                <span>{event.title}</span>
            </span>
        );
    };
    

    return (
        <div className="bg-gray-50 h-screen w-screen flex flex-col">
            <Navbar />
            <div className='m-10'>
                <div className="flex w-full items-center mb-10 justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Search contests"
                        className="text-[20px] px-4 w-[950px] py-3 border border-gray-300 rounded-md rounded-l-lg focus:outline-none"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <select 
                        value={selectedPlatform}
                        onChange={handlePlatformChange}
                        className="w-full text-gray-400 px-4 py-3 text-[25px] border rounded-md border-gray-300 rounded-r-lg focus:outline-none"
                    >
                        <option value="">All Platforms</option>
                        <option value="leetcode">LeetCode</option>
                        <option value="codeforces">Codeforces</option>
                        {/* Add more platforms as needed */}
                    </select>
                </div>
            
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="col-span-1 lg:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upcoming Contests</h2>
                        <p className="text-sm font-mono text-slate-700 mb-4">Don't miss scheduled events</p>
                        <div className="space-y-4 overflow-scroll scroll-smooth overflow-x-hidden h-[650px]">
                            {filteredEvents.map((event) => (
                                <div key={event.startDate.toString()} className="bg-white p-4 rounded-lg shadow border border-gray-400">
                                    <div className="flex items-center justify-between">
                
                                        <div>
                                            <div className='flex'>
                                            {event && getPlatformIcon(event.platform)}
                                                <h3 className="text-lg font-semibold">{event.name.length > 30 ? event.name.slice(0, 40) + '...' : event.name}</h3>
                                                <a href={event.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600">
                                                    <FaLink />
                                                </a>
                                            
                                            </div>
                                            <p className="text-gray-600 text-[20px] mt-2">{event.startDate.toLocaleString()}</p>
                                            <button
                                                onClick={handleAddToCalendar}
                                                className="mt-2 text-[18px] underline text-blue-600 rounded"
                                            >
                                                Add to Google Calendar
                                            </button>
                                            
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-1 lg:col-span-2 ">
                        <Calendar
                            localizer={localizer}
                            events={filteredEvents}
                            startAccessor="start"
                            endAccessor="start"
                            style={{ height: 700 }}
                            onSelectEvent={handleEventClick}
                            className="rounded-lg shadow bg-white p-4 border border-gray-100"
                            components={{
                                event: CustomEvent, // Use the custom event component
                            }}
                        />
                    </div>
                </div>

                {isModalOpen && selectedEvent && (
                    <div
                        className="absolute bg-white shadow-lg p-6 rounded-lg border-t-4 border-blue-600"
                        style={{ top: modalPosition.top, left: modalPosition.left, zIndex: 10 }}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                        <div className='flex'>
                        {getPlatformIcon(selectedEvent.platform)}
                        <h2 className="text-xl font-semibold">{selectedEvent.name}</h2>
                        </div>
                        <p className="text-gray-500 mt-2 font-bold text-[20px]">{selectedEvent.platform}</p>
                        <p className="text-gray-950 mt-2 text-[18px]">Start: {selectedEvent.startDate.toLocaleString()}</p>
                        <p className="text-gray-950 mt-1 text-[18px]">End: {selectedEvent.endDate.toLocaleString()}</p>
                        <p className="text-gray-950 mt-1 text-[18px]">Status: {selectedEvent.phase}</p>
                        <p className="text-gray-950 mt-1 text-[18px]">Duration: {selectedEvent.duration} minutes</p>
                        <p className="text-gray-950 mt-1 text-[18px]">Time Until Start: {Math.abs(selectedEvent.relativeTimeSeconds)} seconds</p>
                        {selectedEvent.url && (
                            <a href={selectedEvent.url} target="_blank" rel="noopener noreferrer" className="mt-4 text-blue-500 underline text-[20px]">
                                Open Contest
                            </a>
                        )}
                        <button
                            onClick={handleAddToCalendar}
                            className="mt-4 ml-4 text-[18px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add to Google Calendar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContestCalendar;
