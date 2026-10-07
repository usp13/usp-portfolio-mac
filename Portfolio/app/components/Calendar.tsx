import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const dates = [];
    const daysFromPrevMonth = firstDay.getDay();
    const prevMonth = new Date(year, month - 1);
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      dates.push({
        date: prevMonthLastDay - i,
        month: "prev",
        fullDate: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonthLastDay - i)
      });
    }

    for (let date = 1; date <= lastDay.getDate(); date++) {
      dates.push({
        date,
        month: "current",
        fullDate: new Date(year, month, date)
      });
    }

    const remainingDays = 42 - dates.length;
    for (let date = 1; date <= remainingDays; date++) {
      dates.push({
        date,
        month: "next",
        fullDate: new Date(year, month + 1, date)
      });
    }

    return dates;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (fullDate: Date) => {
    setSelectedDate(fullDate);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = new Date();

  const events = [
    { title: "Portfolio Demo & Review", time: "11:00 AM", color: "bg-apple-blue" },
    { title: "AI Engineering Sync", time: "2:30 PM", color: "bg-emerald-500" },
    { title: "Open Source Contribution", time: "5:00 PM", color: "bg-purple-500" },
  ];

  return (
    <div className="w-80 apple-glass rounded-2xl shadow-2xl p-4 border border-black/10 dark:border-white/10 select-none animate-menu-dropdown-right">
      {/* Date Header */}
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-apple-blue/15 text-apple-blue dark:text-blue-400">
            <CalendarIcon className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-semibold text-xs sm:text-[13px] text-gray-900 dark:text-gray-100">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
              Today is {today.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/15 rounded-md transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/15 rounded-md transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mt-2.5">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {getMonthDates().map(({ date, month, fullDate }, index) => {
            const todayCell = isToday(fullDate);
            const selectedCell = isSelected(fullDate);
            const isCurrentMonth = month === "current";

            return (
              <button
                key={index}
                onClick={() => handleDateClick(fullDate)}
                className={`
                  relative h-7 w-7 mx-auto rounded-full text-xs font-medium flex items-center justify-center transition-all duration-150
                  ${!isCurrentMonth ? "text-gray-400/40 dark:text-gray-600 cursor-default" : "hover:bg-black/5 dark:hover:bg-white/10"}
                  ${todayCell && !selectedCell ? "text-apple-blue font-bold ring-1 ring-apple-blue/50" : ""}
                  ${selectedCell ? "bg-apple-blue text-white font-semibold shadow-sm scale-105" : "text-gray-800 dark:text-gray-200"}
                `}
              >
                <span>{date}</span>
                {todayCell && (
                  <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${selectedCell ? "bg-white" : "bg-apple-blue"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agenda / Events preview */}
      <div className="mt-3.5 pt-3 border-t border-black/5 dark:border-white/10 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium px-1">
          <span>Upcoming Schedule</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> All Synced
          </span>
        </div>

        <div className="space-y-1">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-xs"
            >
              <div className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${event.color}`} />
                <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[170px]">{event.title}</span>
              </div>
              <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {event.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
