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
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [queryParam, setQueryParam] = useState('query');

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    setIsAtStart(container.scrollLeft <= 0);
    setIsAtEnd(container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10);
  };

  useEffect(() => {
    const container = scrollRef.current;
    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();
    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, []);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/TrackCategories/');
        const courseData = Array.isArray(response.data.data) ? response.data.data : [];
        setCourses(courseData);
        setSearchMessage(courseData.length === 0 ? 'No courses found.' : '');
        console.log('Courses response:', response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setCourses([]);
        setSearchMessage('Error fetching courses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle search functionality
  const handleSearch = async () => {
    setSearchMessage('');
    setIsLoading(true);
    if (!searchQuery.trim()) {
      // Reload all courses if query is empty
      try {
        const response = await axios.get('/api/TrackCategories/');
        const courseData = Array.isArray(response.data.data) ? response.data.data : [];
        setCourses(courseData);
        setSearchMessage(courseData.length === 0 ? 'No courses found.' : '');
        console.log('Reloaded courses:', response.data);
      } catch (error) {
        console.error('Error reloading courses:', error);
        setCourses([]);
        setSearchMessage('Error reloading courses. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const searchUrl = `http://fit4job.runasp.net/api/TrackCategories/search/1/true?${queryParam}=${encodeURIComponent(searchQuery)}`;
      console.log('Search URL:', searchUrl);
      const response = await axios.get(searchUrl);
      const searchResults = Array.isArray(response.data.data) ? response.data.data : [];
      setCourses(searchResults);
      setSearchMessage(
        searchResults.length === 0
          ? `No courses found for "${searchQuery}".`
          : ''
      );
      console.log('Search response:', response.data);
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
    setIsLoading(true);
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/TrackCategories/');
        const courseData = Array.isArray(response.data.data) ? response.data.data : [];
        setCourses(courseData);
        setSearchMessage(courseData.length === 0 ? 'No courses found.' : '');
        console.log('Reset courses:', response.data);
      } catch (error) {
        console.error('Error resetting courses:', error);
        setCourses([]);
        setSearchMessage('Error resetting courses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  };

  return (
    <div>
      <Navbar />
      <main className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-8">Welcome back, Rola Alaa</h3>

          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-[#61758A]">Master Your</h1>
              <h2 className="text-5xl font-bold text-[#1E7CE8]">Technical Interviews</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Join thousands of developers who've landed their dream jobs. Practice with real interview questions,
                get hired by top companies, and advance your career with our comprehensive platform.
              </p>
              <div className="relative max-w-md mx-auto mt-6 flex items-center gap-2">
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
              {isLoading && <p className="text-blue-500 mt-2 text-center">Searching...</p>}
              {searchMessage && !isLoading && (
                <p className="text-red-500 mt-2 text-center">{searchMessage}</p>
              )}
            </div>

            {/* Hero Images */}
            <div className="users">
              <div className="row1 flex">
                <div style={{ backgroundColor: '#428EB7', borderColor: '#F2F6FF' }}
                  className="m-3 border-5 rounded-tl-4xl transition duration-300 ease-in-out hover:-translate-y-2 hover:-translate-x-2">
                  <img src={img1} alt="" className="w-full h-auto" />
                </div>
                <div style={{ backgroundColor: '#2485E4', borderColor: '#F2F6FF' }}
                  className="m-3 border-5 rounded-tr-4xl transition duration-300 ease-in-out hover:-translate-y-2 hover:translate-x-2">
                  <img src={img2} alt="" />
                </div>
              </div>
              <div className="row2 flex">
                <div style={{ backgroundColor: '#2485E4', borderColor: '#F2F6FF' }}
                  className="m-3 border-5 rounded-bl-4xl transition duration-300 ease-in-out hover:translate-y-2 hover:-translate-x-2">
                  <img src={img3} alt="" />
                </div>
                <div style={{ backgroundColor: '#428EB7', borderColor: '#F2F6FF' }}
                  className="m-3 border-4 rounded-br-4xl transition duration-300 ease-in-out hover:translate-y-2 hover:translate-x-2">
                  <img src={img4} alt="" />
                </div>
              </div>
            </div>
          </div>

          {/* Section Title & Arrows */}
          <div className="flex justify-between items-center mt-16 mb-4">
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
            <div className="icons flex items-center gap-2 cursor-pointer text-blue-600 font-semibold">
              View All
              <img src={blackArrow} alt="" className="w-5 h-5" />
            </div>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-2 text-center items-center">
            {Array(4).fill().map((_, index) => (
              <NewJops key={index} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}