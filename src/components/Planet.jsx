import { useState, memo } from 'react';
import '../styles/Planet.scss';

function Planet({ styleVariables }) {

  const [classes, setClasses] = useState('planet');

  function handleClick() {
    if (classes == 'planet') {
      setClasses('planet planet--clicked');
    } else {
      setClasses('planet');
    }
  }

  return (
    <div className={classes} style={styleVariables} onClick={handleClick}>
      <div className="planet__wrapper">
        <div className="planet__inner planet-sizer">
          <div className="planet__continent-edges planet-sizer"></div>
          <div className="planet__oceans planet-sizer"></div>
          <div className="planet__detail planet-sizer"></div>
        </div>
        <div className="planet__atmosphere planet-sizer">
          <div className="planet__atmosphere-inner planet-sizer"></div>
        </div>
        <div className="planet__shadow planet-sizer">
          <div className="planet__shadow-inner planet-sizer"></div>
        </div>
      </div>
    </div>
  );
}

export default memo(Planet);
