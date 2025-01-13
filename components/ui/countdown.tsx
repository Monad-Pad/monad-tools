"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownProps {
	endsAt: string;
	size?: "default" | "small" | "medium" | "full";
}

interface TimeLeft {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
}

const timeBoxClasses = "w-10 h-8 text-xl flex items-center justify-center bg-background border rounded-md";
const timeLabelClasses = "text-xs font-semibold uppercase text-center text-muted-foreground";

const timeUnits: Array<keyof TimeLeft> = ["days", "hours", "minutes", "seconds"];
const timeLabels: Record<keyof TimeLeft, string> = {
	days: "Day",
	hours: "Hr",
	minutes: "Min",
	seconds: "Sec",
};

const getTimeBoxClasses = (size: "default" | "small" | "medium" | "full") =>
	size === "small"
		? "w-6 h-6 text-sm flex items-center justify-center bg-background border rounded-md"
		: size === "medium"
		? "w-7 h-7 text-sm flex items-center justify-center bg-background border rounded-md"
		: size === "full"
		? "w-full h-12 text-2xl flex items-center justify-center bg-background border rounded-md"
		: timeBoxClasses;

const getTimeLabelClasses = (size: "default" | "small" | "medium" | "full") =>
	size === "small"
		? "text-[10px] font-semibold uppercase text-center text-muted-foreground"
		: size === "medium"
		? "text-[12px] font-semibold uppercase text-center text-muted-foreground"
		: size === "full"
		? "text-sm font-semibold uppercase text-center text-muted-foreground"
		: timeLabelClasses;

// Add this new component for the flipping animation
const AnimatedCard = ({ value, size = "default" }: { value: string; size?: "default" | "small" | "medium" | "full" }) => (
	<div className={`relative ${
		size === "small" 
			? "w-6 h-6" 
			: size === "medium" 
			? "w-7 h-7" 
			: size === "full"
			? "w-full h-12"
			: "w-10 h-8"
	}`}>
		<AnimatePresence mode="popLayout">
			<motion.div
				key={value}
				initial={{ rotateX: -90, position: "absolute", top: 0 }}
				animate={{ rotateX: 0 }}
				exit={{ rotateX: 90 }}
				transition={{ duration: 0.3 }}
				className={`${getTimeBoxClasses(size)} backface-hidden`}
			>
				{value}
			</motion.div>
		</AnimatePresence>
	</div>
);

export function Countdown({ endsAt, size = "default" }: CountdownProps) {
	const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

	useEffect(() => {
		const targetDate = new Date(endsAt);

		const intervalId = setInterval(() => {
			const now = new Date();
			const difference = targetDate.getTime() - now.getTime();

			if (difference > 0) {
				setTimeLeft({
					days: Math.floor(difference / (1000 * 60 * 60 * 24)),
					hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
					minutes: Math.floor((difference / 1000 / 60) % 60),
					seconds: Math.floor((difference / 1000) % 60),
				});
			} else {
				clearInterval(intervalId);
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [endsAt]);

	// New function to pad numbers with leading zeros
	const padNumber = (num: number): string => num.toString().padStart(2, "0");

	return (
		<div className={`grid ${size === "full" ? "grid-cols-4 gap-2" : "flex gap-2"} items-center font-semibold`}>
			{timeUnits.map((unit, index) => (
				<React.Fragment key={unit}>
					<div className={`${size === "small" ? "" : "space-y-1"}`}>
						<AnimatedCard value={padNumber(timeLeft[unit])} size={size} />
						<p className={getTimeLabelClasses(size)}>{timeLabels[unit]}</p>
					</div>
					{index < timeUnits.length - 1 && size === "small" && <span className="text-xs">:</span>}
				</React.Fragment>
			))}
		</div>
	);
}
