
import { Link } from 'react-router-dom'


export const Navbar = () => {
  return (
    <div className="bg-gray-50 h-screen w-screen flex flex-col">
      <header className="relative z-10 py-4 md:py-6">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between">
                        <div className="flex-shrink-0 ">
                            <a href="#" title="" className="flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                               <h2 className='text-2xl font-semibold'>/ RARE BLOCKS</h2>
                            </a>
                        </div>
                        

                        <div className="hidden md:flex md:items-center md:justify-center md:space-x-10 md:absolute md:inset-y-0 md:left-1/2 md:-translate-x-1/2 lg:space-x-16">
                            <Link to="/">
                                <a  title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                                    Home
                                </a>
                            </Link>

                            <Link to="/event-tracker">
                                <a  title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                                    Event Tracker
                                </a>
                            </Link>

                            <Link to="/profile">
                                <a  title="" className="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none font-pj hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2">
                                    Profile Tacker
                                </a>
                            </Link>
                        </div>

                        <div className="hidden md:flex">
                            <a
                                href="#"
                                title=""
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded hover:bg-gray-600 font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                role="button"
                            >
                                Try it for free
                            </a>
                        </div>
                    </div>
                </div>
            </header>
    </div>
  )
}
