import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobItem = props => {
  const {jobsDetails} = props
  const {
    logoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobsDetails
  return (
    <li className="job-item1">
      <div className="title-section">
        <img
          src={logoUrl}
          className="logo-img1"
          alt="similar job company logo"
        />
        <div className="name-title">
          <h1 className="title">{title}</h1>
          <div className="star-rating">
            <AiFillStar color=" #fbbf24" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="title">Description</h1>
      <p className="description">{jobDescription}</p>
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
    </li>
  )
}
export default SimilarJobItem
