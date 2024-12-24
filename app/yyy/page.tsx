'use client';

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoPage() {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
      const token = localStorage.getItem('token');

      fetch('/api/inventory', {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
      })
          .then((res) => {
              if (res.status === 403) {
                  router.push('/login');
              }
              return res.json()
          })
          .then((data) => setData(data))
          .catch((err) => console.log('/inventory error', err));
  }, []);

  if (!data) {
      return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
