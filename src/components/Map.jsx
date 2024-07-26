import React, { useState, useEffect, useCallback } from "react";
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer,
} from "@react-google-maps/api";
import styles from "./Map.module.css"; // Import the CSS module

// Define the libraries outside of the component
const MAP_LIBRARIES = ["places"];

function Map(props) {
    const defaultCenter = { lat: 19.0259244, lng: 73.0452016 }; // Default center location
    const [center, setCenter] = useState(defaultCenter);
    console.log(center)
    const [map, setMap] = useState(null);
    const [directionResponse, setDirectionResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [zoom, setZoom] = useState(16);

    const { isLoaded } = useJsApiLoader({
        
        googleMapsApiKey: "AIzaSyDcE7IHNEUboAbtJFeY7IqiHSSdqgzuvg8", // Replace with your actual API key
        libraries: MAP_LIBRARIES,
    });

    useEffect(() => {
        if (isLoaded) {
            if (props.latitude && props.longitude) {
                setCenter({
                    lat: parseFloat(props.latitude),
                    lng: parseFloat(props.longitude),
                });
                setZoom(16);
            } else {
                setCenter(defaultCenter);
                setZoom(16);
            }
        }
    }, [isLoaded, props.latitude, props.longitude]);

    useEffect(() => {
        if (props.origin && isLoaded) {
            const directionsService = new google.maps.DirectionsService();
            directionsService
                .route({
                    origin: props.origin,
                    destination: props.destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                })
                .then((results) => {
                    setDirectionResponse(results);
                    setDistance(results.routes[0].legs[0].distance.text);
                    setDuration(results.routes[0].legs[0].duration.text);
                })
                .catch((error) => {
                    console.error("Error fetching directions:", error);
                });
        }
    }, [isLoaded, props.origin, props.destination]);

    const clearRoute = useCallback(() => {
        setDistance("");
        setDuration("");
        setDirectionResponse(null);
    }, []);

    const centerPosition = useCallback(() => {
        if (map && center.lat && center.lng) {
            map.panTo(center);
            setZoom(16);
        }
    }, [map, center]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className={styles.frame}>
                <GoogleMap
                    center={center}
                    zoom={zoom}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                    onLoad={(map) => setMap(map)}
                >
                    <Marker position={center} />
                    {directionResponse && (
                        <DirectionsRenderer directions={directionResponse} />
                    )}
                </GoogleMap>
            </div>
            <div className={styles.btns}>
                <button onClick={clearRoute}>Clear</button>
                <button onClick={centerPosition}>Center</button>
            </div>
        </>
    );
}

export default Map;