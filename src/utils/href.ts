/**
 * Centralized route path definitions for the application.
 *
 * @remarks
 * Provides type-safe route generation functions for navigation.
 * All route paths should be accessed through this object to maintain consistency.
 */
export const Href = {
  /** Home page route */
  home: () => "/",
  /** Pending transactions page route */
  pendingTransactions: () => "/pending-transactions",
  /** Statistics page route */
  stats: () => "/stats",
  /** Accounts listing page route */
  accounts: () => "/accounts",
  /**
   * Individual account detail page route.
   *
   * @param accountId - The account identifier
   * @returns Route path for the account detail page
   */
  accountById: (accountId: string) => `${Href.accounts()}/${accountId}`,

  /** Authentication base route */
  auth: () => "/auth",
  /** Sign-in page route */
  signIn: () => `${Href.auth()}/sign-in`,
  /** Sign-up page route */
  signUp: () => `${Href.auth()}/sign-up`,

  /** Settings base route */
  settings: () => "/settings",
  /** Categories management page route */
  categories: () => `${Href.settings()}/categories`,
  /** Tags management page route */
  tags: () => `${Href.settings()}/tags`,
  /** User sessions management page route */
  sessions: () => `${Href.settings()}/sessions`,
  /** User preferences page route */
  preferences: () => `${Href.settings()}/preferences`,
  /** Trash/recently deleted items page route */
  trash: () => `${Href.settings()}/trash`,
  /** Data management page route */
  dataManagement: () => `${Href.settings()}/data-management`,
  /** Loans management page route */
  loans: () => `${Href.settings()}/loans`,
  /**
   * Individual loan detail page route.
   *
   * @param loanId - The loan identifier
   * @returns Route path for the loan detail page
   */
  loanById: (loanId: string) => `${Href.loans()}/${loanId}`,

  /** Security settings page route */
  security: () => `${Href.settings()}/security`,
  /** Notifications settings page route */
  notifications: () => `${Href.settings()}/notifications`,
} as const
