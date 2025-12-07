/**
 * Public Transport System - Cities: Skylines Level
 * Manages bus routes, metro lines, train stations, and ridership
 */

export type TransportType = 'bus' | 'metro' | 'train' | 'tram' | 'monorail' | 'cable-car';

export interface TransportStop {
    id: string;
    type: TransportType;
    x: number;
    z: number;
    name: string;
    passengers: number; // Current waiting passengers
    capacity: number; // Max waiting capacity
    routes: Set<string>; // Route IDs using this stop
}

export interface TransportRoute {
    id: string;
    type: TransportType;
    name: string;
    color: string;
    stops: string[]; // Stop IDs in order
    circular: boolean; // Does route loop back to start?
    vehicles: number; // Number of vehicles on route
    vehicleCapacity: number; // Passengers per vehicle
    frequency: number; // Minutes between vehicles
    cost: number; // Monthly operational cost
    revenue: number; // Monthly ticket revenue
    ridership: number; // Total passengers per month
    efficiency: number; // 0-100
}

export interface TransportVehicle {
    id: string;
    routeId: string;
    type: TransportType;
    currentStop: number; // Index in route stops
    passengers: number;
    capacity: number;
    position: { x: number; z: number };
    nextStopETA: number; // Seconds
}

export interface TransportStats {
    bus: {
        routes: number;
        stops: number;
        vehicles: number;
        ridership: number;
        coverage: number; // % of population
        budget: number;
    };
    metro: {
        routes: number;
        stations: number;
        trains: number;
        ridership: number;
        coverage: number;
        budget: number;
    };
    train: {
        routes: number;
        stations: number;
        trains: number;
        ridership: number;
        coverage: number;
        budget: number;
    };
    tram: {
        routes: number;
        stops: number;
        trams: number;
        ridership: number;
        coverage: number;
        budget: number;
    };
    monorail: {
        routes: number;
        stations: number;
        trains: number;
        ridership: number;
        coverage: number;
        budget: number;
    };
    total: {
        routes: number;
        stops: number;
        vehicles: number;
        ridership: number;
        coverage: number;
        revenue: number;
        expenses: number;
        profit: number;
    };
}

class PublicTransportSystemV4 {
    private static instance: PublicTransportSystemV4;
    
    private stops: Map<string, TransportStop> = new Map();
    private routes: Map<string, TransportRoute> = new Map();
    private vehicles: Map<string, TransportVehicle> = new Map();
    private stats: TransportStats;
    
    private updateTimer: number = 0;
    private simulationSpeed: number = 1;

    private constructor() {
        this.stats = this.initializeStats();
    }

    static getInstance(): PublicTransportSystemV4 {
        if (!PublicTransportSystemV4.instance) {
            PublicTransportSystemV4.instance = new PublicTransportSystemV4();
        }
        return PublicTransportSystemV4.instance;
    }

    private initializeStats(): TransportStats {
        return {
            bus: { routes: 0, stops: 0, vehicles: 0, ridership: 0, coverage: 0, budget: 0 },
            metro: { routes: 0, stations: 0, trains: 0, ridership: 0, coverage: 0, budget: 0 },
            train: { routes: 0, stations: 0, trains: 0, ridership: 0, coverage: 0, budget: 0 },
            tram: { routes: 0, stops: 0, trams: 0, ridership: 0, coverage: 0, budget: 0 },
            monorail: { routes: 0, stations: 0, trains: 0, ridership: 0, coverage: 0, budget: 0 },
            total: { routes: 0, stops: 0, vehicles: 0, ridership: 0, coverage: 0, revenue: 0, expenses: 0, profit: 0 }
        };
    }

    // Create transport stop
    buildStop(
        type: TransportType,
        x: number,
        z: number,
        name?: string
    ): TransportStop {
        const capacities = {
            bus: 30,
            metro: 100,
            train: 150,
            tram: 40,
            monorail: 80,
            'cable-car': 20
        };

        const stop: TransportStop = {
            id: `${type}_stop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            x,
            z,
            name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Stop`,
            passengers: 0,
            capacity: capacities[type],
            routes: new Set()
        };

        this.stops.set(stop.id, stop);
        this.updateStats();
        return stop;
    }

