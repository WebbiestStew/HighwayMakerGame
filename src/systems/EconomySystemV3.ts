export interface Budget {
    balance: number
    income: {
        residential: number
        commercial: number
        industrial: number
        tourism: number
        other: number
    }
    expenses: {
        roads: number
        services: number
        publicTransport: number
        maintenance: number
        emergencyServices: number
        utilities: number
    }
    loans: Loan[]
    monthlyIncome: number
    monthlyExpenses: number
}

export interface Loan {
    id: string
    amount: number
    remaining: number
    interestRate: number
    monthlyPayment: number
    monthsRemaining: number
}

export class EconomySystemV3 {
    private static instance: EconomySystemV3
    private budget: Budget
    private daysSinceLastUpdate: number = 0
    private taxRate: number = 0.05 // 5% tax rate

    private constructor() {
        this.budget = {
            balance: 100000, // Starting money
            income: {
                residential: 0,
                commercial: 0,
                industrial: 0,
                tourism: 0,
                other: 0
            },
            expenses: {
                roads: 0,
                services: 0,
                publicTransport: 0,
                maintenance: 0,
                emergencyServices: 0,
                utilities: 0
            },
            loans: [],
            monthlyIncome: 0,
            monthlyExpenses: 0
        }
    }

    static getInstance(): EconomySystemV3 {
        if (!this.instance) {
            this.instance = new EconomySystemV3()
        }
        return this.instance
    }

    update(deltaTime: number, gameSpeed: number = 1) {
        // One game day = 60 seconds real time
        this.daysSinceLastUpdate += (deltaTime / 60) * gameSpeed

        // Update monthly (30 days)
        if (this.daysSinceLastUpdate >= 30) {
            this.processMonthlyFinances()
            this.daysSinceLastUpdate = 0
        }
    }

    private processMonthlyFinances() {
        // Calculate income
        const totalIncome = Object.values(this.budget.income).reduce((sum, val) => sum + val, 0)
        
        // Calculate expenses
        let totalExpenses = Object.values(this.budget.expenses).reduce((sum, val) => sum + val, 0)
        
        // Process loan payments
        this.budget.loans.forEach(loan => {
            totalExpenses += loan.monthlyPayment
            loan.remaining -= loan.monthlyPayment - (loan.remaining * loan.interestRate / 12)
            loan.monthsRemaining--
        })
        
        // Remove paid-off loans
        this.budget.loans = this.budget.loans.filter(loan => loan.monthsRemaining > 0)
        
        // Update balance
        this.budget.balance += totalIncome - totalExpenses
        this.budget.monthlyIncome = totalIncome
        this.budget.monthlyExpenses = totalExpenses

        // Bankruptcy check
        if (this.budget.balance < -50000) {
            // Game over or force loan
            console.warn('City is bankrupt!')
        }
    }

    calculateIncome(cityData: {
        residential: number
        commercial: number
        industrial: number
        population: number
        tourism: number
    }) {
        // Income based on zones and population
        this.budget.income.residential = cityData.residential * 100 * this.taxRate
        this.budget.income.commercial = cityData.commercial * 200 * this.taxRate
        this.budget.income.industrial = cityData.industrial * 150 * this.taxRate
        this.budget.income.tourism = cityData.tourism * 50
        
        // Population-based income
        this.budget.income.other = cityData.population * 2
    }

    calculateExpenses(cityData: {
        roadLength: number
        services: number
        publicTransport: number
        emergencyVehicles: number
    }) {
        // Expenses based on infrastructure
        this.budget.expenses.roads = cityData.roadLength * 5
        this.budget.expenses.maintenance = cityData.roadLength * 2
        this.budget.expenses.services = cityData.services * 500
        this.budget.expenses.publicTransport = cityData.publicTransport * 300
        this.budget.expenses.emergencyServices = cityData.emergencyVehicles * 200
        this.budget.expenses.utilities = 1000 // Base utilities
    }

    takeLoan(amount: number, months: number): boolean {
        const interestRate = 0.05 // 5% annual interest
        const monthlyPayment = (amount * (1 + interestRate * months / 12)) / months

        const loan: Loan = {
            id: `loan_${Date.now()}`,
            amount,
            remaining: amount,
            interestRate,
            monthlyPayment,
            monthsRemaining: months
        }

        this.budget.loans.push(loan)
        this.budget.balance += amount
        return true
    }

    canAfford(cost: number): boolean {
        return this.budget.balance >= cost
    }

    spend(cost: number, category: keyof Budget['expenses']): boolean {
        if (!this.canAfford(cost)) return false
        this.budget.balance -= cost
        this.budget.expenses[category] += cost
        return true
    }

    getBudget(): Budget {
        return { ...this.budget }
    }

    getBalance(): number {
        return this.budget.balance
    }

    setTaxRate(rate: number) {
        this.taxRate = Math.max(0.01, Math.min(0.15, rate)) // 1-15%
    }
}
