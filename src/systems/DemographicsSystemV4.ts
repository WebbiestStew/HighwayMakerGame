/**
 * Demographics & Citizens System - Cities: Skylines Level
 * Simulates individual citizens with age, education, employment, and life cycles
 */

export type AgeGroup = 'child' | 'teen' | 'adult' | 'senior';
export type EducationLevel = 'uneducated' | 'educated' | 'well-educated' | 'highly-educated';
export type EmploymentStatus = 'unemployed' | 'employed' | 'student' | 'retired';

export interface Citizen {
    id: string;
    age: number; // In years
    ageGroup: AgeGroup;
    education: EducationLevel;
    employmentStatus: EmploymentStatus;
    workplace?: string; // Building ID
    home: string; // Building ID
    happiness: number; // 0-100
    health: number; // 0-100
    wealth: number; // 0-100
}

export interface DemographicStats {
    totalPopulation: number;
    
    ageDistribution: {
        children: number;
        teens: number;
        adults: number;
        seniors: number;
    };
    
    education: {
        uneducated: number;
        educated: number;
        wellEducated: number;
        highlyEducated: number;
        averageLevel: number; // 0-100
    };
    
    employment: {
        employed: number;
        unemployed: number;
        students: number;
        retired: number;
        unemploymentRate: number; // Percentage
        availableJobs: number;
    };
    
    wellbeing: {
        averageHappiness: number;
        averageHealth: number;
        averageWealth: number;
    };
    
    birthRate: number; // Per 1000 people per year
    deathRate: number; // Per 1000 people per year
    movingIn: number; // Monthly
    movingOut: number; // Monthly
}

class DemographicsSystemV4 {
    private static instance: DemographicsSystemV4;
    
    private citizens: Map<string, Citizen> = new Map();
    private stats: DemographicStats;
    private simulationTimer: number = 0;
    private birthsThisMonth: number = 0;
    private deathsThisMonth: number = 0;
    private movedInThisMonth: number = 0;
    private movedOutThisMonth: number = 0;

    private constructor() {
        this.stats = this.initializeStats();
    }

    static getInstance(): DemographicsSystemV4 {
        if (!DemographicsSystemV4.instance) {
            DemographicsSystemV4.instance = new DemographicsSystemV4();
        }
        return DemographicsSystemV4.instance;
    }

    private initializeStats(): DemographicStats {
        return {
            totalPopulation: 0,
            ageDistribution: { children: 0, teens: 0, adults: 0, seniors: 0 },
            education: { uneducated: 0, educated: 0, wellEducated: 0, highlyEducated: 0, averageLevel: 0 },
            employment: { employed: 0, unemployed: 0, students: 0, retired: 0, unemploymentRate: 0, availableJobs: 0 },
            wellbeing: { averageHappiness: 50, averageHealth: 70, averageWealth: 40 },
            birthRate: 15,
            deathRate: 8,
            movingIn: 0,
            movingOut: 0
        };
    }

