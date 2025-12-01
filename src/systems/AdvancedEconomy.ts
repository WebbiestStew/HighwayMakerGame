/**
 * ADVANCED ECONOMY SYSTEM
 * Supply/demand, business simulation, unemployment, loans, stock market
 */

export interface Business {
    id: string
    buildingId: string
    type: 'retail' | 'service' | 'manufacturing' | 'tech'
    name: string
    employees: number
    maxEmployees: number
    revenue: number
    expenses: number
    profit: number
    stockValue: number
    demand: number // 0-100
    supply: number // 0-100
    health: number // 0-100, below 20 = risk of closure
}

export interface Good {
    id: string
    name: string
    category: 'food' | 'retail' | 'services' | 'industrial'
    basePrice: number
    currentPrice: number
    demand: number
    supply: number
}

export interface Loan {
    id: string
    amount: number
    interestRate: number
    monthlyPayment: number
    remainingMonths: number
}

export interface Bond {
    id: string
    amount: number
    interest: number
    maturityMonths: number
}

export interface EconomyStats {
    gdp: number
    growthRate: number
    unemployment: number
    inflation: number
    averageIncome: number
    taxRevenue: number
    businessCount: number
    bankruptcies: number
}

export class AdvancedEconomy {
    private businesses: Map<string, Business> = new Map()
    private goods: Map<string, Good> = new Map()
    private loans: Loan[] = []
    private bonds: Bond[] = []
    private cityFunds: number = 1000000
    private taxRate: number = 10 // percentage
    private historicalGDP: number[] = [100000]
    
    constructor() {
        this.initializeGoods()
    }
    
    private initializeGoods() {
        const goodsData = [
            { id: 'food', name: 'Food', category: 'food', basePrice: 10 },
            { id: 'clothing', name: 'Clothing', category: 'retail', basePrice: 50 },
            { id: 'electronics', name: 'Electronics', category: 'retail', basePrice: 500 },
            { id: 'healthcare', name: 'Healthcare', category: 'services', basePrice: 200 },
            { id: 'entertainment', name: 'Entertainment', category: 'services', basePrice: 30 },
            { id: 'steel', name: 'Steel', category: 'industrial', basePrice: 100 },
            { id: 'concrete', name: 'Concrete', category: 'industrial', basePrice: 50 }
        ]
        
        goodsData.forEach(g => {
            this.goods.set(g.id, {
                ...g,
                category: g.category as Good['category'],
                currentPrice: g.basePrice,
                demand: 50,
                supply: 50
            })
        })
    }
    
    registerBusiness(buildingId: string, buildingType: string): Business {
        const typeMap: Record<string, Business['type']> = {
            shop: 'retail', mall: 'retail', restaurant: 'retail', supermarket: 'retail', boutique: 'retail',
            bank: 'service', hotel: 'service', theater: 'service', gym: 'service', hospital: 'service',
            factory: 'manufacturing', plant: 'manufacturing', refinery: 'manufacturing',
            office: 'tech'
        }
        
        const business: Business = {
            id: crypto.randomUUID(),
            buildingId,
            type: typeMap[buildingType] || 'retail',
            name: this.generateBusinessName(buildingType),
            employees: 0,
            maxEmployees: this.getMaxEmployees(buildingType),
            revenue: 0,
            expenses: 0,
            profit: 0,
            stockValue: 100,
            demand: 50 + Math.random() * 30,
            supply: 50 + Math.random() * 30,
            health: 80 + Math.random() * 20
        }
        
        this.businesses.set(business.id, business)
        return business
    }
    
    private getMaxEmployees(buildingType: string): number {
        const sizes: Record<string, number> = {
            shop: 5, mall: 50, restaurant: 15, hotel: 30, office: 40,
            bank: 20, theater: 10, gym: 8, supermarket: 25, boutique: 3,
            factory: 100, warehouse: 20, plant: 80, depot: 15, refinery: 120,
            hospital: 60, school: 40
        }
        return sizes[buildingType] || 10
    }
    
