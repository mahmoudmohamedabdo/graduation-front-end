export default function TracksSection() {
  return (
    <section className="text-center py-12 px-4 bg-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">
        Everything You Need to Succeed
      </h2>
      <p className="text-gray-600 mb-10">
        Comprehensive tools and resources designed to help you ace any technical interview
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-16">
        {/* الصف الأول */}
        <div className="bg-[#446993] text-white p-6 rounded-xl shadow-md h-[230px] flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Multiple Tracks</h3>
          <p>Frontend, Backend, and UI/UX specialized learning paths.</p>
        </div>
        <div className="bg-[#1E7CE8] text-white p-6 rounded-xl shadow-md h-[230px] flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Multiple Tracks</h3>
          <p>Frontend, Backend, and UI/UX specialized learning paths.</p>
        </div>

        {/* الصف الثاني */}
        <div className="bg-[#1E7CE8] text-white p-6 rounded-xl shadow-md h-[230px] flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Multiple Tracks</h3>
          <p>Frontend, Backend, and UI/UX specialized learning paths.</p>
        </div>
        <div className="bg-[#446993] text-white p-6 rounded-xl shadow-md h-[230px] flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Multiple Tracks</h3>
          <p>Frontend, Backend, and UI/UX specialized learning paths.</p>
        </div>
      </div>
    </section>
  );
}
