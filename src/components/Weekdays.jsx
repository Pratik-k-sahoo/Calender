import React from 'react'

const Weekdays = ({ weekdays }) => {
	return (
		<div className="grid grid-cols-7 justify-items-center items-center  text-slate-400">
			{
        weekdays.map((day, index) => (
          <h5 key={index}>{day}</h5>
        ))
      }
		</div>
	);
};

export default Weekdays