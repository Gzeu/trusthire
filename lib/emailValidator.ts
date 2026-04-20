// Email validator for TrustHire Autonomous System
export interface EmailValidationResult {
  email: string;
  valid: boolean;
  domain: string;
  disposable: boolean;
  catchAll: boolean;
  score: number;
}

export class EmailValidator {
  private readonly disposableDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com'
  ];

  validateEmail(email: string): EmailValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(email);
    
    if (!isValidFormat) {
      return {
        email,
        valid: false,
        domain: '',
        disposable: false,
        catchAll: false,
        score: 0
      };
    }

    const domain = email.split('@')[1].toLowerCase();
    const isDisposable = this.disposableDomains.includes(domain);
    const isCatchAll = this.checkCatchAll(domain);
    
    const score = this.calculateEmailScore(email, isDisposable, isCatchAll);

    return {
      email,
      valid: true,
      domain,
      disposable: isDisposable,
      catchAll: isCatchAll,
      score
    };
  }

  private checkCatchAll(domain: string): boolean {
    // Mock implementation - in production, this would check DNS records
    return Math.random() > 0.8;
  }

  private calculateEmailScore(email: string, disposable: boolean, catchAll: boolean): number {
    let score = 100;
    
    if (disposable) score -= 50;
    if (catchAll) score -= 20;
    
    // Check for professional email patterns
    const professionalPatterns = [
      /^[a-z]+\.[a-z]+@/, // firstname.lastname
      /^[a-z]+[0-9]*@/, // firstname with numbers
      /^[a-z]+\.[a-z]+\.[a-z]+@/ // firstname.middlename.lastname
    ];
    
    const hasProfessionalPattern = professionalPatterns.some(pattern => 
      pattern.test(email.toLowerCase())
    );
    
    if (hasProfessionalPattern) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  batchValidate(emails: string[]): EmailValidationResult[] {
    return emails.map(email => this.validateEmail(email));
  }
}

export const emailValidator = new EmailValidator();
