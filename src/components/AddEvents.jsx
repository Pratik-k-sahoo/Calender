import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";


const AddEvents = ({
	setAddEventsPanel,
	setDaysPanel,
	setEventForm,
	eventForm,
	edit,
	events,
	setEvents,
	currentYear,
	currentMonth,
	filterEvents,
	currentDate,
	setEdit,
}) => {
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("eventForm", eventForm);
		const formData = {
			...eventForm,
			id: edit ? eventForm.id : events[events?.length - 1]?.id + 1 || 0,
		};

		console.log("formData", formData);
		const intervals = filterEvents.map((event) => [
			event.startTime,
			event.endTime,
		]);

		function convertTimeToNumber(time) {
			const hours = Number(time.split(":")[0]);
			const minutes = Number(time.split(":")[1]) / 60;
			return hours + minutes;
		}

		function sortIntervals(intervals) {
			return intervals.sort((intA, intB) => {
				const startA = convertTimeToNumber(intA[0]);
				const endA = convertTimeToNumber(intA[1]);

				const startB = convertTimeToNumber(intB[0]);
				const endB = convertTimeToNumber(intB[1]);

				if (startA > endB) {
					return 1;
				}

				if (startB > endA) {
					return -1;
				}

				return 0;
			});
		}

		function isOverlapping(intervals, newInterval) {
			const a = convertTimeToNumber(newInterval[0]);
			const b = convertTimeToNumber(newInterval[1]);

			for (const interval of intervals) {
				const c = convertTimeToNumber(interval[0]);
				const d = convertTimeToNumber(interval[1]);

				if (a < d && b > c) {
					console.log("This one overlap: ", newInterval);
					console.log("with interval: ", interval);
					console.log("----");
					return true;
				}
			}

			return false;
		}

		function isGoodInterval(interval) {
			let good = false;

			if (interval.length === 2) {
				// If you want you can also do extra check if this is the same day
				const start = convertTimeToNumber(interval[0]);
				const end = convertTimeToNumber(interval[1]);

				if (start < end) {
					good = true;
				}
			}

			return good;
		}

		if (!edit) {
			sortIntervals(intervals);
			if (!isGoodInterval([formData.startTime, formData.endTime])) {
				alert("Please enter a valid time range.");
				return;
			}

			if (isOverlapping(intervals, [formData.startTime, formData.endTime])) {
				alert(
					"This event overlaps with an existing one. Please choose a different time range."
				);
				return;
			}
			if (localStorage.getItem("events")) {
				localStorage.setItem(
					"events",
					JSON.stringify([
						...JSON.parse(localStorage?.getItem("events")),
						formData,
					])
				);
			} else {
				localStorage.setItem("events", JSON.stringify([formData]));
			}
		} else {
			const updatedEvents = events.map((event) =>
				event.id === formData.id ? formData : event
			);
			console.log("EDITED", updatedEvents);
			localStorage.setItem("events", JSON.stringify(updatedEvents));
			setEdit(false);
		}
		setAddEventsPanel(false);
		setDaysPanel(true);
		setEventForm({
			id: events.length + 1 || 0,
			title: "",
			date: new Date(currentYear, currentMonth, currentDate.getDate()),
			startTime: "",
			endTime: "",
			description: "",
		});
		setEvents(JSON.parse(localStorage.getItem("events")));
	};

	return (
		<div className={`bg-slate-950 p-6 rounded-3xl mt-4`}>
			<div className="flex flex-col gap-5 items-center relative">
				<div className="flex justify-end items-start absolute top-0 right-0">
					<Button
						size="sm"
						variant="ghost"
						className="text-white"
						onClick={() => {
							setDaysPanel(true);
							setAddEventsPanel(false);
							setEventForm({
								id: events.length + 1 || 0,
								title: "",
								date: new Date(
									currentYear,
									currentMonth,
									currentDate.getDate()
								),
								startTime: "",
								endTime: "",
								description: "",
							});
						}}
					>
						X
					</Button>
				</div>
				<div className="h-1/2 w-2/3">
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex gap-2 justify-between items-center text-white">
							<h6>Title:</h6>
							<Input
								placeholder="EVENT TITLE"
								className="w-2/3 border-sky-400 border-2 outline-double outline-cyan-300 "
								value={eventForm.title}
								onChange={(e) => {
									console.log(eventForm.date);
									setEventForm({ ...eventForm, title: e.target.value });
								}}
							/>
						</div>
						<div className="flex gap-2 justify-between items-center text-white">
							<h6>Start time: </h6>
							<Input
								type="time"
								placeholder="START TIME (AM/PM)"
								value={eventForm.startTime}
								className="w-2/3 border-sky-400 border-2 outline-double outline-cyan-300 text-slate-500"
								onChange={(e) =>
									setEventForm({ ...eventForm, startTime: e.target.value })
								}
							/>
						</div>
						<div className="flex gap-2 justify-between items-center text-white">
							<h6>End Time: </h6>
							<Input
								type="time"
								placeholder="END TIME (AM/PM)"
								value={eventForm.endTime}
								className="w-2/3 border-sky-400 border-2 outline-double outline-cyan-300 text-slate-500"
								onChange={(e) =>
									setEventForm({ ...eventForm, endTime: e.target.value })
								}
							/>
						</div>
						<div className="flex gap-2 justify-between items-center text-white">
							<Textarea
								placeholder="Description (OPTIONAL)"
								value={eventForm.description}
								className="border-sky-400 border-2 outline-double outline-cyan-300"
								onChange={(e) =>
									setEventForm({ ...eventForm, description: e.target.value })
								}
							/>
						</div>
						<div className="flex gap-2 justify-between items-center text-white">
							<h6>Type:</h6>
							<Select onValueChange={(e) => setEventForm({...eventForm, type: e})}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Event Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="work">Work</SelectItem>
									<SelectItem value="personal">Personal</SelectItem>
									<SelectItem value="others">Others.</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<Button
							type="submit"
							className="bg-yellow-800 shadow-yellow-200 shadow-[0_0px_20px_rgba(2,_10,_120,_0.2)] mt-5"
						>
							Add Event
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddEvents;
