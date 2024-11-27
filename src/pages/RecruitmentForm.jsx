import { useState, useEffect } from "react";
import {
  UserCircle,
  Book,
  Trophy,
  Calendar,
  Contact,
  Video,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecruitmentForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    graduationYear: '',
    gpa: '',
    major: '',
    sport: '',
    team: '',
    position: '',
    yearsOfExperience: '',
    achievements: '',
    email: '',
    phoneNumber: '',
    additionalComments: '',
  });

  // Fetch sports and teams on component mount
  useEffect(() => {
    const fetchSportsAndTeams = async () => {
      try {
        // Fetch Sports
        const sportsResponse = await fetch("/api/sports/get_sports");
        const sportsData = await sportsResponse.json();
        setSports(sportsData);
  
        // Fetch Teams
        const teamsResponse = await fetch("/api/recruit/get_teams");
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching sports and teams:', error);
      }
    };
  
    fetchSportsAndTeams();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'sport') {
      setSelectedSport(value ? parseInt(value) : '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stepValidations = [
      validatePersonalInfo(),
      validateAcademicInfo(),
      validateAthleticInfo(),
      validateContactInfo()
    ];

    if (!stepValidations.every(valid => valid)) {
      alert('Please fill in all required fields in each section.');
      return;
    }
    
    // Create FormData object to send files
    const formSubmissionData = new FormData();
    
    // Append all form data
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        formSubmissionData.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch("/api/recruit/submit_recruitment", {
        method: 'POST',
        body: formSubmissionData
      });

      // Log the raw response text before parsing
      const responseText = await response.text();
      console.log('Raw Response:', responseText);

      // Check for non-200 status codes
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Try to parse the response
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Failed to parse JSON response: ' + responseText);
      }

      if (result.status === 'success') {
        navigate('/recruit');
        alert('Application submitted successfully!');
        // Reset form or navigate to a success page
      } else {
        alert('Application submission failed: ' + result.message);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting the application: ' + error.message);
    }
  };

  // Validation functions for each step
  const validatePersonalInfo = () => {
    return formData.firstName && formData.lastName && 
           formData.dateOfBirth && formData.gender && 
           formData.height && formData.weight;
  };

  const validateAcademicInfo = () => {
    return formData.graduationYear && formData.gpa;
  };

  const validateAthleticInfo = () => {
    return formData.sport && formData.team && 
           formData.position && formData.yearsOfExperience;
  };

  const validateContactInfo = () => {
    return formData.email && formData.phoneNumber;
  };

  const handleNextStep = (e) => {
    // Prevent default form submission
    if (e) {
      e.preventDefault();
    }
  
    // Validate the current step before proceeding
    let isValid = false;
    switch(currentStep) {
      case 1:
        isValid = validatePersonalInfo();
        break;
      case 2:
        isValid = validateAcademicInfo();
        break;
      case 3:
        isValid = validateAthleticInfo();
        break;
      case 4:
        isValid = validateContactInfo();
        break;
      case 5:
        isValid = true; // Last step is optional
        break;
      default:
        isValid = false;
    }
  
    if (isValid) {
      setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < currentStep ? "text-red-800" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index < currentStep
                      ? "border-red-800 bg-red-800 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      index < currentStep - 1 ? "bg-red-800" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-sm rounded-lg p-8"
        >
          {/* Personal Information - Step 1 */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center mb-6">
                <UserCircle className="w-6 h-6 text-red-800 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender*
                  </label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)*
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    min={0}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)*
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    min={30}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Academic Information - Step 2 */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center mb-6">
                <Book className="w-6 h-6 text-red-800 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Academic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Graduation Year*
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    min="2024"
                    max="2030"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA*
                  </label>
                  <input
                    type="number"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    max="4"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Major
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Athletic Information - Step 3 */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center mb-6">
                <Trophy className="w-6 h-6 text-red-800 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Athletic Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Sport*
                  </label>
                  <select
                    name="sport"
                    value={formData.sport}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  >
                    <option value="">Select Sport</option>
                    {sports.map((sport) => (
                      <option key={sport.id} value={sport.id}>
                        {sport.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team*
                  </label>
                  <select
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.sportName})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position/Event*
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience*
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Athletic Achievements
                  </label>
                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                    placeholder="List your key athletic achievements, awards, and records..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Information - Step 4 */}
          {currentStep === 4 && (
            <div>
              <div className="flex items-center mb-6">
                <Contact className="w-6 h-6 text-red-800 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Contact Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Phone Number*
                  </label>
                  <input
                    type='tel'
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800'
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Materials - Step 5 */}
          {currentStep === 5 && (
            <div>
              <div className='flex items-center mb-6'>
                <Upload className='w-6 h-6 text-red-800 mr-2' />
                <h2 className='text-2xl font-bold text-gray-900'>
                  Additional Materials
                </h2>
              </div>


              <div className='grid grid-cols-1 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Additional Comments
                  </label>
                  <textarea
                    name='additionalComments'
                    value={formData.additionalComments}
                    onChange={handleInputChange}
                    rows='4'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800'
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button" 
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className={`px-6 py-2 rounded-md font-medium ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              disabled={currentStep === 1}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button" 
                onClick={(e) => handleNextStep(e)}
                className="px-6 py-2 bg-red-800 text-white rounded-md font-medium hover:bg-red-900"
              >
                Next
              </button>
            ) : (
              <button
                type="submit" 
                className="px-6 py-2 bg-red-800 text-white rounded-md font-medium hover:bg-red-900"
              >
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruitmentForm;
