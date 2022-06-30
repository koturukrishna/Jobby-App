import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: {},
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiJobStatusConstants.initial,
    searchInput: '',
    checkboxInput: [],
    radioInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = data.profile_details
      const profileData = {
        name: fetchedData.name,
        profileImage: fetchedData.profile_image_url,
        shortBio: fetchedData.short_bio,
      }
      console.log(profileData)
      this.setState({profileData, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsList = async () => {
    this.setState({apiJobStatus: apiJobStatusConstants.inProgress})
    const {checkboxInput, searchInput, radioInput} = this.state
    console.log(checkboxInput)
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInput}&minimum_package=${radioInput}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch(jobsApiUrl, options)
    if (response.ok === true) {
      const fetchedJobs = await response.json()
      const updatedJobs = fetchedJobs.jobs.map(job => ({
        logoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobsList: updatedJobs,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiJobStatusConstants.failure})
    }
  }

  renderProfile = () => {
    const {profileData} = this.state
    const {name, profileImage, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImage} className="profile-img" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-role">{shortBio}</p>
      </div>
    )
  }

  onRetryProfile = () => {
    this.getProfileDetails()
  }

  renderProfileFailure = () => (
    <div className="failure-profile-container">
      <button type="button" className="btn" onClick={this.onRetryProfile}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfile()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  onGoBackJobs = () => {
    this.getJobsList()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="button" type="button" onClick={this.onGoBackJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    const noJobs = jobsList.length === 0
    return noJobs ? (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="failure-heading">No Jobs Found</h1>
        <p className="failure-para">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    ) : (
      <ul className="jobs-list">
        {jobsList.map(eachJob => (
          <JobCard jobDetails={eachJob} key={eachJob.id} />
        ))}
      </ul>
    )
  }

  onEnterSearchKey = event => {
    if (event.key === 'Enter') {
      this.getJobsList()
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearch = () => {
    this.getJobsList()
  }

  renderSearchInput = () => {
    const {searchInput} = this.state
    console.log(searchInput)
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchKey}
        />
        <button
          type="button"
          className="search-button"
          testid="searchButton"
          onClick={this.onSubmitSearch}
        >
          <AiOutlineSearch className="search-icon" />
        </button>
      </div>
    )
  }

  onChangeRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.getJobsList)
  }

  renderViews = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiJobStatusConstants.success:
        return this.renderJobsList()
      case apiJobStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiJobStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeInput = event => {
    const {checkboxInput} = this.state
    const noInput = checkboxInput.filter(
      eachItem => eachItem === event.target.id,
    )
    if (noInput.length === 0) {
      this.setState(
        prevState => ({
          checkboxInput: [...prevState.checkboxInput, event.target.id],
        }),
        this.getJobsList,
      )
    } else {
      const filteredData = checkboxInput.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        prevState => ({checkboxInput: filteredData}),
        this.getJobsList,
      )
    }
  }

  render() {
    const {employmentType} = this.state
    console.log(employmentType)
    return (
      <div>
        <Header />
        <div className="jobs-container">
          <div className="filter-section">
            {this.renderProfileStatus()}
            <hr />
            <h1 className="types-of-employee">Type of Employment</h1>
            <ul className="list">
              {employmentTypesList.map(employment => (
                <li
                  className="checkbox-input"
                  key={employment.employmentTypeId}
                >
                  <input
                    type="checkbox"
                    id={employment.employmentTypeId}
                    onChange={this.onChangeInput}
                  />
                  <label
                    className="input"
                    htmlFor={employment.employmentTypeId}
                  >
                    {employment.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 className="types-of-employee">Salary Range</h1>
            <ul>
              {salaryRangesList.map(salary => (
                <li className="checkbox-input" key={salary.salaryRangeId}>
                  <input
                    type="radio"
                    id={salary.salaryRangeId}
                    value={salary.label}
                    name="option"
                    onChange={this.onChangeRadioOption}
                  />
                  <label htmlFor={salary.salaryRangeId} className="input">
                    {salary.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="jobs-section">
            {this.renderSearchInput()}
            {this.renderViews()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
