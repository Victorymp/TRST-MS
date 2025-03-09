import { useState } from 'react';
import TrostAgent from './components/TrostAgent';
import TrostButton from './components/TrostButton';
import './styles/globals.css';
import './styles/Home.module.css';
import './styles/landing.css';
import './styles/main.css';

function importAll(r) {
  return r.keys().map(r);
}

function App() {
  const carImages = importAll(require.context('./images/cars', false, /\.(png|jpe?g|svg)$/));
  const [currentCar, setCurrentCar] = useState(0);
  const nextCar = () => {
    if (currentCar < carImages.length - 1) {
      setCurrentCar(currentCar + 1);
      console.log(currentCar);
    } else {
      setCurrentCar(0);
    }
  }
  const backCar = () => {
    if (currentCar > 0) {
      setCurrentCar(currentCar - 1);
      console.log(currentCar);
    } else {
      setCurrentCar(carImages.length - 1);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="dashboard">
        <div className='item'>
          <h1>TRST</h1>
          <div className='item-content'>
            <img src={carImages[currentCar]} alt='cars'/>
            <div className='navigation-buttons'>
              <button id='next' onClick={() => nextCar()}>Next</button>
              <button id='back' onClick={() => backCar()}>Back</button>
            </div>
            <div className='item-text'>

            </div>
          </div>
        </div>
        <div className='button-group'>
          <TrostAgent />
          <TrostButton />
        </div>
      </div>
    </div>
  );
}

export default App;
