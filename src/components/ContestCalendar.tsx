import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Navbar } from './Navbar';

const localizer = momentLocalizer(moment);

interface ContestEvent extends Event {
    platform: string;
    name: string;
    startDate: Date;
    endDate: Date;
    phase: string;
    duration: number;
    relativeTime: number;
    durationSeconds: number;
    relativeTimeSeconds: number;
}

const ContestCalendar: React.FC = () => {
    const [events, setEvents] = useState<ContestEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<ContestEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 12);

                const response = await axios.post('http://13.201.21.248:3001/api/contests', { withCredentials: true });
                const data = response.data.filter((contest: ContestEvent) => {
                    const contestDate = new Date(contest.startDate);
                    return contestDate >= sevenDaysAgo;
                }).map((contest: ContestEvent) => ({
                    title: `${contest.name} (${contest.platform})`,
                    start: new Date(contest.startDate),
                    end: new Date(contest.endDate),
                    allDay: false,
                    platform: contest.platform,
                    name: contest.name,
                    startDate: new Date(contest.startDate),
                    endDate: new Date(contest.endDate),
                    phase: contest.phase,
                    duration: contest.durationSeconds / 60, // Convert to minutes
                    relativeTime: contest.relativeTimeSeconds,

                }));

                setEvents(data);
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

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredEvents = events.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-50 h-screen w-screen flex flex-col">
            <Navbar />
            <div className='m-10'>
            <div className=''>
                <div className="flex w-full items-center mb-10 justify-between gap-4">
                    <input
                        type="text"
                        placeholder="Search contests"
                        className="text-[20px] px-4 w-[950px] py-3 border border-gray-300 rounded-md rounded-l-lg focus:outline-none"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <select className="w-full text-gray-400 px-4 py-3 text-[25px] border rounded-md border-gray-300 rounded-r-lg focus:outline-none">
                        <option value="">All Platforms</option>
                        <option value="platform1">Platform 1</option>
                        <option value="platform2">Platform 2</option>
                        <option value="platform3">Platform 3</option>
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-1 lg:col-span-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Upcoming Contests</h2>
                    <p className="text-sm font-mono text-slate-700 mb-4">Don't miss scheduled events</p>
                    <div className="space-y-4 overflow-scroll scroll-smooth overflow-x-hidden h-[650px]">
                        {filteredEvents.map((event) => (
                            <div key={event.startDate.toString()} className="bg-white p-4 rounded-lg shadow border border-gray-400">
                                <div className="flex items-center justify-between">
                                    <div className="">
                                        <h3 className="text-lg font-semibold">{event.name.length > 30 ? event.name.slice(0, 30) + '...' : event.name}</h3>
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

                <div className="col-span-1 lg:col-span-2">
                    <Calendar
                        localizer={localizer}
                        events={filteredEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 700 }}
                        onSelectEvent={handleEventClick}
                        className="rounded-lg shadow bg-white p-4 border border-gray-100"
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
                    <h2 className="text-xl font-semibold">{selectedEvent.name}</h2>
                    <p className="text-gray-500 mt-2 font-bold text-[20px]">{selectedEvent.platform}</p>
                    <p className="text-gray-950 mt-2 text-[18px]">Start: {selectedEvent.startDate.toLocaleString()}</p>
                    <p className="text-gray-950 mt-1 text-[18px]">End: {selectedEvent.endDate.toLocaleString()}</p>
                    <p className="text-gray-950 mt-1 text-[18px]">Status: {selectedEvent.phase}</p>
                    <p className="text-gray-950 mt-1 text-[18px]">Duration: {selectedEvent.duration} minutes</p>
                    <p className="text-gray-950 mt-1 text-[18px]">Time Until Start: {Math.abs(selectedEvent.relativeTime)} seconds</p>
                    <button
                        onClick={handleAddToCalendar}
                        className="mt-4 text-[18px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
