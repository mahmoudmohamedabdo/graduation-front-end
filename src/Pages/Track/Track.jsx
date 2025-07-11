import React from 'react'
import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'
import learn from '../../assets/Images/Learning.png'
import Card from './Components/Card'
import Level from '../Level/Level'
export default function Track() {
  return (
    <div>
      <Navbar />
      <main className="py-12 min-h-screen bg-gray-50">

        {/* Hero Section*/}
        <div className="bg-white my-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">Select A</h1>
              <h1 className="text-5xl font-bold">Technology</h1>
              <h1 className="text-5xl font-bold text-[#1E7CE8]">To start Practicing</h1>
              <p className="text-gray-700 max-w-2xl">
                Choose from our carefully curated technologies and start your learning journey with questions tailored to your skill level.
              </p>
            </div>

            {/* Hero Image */}
            <div className="image">
              <img src={learn} alt="Learning" />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg px-8 py-10">

              {/* Title */}
              <h2 className="text-xl font-semibold text-center text-gray-800 my-6">
                Track Overview
              </h2>

              {/* Cards */}
              <div className="flex flex-col md:flex-row justify-around items-center gap-8">

                {/* Card 1 */}
                <div className="flex flex-col items-center">
                  <span className="text-[#2563EB] text-3xl font-bold">2</span>
                  <span className="text-gray-600 mt-1 text-sm">Technologies</span>
                </div>

                {/* Card 2 */}
                <div className="flex flex-col items-center">
                  <span className="text-[#4F46E5] text-3xl font-bold">3</span>
                  <span className="text-gray-600 mt-1 text-sm">Skill Levels</span>
                </div>

                {/* Card 3 */}
                <div className="flex flex-col items-center">
                  <span className="text-[#9333EA] text-3xl font-bold">8</span>
                  <span className="text-gray-600 mt-1 text-sm">Total Questions</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/**Cars */}

        {/* Cards Grid Section */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
    <Card />
  </div>
</div>


      </main>
      <Footer />
    </div>
  )
}
