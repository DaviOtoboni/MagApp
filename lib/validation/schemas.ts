import { z } from 'zod'
import { 
  emailSchema,
  nameSchema,
  avatarUrlSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileEditSchema,
  profileInsertSchema,
  profileUpdateSchema
} from '@/types/database'
import { FormValidationResult } from '@/types/supabase'

/**
 * Validation utilities for forms and API endpoints
 */

// Password strength validation
export const passwordStrengthSchema = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/\d/, 'Senha deve conter pelo menos um número')
  .regex(/[^a-zA-Z0-9]/, 'Senha deve conter pelo menos um caractere especial')

// Enhanced registration schema with stronger password validation
export const enhancedRegisterSchema = registerSchema.extend({
  password: passwordStrengthSchema,
  terms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos de uso',
  }),
})

// Profile photo upload schema
export const profilePhotoSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'Arquivo deve ter no máximo 5MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Apenas arquivos JPEG, PNG e WebP são permitidos'
    ),
})

// Contact form schema (if needed for support)
export const contactSchema = z.object({
  name: nameSchema.refine(val => val !== null && val !== undefined, {
    message: 'Nome é obrigatório',
  }),
  email: emailSchema,
  subject: z
    .string()
    .min(5, 'Assunto deve ter pelo menos 5 caracteres')
    .max(100, 'Assunto muito longo'),
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem muito longa'),
})

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Termo de busca é obrigatório').max(100),
  filters: z.object({
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    category: z.string().optional(),
  }).optional(),
})

/**
 * Validation helper functions
 */

// Generic validation function
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): FormValidationResult & { data?: T } {
  try {
    const validatedData = schema.parse(data)
    return {
      isValid: true,
      errors: [],
      fieldErrors: {},
      data: validatedData,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {}
      const errors: string[] = []

      error.errors.forEach(err => {
        const path = err.path.join('.')
        if (!fieldErrors[path]) {
          fieldErrors[path] = []
        }
        fieldErrors[path].push(err.message)
        errors.push(`${path}: ${err.message}`)
      })

      return {
        isValid: false,
        errors,
        fieldErrors,
      }
    }

    return {
      isValid: false,
      errors: ['Erro de validação desconhecido'],
      fieldErrors: {},
    }
  }
}

// Specific validation functions for common use cases
export function validateLogin(data: unknown) {
  return validateData(loginSchema, data)
}

export function validateRegister(data: unknown) {
  return validateData(enhancedRegisterSchema, data)
}

export function validateForgotPassword(data: unknown) {
  return validateData(forgotPasswordSchema, data)
}

export function validateResetPassword(data: unknown) {
  return validateData(resetPasswordSchema, data)
}

export function validateProfileEdit(data: unknown) {
  return validateData(profileEditSchema, data)
}

export function validateProfileInsert(data: unknown) {
  return validateData(profileInsertSchema, data)
}

export function validateProfileUpdate(data: unknown) {
  return validateData(profileUpdateSchema, data)
}

// Email validation with additional checks
export function validateEmailAdvanced(email: string): FormValidationResult {
  const basicValidation = validateData(emailSchema, email)
  
  if (!basicValidation.isValid) {
    return basicValidation
  }

  // Additional email validation checks
  const warnings: string[] = []
  
  // Check for common typos in domains
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
  const domain = email.split('@')[1]?.toLowerCase()
  
  if (domain && !commonDomains.includes(domain)) {
    // Check for common typos
    const typos = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
    }
    
    if (typos[domain as keyof typeof typos]) {
      warnings.push(`Você quis dizer ${typos[domain as keyof typeof typos]}?`)
    }
  }

  return {
    ...basicValidation,
    warnings,
  }
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number // 0-4
  feedback: string[]
  isStrong: boolean
} {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 8) score++
  else feedback.push('Use pelo menos 8 caracteres')

  if (password.length >= 12) score++
  else if (password.length >= 8) feedback.push('Considere usar 12+ caracteres para maior segurança')

  // Character variety checks
  if (/[a-z]/.test(password)) score++
  else feedback.push('Adicione letras minúsculas')

  if (/[A-Z]/.test(password)) score++
  else feedback.push('Adicione letras maiúsculas')

  if (/\d/.test(password)) score++
  else feedback.push('Adicione números')

  if (/[^a-zA-Z0-9]/.test(password)) score++
  else feedback.push('Adicione caracteres especiais (!@#$%^&*)')

  // Common patterns check
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
  ]

  if (commonPatterns.some(pattern => pattern.test(password))) {
    score = Math.max(0, score - 2)
    feedback.push('Evite padrões comuns como "123456" ou "password"')
  }

  // Normalize score to 0-4 range
  score = Math.min(4, Math.max(0, score - 2))

  return {
    score,
    feedback,
    isStrong: score >= 3,
  }
}

// Form field validation helpers
export const fieldValidators = {
  email: (value: string) => {
    const result = emailSchema.safeParse(value)
    return result.success ? null : result.error.errors[0]?.message || 'Email inválido'
  },
  
  name: (value: string | null) => {
    const result = nameSchema.safeParse(value)
    return result.success ? null : result.error.errors[0]?.message || 'Nome inválido'
  },
  
  password: (value: string) => {
    const result = passwordStrengthSchema.safeParse(value)
    return result.success ? null : result.error.errors[0]?.message || 'Senha inválida'
  },
  
  avatarUrl: (value: string | null) => {
    if (!value) return null
    const result = avatarUrlSchema.safeParse(value)
    return result.success ? null : result.error.errors[0]?.message || 'URL inválida'
  },
}

// Export all schemas for external use
export {
  emailSchema,
  nameSchema,
  avatarUrlSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileEditSchema,
  profileInsertSchema,
  profileUpdateSchema,
  enhancedRegisterSchema,
  profilePhotoSchema,
  contactSchema,
  searchSchema,
}