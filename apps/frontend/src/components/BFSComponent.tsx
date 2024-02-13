import React, { useState, useEffect, useCallback } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Node } from "common/src/graph-structure.ts";
import PathfindingRequest from "common/src/PathfindingRequest.ts";
import MapDisplay from "./maps/MapDisplay.tsx";
import { parseCSV } from "common/src/parser.ts";
import nodeCSVString from "common/dev/nodeCSVString.ts";
import Form from "react-bootstrap/Form";
import {Col, Container, Row} from "react-bootstrap";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet.tsx";
import { Button } from "./ui/button.tsx";

export function BFSComponent() {
    const [bfsResult, setBFSResult] = useState<Node[]>([]);
    const [startNode, setStartNode] = useState<string>("Select Start Location");
    const [endNode, setEndNode] = useState<string>("End Location");
    const [pathFindingType, setPathFindingType] = useState<string>("/api/bfsAstar-searching");
    const [mapKey, setMapKey] = useState<number>(0); // Key for forcing MapDisplay to remount
    const [doDisplayEdges, setDoDisplayEdges] = useState<boolean>(false);
     const [doDisplayNodes, setDoDisplayNodes] = useState<boolean>(true);
     const [doDisplayNames, setDoDisplayNames] = useState<boolean>(false);

    const fetchData = useCallback(async (): Promise<AxiosResponse<Node[]>> => {
        try {
            const request: PathfindingRequest = {
                startid: startNode,
                endid: endNode
            };
            const response: AxiosResponse<Node[]> = await axios.post(pathFindingType, request, {
                headers: {
                    'Content-Type': "application/json"
                }
            });

            if (response.status === 200) {
                setBFSResult(response.data);
            }

            return response;
        } catch (error) {
            console.error("Error fetching BFS result:", (error as AxiosError).message);
            throw error;
        }
    }, [startNode, endNode, pathFindingType]);

    useEffect(() => {
        fetchData()
            .then(response => {
                // Handle success
                console.log(response.data);
            })
            .catch(error => {
                // Handle error
                console.error("Error:", error.message);
                // Optionally set state or show error message to the user
            });
    }, [fetchData]);

    useEffect(() => {
        // When pathFindingType changes, update mapKey to force remount of MapDisplay
        setMapKey(prevKey => prevKey + 1);
    }, [pathFindingType]);

    const collectLongNames = () => {
        return bfsResult.map(node => node.longName);
    };

    //parse node CSV into array of CSVRows
    const CSVRow = parseCSV(nodeCSVString);
    //make array to be inserted in the html code
    const roomNames = [];


    //for each CSV row, add an option with the value as id and name as longName into array
    for (let i = 0; i < CSVRow.length; i++) {
        const row = CSVRow[i];
        const rowval = Object.values(row);
        const id = rowval[0];
        const longName = row["longName"];
        roomNames.push(<option value={id}> {longName} </option>);
    }

    const sendHoverMapPath = (path: PathfindingRequest) => {
        setStartNode(path.startid);
        setEndNode(path.endid);
    };

    //restyle :) put in same line
    return (
        <div>
            <h1 className="font-roboto font-extrabold italic"
                style={{ marginTop: '5%', fontSize: '60px' }}>Map Page</h1>

            <br />

            <Container>
                <Row>
                    <Col>
                        <Container>
                            <Row>
                                <Col>
                                    <Form.Check
                                        inline
                                        type="switch"
                                        id="display-edges-switch"
                                        label="Display Edges"
                                        checked={doDisplayEdges}
                                        onChange={() => setDoDisplayEdges(!doDisplayEdges)}
                                    />
                                </Col>
                                <Col>
                                    <Form.Check
                                        inline
                                        type="switch"
                                        id="display-nodes-switch"
                                        label="Display Nodes"
                                        checked={doDisplayNodes}
                                        onChange={() => setDoDisplayNodes(!doDisplayNodes)}
                                    />
                                </Col>
                                <Col>
                                    <Form.Check
                                        inline
                                        type="switch"
                                        id="display-names-switch"
                                        label="Display Names"
                                        checked={doDisplayNames}
                                        onChange={() => setDoDisplayNames(!doDisplayNames)}
                                    />
                                </Col>
                            </Row>
                        </Container>

                    </Col>

                    <Col>
                        <p>Starting Location</p>
                        <Form.Select value={startNode} size={"sm"}
                                     onChange={e => setStartNode(e.target.value)}>
                            <option></option>
                            {roomNames}
                        </Form.Select>
                    </Col>

                    <Col>
                        <p>Destination</p>
                        <Form.Select value={endNode} size={"sm"}
                                     onChange={e => setEndNode(e.target.value)}>
                            <option></option>
                            {roomNames}
                        </Form.Select>
                    </Col>

                    <Col>
                        <p>Select Search Type</p>
                        <Form.Select value={pathFindingType} size={"sm"} onChange={e => setPathFindingType(e.target.value)}>
                            <option value={"/api/bfs-searching"}>BFS searching</option>
                            <option value={"/api/bfsAstar-searching"}>A-star searching</option>
                        </Form.Select>

                    </Col>

                    <Col>
                        <p>View Text Route</p>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">Check Route</Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Route</SheetTitle>
                                    <SheetDescription>
                                        Follow this path to reach your destination
                                    </SheetDescription>
                                    <br />
                                </SheetHeader>
                                <ol type="1">
                                    {collectLongNames().map((longName, index) => (
                                        <li key={index}>{longName}</li>
                                    ))}
                                </ol>
                            </SheetContent>
                        </Sheet>

                    </Col>
                </Row>
            </Container>
            <br />

            <MapDisplay key={mapKey} startNode={startNode} endNode={endNode} sendHoverMapPath={sendHoverMapPath}
            pathFindingType={pathFindingType} doDisplayEdges={doDisplayEdges} doDisplayNodes={doDisplayNodes}
                        doDisplayNames={doDisplayNames}/>

        </div>

    );
}
