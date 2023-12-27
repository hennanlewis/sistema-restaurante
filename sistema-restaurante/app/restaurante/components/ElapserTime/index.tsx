"use client"
import { useEffect, useState } from "react"
import { MdOutlineTimer } from "react-icons/md"


type ElapsedTimerProps = {
	occupiedAt: Date | null
	showIcon?: boolean
	className?: string
}

export function ElapsedTimer({ occupiedAt, showIcon = true, className = "" }: ElapsedTimerProps) {
	const [timer, setTimer] = useState(0)

	const convertToTime = (timeInMiliseconds: number) => {
		if (timeInMiliseconds == 0) return "00:00"

		const seconds = Math.floor(timeInMiliseconds / 1000) % 60
		const minutes = Math.floor(Math.floor(timeInMiliseconds / 1000 - seconds) / 60)

		return `${minutes}:${String(seconds).padStart(2, "0")}`
	}

	useEffect(() => {
		const currentTime = occupiedAt ? Date.now() - new Date(occupiedAt).getTime() : 0
		setTimer(currentTime)
	}, [])

	useEffect(() => {
		const intervalID = setInterval(() => {
			const currentTime = occupiedAt ? Date.now() - new Date(occupiedAt).getTime() : 0
			setTimer(currentTime)
		}, 1000)

		return () => clearInterval(intervalID)
	}, [timer, occupiedAt])

	return <span className={className}>
		{convertToTime(timer)} {showIcon && <MdOutlineTimer />}
	</span>
}