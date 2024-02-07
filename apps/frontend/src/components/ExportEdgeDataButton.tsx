import {useEffect, useState} from "react";

const ExportEdgeDataToCSVButton = () => {
    const [file, setFile] = useState("");
    const [loading, setLoading] = useState(true);

    const handleExportButton = () =>{
        // Convert data to CSV format

        // Create a Blob and download the CSV file
        const blob = new Blob([file], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'exported_data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Make a GET request to the API endpoint
                const response = await fetch("/api/download-edge-csv");

                // Check if the request was successful (status code 2xx)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }


                const result = await response.text();
                // Set the data in the state
                setFile(result);
            } catch (err) {
                // Handle errors
                console.log("Failed");
            } finally {
                // Set loading to false, indicating that the request has completed
                setLoading(false);
            }
        };

        fetchData().then();
    }, []); //

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <button className="inline-block p-2.5 text-center text-light-blue cursor-pointer
                           border-light-blue rounded-md border-solid border-2
                           transition-all transition-duration-300
                           hover:bg-light-blue hover:text-white"
                onClick={handleExportButton}>Export</button>
    );
};


export default ExportEdgeDataToCSVButton;