'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"

export default function Protected() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('/api/protected', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.log('/protected error', err));
    }, []);

    if (!data) {
    return <div>Loading...</div>;
    }

    return (
        <div>
            <Button>Click me</Button>
            <pre>{JSON.stringify(data)}</pre>
        </div>
    );
}