    // Create transport route
    createRoute(
        type: TransportType,
        name: string,
        stops: string[],
        circular: boolean = false
    ): TransportRoute | null {
        // Validate stops exist
        if (stops.length < 2) return null;
        for (const stopId of stops) {
            if (!this.stops.has(stopId)) return null;
        }

        const routeCosts = {
            bus: 300,
            metro: 1500,
            train: 2000,
            tram: 600,
            monorail: 1200,
            'cable-car': 400
        };

        const vehicleCapacities = {
            bus: 40,
            metro: 150,
            train: 200,
            tram: 60,
            monorail: 120,
            'cable-car': 30
        };

        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#F7DC6F', '#BB8FCE', '#85C1E2', '#52B788'];
        const color = colors[this.routes.size % colors.length];

        const route: TransportRoute = {
            id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            name,
            color,
            stops,
            circular,
            vehicles: Math.ceil(stops.length / 3), // Default: 1 vehicle per 3 stops
            vehicleCapacity: vehicleCapacities[type],
            frequency: 5, // 5 minutes between vehicles
            cost: routeCosts[type] * stops.length,
            revenue: 0,
            ridership: 0,
            efficiency: 0
        };

        this.routes.set(route.id, route);

        // Add route to stops
        stops.forEach(stopId => {
            const stop = this.stops.get(stopId);
            if (stop) {
                stop.routes.add(route.id);
            }
        });

        // Spawn vehicles
        this.spawnVehiclesForRoute(route);
        
        this.updateStats();
        return route;
    }

    private spawnVehiclesForRoute(route: TransportRoute): void {
        for (let i = 0; i < route.vehicles; i++) {
            const stopIndex = Math.floor((i / route.vehicles) * route.stops.length);
            const stopId = route.stops[stopIndex];
            const stop = this.stops.get(stopId);
            
            if (!stop) continue;

            const vehicle: TransportVehicle = {
                id: `vehicle_${Date.now()}_${i}`,
                routeId: route.id,
                type: route.type,
                currentStop: stopIndex,
                passengers: 0,
                capacity: route.vehicleCapacity,
                position: { x: stop.x, z: stop.z },
                nextStopETA: route.frequency * 60 * (i / route.vehicles) // Stagger vehicles
            };

            this.vehicles.set(vehicle.id, vehicle);
        }
    }

    // Delete route
    deleteRoute(routeId: string): void {
        const route = this.routes.get(routeId);
        if (!route) return;

        // Remove route from stops
        route.stops.forEach(stopId => {
            const stop = this.stops.get(stopId);
            if (stop) {
                stop.routes.delete(routeId);
            }
        });

        // Remove vehicles
        this.vehicles.forEach((vehicle, vehicleId) => {
            if (vehicle.routeId === routeId) {
                this.vehicles.delete(vehicleId);
            }
        });

        this.routes.delete(routeId);
        this.updateStats();
    }

    // Delete stop (if not in use)
    deleteStop(stopId: string): void {
        const stop = this.stops.get(stopId);
        if (!stop || stop.routes.size > 0) return;

        this.stops.delete(stopId);
        this.updateStats();
    }

    // Update simulation
    update(deltaTime: number, population: number): void {
        this.updateTimer += deltaTime * this.simulationSpeed;

        if (this.updateTimer >= 1) { // Update every second
            this.updateTimer = 0;

            // Move vehicles
            this.vehicles.forEach(vehicle => {
                vehicle.nextStopETA -= 1;

                if (vehicle.nextStopETA <= 0) {
                    // Arrive at next stop
                    const route = this.routes.get(vehicle.routeId);
                    if (!route) return;

                    // Drop off passengers
                    const passengersDropped = Math.floor(vehicle.passengers * 0.3);
                    vehicle.passengers -= passengersDropped;

                    // Pick up passengers
                    const stopId = route.stops[vehicle.currentStop];
                    const stop = this.stops.get(stopId);
                    if (stop) {
                        const availableSpace = vehicle.capacity - vehicle.passengers;
                        const pickUp = Math.min(stop.passengers, availableSpace);
                        vehicle.passengers += pickUp;
                        stop.passengers = Math.max(0, stop.passengers - pickUp);

                        // Update route ridership and revenue
                        route.ridership += pickUp;
                        route.revenue += pickUp * 2; // $2 per ride

                        // Update position
                        vehicle.position = { x: stop.x, z: stop.z };
                    }

                    // Move to next stop
                    vehicle.currentStop++;
                    if (vehicle.currentStop >= route.stops.length) {
                        if (route.circular) {
                            vehicle.currentStop = 0;
                        } else {
                            // Reverse direction for non-circular routes
                            route.stops.reverse();
                            vehicle.currentStop = 0;
                        }
                    }

                    // Set ETA to next stop
                    vehicle.nextStopETA = route.frequency * 60;
                }
            });

            // Generate passengers at stops based on population
            const passengerGenRate = population * 0.0001; // 0.01% of population per second
            this.stops.forEach(stop => {
                if (stop.routes.size > 0 && stop.passengers < stop.capacity) {
                    const newPassengers = Math.random() < passengerGenRate ? 1 : 0;
                    stop.passengers = Math.min(stop.capacity, stop.passengers + newPassengers);
                }
            });

            // Update route efficiency
            this.routes.forEach(route => {
                const totalCapacity = route.vehicles * route.vehicleCapacity * (60 / route.frequency);
                if (totalCapacity > 0) {
                    route.efficiency = Math.min(100, (route.ridership / totalCapacity) * 100);
                }
            });
        }
    }

