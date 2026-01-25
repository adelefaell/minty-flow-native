import { Q } from "@nozbe/watermelondb"

import { database } from "../index"
import type Account from "../models/Account"
import type Loan from "../models/Loan"

/**
 * Loan Service
 *
 * Provides functions for managing loan data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the loans collection
 */
function getLoanCollection() {
  return database.get<Loan>("loans")
}

/**
 * Get loans with optional filters
 */
export async function getLoans(filters?: {
  loanType?: "borrowed" | "lent"
  isPaid?: boolean
  includeArchived?: boolean
}): Promise<Loan[]> {
  const loans = getLoanCollection()
  let query = loans.query()

  if (filters?.loanType) {
    query = query.extend(Q.where("loan_type", filters.loanType))
  }
  if (filters?.isPaid !== undefined) {
    query = query.extend(Q.where("is_paid", filters.isPaid))
  }
  if (!filters?.includeArchived) {
    query = query.extend(Q.where("is_archived", false))
  }

  return await query.fetch()
}

/**
 * Find a loan by ID
 */
export async function findLoan(id: string): Promise<Loan | null> {
  try {
    return await getLoanCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Observe loans reactively with optional filters
 */
export function observeLoans(filters?: {
  loanType?: "borrowed" | "lent"
  isPaid?: boolean
  includeArchived?: boolean
}) {
  const loans = getLoanCollection()
  let query = loans.query()

  if (filters?.loanType) {
    query = query.extend(Q.where("loan_type", filters.loanType))
  }
  if (filters?.isPaid !== undefined) {
    query = query.extend(Q.where("is_paid", filters.isPaid))
  }
  if (!filters?.includeArchived) {
    query = query.extend(Q.where("is_archived", false))
  }

  return query.observe()
}

/**
 * Observe a specific loan by ID
 */
export function observeLoanById(id: string) {
  return getLoanCollection().findAndObserve(id)
}

/**
 * Create a new loan
 */
export async function createLoan(data: {
  name: string
  description?: string
  principalAmount: number
  remainingAmount?: number
  interestRate?: number
  currencyCode: string
  loanType: "borrowed" | "lent"
  contactName?: string
  contactPhone?: string
  dueDate?: Date
  accountId?: string
}): Promise<Loan> {
  const loans = getLoanCollection()

  return await database.write(async () => {
    // Validate account if provided
    if (data.accountId) {
      const accounts = database.get<Account>("accounts")
      const account = await accounts.find(data.accountId)
      if (!account) {
        throw new Error(`Account with id ${data.accountId} not found`)
      }
    }

    return await loans.create((loan) => {
      loan.name = data.name
      loan.description = data.description
      loan.principalAmount = data.principalAmount
      loan.remainingAmount = data.remainingAmount ?? data.principalAmount
      loan.interestRate = data.interestRate
      loan.currencyCode = data.currencyCode
      loan.loanType = data.loanType
      loan.contactName = data.contactName
      loan.contactPhone = data.contactPhone
      loan.dueDate = data.dueDate
      loan.accountId = data.accountId
      loan.isPaid = false
      loan.isArchived = false
      loan.createdAt = new Date()
      loan.updatedAt = new Date()
    })
  })
}

/**
 * Update loan
 */
export async function updateLoan(
  loan: Loan,
  updates: Partial<{
    name: string
    description: string | undefined
    remainingAmount: number
    interestRate: number | undefined
    contactName: string | undefined
    contactPhone: string | undefined
    dueDate: Date | undefined
    isPaid: boolean
    isArchived: boolean
  }>,
): Promise<Loan> {
  return await database.write(async () => {
    return await loan.update((l) => {
      if (updates.name !== undefined) l.name = updates.name
      if (updates.description !== undefined) l.description = updates.description
      if (updates.remainingAmount !== undefined)
        l.remainingAmount = updates.remainingAmount
      if (updates.interestRate !== undefined)
        l.interestRate = updates.interestRate
      if (updates.contactName !== undefined) l.contactName = updates.contactName
      if (updates.contactPhone !== undefined)
        l.contactPhone = updates.contactPhone
      if (updates.dueDate !== undefined) l.dueDate = updates.dueDate
      if (updates.isPaid !== undefined) l.isPaid = updates.isPaid
      if (updates.isArchived !== undefined) l.isArchived = updates.isArchived
      l.updatedAt = new Date()
    })
  })
}

/**
 * Update loan by ID
 */
export async function updateLoanById(
  id: string,
  updates: Partial<{
    name: string
    description: string | undefined
    remainingAmount: number
    interestRate: number | undefined
    contactName: string | undefined
    contactPhone: string | undefined
    dueDate: Date | undefined
    isPaid: boolean
    isArchived: boolean
  }>,
): Promise<Loan> {
  const loan = await findLoan(id)
  if (!loan) {
    throw new Error(`Loan with id ${id} not found`)
  }
  return await updateLoan(loan, updates)
}

/**
 * Record a payment on a loan
 */
export async function recordLoanPayment(
  loan: Loan,
  amount: number,
): Promise<Loan> {
  const newRemaining = Math.max(0, loan.remainingAmount - amount)
  const isPaid = newRemaining === 0
  return await updateLoan(loan, {
    remainingAmount: newRemaining,
    isPaid,
  })
}

/**
 * Mark loan as paid
 */
export async function markLoanAsPaid(loan: Loan): Promise<Loan> {
  return await updateLoan(loan, {
    remainingAmount: 0,
    isPaid: true,
  })
}

/**
 * Delete loan (mark as deleted for sync)
 */
export async function deleteLoan(loan: Loan): Promise<void> {
  await database.write(async () => {
    await loan.markAsDeleted()
  })
}

/**
 * Permanently destroy loan
 */
export async function destroyLoan(loan: Loan): Promise<void> {
  await database.write(async () => {
    await loan.destroyPermanently()
  })
}
