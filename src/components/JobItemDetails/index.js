import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobsData: {},
    skills: [],
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jobsDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsDetailsApiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobsData = data.job_details
      const lifeAtCompany = data.job_details.life_at_company

      const jobsDetails = {
        companyLogoUrl: jobsData.company_logo_url,
        companyWebsiteUrl: jobsData.company_website_url,
        employmentType: jobsData.employment_type,
        id: jobsData.id,
        jobDescription: jobsData.job_description,
        imgUrl: lifeAtCompany.image_url,
        description: lifeAtCompany.description,
        location: jobsData.location,
        packagePerAnnum: jobsData.package_per_annum,
        rating: jobsData.rating,
        title: jobsData.title,
      }
      const skillsData = data.job_details.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))

      console.log(skillsData)
      const similarJobs = data.similar_jobs.map(job => ({
        logoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      console.log(jobsDetails)
      console.log(similarJobs)
      this.setState({
        jobsData: jobsDetails,
        skills: skillsData,
        similarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetails = () => {
    const {jobsData, skills, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      title,
      jobDescription,
      imgUrl,
      description,
      location,
      packagePerAnnum,
      rating,
    } = jobsData
    return (
      <div>
        <div className="job-item">
          <div className="title-section">
            <img
              src={companyLogoUrl}
              className="logo-img1"
              alt="job details company logo"
            />
            <div className="name-title">
              <h1 className="title">{title}</h1>
              <div className="star-rating">
                <AiFillStar color=" #fbbf24" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-sa">
            <div className="location-type">
              <div className="location-icon">
                <MdLocationOn color="#f8fafc" />
                <p className="type">{location}</p>
              </div>
              <div className="location-icon">
                <BsBriefcaseFill color="#f8fafc" />
                <p className="type">{employmentType}</p>
              </div>
            </div>
            <p className="type">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="visit-section">
            <h1 className="title">Description</h1>
            <a href={companyWebsiteUrl} className="visit">
              Visit
              <BiLinkExternal />
            </a>
          </div>
          <p className="description">{jobDescription}</p>
          <h1 className="title">Skills</h1>
          <ul className="skills-list">
            {skills.map(eachSkill => (
              <li className="skill-item" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  className="skill-image"
                  alt={eachSkill.name}
                />
                <h1 className="skill-name">{eachSkill.name}</h1>
              </li>
            ))}
          </ul>
          <h1 className="title">life at Company</h1>
          <div className="life-at-company">
            <p className="para">{description}</p>
            <img src={imgUrl} className="location-img" alt="life at company" />
          </div>
        </div>

        <h1 className="similar-title">Similar Jobs</h1>
        <ul className="similar-job-list">
          {similarJobs.map(eachJob => (
            <SimilarJobItem jobsDetails={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onGoBackJobs = () => {
    this.getJobDetails()
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

  renderSuccessView = () => (
    <div className="job-item-container">{this.renderJobDetails()}</div>
  )

  renderViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-item-container">{this.renderViews()}</div>
      </div>
    )
  }
}
export default JobItemDetails
