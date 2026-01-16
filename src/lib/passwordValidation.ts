// Password validation utilities for security compliance

const WEAK_PASSWORDS = [
  '123456', '123456789', '12345678', 'password', 'password1',
  '111111', '12345', '1234567', 'qwerty', 'abc123',
  'senha123', 'admin123', 'letmein', 'welcome', 'monkey'
];

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Minimum 8 characters
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }

  // At least one letter
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos 1 letra');
  }

  // At least one number
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos 1 número');
  }

  // Check for weak passwords
  if (WEAK_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Esta senha é muito comum. Escolha uma senha mais forte');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) return 'weak';
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
}
