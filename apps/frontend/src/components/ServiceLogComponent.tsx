import React, { useState, useEffect } from 'react';
import { flowerServiceRequest } from 'common/interfaces/interfaces.ts';
import { employee } from 'common/interfaces/interfaces.ts';
import axios from "axios";

function GenerateTableRowsServices(tableData: flowerServiceRequest[], employeeData: employee[]): JSX.Element[] {
    //const [status, setStatus] = useState("Assigned");

    const handleStatusChange = (index: number, value: string, tableData: flowerServiceRequest[]) => {
            axios.patch("/api/populate-flower-service-request", {
                id:  tableData[index].id,
                senderName: tableData[index].senderName,
                senderEmail: tableData[index].senderEmail,
                roomLongName: tableData[index].roomLongName,
                flowerType: tableData[index].flowerType,
                deliveryDate: tableData[index].deliveryDate,
                note: tableData[index].note,
                status: value,
                employeeUser: tableData[index].employeeUser

            }).then(response => console.log(response.data))
                .catch(error => console.error(error));
    };

    const handleAssignmentChange = (index: number, value: string, tableData: flowerServiceRequest[]) => {
        axios.patch("/api/populate-flower-service-request", {
            id:  tableData[index].id,
            senderName: tableData[index].senderName,
            senderEmail: tableData[index].senderEmail,
            roomLongName: tableData[index].roomLongName,
            flowerType: tableData[index].flowerType,
            deliveryDate: tableData[index].deliveryDate,
            note: tableData[index].note,
            status: tableData[index].status,
            employeeUser: value

        }).then(response => console.log(response.data))
            .catch(error => console.error(error));
    };

    return tableData.map((item, index) => (
        <tr key={index}>
            <td>{tableData[index].senderName}</td>
            <td>{tableData[index].senderEmail}</td>
            <td>{tableData[index].roomLongName}</td>
            <td>{tableData[index].patientName}</td>
            <td>{tableData[index].flowerType}</td>
            <td>{tableData[index].deliveryDate}</td>
            <td>{tableData[index].note}</td>
            <td>
                <select value={tableData[index].status} onChange={(e) => handleStatusChange(index, e.target.value, tableData)}>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </td>
            <td>
                <select
                    value={tableData[index].employeeUser}
                    onChange={(e) => handleAssignmentChange(index, e.target.value, tableData)}>
                    {employeeData.map((employee, employeeIndex) => (
                        <option key={employeeIndex} value={employeeData[employeeIndex].username}>
                            {employeeData[employeeIndex].username}
                        </option>
                    ))}
                </select>
            </td>
        </tr>
    ));
}

const TableServices: React.FC<{ tableData: flowerServiceRequest[]; employeeData: employee[] }> = ({tableData, employeeData,}) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Sender Name</th>
                <th>Sender Email</th>
                <th>Room Name</th>
                <th>Patient's Name</th>
                <th>Flower Type</th>
                <th>Delivery Date</th>
                <th>Note</th>
                <th>Status</th>
                <th>Assignment</th>
            </tr>
            </thead>
            <tbody>{GenerateTableRowsServices(tableData, employeeData)}</tbody>
        </table>
    );
};

// GETTING data for service request and
export const ServiceLogComponent = () => {
    const [data, setData] = useState<flowerServiceRequest[]>([]);
    const [employeeData, setEmployeeData] = useState<employee[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Make a GET request to the API endpoint for flower service requests
                const response = await fetch('/api/populate-flower-service-request');
                if (!response.ok) {
                    throw new Error(`Failed to fetch flower service requests: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error('Error fetching flower service requests:', err);
            }
        };

        const fetchEmployeeData = async () => {
            try {
                // Make a GET request to the API endpoint for employees
                const response = await fetch('/api/populate-employee');
                if (!response.ok) {
                    throw new Error(`Failed to fetch employees: ${response.status}`);
                }
                const result = await response.json();
                setEmployeeData(result);
            } catch (err) {
                console.error('Error fetching employees:', err);
            }
        };

        fetchData().then();
        fetchEmployeeData().then();
    }, []); // Empty dependency array to run only once on mount

    return (
        <div>
            <TableServices tableData={data} employeeData={employeeData} />
        </div>
    );
};