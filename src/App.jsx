import React, { useEffect, useState } from "react";
import Calender from "./components/Calender";

const App = () => {
	const [currentDate, setCurrentDate] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentDate(new Date());
		}, 1000);
		return () => clearInterval(interval);
	});
	return (
		<div>
			<Calender currentDate={currentDate} />
		</div>
	);
};

export default App;
