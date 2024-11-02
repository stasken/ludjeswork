import { Injectable } from '@angular/core';
import { ShiftItem } from '../components/shifts/shift-list/shift-list.component';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CalculationService {
  earningsNetto = 0;
  constructor(private date: DatePipe) { }


  calculateHours(endDate: Date, startDate: Date, breakMinutes: number) {
    if (!endDate || !startDate) return 0;
    const diffInMs = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
    let totalMinutes = Math.floor(diffInMs / (1000 * 60)) - breakMinutes;
    return totalMinutes;
  }

  calculateEarnings(endDate: Date, startDate: Date, totalMinutes: number, breakMinutes: number, selectedPlatform: string, earnings: number) {
    if (!selectedPlatform || (!earnings && selectedPlatform != "X-Care")) return 0;
    if (selectedPlatform === 'Clickcare') {
      this.earningsNetto = earnings * 0.93;
    } else if (selectedPlatform === 'Caresquare') {
      this.earningsNetto = earnings;
    } else if (selectedPlatform === 'Zonder') {
      this.earningsNetto = earnings;
    } else if (selectedPlatform === 'Beeple') {
      if (totalMinutes == 0) {
        totalMinutes = this.calculateHours(endDate, startDate, breakMinutes);
      }
      this.calculatePriceBeeple(startDate, endDate, breakMinutes, totalMinutes);
    } else if (selectedPlatform === 'X-Care') {
      if (totalMinutes == 0) {
        totalMinutes = this.calculateHours(endDate, startDate, breakMinutes);
      }
      this.calculatePriceX(startDate, endDate, breakMinutes, totalMinutes);
    }
    this.earningsNetto = Math.round(this.earningsNetto * 100) / 100;
    return this.earningsNetto;
  }

  calculatePriceX(startDate: Date, endDate: Date, currentBreakMinutes: number, totalMinutes: number) {
    if (!startDate || !endDate || !totalMinutes) return 0;
    let day = startDate.getDay();

    if (day.toString() == "feestdag") {
      return 0;
    } else if (day == 0) {
      let minutesPM = this.calculateTimeUntilMidnight(startDate, endDate);
      if (minutesPM - currentBreakMinutes != totalMinutes) {
        let minutesAM = totalMinutes - minutesPM;
        this.earningsNetto = (minutesPM * (62.4 / 60)) + (minutesAM * (54 / 60));
      } else {
        this.earningsNetto = totalMinutes * (62.4 / 60);
      }
    } else if (day == 6) {
      const eightPM = new Date(startDate);
      eightPM.setHours(20, 0, 0, 0);

      const midnight = new Date(startDate);
      midnight.setDate(midnight.getDate() + 1);
      midnight.setHours(0, 0, 0, 0);

      const before8PM = this.toMinutes(Math.max(0, Math.min(eightPM.getTime(), endDate.getTime()) - startDate.getTime()));
      const beforeMidnight = this.toMinutes(Math.max(0, Math.min(midnight.getTime(), endDate.getTime()) - Math.max(startDate.getTime(), eightPM.getTime())));
      const afterMidnight = this.toMinutes(Math.max(0, endDate.getTime() - midnight.getTime()));

      this.earningsNetto = ((before8PM - currentBreakMinutes) * (50.4 / 60)) + (beforeMidnight * (54 / 60)) + (afterMidnight * (62.4 / 60));
    } else {
      const durations = this.calculateShiftDurationsInMinutes(startDate, endDate);

      this.earningsNetto = ((durations.before7PM - currentBreakMinutes) * (40 / 60)) + (durations.between7And8PM * (48 / 60)) + (durations.after8PM * (54 / 60));
    }
    return this.earningsNetto;
  }

    /**
   * 
   * Basis (100%) = €41.00 (uren op weekdagen tussen 07:00 – 19:00)
   * Avond (120%) = €49.20 (uur tussen 19:00 – 20:00)
   * Nacht (135%) = €55.35 (uren tussen 20:00 – 07:00)
   * Zaterdag (126%) = €51.66 (uren op zaterdag)
   * Zondag/feestdag (156%) = €63.96 (uren op zon-en feestdagen)
   */
  calculatePriceBeeple(startDate: Date, endDate: Date, currentBreakMinutes: number, totalMinutes: number) {
    if (!startDate || !endDate || !totalMinutes) return 0;
    let day = startDate.getDay();

    if (day.toString() == "feestdag") {
      return 0;
    } else if (day == 0) {
      let minutesPM = this.calculateTimeUntilMidnight(startDate, endDate);
      if (minutesPM - currentBreakMinutes != totalMinutes) {
        let minutesAM = totalMinutes - minutesPM;
        this.earningsNetto = (minutesPM * (62.4 / 60)) + (minutesAM * (54 / 60));
      } else {
        this.earningsNetto = totalMinutes * (62.4 / 60);
      }
    } else if (day == 6) {
      const eightPM = new Date(startDate);
      eightPM.setHours(20, 0, 0, 0);

      const midnight = new Date(startDate);
      midnight.setDate(midnight.getDate() + 1);
      midnight.setHours(0, 0, 0, 0);

      const before8PM = this.toMinutes(Math.max(0, Math.min(eightPM.getTime(), endDate.getTime()) - startDate.getTime()));
      const beforeMidnight = this.toMinutes(Math.max(0, Math.min(midnight.getTime(), endDate.getTime()) - Math.max(startDate.getTime(), eightPM.getTime())));
      const afterMidnight = this.toMinutes(Math.max(0, endDate.getTime() - midnight.getTime()));

      this.earningsNetto = ((before8PM - currentBreakMinutes) * (50.4 / 60)) + (beforeMidnight * (54 / 60)) + (afterMidnight * (62.4 / 60));
    } else {
      const durations = this.calculateShiftDurationsInMinutes(startDate, endDate);

      this.earningsNetto = ((durations.before7PM - currentBreakMinutes) * (40 / 60)) + (durations.between7And8PM * (48 / 60)) + (durations.after8PM * (54 / 60));
    }
    return this.earningsNetto;
  }

  calculateTimeUntilMidnight(dateTime: Date, endDateTime: Date) {
    const nextMidnight = new Date(dateTime);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);

    // If the endDateTime is before midnight, return the time difference between dateTime and endDateTime
    if (endDateTime <= nextMidnight) {
      return this.toMinutes(endDateTime.getTime() - dateTime.getTime());
    }

    // If the endDateTime is after midnight, calculate the time worked before midnight
    const timeBeforeMidnight = nextMidnight.getTime() - dateTime.getTime();

    return this.toMinutes(timeBeforeMidnight);
  }

  calculateShiftDurationsInMinutes(startDateTime: Date, endDateTime: Date) {
    const start = new Date(startDateTime); // Shift start time
    const end = new Date(endDateTime); // Shift end time

    // Reference times
    const sixAM = new Date(start);
    sixAM.setHours(6, 0, 0, 0); // 6 AM on the shift day

    const sevenPM = new Date(start);
    sevenPM.setHours(19, 0, 0, 0); // 7 PM on the shift day

    const eightPM = new Date(start);
    eightPM.setHours(20, 0, 0, 0); // 8 PM on the shift day

    const midnight = new Date(start);
    midnight.setDate(midnight.getDate() + 1); // Move to the next day
    midnight.setHours(0, 0, 0, 0); // Midnight (12 AM)

    // Calculate durations in milliseconds for each time range
    const before7PM = Math.max(0, Math.min(sevenPM.getTime(), end.getTime()) - Math.max(sixAM.getTime(), start.getTime()));
    const between7And8PM = Math.max(0, Math.min(eightPM.getTime(), end.getTime()) - Math.max(sevenPM.getTime(), start.getTime()));
    const after8PM = Math.max(0, end.getTime() - Math.max(eightPM.getTime(), start.getTime()));

    // Convert milliseconds to minutes only

    return {
      before7PM: this.toMinutes(before7PM),
      between7And8PM: this.toMinutes(between7And8PM),
      after8PM: this.toMinutes(after8PM)
    };
  }

  toMinutes = (duration: number) => Math.floor(duration / (1000 * 60));

  checkForOverlap(start: Date, end: Date, shifts: ShiftItem[]) {
    for (const shift of shifts) {
      const shiftStart = shift.startdate;
      const shiftEnd = shift.enddate;

      const overlap: boolean = (start <= shiftEnd && start >= shiftStart) || (end <= shiftEnd && end >= shiftStart);
      if (overlap) {
        const formattedStartDate = this.date.transform(shift.startdate, 'medium');
        const formattedEndDate = this.date.transform(shift.enddate, 'medium');
        return {
          status: 1,
          statusText: `Deze shift overlapt met de shift in ${shift.location} van ${formattedStartDate} tot ${formattedEndDate}.`
        };
      }
      const beforeStart = shiftStart.getTime() - (4 * 60 * 60 * 1000); // shiftEnd + 4 hours
      const before: boolean = start.getTime() >= beforeStart && start.getTime() <= shiftStart.getTime();

      if (before) {
        const formattedStartDate = this.date.transform(shift.startdate, 'medium');
        const formattedEndDate = this.date.transform(shift.enddate, 'medium');
        return {
          status: 2,
          statusText: `Deze shift zou net voor de shift vallen in ${shift.location} die start van ${formattedStartDate} tot ${formattedEndDate} is.`
        };
      }

      const afterEnd = shiftEnd.getTime() + (4 * 60 * 60 * 1000); // end + 4 hours
      const after: boolean = shiftEnd.getTime() <= start.getTime() && afterEnd >= start.getTime();
      if (after) {
        const formattedStartDate = this.date.transform(shift.startdate, 'medium');
        const formattedEndDate = this.date.transform(shift.enddate, 'medium');
        return {
          status: 3,
          statusText: `Deze shift komt net na de shift in ${shift.location} van ${formattedStartDate} tot ${formattedEndDate} is.`
        };
      }
    }
    return {
      status: 0,
      statusText: ``,
    };
  }
}
