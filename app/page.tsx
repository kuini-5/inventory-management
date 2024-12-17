'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

export default function Home() {
  const [date, setDate] = useState<Date | null | undefined>(null);
  return (
    <div className='flex justify-center items-center min-h-screen bg-stone-900'>
      <Calendar value={date} onChange={(e) => setDate(e.value as Date)} />
      <Button label="Click Me" icon="pi pi-check" />
    </div>
  );
}
