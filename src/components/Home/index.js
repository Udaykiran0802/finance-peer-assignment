import {Component} from 'react'
import ReactFileReader from 'react-file-reader'
import Cookies from 'js-cookie'
import Header from '../Header'
import PostData from '../PostData'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  isLoading: 'LOADING',
  deleted: 'DELETED',
}

class Home extends Component {
  state = {
    postApiStatus: apiStatusConstants.initial,
    fileName: '',
    uploadData: [],
    showPostData: false,
    getApiStatus: apiStatusConstants.initial,
    fetchedData: [],
  }

  componentDidMount() {
    this.getPostsData()
  }

  toggleShowData = () => {
    this.setState(prevState => ({showPostData: !prevState.showPostData}))
  }

  getPostsData = async () => {
    this.setState({
      getApiStatus: apiStatusConstants.isLoading,
      postApiStatus: apiStatusConstants.initial,
    })
    const url = 'https://financepeer-node-js.herokuapp.com/posts'
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      this.setState({
        fetchedData: data,
        getApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({getApiStatus: apiStatusConstants.failure})
    }
  }

  sendingData = async () => {
    this.setState({postApiStatus: apiStatusConstants.isLoading})
    const {uploadData} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://financepeer-node-js.herokuapp.com/data'
    const options = {
      method: 'POST',
      body: JSON.stringify(uploadData),
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      this.setState(
        {
          postApiStatus: apiStatusConstants.success,
          showPostData: true,
        },
        this.getPostsData,
      )
    } else {
      this.setState({postApiStatus: apiStatusConstants.failure})
    }
  }

  clearData = async () => {
    this.setState({getApiStatus: apiStatusConstants.isLoading})
    const url = 'https://financepeer-node-js.herokuapp.com/data'
    const options = {
      method: 'DELETE',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      console.log('Deleted')
      this.setState({getApiStatus: apiStatusConstants.deleted})
    }
  }

  fileHandling = files => {
    console.log('upload button clicked')
    const {name} = files[0]

    const reader = new FileReader()
    reader.onload = () => {
      const data = JSON.parse(reader.result)
      const modifiedData = data.map(each => ({
        user_id: each.userId,
        id: each.id,
        title: each.title,
        body: each.body,
      }))

      console.log(modifiedData)
      this.setState(
        {fileName: name, uploadData: modifiedData},
        this.sendingData,
      )
    }
    reader.readAsText(files[0])
  }

  renderUploadingFileStatus = () => {
    const {postApiStatus, fileName} = this.state
    switch (postApiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <p className="in-progress">
            Your file <span className={{fontWeight: 'bold'}}>{fileName} </span>
            is uploading...
          </p>
        )
      case apiStatusConstants.success:
        return <p className="success">Uploaded SuccessFully!</p>
      case apiStatusConstants.failure:
        return <p className="failure">Uploading Failed Please Try Again</p>
      default:
        return null
    }
  }

  render() {
    const {showPostData, getApiStatus, fetchedData} = this.state

    return (
      <>
        <Header />
        {showPostData ? (
          <PostData
            showData={showPostData}
            getApiStatus={getApiStatus}
            fetchedData={fetchedData}
            clearData={this.clearData}
            toggleShowData={this.toggleShowData}
          />
        ) : (
          <div className="home-container">
            <div className="home-content">
              <h1 className="home-heading">JSON FILE UPLOADER</h1>
              <img
                src="http://res.cloudinary.com/tastykitchen/image/upload/v1641735720/image-260nw-1407040865_sv8dyx.jpg"
                alt="clothes to be noticed"
                className="home-mobile-img"
              />
              <h3 className="home-description">
                Click On Upload button To upload JSON File
              </h3>
              <div className="react-file-reader-container">
                <ReactFileReader handleFiles={this.fileHandling}>
                  <button type="button" className="upload-button">
                    UploadJSON File
                  </button>
                </ReactFileReader>
              </div>
              {this.renderUploadingFileStatus()}
            </div>

            <img
              src="http://res.cloudinary.com/tastykitchen/image/upload/v1641735983/json-file-document-icon-vector-24672092_gyivuk.jpg"
              alt="dresses to be noticed"
              className="home-desktop-img"
            />
          </div>
        )}
      </>
    )
  }
}
export default Home
