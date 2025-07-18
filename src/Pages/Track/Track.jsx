import React, { useState, useEffect } from 'react';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import learn from '../../assets/Images/Learning.png';
import Card from './Components/Card';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

export default function Track() {
  const [tracks, setTracks] = useState([]);
  const [allTracks, setAllTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [premiumFilter, setPremiumFilter] = useState(true);
  const { id: trackId } = useParams();

  // Fetch tracks based on trackId
  useEffect(() => {
    const fetchTrackData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/Tracks/by-category/${trackId}`);
        console.log('Raw API response:', JSON.stringify(response.data, null, 2));

        // Normalize response.data.data to an array
        const trackData = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data
          ? [response.data.data]
          : [];

        const formattedTracks = trackData.map(track => {
          // Calculate total question count from difficulty counters
          const difficultyCount =
            (track.trackDetails?.easyQuestionsCounter || 0) +
            (track.trackDetails?.mediumQuestionsCounter || 0) +
            (track.trackDetails?.hardQuestionsCounter || 0);
          
          // Fallback to trackQuestionsCount if difficultyCount is 0
          const questionCount = difficultyCount > 0 ? difficultyCount : (track.trackQuestionsCount || 0);

          const trackInfo = {
            id: track.id || 0,
            categoryId: track.categoryId, // أضف هذا السطر
            name: track.name || 'Unnamed Track',
            description: track.description || 'No description available',
            isPremium: track.isPremium || false,
            price: track.isPremium ? track.price : null,
            questionCount: questionCount,
            levelCount: trackData.length || 1,
          };
          
          console.log('Track mapping:', { input: track, output: trackInfo });
          return trackInfo;
        });

        console.log('Formatted tracks:', JSON.stringify(formattedTracks, null, 2));
        setTracks(formattedTracks);
        setAllTracks(formattedTracks);
        setSearchMessage(formattedTracks.length === 0 ? `No tracks found for category ${trackId}.` : '');
      } catch (error) {
        console.error('Error fetching track data:', error.response?.data || error.message);
        setTracks([]);
        setAllTracks([]);
        setSearchMessage('Error fetching tracks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (trackId) {
      fetchTrackData();
    }
  }, [trackId]);

  // Handle search functionality (client-side filtering)
  const handleSearch = async () => {
    setSearchMessage('');
    setIsLoading(true);
    if (!searchQuery.trim()) {
      setTracks(allTracks);
      setSearchMessage(allTracks.length === 0 ? `No tracks found for category ${trackId}.` : '');
      setIsLoading(false);
      return;
    }

    try {
      const searchUrl = `http://fit4job.runasp.net/api/Tracks/search?Name=${encodeURIComponent(searchQuery)}&CategoryId=${trackId}&IsActive=${premiumFilter}`;
      console.log('Search URL:', searchUrl);
      const response = await axios.get(searchUrl);
      console.log('Search response:', JSON.stringify(response.data, null, 2));
      const searchResults = Array.isArray(response.data.data) ? response.data.data : response.data.data ? [response.data.data] : [];
      const formattedResults = searchResults.map(track => {
        // Calculate total question count from difficulty counters
        
        const questionCount = (track.trackQuestionsCount );

        const trackInfo = {
          id: track.id || 0,
          name: track.name || 'Unnamed Track',
          description: track.description || 'No description available',
          isPremium: track.isPremium || false,
          price: track.isPremium ? track.price : null,
          questionCount: questionCount,
          levelCount: searchResults.length || 1,
        };
        
        console.log('Search track mapping:', { input: track, output: trackInfo });
        return trackInfo;
      });
      setTracks(formattedResults);
      setSearchMessage(
        formattedResults.length === 0
          ? `No results found for "${searchQuery}" in category ${trackId}.`
          : ''
      );
    } catch (error) {
      console.error('Error searching tracks:', error.response?.data || error.message);
      const filteredTracks = allTracks.filter((track) =>
        track.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (premiumFilter ? track.isPremium : true)
      );
      setTracks(filteredTracks);
      setSearchMessage(
        filteredTracks.length === 0
          ? `No results found for "${searchQuery}" in category ${trackId}.`
          : 'Using client-side filtering due to search endpoint failure.'
      );
      console.log('Client-side filtered tracks:', JSON.stringify(filteredTracks, null, 2));
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
    setTracks(allTracks);
    setSearchMessage(allTracks.length === 0 ? `No tracks found for category ${trackId}.` : '');
  };

  return (
    <div>
      <Navbar />
      <main className="py-12 min-h-screen bg-gray-50">
        <div className="bg-white my-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">Select A</h1>
              <h1 className="text-5xl font-bold">Technology</h1>
              <h1 className="text-5xl font-bold text-[#1E7CE8]">To start Practicing</h1>
              <p className="text-gray-700 max-w-2xl">
                Choose from our carefully curated technologies and start your learning journey with questions tailored to your skill level.
              </p>
              <div className="space-y-4">
                <div className="relative max-w-md flex items-center gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search technologies..."
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
                <div className="flex gap-4">
                  <div>
                    <label className="mr-2">Premium Filter:</label>
                    <select
                      value={premiumFilter}
                      onChange={(e) => setPremiumFilter(e.target.value === 'true')}
                      className="px-2 py-1 border rounded-lg"
                      disabled={isLoading}
                    >
                      <option value="true">Premium</option>
                      <option value="false">Non-Premium</option>
                    </select>
                  </div>
                </div>
              </div>
              {isLoading && <p className="text-blue-500 mt-2">Searching...</p>}
              {searchMessage && !isLoading && (
                <p className="text-red-500 mt-2">{searchMessage}</p>
              )}
            </div>
            <div className="image">
              <img src={learn} alt="Learning" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading tracks...</p>
          ) : tracks && tracks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {tracks.map((track) => (
                <Card
                  key={track.id}
                  title={track.name}
                  description={track.description}
                  isPremium={track.isPremium}
                  price={track.isPremium ? track.price : null}
                  trackId={track.id}
                  categoryId={track.categoryId}
                  levelCount={track.levelCount}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No tracks available.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}