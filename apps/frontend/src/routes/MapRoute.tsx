import {Outlet} from "react-router-dom";
import BackButton from "../components/BackButton.tsx";
import DragNDrop from "../components/DragNDrop.tsx";
//import { useState } from 'react';
import {Container} from "react-bootstrap";
import NavBar from "../components/NavBar.tsx";

export function MapRoute() {


    const handleFileDrop = async(file: File) => {
        // Create a FileReader
        const reader = new FileReader();

        // Set up a callback for when the file is loaded
        reader.onload = async (event) => {
            if (event.target) {
                // Extract the CSV content as a string
                const csvString = event.target.result as string;

                console.log(csvString);

                try {
                    const res = await fetch("/api/node-populate", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json", // Set the appropriate content type
                        },
                        body: JSON.stringify({csvString}), // Send the CSV string as JSON
                    });


                    console.log(res);
                } catch (error) {
                    console.error("Error:", error);
                }
            }

        };
        reader.readAsText(file);
    };

        return (
            <div>
                <Outlet></Outlet>
                <NavBar></NavBar>



                <BackButton link={"/"}></BackButton>
                <img
                    className={"pictureOfL1"}
                    src="public/icon/00_thelowerlevel1 (2).png"
                    alt="Lower Level of Hospital (L1)"
                    style={{marginTop: "60px"}}
                />
                <br/>
                <br/>

                <DragNDrop onFileDrop={handleFileDrop}></DragNDrop>
                <br/>

                <Container className="CsvDataText">
                    <p>CSV File: </p>
                    <br/>
                </Container>
            </div>
        );

}
