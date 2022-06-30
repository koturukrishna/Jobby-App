import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const JobCard = props => {
  const {jobDetails} = props

  const {
    logoUrl,
    id,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`} className="nav-link">
      <li className="job-item">
        <div className="title-section">
          <img src={logoUrl} className="logo-img1" alt="company logo" />
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
        <h1 className="title">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
