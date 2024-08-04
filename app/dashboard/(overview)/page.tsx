'use client';

import { useEffect, useState } from "react"

export default function Page() {
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/csrf-token/', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                if (response.ok) {
                    setCsrfToken(data.csrfToken);
                    console.log(data);
                } else {
                    console.error('Failed to fetch CSRF token:', data);
                }
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        fetchCsrfToken();
    }, []);

    const [userFirstName, setUserFirstName] = useState('');

    useEffect(() => {
        if (!csrfToken) return;

        const fetchUserFirstName = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/current-user/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                
                const data = await response.json()
                console.log(data);
                setUserFirstName(data.first_name);
            } catch (error) {
                console.error('Error fetching User Information:',  error)
            }
        };

        fetchUserFirstName();
    }, [csrfToken])

    return <h1>Dashboard, {userFirstName}</h1>
}