import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  isLoading: 'LOADING',
  deleted: 'DELETED',
}

const PostData = props => {
  const onClickClearData = () => {
    const {clearData} = props
    clearData()
  }

  const uploadAgainButton = () => {
    const {toggleShowData} = props
    toggleShowData()
  }

  const renderGettingPostStatus = () => {
    const {getApiStatus, fetchedData} = props
    switch (getApiStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div className="react-loader-spinner">
            <Loader height="50" width="50" color="blue" type="ThreeDots" />
          </div>
        )
      case apiStatusConstants.success:
        return fetchedData.length > 0 ? (
          <div>
            <h1 className="output-heading">Uploaded Data</h1>
            <p className="total-posts">
              Total Posts:{' '}
              <span className="total-posts-span">{fetchedData.length}</span>
            </p>
            <ul className="posts-container">
              {fetchedData.map(each => (
                <li key={each.id} className="post-container">
                  <div className="image-user-container">
                    <img
                      className="card-image"
                      src="https://res.cloudinary.com/tastykitchen/image/upload/v1641827542/e27c8735da98ec6ccdcf12e258b26475_jqdhyy.jpg"
                      alt={`user ${each.userId}`}
                    />
                    <h1 className="username">User:{each.userId}</h1>
                  </div>

                  <div>
                    <h1 className="card-title">{each.title}</h1>
                    <p className="card-body">{each.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <hr className="middle-line" />
            <div className="clear-container">
              <p className="home-description">
                To Clear (or) Delete Data in The Db Click On Clear button
              </p>
              <button
                type="button"
                className="clear-button"
                onClick={onClickClearData}
              >
                Clear Data base
              </button>
            </div>
          </div>
        ) : (
          <p className="home-description">
            No Posts are there Please upload a file to see posts
          </p>
        )
      case apiStatusConstants.failure:
        return (
          <p className="home-description failure">
            Fetching Failed Please Try Again
          </p>
        )
      case apiStatusConstants.deleted:
        return (
          <div>
            <img
              className="no-data-found"
              src="https://assets.ccbp.in/frontend/react-js/not-found-blog-img.png"
              alt="no-data-found"
            />
            <p className="home-description failure">
              Data base is cleared and you can upload json file again to see
              data
            </p>

            <button
              type="button"
              className="upload-button"
              onClick={uploadAgainButton}
            >
              Upload Again
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="result-container">{renderGettingPostStatus()}</div>
    </>
  )
}

export default PostData
