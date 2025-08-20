import { useState, useEffect } from 'react';
import '../styles/PlusMinusRange.scss';

function PlusMinusRange({ label, rangeId, min, max, step, defaultValue, onChange, onUp, onDown }) {
  const [localValue, setLocalValue] = useState(parseFloat(defaultValue));

  useEffect(() => {
    setLocalValue(parseFloat(defaultValue));
  }, [defaultValue]);

  const handleRangeChange = (event) => {
    const nextValue = parseFloat(event.target.value);
    setLocalValue(nextValue);
    if (onChange) onChange(event);
  };

  const stepNum = parseFloat(step);
  const minNum = parseFloat(min);
  const maxNum = parseFloat(max);

  const clamp = (value) => Math.min(Math.max(value, minNum), maxNum);

  const handleDown = () => {
    setLocalValue((prev) => {
      const next = clamp(prev - stepNum);
      if (onDown) onDown(next);
      return next;
    });
  };

  const handleUp = () => {
    setLocalValue((prev) => {
      const next = clamp(prev + stepNum);
      if (onUp) onUp(next);
      return next;
    });
  };

  return (
    <>
      <div className="plusminus__text">
        <label className="plusminus__text-label">{label}</label>
        <span className="plusminus__text-value">{parseFloat(localValue).toFixed(2)}</span>
      </div>
      <div className="plusminus__inputs">
        <input type="button" value={'-'} onClick={handleDown} />
        <input id={rangeId} type="range" min={min} max={max} step={step} value={localValue} onChange={handleRangeChange} />
        <input type="button" value={'+'} onClick={handleUp} />
      </div>
    </>
  );
}

export default PlusMinusRange;
