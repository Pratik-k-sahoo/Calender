import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "./ui/button";
import AddEvents from "./AddEvents";
import Events from "./Events";
import Weekdays from "./Weekdays";
import Days from "./Days";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
	"January",
	"Febuary",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function Calender({ currentDate }) {
	const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
	const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
	const [targetDate, setTargetDate] = useState({
		day: currentDate.getDate(),
		date: new Date(currentYear, currentMonth, currentDate.getDate()),
		month: currentMonth,
		year: currentYear,
	});

	useEffect(() => {
		setCurrentMonth(currentDate.getMonth());
		setCurrentYear(currentDate.getFullYear());
	}, [currentDate]);


	const [searchFilter, setSearchFilter] = useState("");

	const [events, setEvents] = useState([]);
	const [filterEvents, setFilterEvents] = useState(events);
	const [eventForm, setEventForm] = useState({
		id: events.length + 1 || 0,
		title: "",
		date: new Date(currentYear, currentMonth, currentDate.getDate()),
		startTime: "",
		endTime: "",
		description: "",
		type: "",
	});
	const [edit, setEdit] = useState(false);

  
  useEffect(() => {
		setTargetDate({
			day: currentDate.getDate(),
			date: new Date(currentYear, currentMonth, currentDate.getDate()),
			month: currentMonth,
			year: currentYear,
		});
    setEventForm({
			id: "",
			title: "",
			date: new Date(currentYear, currentMonth, currentDate.getDate()),
			startTime: "",
			endTime: "",
			description: "",
			type: "",
		});
	}, [currentMonth, currentYear]);

	const [daysPanel, setDaysPanel] = useState(true);
	const [addEventsPanel, setAddEventsPanel] = useState(false);
	const daysPanelRef = useRef(null);
	const addEventsPanelRef = useRef(null);

	const prevMonth = () => {
		setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
		setCurrentYear((prevYear) =>
			currentMonth === 0 ? prevYear - 1 : prevYear
		);
	};

	const nextMonth = () => {
		setCurrentMonth((nextMonth) => (nextMonth === 11 ? 0 : nextMonth + 1));
		setCurrentYear((nextYear) =>
			currentMonth === 11 ? nextYear + 1 : nextYear
		);
	};

	const handleAddEventPanel = () => {
		setAddEventsPanel(true);
		setDaysPanel(false);
	};

	const handleDeleteEvent = (id) => {
		const updatedEvents = events.filter((event) => event.id !== id);
		localStorage.setItem("events", JSON.stringify(updatedEvents));
		setEvents(updatedEvents);
	};

	useGSAP(() => {
		if (daysPanel) {
			gsap.to(daysPanelRef.current, {
				ease: "power4.inOut",
				display: "block",
				opacity: "1",
			});
		} else {
			gsap.to(daysPanelRef.current, {
				ease: "power4.inOut",
				display: "none",
				opacity: "0",
			});
		}

		if (addEventsPanel) {
			gsap.to(addEventsPanelRef.current, {
				ease: "power4.inOut",
				display: "block",
				opacity: "1",
			});
		} else {
			gsap.to(addEventsPanelRef.current, {
				ease: "power4.inOut",
				display: "none",
				opacity: "0",
			});
		}
	}, [daysPanel, addEventsPanel]);

	useEffect(() => {
		if (localStorage.getItem("events")) {
			setEvents(JSON.parse(localStorage.getItem("events")));
		}
	}, []);

	useEffect(() => {
		if (events) {
			if (searchFilter.length > 0) {
				setFilterEvents(
					events.filter((event) => {
						const date = new Date(event.date);
						const target = new Date(targetDate.date);

						return (
							date.toString() === target.toString() &&
							(event.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
								event.description
									.toLowerCase()
									.includes(searchFilter.toLowerCase()))
						);
					})
				);
			} else {
				setFilterEvents(
					events.filter((event) => {
						const date = new Date(event?.date);
						const target = new Date(targetDate?.date);
						return date.toString() === target.toString();
					})
				);
			}
		}
	}, [targetDate, events, searchFilter]);

	function exportEventsAsJSON(month, year) {
		const filteredEvents = events.filter((event) => {
			const eventDate = new Date(event.date);
			return eventDate.getMonth() === month && eventDate.getFullYear() === year;
		});

		const json = JSON.stringify(filteredEvents, null, 2);

		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `events-${year}-${month + 1}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	function exportEventsAsCSV(month, year) {
		const filteredEvents = events.filter((event) => {
			const eventDate = new Date(event.date);
			return eventDate.getMonth() === month && eventDate.getFullYear() === year;
		});

		const csvRows = [
			["ID", "Title", "Date", "Start Time", "End Time", "Description"],
			...filteredEvents.map((event) => [
				event.id,
				event.title,
				new Date(event.date).toLocaleDateString(),
				event.startTime,
				event.endTime,
				event.description,
			]),
		];

		const csvContent = csvRows.map((row) => row.join(",")).join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `events-${year}-${month + 1}.csv`;
		link.click();
		URL.revokeObjectURL(url);
	}

	return (
		<>
			<div className="bg-slate-800 w-screen h-screen p-10 overflow-auto flex gap-10">
				<div className="w-1/3 border-8 border-zinc-500 rounded-3xl p-5">
					<h1 className="text-7xl text-white font-bold">CALENDER</h1>
					<div className="flex justify-between items-center mt-10 mb-6">
						<h3 className="text-xl text-zinc-300 font-semibold">
							{months[currentMonth] + ", " + currentYear}
						</h3>
						<div className="flex gap-4 items-center">
							<Button onClick={prevMonth}>{"<"}</Button>
							<Button onClick={nextMonth}>{">"}</Button>
							<Button
								onClick={handleAddEventPanel}
								className="bg-transparent drop-shadow-2xl border border-gray-900 hover:bg-slate-900"
							>
								{"+"}
							</Button>
						</div>
					</div>
					<Weekdays weekdays={weekdays} />
					<div className="overflow-hidden pb-4 max-h-[24.42rem] rounded-3xl">
						<div ref={daysPanelRef}>
							<Days
								setTargetDate={setTargetDate}
								currentDate={currentDate}
								currentMonth={currentMonth}
								currentYear={currentYear}
								firstDayOfMonth={firstDayOfMonth}
								daysInMonth={daysInMonth}
								daysPanel={daysPanel}
								setDaysPanel={setDaysPanel}
								setAddEventsPanel={setAddEventsPanel}
								setEventForm={setEventForm}
								targetDate={targetDate}
								events={events}
								setEvents={setEvents}
							/>
						</div>
						<div ref={addEventsPanelRef} className="">
							<AddEvents
								setDaysPanel={setDaysPanel}
								setAddEventsPanel={setAddEventsPanel}
								setEventForm={setEventForm}
								eventForm={eventForm}
								edit={edit}
								events={events}
								setEvents={setEvents}
								currentYear={currentYear}
								currentMonth={currentMonth}
								currentDate={currentDate}
								filterEvents={filterEvents}
								setEdit={setEdit}
							/>
						</div>
					</div>
				</div>
				<div className="w-2/3 text-white">
					<Events
						months={months}
						targetDate={targetDate}
						setDaysPanel={setDaysPanel}
						setAddEventsPanel={setAddEventsPanel}
						setEdit={setEdit}
						setEventForm={setEventForm}
						filterEvents={filterEvents}
						handleDeleteEvent={handleDeleteEvent}
						searchFilter={searchFilter}
						setSearchFilter={setSearchFilter}
						exportEventsAsCSV={exportEventsAsCSV}
						exportEventsAsJSON={exportEventsAsJSON}
						currentMonth={currentMonth}
						currentYear={currentYear}
					/>
				</div>
			</div>
		</>
	);
}

export default Calender;
