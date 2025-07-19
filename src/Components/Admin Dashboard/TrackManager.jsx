import React, { useState, useEffect } from 'react'
import card1 from '../../assets/Images/card1.png'
import card2 from '../../assets/Images/card2.png'
import card3 from '../../assets/Images/card3.png'
import card4 from '../../assets/Images/card4.png'

export default function TrackManager() {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        categoryId: '',
        name: '',
        description: '',
        isPremium: false,
        price: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Track Categories State
    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(false);
    const [catError, setCatError] = useState('');

    // State for Create Category Modal
    const [showCatModal, setShowCatModal] = useState(false);
    const [catForm, setCatForm] = useState({
        name: '',
        iconUrl: '',
        description: '',
        categorySkills: '' // نص مفصول بفواصل
    });
    const [catLoadingCreate, setCatLoadingCreate] = useState(false);
    const [catErrorCreate, setCatErrorCreate] = useState('');

    // State for Tracks
    const [tracks, setTracks] = useState([]);
    const [tracksLoading, setTracksLoading] = useState(false);
    const [tracksError, setTracksError] = useState('');

    // State for Add TrackQuestions Modal
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [questionForm, setQuestionForm] = useState({
        trackId: '',
        questionText: '',
        questionType: 0,
        questionLevel: 0,
        difficultyLevel: 0,
        points: '',
        explanation: '',
        codeSnippet: '',
        expectedOutput: ''
    });
    const [questionLoadingCreate, setQuestionLoadingCreate] = useState(false);
    const [questionErrorCreate, setQuestionErrorCreate] = useState('');

    // State for Add QuestionOptions Modal
    const [showOptionModal, setShowOptionModal] = useState(false);
    const [optionForm, setOptionForm] = useState({
        questionId: '',
        optionText: '',
        isCorrect: false
    });
    const [optionLoadingCreate, setOptionLoadingCreate] = useState(false);
    const [optionErrorCreate, setOptionErrorCreate] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            setCatLoading(true);
            setCatError('');
            try {
                const res = await fetch('http://fit4job.runasp.net/api/TrackCategories/all');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setCategories(data.data);
                } else {
                    setCatError('Failed to load categories');
                }
            } catch {
                setCatError('Failed to load categories');
            } finally {
                setCatLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchTracks = async () => {
            setTracksLoading(true);
            setTracksError('');
            try {
                const res = await fetch('http://fit4job.runasp.net/api/Tracks/all');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setTracks(data.data);
                } else {
                    setTracksError('Failed to load tracks');
                }
            } catch {
                setTracksError('Failed to load tracks');
            } finally {
                setTracksLoading(false);
            }
        };
        fetchTracks();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreate = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        // تحقق من صحة القيم قبل الإرسال
        if (!form.categoryId || isNaN(parseInt(form.categoryId))) {
            setError('Category ID is required and must be a valid number');
            setLoading(false);
            return;
        }
        if (!form.name.trim()) {
            setError('Name is required');
            setLoading(false);
            return;
        }
        if (!form.description.trim()) {
            setError('Description is required');
            setLoading(false);
            return;
        }
        if (form.price === '' || isNaN(parseFloat(form.price))) {
            setError('Price is required and must be a valid number');
            setLoading(false);
            return;
        }
        try {
            const payload = {
                categoryId: parseInt(form.categoryId),
                name: form.name,
                description: form.description,
                price: parseFloat(form.price)
            };
            // isPremium input as text
            if (typeof form.isPremium === 'string') {
                const val = form.isPremium.trim().toLowerCase();
                payload.isPremium = (val === 'true' || val === '1');
            } else {
                payload.isPremium = !!form.isPremium;
            }
            // إعداد الهيدر مع التوكن إذا كان موجود
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = 'Bearer ' + token;
            }
            const res = await fetch('http://fit4job.runasp.net/api/Tracks/create', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                let errorText = '';
                try {
                    const errData = await res.clone().json();
                    errorText = errData.message || JSON.stringify(errData);
                } catch {
                    try {
                        errorText = await res.clone().text();
                    } catch {
                        errorText = 'Failed to create track';
                    }
                }
                throw new Error(errorText || 'Failed to create track');
            }
            // جلب id التراك الجديد من الرد
            let trackId = null;
            try {
                const data = await res.json();
                trackId = data?.data?.id;
            } catch {
                // Ignore JSON parsing errors
            }
            setSuccess('Track created successfully!');
            setShowModal(false);
            setForm({ categoryId: '', name: '', description: '', isPremium: false, price: '' });
            if (trackId) {
                alert('Track created successfully! Track ID: ' + trackId);
            } else {
                alert('Track created successfully!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCatChange = (e) => {
        const { name, value } = e.target;
        setCatForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateCategory = async () => {
        setCatLoadingCreate(true);
        setCatErrorCreate('');
        // تحقق من القيم
        if (!catForm.name.trim()) {
            setCatErrorCreate('Name is required');
            setCatLoadingCreate(false);
            return;
        }
        if (!catForm.iconUrl.trim()) {
            setCatErrorCreate('Icon URL is required');
            setCatLoadingCreate(false);
            return;
        }
        if (!catForm.description.trim()) {
            setCatErrorCreate('Description is required');
            setCatLoadingCreate(false);
            return;
        }
        // categorySkills: split by comma, trim
        const skillsArr = catForm.categorySkills
            ? catForm.categorySkills.split(',').map(s => s.trim()).filter(Boolean)
            : [];
        const payload = {
            name: catForm.name,
            iconUrl: catForm.iconUrl,
            description: catForm.description,
            categorySkills: skillsArr
        };
        try {
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('authToken');
            if (token) headers['Authorization'] = 'Bearer ' + token;
            const res = await fetch('http://fit4job.runasp.net/api/TrackCategories', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                let errorText = '';
                try {
                    const errData = await res.clone().json();
                    errorText = errData.message || JSON.stringify(errData);
                } catch {
                    try { errorText = await res.clone().text(); } catch { errorText = 'Failed to create category'; }
                }
                throw new Error(errorText || 'Failed to create category');
            }
            setShowCatModal(false);
            setCatForm({ name: '', iconUrl: '', description: '', categorySkills: '' });
            alert('Category add sucssfully');
        } catch (err) {
            setCatErrorCreate(err.message);
        } finally {
            setCatLoadingCreate(false);
        }
    };

    const handleQuestionChange = (e) => {
        const { name, value } = e.target;
        setQuestionForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateQuestion = async () => {
        setQuestionLoadingCreate(true);
        setQuestionErrorCreate('');
        // تحقق من القيم
        if (!questionForm.trackId || isNaN(parseInt(questionForm.trackId))) {
            setQuestionErrorCreate('Track ID is required and must be a valid number');
            setQuestionLoadingCreate(false);
            return;
        }
        if (!questionForm.questionText.trim()) {
            setQuestionErrorCreate('Question Text is required');
            setQuestionLoadingCreate(false);
            return;
        }
        if (questionForm.points === '' || isNaN(parseFloat(questionForm.points))) {
            setQuestionErrorCreate('Points is required and must be a valid number');
            setQuestionLoadingCreate(false);
            return;
        }
        const payload = {
            trackId: parseInt(questionForm.trackId),
            questionText: questionForm.questionText,
            questionType: parseInt(questionForm.questionType),
            questionLevel: parseInt(questionForm.questionLevel),
            difficultyLevel: parseInt(questionForm.difficultyLevel),
            points: parseFloat(questionForm.points),
            explanation: questionForm.explanation,
            codeSnippet: questionForm.codeSnippet,
            expectedOutput: questionForm.expectedOutput
        };
        try {
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('authToken');
            if (token) headers['Authorization'] = 'Bearer ' + token;
            const res = await fetch('http://fit4job.runasp.net/api/TrackQuestions', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                let errorText = '';
                try {
                    const errData = await res.clone().json();
                    errorText = errData.message || JSON.stringify(errData);
                } catch {
                    try { errorText = await res.clone().text(); } catch { errorText = 'Failed to create question'; }
                }
                throw new Error(errorText || 'Failed to create question');
            }
            // جلب id السؤال الجديد من الرد
            let questionId = null;
            try {
                const data = await res.json();
                questionId = data?.data?.id;
            } catch {
                // Ignore JSON parsing errors
            }
            setShowQuestionModal(false);
            setQuestionForm({
                trackId: '', questionText: '', questionType: 0, questionLevel: 0,
                difficultyLevel: 0, points: '', explanation: '', codeSnippet: '', expectedOutput: ''
            });
            if (questionId) {
                alert('TrackQuestions add sucssufuly, ID: ' + questionId);
            } else {
                alert('TrackQuestions add sucssufuly');
            }
        } catch (err) {
            setQuestionErrorCreate(err.message);
        } finally {
            setQuestionLoadingCreate(false);
        }
    };

    const handleOptionChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOptionForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateOption = async () => {
        setOptionLoadingCreate(true);
        setOptionErrorCreate('');
        // تحقق من القيم
        if (!optionForm.questionId || isNaN(parseInt(optionForm.questionId))) {
            setOptionErrorCreate('Question ID is required and must be a valid number');
            setOptionLoadingCreate(false);
            return;
        }
        if (!optionForm.optionText.trim()) {
            setOptionErrorCreate('Option Text is required');
            setOptionLoadingCreate(false);
            return;
        }
        const payload = {
            questionId: parseInt(optionForm.questionId),
            optionText: optionForm.optionText,
            isCorrect: !!optionForm.isCorrect
        };
        try {
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('authToken');
            if (token) headers['Authorization'] = 'Bearer ' + token;
            const res = await fetch('http://fit4job.runasp.net/api/TrackQuestionOptions', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                let errorText = '';
                try {
                    const errData = await res.clone().json();
                    errorText = errData.message || JSON.stringify(errData);
                } catch {
                    try { errorText = await res.clone().text(); } catch { errorText = 'Failed to create option'; }
                }
                throw new Error(errorText || 'Failed to create option');
            }
            setShowOptionModal(false);
            setOptionForm({ questionId: '', optionText: '', isCorrect: false });
            alert('Question option added successfully!');
        } catch (err) {
            setOptionErrorCreate(err.message);
        } finally {
            setOptionLoadingCreate(false);
        }
    };

    return (
        <div className="bg-gray-50 md:p-10">
                <div className='flex items-center flex-row justify-between'>
                    <div>
                        <h1 className='text-[24px]'>Track Manager</h1>
                        <p className='text-[#4B5563] text-[16px] '>Manage career tracks, curriculum, and monitor student progress</p>
                    </div>
                    <div className="flex gap-2">
                        <button className='bg-[#2563EB] text-white rounded-lg px-2 py-1' onClick={() => setShowModal(true)}>Create New Track</button>
                        <button className='bg-green-600 text-white rounded-lg px-2 py-1' onClick={() => setShowCatModal(true)}>Create New Category</button>
                        <button className='bg-[#2563EB] text-white rounded-lg px-2 py-1' onClick={() => setShowQuestionModal(true)}>Add TrackQuestions</button>
                        <button className='bg-[#2563EB] text-white rounded-lg px-2 py-1' onClick={() => setShowOptionModal(true)}>Add QuestionOptions</button>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                            <button className="absolute top-2 right-3 text-gray-400 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
                            <h2 className="text-xl font-bold mb-4">Create New Track</h2>
                            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                            {success && <div className="text-green-500 text-sm mb-2">{success}</div>}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm mb-1">Category ID</label>
                                    <input type="number" name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Name</label>
                                    <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Description</label>
                                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Is Premium (true/false or 1/0)</label>
                                    <input type="text" name="isPremium" value={form.isPremium} onChange={handleChange} className="w-full border rounded p-2" placeholder="true or false" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Price</label>
                                    <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded p-2" />
                                </div>
                            </div>
                            <button
                                className="mt-6 w-full bg-[#2563EB] text-white py-2 rounded hover:bg-[#2546EB] disabled:bg-gray-300"
                                onClick={handleCreate}
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal Create Category */}
                {showCatModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                            <button className="absolute top-2 right-3 text-gray-400 text-2xl" onClick={() => setShowCatModal(false)}>&times;</button>
                            <h2 className="text-xl font-bold mb-4">Create New Category</h2>
                            {catErrorCreate && <div className="text-red-500 text-sm mb-2">{catErrorCreate}</div>}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm mb-1">Name</label>
                                    <input type="text" name="name" value={catForm.name} onChange={handleCatChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Icon URL</label>
                                    <input type="text" name="iconUrl" value={catForm.iconUrl} onChange={handleCatChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Description</label>
                                    <textarea name="description" value={catForm.description} onChange={handleCatChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Category Skills (comma separated)</label>
                                    <input type="text" name="categorySkills" value={catForm.categorySkills} onChange={handleCatChange} className="w-full border rounded p-2" placeholder="e.g. skill1, skill2" />
                                </div>
                            </div>
                            <button
                                className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-300"
                                onClick={handleCreateCategory}
                                disabled={catLoadingCreate}
                            >
                                {catLoadingCreate ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal Add TrackQuestions */}
                {showQuestionModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                            <button className="absolute top-2 right-3 text-gray-400 text-2xl" onClick={() => setShowQuestionModal(false)}>&times;</button>
                            <h2 className="text-xl font-bold mb-4">Add Track Question</h2>
                            {questionErrorCreate && <div className="text-red-500 text-sm mb-2">{questionErrorCreate}</div>}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm mb-1">Track ID</label>
                                    <input type="number" name="trackId" value={questionForm.trackId} onChange={handleQuestionChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Question Text</label>
                                    <textarea name="questionText" value={questionForm.questionText} onChange={handleQuestionChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Question Type</label>
                                    <input type="number" name="questionType" value={questionForm.questionType} onChange={handleQuestionChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Question Level</label>
                                    <input type="number" name="questionLevel" value={questionForm.questionLevel} onChange={handleQuestionChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Difficulty Level</label>
                                    <input type="number" name="difficultyLevel" value={questionForm.difficultyLevel} onChange={handleQuestionChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Points</label>
                                    <input type="number" name="points" value={questionForm.points} onChange={handleQuestionChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Explanation</label>
                                    <input type="text" name="explanation" value={questionForm.explanation} onChange={handleQuestionChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Code Snippet</label>
                                    <input type="text" name="codeSnippet" value={questionForm.codeSnippet} onChange={handleQuestionChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Expected Output</label>
                                    <input type="text" name="expectedOutput" value={questionForm.expectedOutput} onChange={handleQuestionChange} className="w-full border rounded p-2" />
                                </div>
                            </div>
                            <button
                                className="mt-6 w-full bg-[#2563EB] text-white py-2 rounded hover:bg-[#2546EB] disabled:bg-gray-300"
                                onClick={handleCreateQuestion}
                                disabled={questionLoadingCreate}
                            >
                                {questionLoadingCreate ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Modal Add QuestionOptions */}
                {showOptionModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                            <button className="absolute top-2 right-3 text-gray-400 text-2xl" onClick={() => setShowOptionModal(false)}>&times;</button>
                            <h2 className="text-xl font-bold mb-4">Add Question Option</h2>
                            {optionErrorCreate && <div className="text-red-500 text-sm mb-2">{optionErrorCreate}</div>}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm mb-1">Question ID</label>
                                    <input type="number" name="questionId" value={optionForm.questionId} onChange={handleOptionChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Option Text</label>
                                    <input type="text" name="optionText" value={optionForm.optionText} onChange={handleOptionChange} className="w-full border rounded p-2" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" name="isCorrect" checked={optionForm.isCorrect} onChange={handleOptionChange} id="isCorrect" />
                                    <label htmlFor="isCorrect" className="text-sm">Is Correct</label>
                                </div>
                            </div>
                            <button
                                className="mt-6 w-full bg-[#2563EB] text-white py-2 rounded hover:bg-[#2546EB] disabled:bg-gray-300"
                                onClick={handleCreateOption}
                                disabled={optionLoadingCreate}
                            >
                                {optionLoadingCreate ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                )}


                {/**Cards */}
                <div className='flex py-5'>

                    <div className="bg-white rounded-xl flex shadow p-4  mx-auto items-center justify-between">
                        <div className='pr-10'>
                            <p className='text-[#4B5563] text-[16px] '>Total Tracks</p>
                            <h1 className='text-[24px]'>12</h1>
                            <p className='text-[#10B981] text-[14px] '>8 active tracks</p>

                        </div>
                        <div>
                            <img src={card1} alt="" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl flex shadow p-4  mx-auto items-center justify-between">
                        <div className='pr-10'>
                            <p className='text-[#4B5563] text-[16px] '>Active Students</p>
                            <h1 className='text-[24px]'>12</h1>
                            <p className='text-[#10B981] text-[14px] '>+15% this month</p>

                        </div>
                        <div>
                            <img src={card2} alt="" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl flex shadow p-4  mx-auto items-center justify-between">
                        <div className='pr-10'>
                            <p className='text-[#4B5563] text-[16px] '>Avg Completion Rate</p>
                            <h1 className='text-[24px]'>12</h1>
                            <p className='text-[#EA580C] text-[14px] '>+3% from last month</p>

                        </div>
                        <div>
                            <img src={card3} alt="" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl flex shadow p-4  mx-auto items-center justify-between">
                        <div className='pr-10'>
                            <p className='text-[#4B5563] text-[16px] '>Curriculum Items</p>
                            <h1 className='text-[24px]'>12</h1>
                            <p className='text-[#9333EA] text-[14px] '>38 courses, 418 lessons</p>

                        </div>
                        <div>
                            <img src={card4} alt="" />
                        </div>
                    </div>
                </div>

               

               {/* Career Tracks Section */}
<div className="bg-white rounded-xl shadow max-w-[1300px] mx-auto mt-6 p-6">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
    <h2 className="font-semibold text-base sm:text-lg">Career Tracks</h2>
    <div className="flex gap-2">
      <select className="border rounded-lg px-3 py-1 text-sm text-gray-600">
        <option>All Tracks</option>
        <option>Frontend</option>
        <option>Backend</option>
      </select>
      <select className="border rounded-lg px-3 py-1 text-sm text-gray-600">
        <option>Name A-Z</option>
        <option>Name Z-A</option>
        <option>Students ↑</option>
        <option>Completion ↑</option>
      </select>
    </div>
  </div>

  <table className="min-w-full text-sm text-gray-700">
    <thead>
      <tr className="border-b border-gray-200 text-gray-500 text-left">
        <th className="py-2 pr-4">DESCRIPTION</th>
        <th className="py-2 pr-4">STUDENTS</th>
        <th className="py-2 pr-4">COMPLETION RATE</th>
      </tr>
    </thead>
    <tbody>
      {[
        {
          desc: 'Complete frontend development track covering modern frameworks, responsive design, and best practices',
          students: 847,
          diff: '+23 this week',
          rate: 82,
        },
        {
          desc: 'Comprehensive backend development with databases, APIs, and cloud deployment strategies',
          students: 623,
          diff: '+18 this week',
          rate: 76,
        },
        {
          desc: 'User interface and experience design fundamentals with modern design tools and methodologies',
          students: 492,
          diff: '+31 this week',
          rate: 89,
        },
        {
          desc: 'Infrastructure automation, containerization, and cloud deployment for modern applications',
          students: 287,
          diff: '+12 this week',
          rate: 71,
        },
        {
          desc: 'Cross-platform and native mobile app development for iOS and Android platforms',
          students: 356,
          diff: '+19 this week',
          rate: 84,
        },
        {
          desc: 'Data analysis, visualization, and machine learning fundamentals for business insights',
          students: 198,
          diff: '+8 this week',
          rate: 67,
        },
      ].map((track, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          <td className="py-4 pr-4">{track.desc}</td>
          <td className="py-4 pr-4">
            <div className="font-semibold">{track.students}</div>
            <div className="text-xs text-green-600">{track.diff}</div>
          </td>
          <td className="py-4 pr-4">
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${track.rate}%` }}
                />
              </div>
              <div className="text-sm font-medium text-gray-700">{track.rate}%</div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <div className="flex justify-between mt-6 text-sm text-gray-500 items-center">
    <span>Showing 1 to 6 of 12 tracks</span>
    <div className="flex items-center gap-2">
      <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">Previous</button>
      <button className="px-3 py-1 rounded border bg-blue-600 text-white">1</button>
      <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">2</button>
      <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">Next</button>
    </div>
  </div>
</div>
                {/* Track Categories Table - Improved UI and moved to top */}
                <div className="max-w-4xl mx-auto mt-2 mb-10 bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Track Categories</h2>
                    {catLoading && <div className="text-center text-gray-500">Loading categories...</div>}
                    {catError && <div className="text-center text-red-500">{catError}</div>}
                    {!catLoading && !catError && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-gray-700">
                                <thead>
                                    <tr className="bg-blue-50 border-b">
                                        <th className="py-3 px-4 text-left rounded-tl-lg">ID</th>
                                        <th className="py-3 px-4 text-left">Name</th>
                                        <th className="py-3 px-4 text-left rounded-tr-lg">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(cat => (
                                        <tr key={cat.id} className="border-b hover:bg-blue-50 transition">
                                            <td className="py-2 px-4 font-semibold text-blue-900">{cat.id}</td>
                                            <td className="py-2 px-4">{cat.name}</td>
                                            <td className="py-2 px-4">{cat.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* Tracks Table */}
                <div className="max-w-4xl mx-auto mt-2 mb-10 bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Tracks</h2>
                    {tracksLoading && <div className="text-center text-gray-500">Loading tracks...</div>}
                    {tracksError && <div className="text-center text-red-500">{tracksError}</div>}
                    {!tracksLoading && !tracksError && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-gray-700">
                                <thead>
                                    <tr className="bg-blue-50 border-b">
                                        <th className="py-3 px-4 text-left rounded-tl-lg">Track ID</th>
                                        <th className="py-3 px-4 text-left">Name</th>
                                        <th className="py-3 px-4 text-left rounded-tr-lg">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tracks.map(track => (
                                        <tr key={track.id} className="border-b hover:bg-blue-50 transition">
                                            <td className="py-2 px-4 font-semibold text-blue-900">{track.id}</td>
                                            <td className="py-2 px-4">{track.name}</td>
                                            <td className="py-2 px-4">{track.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

    )
}