import React from 'react'
import './Weather.css'

const Weather = () => {
  return (
    <div className="weather">
        <div className="search-bar">
            <form id="search-location">
                <input type="text" id="city" placeholder="Enter City Name"></input>
                <button type="submit">Search</button>
            </form>
        </div>
        <p className='temp'>70°F</p>
        <p className='location'>Austin</p>

    </div>
  )
}

export default Weather