    // Spawn a new citizen (birth or move-in)
    spawnCitizen(homeId: string, age?: number, isBirth: boolean = false): Citizen {
        const citizenAge = age !== undefined ? age : this.generateRandomAge();
        
        const citizen: Citizen = {
            id: `citizen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            age: citizenAge,
            ageGroup: this.getAgeGroup(citizenAge),
            education: this.generateEducationLevel(citizenAge),
            employmentStatus: this.generateEmploymentStatus(citizenAge),
            home: homeId,
            happiness: 50 + Math.random() * 20,
            health: 70 + Math.random() * 20,
            wealth: 30 + Math.random() * 40
        };

        this.citizens.set(citizen.id, citizen);
        
        if (isBirth) {
            this.birthsThisMonth++;
        } else {
            this.movedInThisMonth++;
        }

        this.updateStats();
        return citizen;
    }

    private generateRandomAge(): number {
        // Weighted random age generation
        const rand = Math.random();
        if (rand < 0.15) return Math.floor(Math.random() * 13); // Child
        if (rand < 0.25) return 13 + Math.floor(Math.random() * 7); // Teen
        if (rand < 0.75) return 20 + Math.floor(Math.random() * 45); // Adult
        return 65 + Math.floor(Math.random() * 25); // Senior
    }

    private getAgeGroup(age: number): AgeGroup {
        if (age < 13) return 'child';
        if (age < 20) return 'teen';
        if (age < 65) return 'adult';
        return 'senior';
    }

    private generateEducationLevel(age: number): EducationLevel {
        if (age < 13) return 'uneducated';
        if (age < 18) return Math.random() < 0.7 ? 'uneducated' : 'educated';
        
        const rand = Math.random();
        if (rand < 0.3) return 'educated';
        if (rand < 0.5) return 'well-educated';
        if (rand < 0.7) return 'highly-educated';
        return 'uneducated';
    }

    private generateEmploymentStatus(age: number): EmploymentStatus {
        if (age < 13) return 'student';
        if (age < 20) return Math.random() < 0.9 ? 'student' : 'employed';
        if (age < 65) return Math.random() < 0.85 ? 'employed' : 'unemployed';
        return 'retired';
    }

    // Remove citizen (death or move-out)
    removeCitizen(citizenId: string, isDeath: boolean = false): void {
        const citizen = this.citizens.get(citizenId);
        if (!citizen) return;

        this.citizens.delete(citizenId);
        
        if (isDeath) {
            this.deathsThisMonth++;
        } else {
            this.movedOutThisMonth++;
        }

        this.updateStats();
    }

    // Age citizens and handle life events
    update(deltaTime: number, cityConditions: {
        jobsAvailable: number;
        educationQuality: number; // 0-100
        healthcareQuality: number; // 0-100
        pollution: number; // 0-100
        crime: number; // 0-100
    }): void {
        this.simulationTimer += deltaTime;

        // Age citizens every game day (adjust based on time scale)
        if (this.simulationTimer >= 86400) { // 1 day
            this.simulationTimer = 0;

            this.citizens.forEach(citizen => {
                // Age by 1 day (simplified)
                citizen.age += 1 / 365;

                // Update age group
                const newAgeGroup = this.getAgeGroup(Math.floor(citizen.age));
                if (newAgeGroup !== citizen.ageGroup) {
                    citizen.ageGroup = newAgeGroup;
                    
                    // Life transitions
                    if (citizen.ageGroup === 'adult' && citizen.employmentStatus === 'student') {
                        citizen.employmentStatus = Math.random() < 0.9 ? 'employed' : 'unemployed';
                    } else if (citizen.ageGroup === 'senior' && citizen.employmentStatus === 'employed') {
                        citizen.employmentStatus = 'retired';
                    }
                }

                // Update happiness based on city conditions
                let happinessChange = 0;
                happinessChange += (100 - cityConditions.pollution) * 0.001;
                happinessChange += (100 - cityConditions.crime) * 0.001;
                happinessChange += cityConditions.educationQuality * 0.0005;
                happinessChange += cityConditions.healthcareQuality * 0.0005;
                
                if (citizen.employmentStatus === 'unemployed' && citizen.ageGroup === 'adult') {
                    happinessChange -= 0.5;
                }

                citizen.happiness = Math.max(0, Math.min(100, citizen.happiness + happinessChange));

                // Update health based on healthcare and age
                let healthChange = cityConditions.healthcareQuality * 0.001;
                healthChange -= (citizen.age / 100) * 0.01; // Health declines with age
                healthChange -= cityConditions.pollution * 0.001;
                
                citizen.health = Math.max(0, Math.min(100, citizen.health + healthChange));

                // Death chance (higher for unhealthy and old citizens)
                const deathChance = (100 - citizen.health) * 0.0001 + (citizen.age / 100) * 0.001;
                if (Math.random() < deathChance) {
                    this.removeCitizen(citizen.id, true);
                }

                // Move-out chance (unhappy citizens leave)
                if (citizen.happiness < 30 && Math.random() < 0.001) {
                    this.removeCitizen(citizen.id, false);
                }
            });

            this.updateStats();
        }
    }

    // Assign job to citizen
    assignJob(citizenId: string, workplaceId: string): boolean {
        const citizen = this.citizens.get(citizenId);
        if (!citizen || citizen.employmentStatus !== 'unemployed') return false;

        citizen.workplace = workplaceId;
        citizen.employmentStatus = 'employed';
        citizen.happiness += 10;
        this.updateStats();
        return true;
    }

    // Educate citizen
    educateCitizen(citizenId: string): void {
        const citizen = this.citizens.get(citizenId);
        if (!citizen) return;

        const educationProgression: Record<EducationLevel, EducationLevel> = {
            'uneducated': 'educated',
            'educated': 'well-educated',
            'well-educated': 'highly-educated',
            'highly-educated': 'highly-educated'
        };

        citizen.education = educationProgression[citizen.education];
        citizen.happiness += 5;
        this.updateStats();
    }

    private updateStats(): void {
        this.stats.totalPopulation = this.citizens.size;
        
        // Reset counters
        this.stats.ageDistribution = { children: 0, teens: 0, adults: 0, seniors: 0 };
        this.stats.education = { uneducated: 0, educated: 0, wellEducated: 0, highlyEducated: 0, averageLevel: 0 };
        this.stats.employment = { employed: 0, unemployed: 0, students: 0, retired: 0, unemploymentRate: 0, availableJobs: 0 };
        
        let totalHappiness = 0;
        let totalHealth = 0;
        let totalWealth = 0;
        let totalEducation = 0;

        this.citizens.forEach(citizen => {
            // Age distribution
            switch (citizen.ageGroup) {
                case 'child': this.stats.ageDistribution.children++; break;
                case 'teen': this.stats.ageDistribution.teens++; break;
                case 'adult': this.stats.ageDistribution.adults++; break;
                case 'senior': this.stats.ageDistribution.seniors++; break;
            }

            // Education
            switch (citizen.education) {
                case 'uneducated': this.stats.education.uneducated++; totalEducation += 0; break;
                case 'educated': this.stats.education.educated++; totalEducation += 33; break;
                case 'well-educated': this.stats.education.wellEducated++; totalEducation += 66; break;
                case 'highly-educated': this.stats.education.highlyEducated++; totalEducation += 100; break;
            }

            // Employment
            switch (citizen.employmentStatus) {
                case 'employed': this.stats.employment.employed++; break;
                case 'unemployed': this.stats.employment.unemployed++; break;
                case 'student': this.stats.employment.students++; break;
                case 'retired': this.stats.employment.retired++; break;
            }

            // Wellbeing
            totalHappiness += citizen.happiness;
            totalHealth += citizen.health;
            totalWealth += citizen.wealth;
        });

        // Calculate averages
        if (this.stats.totalPopulation > 0) {
            this.stats.wellbeing.averageHappiness = totalHappiness / this.stats.totalPopulation;
            this.stats.wellbeing.averageHealth = totalHealth / this.stats.totalPopulation;
            this.stats.wellbeing.averageWealth = totalWealth / this.stats.totalPopulation;
            this.stats.education.averageLevel = totalEducation / this.stats.totalPopulation;
        }

        // Unemployment rate
        const workforce = this.stats.employment.employed + this.stats.employment.unemployed;
        if (workforce > 0) {
            this.stats.employment.unemploymentRate = (this.stats.employment.unemployed / workforce) * 100;
        }

        // Birth/death rates per 1000
        if (this.stats.totalPopulation > 0) {
            this.stats.birthRate = (this.birthsThisMonth / this.stats.totalPopulation) * 1000;
            this.stats.deathRate = (this.deathsThisMonth / this.stats.totalPopulation) * 1000;
        }

        this.stats.movingIn = this.movedInThisMonth;
        this.stats.movingOut = this.movedOutThisMonth;
    }

    // Reset monthly counters (call at end of each month)
    resetMonthlyCounters(): void {
        this.birthsThisMonth = 0;
        this.deathsThisMonth = 0;
        this.movedInThisMonth = 0;
        this.movedOutThisMonth = 0;
    }

    // Getters
    getStats(): DemographicStats {
        return this.stats;
    }

    getCitizen(id: string): Citizen | undefined {
        return this.citizens.get(id);
    }

    getAllCitizens(): Citizen[] {
        return Array.from(this.citizens.values());
    }

    getCitizensByHome(homeId: string): Citizen[] {
        return Array.from(this.citizens.values()).filter(c => c.home === homeId);
    }

    getUnemployedCitizens(): Citizen[] {
        return Array.from(this.citizens.values()).filter(
            c => c.employmentStatus === 'unemployed' && c.ageGroup === 'adult'
        );
    }
}

export default DemographicsSystemV4;
