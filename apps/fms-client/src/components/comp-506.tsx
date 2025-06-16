'use client';

import { subDays, subMonths, subYears } from 'date-fns';
import { useState } from 'react';

import { Button } from '@anscer/ui/components/button';
import { Calendar } from '@anscer/ui/components/calendar';

export default function Component() {
  const today = new Date();
  const yesterday = subDays(today, 1);
  const lastWeek = subDays(today, 7);
  const lastMonth = subMonths(today, 1);
  const lastYear = subYears(today, 1);
  const [month, setMonth] = useState(today);
  const [date, setDate] = useState<Date>(today);

  return (
    <div>
      <div className="rounded-md border">
        <div className="flex max-sm:flex-col">
          <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
            <div className="h-full sm:border-e">
              <div className="flex flex-col px-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(today);
                    setMonth(today);
                  }}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(yesterday);
                    setMonth(yesterday);
                  }}
                >
                  Yesterday
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(lastWeek);
                    setMonth(lastWeek);
                  }}
                >
                  Last week
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(lastMonth);
                    setMonth(lastMonth);
                  }}
                >
                  Last month
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setDate(lastYear);
                    setMonth(lastYear);
                  }}
                >
                  Last year
                </Button>
              </div>
            </div>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate);
              }
            }}
            month={month}
            onMonthChange={setMonth}
            className="p-2"
            disabled={[
              { after: today }, // Dates before today
            ]}
          />
        </div>
      </div>
      <p
        className="mt-4 text-center text-muted-foreground text-xs"
        role="region"
        aria-live="polite"
      >
        Calendar with presets -{' '}
        <a
          className="underline hover:text-foreground"
          href="https://daypicker.dev/"
          target="_blank"
          rel="noreferrer noopener nofollow"
        >
          React DayPicker
        </a>
      </p>
    </div>
  );
}
