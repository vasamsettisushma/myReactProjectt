import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import ProductCard from '../ProductCard'
import './index.css'

const apiStatus = {
  intial: 'Initial',
  success: 'Success',
  failure: 'Failure',
  progress: 'Progress',
}

class PrimeDealsSection extends Component {
  state = {
    primeDeals: [],
    apinState: apiStatus.initial,
  }

  componentDidMount() {
    this.getPrimeDeals()
  }

  getPrimeDeals = async () => {
    this.setState({
      apinState: apiStatus.progress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/prime-deals'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.prime_deals.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        primeDeals: updatedData,
        apinState: apiStatus.success,
      })
    } else if (response.status === 401) {
      this.setState({
        apinState: apiStatus.failure,
      })
    }
  }

  renderPrimeDealsList = () => {
    const {primeDeals} = this.state
    return (
      <div className="products-list-container">
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        <ul className="products-list">
          {primeDeals.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderPrimeDealsFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="Register Prime"
      className="register-prime-image"
    />
  )

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apinState} = this.state
    switch (apinState) {
      case apiStatus.success:
        return this.renderPrimeDealsList()
      case apiStatus.failure:
        return this.renderPrimeDealsFailureView()

      case apiStatus.progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default PrimeDealsSection
