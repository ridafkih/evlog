import type { FetchError } from 'ofetch'
import type { ParsedError } from '../../types'

export type { ParsedError }

export function parseError(error: unknown): ParsedError {
  if (error && typeof error === 'object' && 'data' in error) {
    const { data, message: fetchMessage, statusCode: fetchStatusCode } = error as FetchError

    const evlogData = data?.data as { why?: string, fix?: string, link?: string } | undefined

    return {
      message: data?.message || fetchMessage || 'An error occurred',
      status: data?.statusCode || fetchStatusCode || 500,
      why: evlogData?.why,
      fix: evlogData?.fix,
      link: evlogData?.link,
      raw: error,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
      raw: error,
    }
  }

  return {
    message: String(error),
    status: 500,
    raw: error,
  }
}
