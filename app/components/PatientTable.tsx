import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PatientTable = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    //const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients', {
          method: 'GET',
          headers: {
         //    'X-CSRFToken': csrftoken
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients', error);
      }
    };

    fetchPatients();
  }, [])

  return (
    <Table className='lg:w-1/3 w-11/12 m-auto'>
    <TableCaption>Lista dos Pacientes</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="">Nome</TableHead>
        <TableHead>Ocupação</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {patients.map((patient) => (
        <TableRow key={patient.id}>
          <TableCell className="font-medium">{patient.nome}</TableCell>
        <TableCell>{patient.trabalho}</TableCell>
      </TableRow>
      ))}
    </TableBody>
  </Table>
  )
}

export default PatientTable