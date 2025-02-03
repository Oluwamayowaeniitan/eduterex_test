import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { eachDayOfInterval, format, startOfMonth, endOfMonth } from "date-fns";

export const getMonthsBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [];

  // Validate that the end date is after the start date
  if (end < start) {
    return "End date must be after start date";
  }

  // Loop through the months between the start and end dates
  while (start <= end) {
    // Get the month name and push it to the array
    months.push(start.toLocaleString("default", { month: "long" }));
    // Move to the next month
    start.setMonth(start.getMonth() + 1);
  }

  return months;
};

export const getMonthsWeeksDays = (start_date, end_date) => {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  if (isNaN(startDate) || isNaN(endDate) || endDate < startDate) {
    console.error("Invalid date range");
    return [];
  }

  const result = [];

  // Helper to format dates as "DD/MM"
  const formatDate = (date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Get the current month and year
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString("default", { month: "long" });

    const month = {
      name: `${monthName} ${currentYear}`,
      weeks: [],
    };

    while (currentDate.getMonth() === currentMonth && currentDate <= endDate) {
      const week = [];

      // Fill Monday to Friday of the current week
      for (
        let i = 0;
        i < 7 &&
        currentDate.getMonth() === currentMonth &&
        currentDate <= endDate;
        i++
      ) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          week.push(formatDate(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }

      if (week.length > 0) {
        month.weeks.push(week);
      }
    }

    result.push(month);

    // Move to the first day of the next month if necessary
    if (currentDate.getMonth() !== currentMonth) {
      currentDate = new Date(currentYear, currentMonth + 1, 1);
    }
  }

  return result;
};

export const formatDate = (datetimeStr) => {
  // Parse the datetime string into a Date object
  const date = new Date(datetimeStr);

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the day, month, and year
  const day = date.getUTCDate();
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  // Format the date as '11 Feb 2022'
  return `${day} ${month} ${year}`;
};

export const generatePDF = (printId, saveAs) => {
  const element = document.getElementById(printId);

  const images = element.querySelectorAll("img");

  Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete)
            resolve(); // If already loaded
          else img.onload = resolve; // Wait for image to load
        }),
    ),
  )
    .then(() => {
      return html2canvas(element, {
        scale: 3, // Higher scale for better resolution
        useCORS: true, // To handle cross-origin images
      });
    })
    .then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const margin = 10; // Margin in mm

      const contentWidth = canvas.width;
      const contentHeight = canvas.height;

      // Calculate scale factor to fit content into A4 size
      const scaleFactor = Math.min(
        (pdfWidth - margin * 2) / contentWidth,
        (pdfHeight - margin * 2) / contentHeight,
      );

      const scaledWidth = contentWidth * scaleFactor;
      const scaledHeight = contentHeight * scaleFactor;

      // Center the content in the PDF
      const xOffset = (pdfWidth - scaledWidth) / 2;
      const yOffset = (pdfHeight - scaledHeight) / 2;

      if (scaledHeight <= pdfHeight - margin * 2) {
        // If content fits within a single page
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          xOffset,
          yOffset,
          scaledWidth,
          scaledHeight,
        );
      } else {
        // For multi-page content
        const pageHeightInPixels = (pdfHeight - margin * 2) / scaleFactor; // Page height in pixels
        let remainingHeight = contentHeight;

        while (remainingHeight > 0) {
          const pdfCanvas = document.createElement("canvas");
          pdfCanvas.width = contentWidth;
          pdfCanvas.height = Math.min(pageHeightInPixels, remainingHeight);

          const ctx = pdfCanvas.getContext("2d");

          ctx.drawImage(
            canvas,
            0,
            contentHeight - remainingHeight,
            contentWidth,
            Math.min(pageHeightInPixels, remainingHeight),
            0,
            0,
            contentWidth,
            pdfCanvas.height,
          );

          const pageImgData = pdfCanvas.toDataURL("image/jpeg", 1.0);

          pdf.addImage(
            pageImgData,
            "JPEG",
            margin,
            margin,
            scaledWidth,
            (pdfCanvas.height * scaledWidth) / contentWidth,
          );

          remainingHeight -= pageHeightInPixels;

          if (remainingHeight > 0) pdf.addPage();
        }
      }

      pdf.save(saveAs);
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
    });
};

export const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function generateWeeklyDetails(start_date, end_date) {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const result = [];
  let currentWeek = [];
  let currentWeekNumber = 1;

  // Loop from start_date to end_date
  for (
    let currentDate = new Date(startDate);
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const dayOfWeek = currentDate.getDay();

    // Add the current date to the current week only if it's Monday to Friday
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      currentWeek.push(currentDate.toISOString().split("T")[0]);
    }

    // Check if the current day is Friday or the end date
    if (dayOfWeek === 5 || currentDate.getTime() === endDate.getTime()) {
      if (currentWeek.length > 0) {
        result.push({
          name: `Week ${currentWeekNumber}`,
          days_in_weeks: currentWeek,
        });
        currentWeek = [];
        currentWeekNumber++;
      }
    }
  }

  return result;
}

export const generateMonthlyDetails = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = [];

  while (start <= end) {
    const startOfCurrentMonth = startOfMonth(start);
    const endOfCurrentMonth = endOfMonth(startOfCurrentMonth);

    months.push({
      name: format(startOfCurrentMonth, "MMMM yyyy"), // e.g., "January 2024"
      days_in_month: eachDayOfInterval({
        start: startOfCurrentMonth,
        end: endOfCurrentMonth,
      }).map((date) => format(date, "yyyy-MM-dd")), // Dates in 'yyyy-MM-dd' format
    });

    // Move to the next month
    start.setMonth(start.getMonth() + 1);
  }

  return months;
};
