import React from "react";

const Days = ({
	firstDayOfMonth,
	daysInMonth,
	currentDate,
	currentMonth,
	currentYear,
	setEventForm,
	setTargetDate,
	targetDate,
	events,
}) => {
	return (
		<div
			className={`grid grid-cols-7 justify-items-center items-center  text-white gap-y-10 mt-6`}
		>
			{[
				...Array(firstDayOfMonth)
					.keys()
					.map((_, index) => <span key={index} />),
			]}
			{[
				...Array(daysInMonth)
					.keys()
					.map((day, index) => (
						<span
							onClick={() => {
								setTargetDate({
									day: day + 1,
									date: new Date(currentYear, currentMonth, day + 1),
									month: currentMonth,
									year: currentYear,
								});
								setEventForm({
									id: events.length + 1 || 0,
									title: "",
									startTime: "",
									endTime: "",
									description: "",
									date: new Date(currentYear, currentMonth, day + 1),
								});
							}}
							className={`${
								targetDate?.day == day + 1 &&
                targetDate?.day != currentDate.getDate() &&
								targetDate?.month == currentMonth &&
								targetDate?.year == currentYear
									? "bg-slate-600 bg-opacity-35"
									: null
							} ${
								day + 1 === currentDate.getDate() &&
								currentYear === currentDate.getFullYear() &&
								currentMonth === currentDate.getMonth()
									? "bg-green-600 shadow-gray-600 shadow-xl text-gray-900 font-bold hover:bg-green-700 hover:shadow-xl hover:shadow-zinc-600"
									: null
							} p-2 w-[38px] h-[38px] cursor-pointer hover:bg-slate-700 hover:shadow-lg hover:shadow-zinc-600 text-center rounded-full `}
							key={index}
						>
							{day + 1}
						</span>
					)),
			]}
		</div>
	);
};

export default Days;
