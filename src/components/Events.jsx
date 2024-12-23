import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { DeleteIcon, Edit2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

const Events = ({
	months,
	targetDate,
	setDaysPanel,
	setAddEventsPanel,
	setEdit,
	setEventForm,
	handleDeleteEvent,
	filterEvents,
	setSearchFilter,
	searchFilter,
	exportEventsAsJSON,
	exportEventsAsCSV,
	currentMonth,
	currentYear,
}) => {
	const handleEdit = (event) => {
		setEventForm(event);
		setAddEventsPanel(true);
		setDaysPanel(false);
		setEdit(true);
	};

	const handleSearchFilter = (e) => {
		setSearchFilter(e.target.value);
	};

	return (
		<div>
			<div className="my-5 flex justify-between items-center">
				<Input
					value={searchFilter}
					onChange={handleSearchFilter}
					className="text-lg font-semibold w-4/6"
					placeholder="Enter keywords to search"
				/>
				<div className="w-2/6 flex justify-center items-center gap-4">
					<Button onClick={() => exportEventsAsJSON(currentMonth, currentYear)}>
						JSON
					</Button>
					<Button onClick={() => exportEventsAsCSV(currentMonth, currentYear)}>
						CSV
					</Button>
				</div>
			</div>
			{!targetDate && (
				<h1 className="text-slate-500 text-6xl font-bold">
					Click on any date to show events
				</h1>
			)}
			{filterEvents.map((event, i) => {
				const date = new Date(event.date);
				const day = date.getDate();
				const month = date.getMonth();
				const year = date.getFullYear();
				const monthName = months[month];

				return (
					<div
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("text", JSON.stringify(event))
              console.log(
								"dragging",
								JSON.parse(e.dataTransfer.getData("text"))
							);              
            }}
						key={i}
						className={`flex justify-between w-full p-3 ${
							event.type === "work"
								? "bg-blue-600 "
								: event.type === "personal"
								? "bg-cyan-900 "
								: "bg-violet-900 "
						} gap-4 mb-6 border-4 rounded-xl border-white`}
					>
						<div className="flex flex-col items-center justify-center w-1/4 border-r-2 border-cyan-300">
							<h2 className="text-sm">{monthName + " " + day + ", " + year}</h2>
							<h3 className="font-semibold">
								{event.startTime + " - " + event.endTime}
							</h3>
						</div>
						<div className="w-full flex justify-between items-center gap-2">
							<div className="border-r-2 w-full">
								<h4 className="text-lg font-bold">{event.title}</h4>
								<h3 className="text-xs text-blue-200">
									{(event?.description.length > 0 && event.description) ||
										"No description available"}
								</h3>
							</div>
							<p className="flex flex-col gap-2">
								<span
									className="cursor-pointer"
									onClick={() => handleEdit(event)}
								>
									<Edit2 />
								</span>
								<span
									className="cursor-pointer"
									onClick={() => handleDeleteEvent(event.id)}
								>
									<Trash2 />
								</span>
							</p>
						</div>
					</div>
				);
			})}
			{filterEvents.length <= 0 && (
				<h1 className="text-slate-500 text-6xl font-bold">No Events</h1>
			)}
		</div>
	);
};

export default Events;
