import React, { useEffect, useState } from "react";
import styles from "./CarMatch.module.css"; // Import your CSS Module

const CarMatch = (props) => {
    const [cars, setCars] = useState([]);
    const [bestCar, setBestCar] = useState(null);
    const [fuelDetails, setFuelDetails] = useState([]);
    const newChat = props.newChat;

    // Parse and normalize props
    const distance = parseFloat(props.distance) || 0;
    const durationInSeconds = parseFloat(props.duration) || 0; // Duration in seconds
    const people = parseInt(props.people, 10) || 0;
    const budget = parseFloat(props.budget) || 0;

    // Convert duration from seconds to hours
    const totalHours = durationInSeconds / 3600;
    console.log("Total Hours:", totalHours);

    useEffect(() => {
        if (!newChat) {
            // Only fetch data if newChat is false
            const fetchData = async () => {
                try {
                    // Fetch data from the provided endpoint
                    const response = await fetch("http://localhost:3000/cars");
                    const data = await response.json();

                    if (data && Array.isArray(data)) {
                        setCars(data);

                        // Process the car data
                        processCarData(data, totalHours);
                    } else {
                        console.log(
                            "No cars found or data format is incorrect"
                        );
                    }
                } catch (error) {
                    console.error("Error:", error.message);
                }
            };

            fetchData();
        } else {
            // Clear previous data if newChat is true
            setCars([]);
            setBestCar(null);
            setFuelDetails([]);
        }
    }, [newChat, props]);

    const fuelPricePerLiter = 106; // Example fuel price per liter in rupees

    const processCarData = (carArray, totalHours) => {
        // Filter cars based on seating capacity
        const filteredCars = carArray.filter((car) => {
            const seats = parseInt(car.seater.split(" ")[0], 10);
            return (
                (people <= 5 && seats >= 4 && seats <= 5) ||
                (people >= 6 && seats >= 6 && seats <= 7)
            );
        });

        // Calculate the maximum rental cost allowed
        const maxRentalCost = budget;

        // Find the best car based on mileage
        const bestCar = filteredCars.reduce((best, car) => {
            // Calculate the total cost for the car
            const pricing = parseFloat(car.pricing.replace(/\D/g, "")); // Updated pricing parsing
            const totalCost = pricing * totalHours;

            console.log("Total Cost for", car.name, ":", totalCost);

            // Check if the car is within the budget
            if (totalCost <= maxRentalCost) {
                // Determine if this car is better based on mileage
                const mileage = parseFloat(car.mileage.split("-")[0].trim());
                if (!best || mileage > best.mileage) {
                    return { ...car, mileage };
                }
            }

            return best;
        }, null);

        // Sort the list of cars by mileage in descending order
        const sortedCars = filteredCars.sort((a, b) => {
            const mileageA = parseFloat(a.mileage.split("-")[0].trim());
            const mileageB = parseFloat(b.mileage.split("-")[0].trim());
            return mileageB - mileageA;
        });

        // Calculate fuel requirements and costs for each car
        const fuelDetails = sortedCars
            .map((car) => {
                const mileage = parseFloat(car.mileage.split("-")[0].trim());
                if (isNaN(mileage) || mileage === 0) {
                    return null; // Skip invalid mileage
                }
                const fuelRequired = distance / mileage;
                const fuelCost = fuelRequired * fuelPricePerLiter;
                const rentalCost =
                    parseFloat(car.pricing.replace(/\D/g, "")) * totalHours; // Updated pricing parsing

                return {
                    name: car.name,
                    mileage: mileage,
                    fuelRequired: fuelRequired.toFixed(2), // Fuel required in liters
                    fuelCost: fuelCost.toFixed(2), // Cost of fuel in rupees
                    rentalCost: rentalCost.toFixed(2), // Rental cost in rupees
                    image: car.images.image1, // Example image
                };
            })
            .filter((detail) => detail !== null); // Remove any null entries

        setBestCar(bestCar);
        setFuelDetails(fuelDetails);

        // Log the results to the console
        console.log(
            `The best car for you is: ${
                bestCar ? bestCar.name : "None within budget"
            }`
        );
        console.log("List of cars in decreasing order of fuel mileage:");
        fuelDetails.forEach((car) => {
            console.log(`${car.name}: ${car.mileage} km/l`);
            console.log(`  Fuel required: ${car.fuelRequired} liters`);
            console.log(`  Fuel cost: ₹${car.fuelCost}`);
            console.log(`  Rental cost: ₹${car.rentalCost}`);
        });
    };

    return (
        <div className={styles.carMatchContainer}>
            <h1>Car Data</h1>
            {newChat ? (
                <p>Start a new chat to find car matches.</p>
            ) : fuelDetails.length > 0 ? (
                <div className={styles.cardContainer}>
                    {fuelDetails.map((car) => (
                        <div className={styles.carCard} key={car.name}>
                            <img
                                src={car.image}
                                alt={car.name}
                                className={styles.carImage}
                            />
                            <div className={styles.carInfo}>
                                <h2>{car.name}</h2>
                                <p>Mileage: {car.mileage} km/l</p>
                                <p>Fuel Required: {car.fuelRequired} liters</p>
                                <p>Fuel Cost: ₹{car.fuelCost}</p>
                                <p>Rental Cost: ₹{car.rentalCost}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No car details available.</p>
            )}
        </div>
    );
};

export default CarMatch;