    // Modify route
    addVehicleToRoute(routeId: string): void {
        const route = this.routes.get(routeId);
        if (!route) return;

        route.vehicles++;
        route.cost += route.cost / route.vehicles; // Increase cost proportionally

        // Spawn new vehicle
        const stopId = route.stops[0];
        const stop = this.stops.get(stopId);
        if (stop) {
            const vehicle: TransportVehicle = {
                id: `vehicle_${Date.now()}`,
                routeId: route.id,
                type: route.type,
                currentStop: 0,
                passengers: 0,
                capacity: route.vehicleCapacity,
                position: { x: stop.x, z: stop.z },
                nextStopETA: route.frequency * 60
            };
            this.vehicles.set(vehicle.id, vehicle);
        }

        this.updateStats();
    }

    removeVehicleFromRoute(routeId: string): void {
        const route = this.routes.get(routeId);
        if (!route || route.vehicles <= 1) return;

        route.vehicles--;
        route.cost = Math.max(100, route.cost * 0.9);

        // Remove a vehicle
        for (const [vehicleId, vehicle] of this.vehicles.entries()) {
            if (vehicle.routeId === routeId) {
                this.vehicles.delete(vehicleId);
                break;
            }
        }

        this.updateStats();
    }

    private updateStats(): void {
        this.stats = this.initializeStats();

        // Count by type
        this.stops.forEach(stop => {
            switch (stop.type) {
                case 'bus': this.stats.bus.stops++; break;
                case 'metro': this.stats.metro.stations++; break;
                case 'train': this.stats.train.stations++; break;
                case 'tram': this.stats.tram.stops++; break;
                case 'monorail': this.stats.monorail.stations++; break;
            }
            this.stats.total.stops++;
        });

        this.routes.forEach(route => {
            switch (route.type) {
                case 'bus': 
                    this.stats.bus.routes++;
                    this.stats.bus.budget += route.cost;
                    this.stats.bus.ridership += route.ridership;
                    break;
                case 'metro': 
                    this.stats.metro.routes++;
                    this.stats.metro.budget += route.cost;
                    this.stats.metro.ridership += route.ridership;
                    break;
                case 'train': 
                    this.stats.train.routes++;
                    this.stats.train.budget += route.cost;
                    this.stats.train.ridership += route.ridership;
                    break;
                case 'tram': 
                    this.stats.tram.routes++;
                    this.stats.tram.budget += route.cost;
                    this.stats.tram.ridership += route.ridership;
                    break;
                case 'monorail': 
                    this.stats.monorail.routes++;
                    this.stats.monorail.budget += route.cost;
                    this.stats.monorail.ridership += route.ridership;
                    break;
            }
            
            this.stats.total.routes++;
            this.stats.total.expenses += route.cost;
            this.stats.total.revenue += route.revenue;
            this.stats.total.ridership += route.ridership;
        });

        this.vehicles.forEach(vehicle => {
            switch (vehicle.type) {
                case 'bus': this.stats.bus.vehicles++; break;
                case 'metro': this.stats.metro.trains++; break;
                case 'train': this.stats.train.trains++; break;
                case 'tram': this.stats.tram.trams++; break;
                case 'monorail': this.stats.monorail.trains++; break;
            }
            this.stats.total.vehicles++;
        });

        this.stats.total.profit = this.stats.total.revenue - this.stats.total.expenses;
    }

    // Getters
    getStats(): TransportStats {
        return this.stats;
    }

    getStop(id: string): TransportStop | undefined {
        return this.stops.get(id);
    }

    getRoute(id: string): TransportRoute | undefined {
        return this.routes.get(id);
    }

    getAllStops(): TransportStop[] {
        return Array.from(this.stops.values());
    }

    getAllRoutes(): TransportRoute[] {
        return Array.from(this.routes.values());
    }

    getAllVehicles(): TransportVehicle[] {
        return Array.from(this.vehicles.values());
    }

    getVehiclesByRoute(routeId: string): TransportVehicle[] {
        return Array.from(this.vehicles.values()).filter(v => v.routeId === routeId);
    }
}

export default PublicTransportSystemV4;