    // Simulate daily business operations
    updateDaily(citizenStats: { unemployment: number, population: number, avgHappiness: number }) {
        let totalRevenue = 0
        let totalProfit = 0
        let bankruptcies = 0
        
        // Update each business
        for (const [id, business] of this.businesses.entries()) {
            // Calculate demand based on population and happiness
            const baseDemand = citizenStats.population * 0.01
            const happinessMult = citizenStats.avgHappiness / 50 // 0-2x
            business.demand = Math.min(100, baseDemand * happinessMult)
            
            // Supply = employees efficiency
            const efficiency = business.employees / business.maxEmployees
            business.supply = efficiency * 100
            
            // Revenue based on supply/demand balance
            const priceMultiplier = business.demand / business.supply
            const baseRevenue = business.employees * 1000
            business.revenue = baseRevenue * priceMultiplier
            
            // Expenses: salaries + overhead
            const salaries = business.employees * 500
            const overhead = business.maxEmployees * 100
            business.expenses = salaries + overhead
            
            // Profit
            business.profit = business.revenue - business.expenses
            totalRevenue += business.revenue
            totalProfit += business.profit
            
            // Health deteriorates if unprofitable
            if (business.profit < 0) {
                business.health -= 5
            } else {
                business.health = Math.min(100, business.health + 2)
            }
            
            // Stock value based on profitability
            business.stockValue *= (1 + business.profit / 100000)
            business.stockValue = Math.max(1, business.stockValue)
            
            // Bankruptcy if health too low
            if (business.health < 20) {
                this.businesses.delete(id)
                bankruptcies++
            }
        }
        
        // Update goods prices (supply/demand)
        this.updateGoodsPrices()
        
        // Update loans
        this.updateLoans()
        
        // Calculate GDP
        const gdp = totalRevenue
        this.historicalGDP.push(gdp)
        if (this.historicalGDP.length > 365) {
            this.historicalGDP.shift()
        }
        
        // Calculate growth rate
        const growthRate = this.historicalGDP.length > 30 
            ? ((gdp - this.historicalGDP[this.historicalGDP.length - 31]) / this.historicalGDP[this.historicalGDP.length - 31]) * 100
            : 0
        
        // Tax revenue
        const taxRevenue = totalRevenue * (this.taxRate / 100)
        this.cityFunds += taxRevenue
        
        return {
            gdp,
            growthRate,
            unemployment: citizenStats.unemployment,
            inflation: this.calculateInflation(),
            averageIncome: totalRevenue / (citizenStats.population || 1),
            taxRevenue,
            businessCount: this.businesses.size,
            bankruptcies
        }
    }
    
    private updateGoodsPrices() {
        for (const good of this.goods.values()) {
            // Price moves toward equilibrium
            const imbalance = good.demand - good.supply
            const priceChange = imbalance * 0.01
            good.currentPrice = good.basePrice * (1 + priceChange)
            
            // Gradually equilibrate
            good.supply += (good.demand - good.supply) * 0.1
            good.demand += Math.random() * 5 - 2.5 // Random fluctuation
            good.demand = Math.max(10, Math.min(100, good.demand))
        }
    }
    
    private calculateInflation(): number {
        const avgPrice = Array.from(this.goods.values())
            .reduce((sum, g) => sum + g.currentPrice, 0) / this.goods.size
        const avgBasePrice = Array.from(this.goods.values())
            .reduce((sum, g) => sum + g.basePrice, 0) / this.goods.size
        return ((avgPrice - avgBasePrice) / avgBasePrice) * 100
    }
    
    // Take out a loan
    takeLoan(amount: number, months: number): { success: boolean, message: string } {
        const interestRate = 5 + Math.random() * 3 // 5-8% annual
        const monthlyRate = interestRate / 12 / 100
        const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                               (Math.pow(1 + monthlyRate, months) - 1)
        
        const loan: Loan = {
            id: crypto.randomUUID(),
            amount,
            interestRate,
            monthlyPayment,
            remainingMonths: months
        }
        
        this.loans.push(loan)
        this.cityFunds += amount
        
        return { success: true, message: `Loan approved: $${amount.toLocaleString()} at ${interestRate.toFixed(1)}%` }
    }
    
    // Issue bonds (citizens buy them)
    issueBond(amount: number, interest: number, maturityMonths: number): { success: boolean, message: string } {
        const bond: Bond = {
            id: crypto.randomUUID(),
            amount,
            interest,
            maturityMonths
        }
        
        this.bonds.push(bond)
        this.cityFunds += amount
        
        return { success: true, message: `Bonds issued: $${amount.toLocaleString()}` }
    }
    
    private updateLoans() {
        const remaining: Loan[] = []
        for (const loan of this.loans) {
            this.cityFunds -= loan.monthlyPayment
            loan.remainingMonths--
            if (loan.remainingMonths > 0) {
                remaining.push(loan)
            }
        }
        this.loans = remaining
    }
    
    // Hire unemployed citizens
    hireEmployee(businessId: string): boolean {
        const business = this.businesses.get(businessId)
        if (business && business.employees < business.maxEmployees) {
            business.employees++
            return true
        }
        return false
    }
    
    fireEmployee(businessId: string): boolean {
        const business = this.businesses.get(businessId)
        if (business && business.employees > 0) {
            business.employees--
            return true
        }
        return false
    }
    
    setTaxRate(rate: number) {
        this.taxRate = Math.max(0, Math.min(50, rate))
    }
    
    getBusinesses(): Business[] {
        return Array.from(this.businesses.values())
    }
    
    getGoods(): Good[] {
        return Array.from(this.goods.values())
    }
    
    getLoans(): Loan[] {
        return this.loans
    }
    
    getBonds(): Bond[] {
        return this.bonds
    }
    
    getCityFunds(): number {
        return this.cityFunds
    }
    
    addFunds(amount: number) {
        this.cityFunds += amount
    }
    
    private generateBusinessName(type: string): string {
        const prefixes = ['Global', 'Metro', 'City', 'United', 'Premier', 'Royal', 'Elite', 'Prime']
        const suffixes = ['Corp', 'Inc', 'Ltd', 'Group', 'Holdings', 'Enterprises', 'Industries']
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${type} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`
    }
}

export const advancedEconomy = new AdvancedEconomy()
