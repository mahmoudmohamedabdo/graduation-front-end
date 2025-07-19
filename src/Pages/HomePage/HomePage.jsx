import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../../layouts/Navbar';
import CourseCard from './Components/CourseCard';
import NewJops from './Components/NewJobs';
import Footer from '../../layouts/Footer';
import img1 from '../../assets/Images/img1.png';
import img2 from '../../assets/Images/img2.png';
import img3 from '../../assets/Images/img3.png';
import img4 from '../../assets/Images/img4.png';
import rightArrow from '../../assets/Images/rightArrow.png';
import leftArrow from '../../assets/Images/leftArrow.png';
import blackArrow from '../../assets/Images/blackArrow.png';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

export default function HomePage() {
  // Refs for scrollable containers
  const scrollRef = useRef(null);
  const jobsScrollRef = useRef(null);
  
  // States for course carousel
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  
  // States for jobs carousel
  const [isJobsAtStart, setIsJobsAtStart] = useState(true);
  const [isJobsAtEnd, setIsJobsAtEnd] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false); // Controls jobs display mode
  
  // Data states
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // Cache all courses
  const [jobs, setJobs] = useState([]); // State for jobs
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = '/api/TrackCategories';

  // Handle course carousel scroll
  const handleScroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  // Handle jobs carousel scroll
  const handleJobsScroll = (direction) => {
    const container = jobsScrollRef.current;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  // Check course carousel scroll position to enable/disable navigation buttons
  const checkScrollPosition = () => {
    const container = scrollRef.current;
    setIsAtStart(container.scrollLeft <= 0);
    setIsAtEnd(container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10);
  };

  // Check jobs carousel scroll position to enable/disable navigation buttons
  const checkJobsScrollPosition = () => {
    const container = jobsScrollRef.current;
    if (container) {
      setIsJobsAtStart(container.scrollLeft <= 0);
      setIsJobsAtEnd(container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();
    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, []);

  useEffect(() => {
    const container = jobsScrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkJobsScrollPosition);
      checkJobsScrollPosition();
      return () => container.removeEventListener('scroll', checkJobsScrollPosition);
    }
  }, [showAllJobs]);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/all`, {
          headers: { Accept: 'text/plain' },
        });
        const courseData = Array.isArray(response.data.data) ? response.data.data : [];
        setAllCourses(courseData);
        setCourses(courseData);
        setSearchMessage(courseData.length === 0 ? 'No courses found.' : '');
        console.log('Courses response:', response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setCourses([]);
        setAllCourses([]);
        setSearchMessage('Error fetching courses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://fit4job.runasp.net/api/Jobs');
        const jobData = Array.isArray(response.data.data) ? response.data.data : [];
        setJobs(jobData);
        console.log('Jobs response:', response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle search functionality (client-side filtering for courses)
  const handleSearch = async () => {
    setSearchMessage('');
    setIsLoading(true);

    if (!searchQuery.trim()) {
      setCourses(allCourses);
      setSearchMessage(allCourses.length === 0 ? 'No courses found.' : '');
      setIsLoading(false);
      return;
    }

    try {
      const searchResults = allCourses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCourses(searchResults);
      setSearchMessage(
        searchResults.length === 0
          ? `No courses found for "${searchQuery}".`
          : ''
      );
      console.log('Filtered courses:', searchResults);
    } catch (error) {
      console.error('Error searching courses:', error);
      setCourses([]);
      setSearchMessage('Error searching courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger search on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Reset search
  const handleReset = () => {
    setSearchQuery('');
    setSearchMessage('');
    setCourses(allCourses);
  };

  const username = localStorage.getItem('username') || 'Guest';

  return (
    <div>
      <Navbar />
      <main className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-8">Welcome back, {username}</h3>

          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-[#61758A]">Master Your</h1>
              <h2 className="text-5xl font-bold text-[#1E7CE8]">Technical Interviews</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Join thousands of developers who've landed their dream jobs. Practice with real interview questions,
                get hired by top companies, and advance your career with our comprehensive platform.
              </p>
            </div>

            {/* Hero Images */}
            <div className="users">
              <div className="row1 flex">
                <div
                  style={{ backgroundColor: '#428EB7', borderColor: '#F2F6FF' }}
                  className="m-3 border-5 rounded-tl-4xl transition duration-300 ease-in-out hover:-translate-y-2 hover:-translate-x-2"
                >
                  <img src={img1} alt="" className="w-full h-auto" />
                </div>
                <div
                  style={{ backgroundColor: '#2485E4', borderColor: '#F2F6FF' }}
                  className="m-3 border-5 rounded-tr-4xl transition duration-300 ease-in-out hover:-_translate-y-2 hover:translate-x-2"
                >
                  <img src={img2} alt="" />
                </div>
              </div>
              <div className="row2 flex">
                <div
                  style={{ backgroundColor: '#2485E4', borderColor: '#F2F6FF' }}
                  className="m-3 border-5 rounded-bl-4xl transition duration-300 ease-in-out hover:translate-y-2 hover:-translate-x-2"
                >
                  <img src={img3} alt="" />
                </div>
                <div
                  style={{ backgroundColor: '#428EB7', borderColor: '#F2F6FF' }}
                  className="m-3 border-4 rounded-br-4xl transition duration-300 ease-in-out hover:translate-y-2 hover:translate-x-2"
                >
                  <img src={img4} alt="" />
                </div>
              </div>
            </div>
          </div>

          {/* Section Title, Arrows & Search */}
          <div className="mt-16 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">All Tracks</h3>
              <div className="icons flex items-center gap-2">
                <button
                  onClick={() => handleScroll('left')}
                  disabled={isAtStart}
                  className={`${isAtStart ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <img src={rightArrow} alt="Left" />
                </button>
                <button
                  onClick={() => handleScroll('right')}
                  disabled={isAtEnd}
                  className={`${isAtEnd ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <img src={leftArrow} alt="Right" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mt-4 flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search courses..."
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E7CE8]"
                  disabled={isLoading}
                />
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={handleSearch}
                />
              </div>
              {searchQuery && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={isLoading}
                >
                  Clear
                </button>
              )}
            </div>
            {/* Feedback Messages */}
            {isLoading && (
              <div className="text-center mt-2">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-blue-500 mt-2">Searching...</p>
              </div>
            )}
            {searchMessage && !isLoading && (
              <p className="text-red-500 mt-2 text-center">{searchMessage}</p>
            )}
          </div>

          {/* Course Cards */}
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-2">
            {isLoading ? (
              <p className="text-center text-gray-500">Loading courses...</p>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id}>
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No courses available.</p>
            )}
          </div>

          {/* Job Cards Header */}
          <div className="flex justify-between items-center mt-16 mb-4 px-2 sm:px-0">
            <h3 className="text-2xl font-semibold">New Jobs</h3>
            <div className="flex items-center gap-4">
              {showAllJobs && (
                <div className="icons flex items-center gap-2">
                  <button
                    onClick={() => handleJobsScroll('left')}
                    disabled={isJobsAtStart}
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
                      isJobsAtStart ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-md'
                    }`}
                  >
                    <img src={rightArrow} alt="Left" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleJobsScroll('right')}
                    disabled={isJobsAtEnd}
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
                      isJobsAtEnd ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-md'
                    }`}
                  >
                    <img src={leftArrow} alt="Right" className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div 
                className="icons flex items-center gap-2 cursor-pointer text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                onClick={() => setShowAllJobs(!showAllJobs)}
              >
                {showAllJobs ? 'Show Less' : 'View All'}
                <img src={blackArrow} alt="" className={`w-5 h-5 transition-transform duration-300 ${showAllJobs ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div 
            ref={jobsScrollRef} 
            className={`transition-all duration-500 ease-in-out ${
              showAllJobs 
                ? 'flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-2' 
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-2 text-center items-center'
            }`}
          >
            {isLoading ? (
              <p className="text-center text-gray-500">Loading jobs...</p>
            ) : jobs.length > 0 ? (
              (showAllJobs ? jobs : jobs.slice(0, 4)).map((job) => (
                <div key={job.id} className="transition-all duration-300 ease-in-out">
                  <NewJops job={job} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No jobs available.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}