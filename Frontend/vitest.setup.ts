import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// registra los matchers: toBeInTheDocument, toHaveTextContent, etc.
expect.extend(matchers)