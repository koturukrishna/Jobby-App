import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  console.log(jwtToken)
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="container">
          <h1 className="title2">Find The job That Fits Your Life</h1>
          <p className="description2">
            Millions of people are searching for jobs,salary,
            information,reviews, Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs">
            <button type="button" className="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home
