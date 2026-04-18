interface EmailValidationResult {
  isValid: boolean;
  isDisposable: boolean;
  isFree: boolean;
  domain: string;
  riskScore: number;
  recommendations: string[];
}

export async function validateEmail(email: string): Promise<EmailValidationResult> {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      isDisposable: false,
      isFree: false,
      domain: '',
      riskScore: 100,
      recommendations: ['Invalid email format']
    };
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return {
      isValid: false,
      isDisposable: false,
      isFree: false,
      domain: '',
      riskScore: 100,
      recommendations: ['Invalid email domain']
    };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      isDisposable: false,
      isFree: false,
      domain,
      riskScore: 90,
      recommendations: ['Invalid email format']
    };
  }

  // Check for disposable email providers
  const disposableProviders = [
    '10minutemail', 'tempmail', 'guerrillamail', 'mailinator', 'yopmail',
    'tempmail.org', 'throwaway.email', 'maildrop.cc', 'temp-mail.org'
  ];

  const isDisposable = disposableProviders.some(provider => 
    domain.includes(provider) || email.toLowerCase().includes(provider)
  );

  // Check for free email providers
  const freeProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'protonmail.com',
    'icloud.com', 'aol.com', 'mail.com', 'gmx.com', 'zoho.com'
  ];

  const isFree = freeProviders.includes(domain);

  // Calculate risk score
  let riskScore = 0;
  const recommendations: string[] = [];

  if (isDisposable) {
    riskScore += 40;
    recommendations.push('Disposable email detected - high risk indicator');
  }

  if (isFree) {
    riskScore += 20;
    recommendations.push('Personal email provider - verify through official channels');
  }

  // Check domain age and reputation (simplified version)
  const suspiciousPatterns = [
    /[0-9]{4,}/, // Domains with lots of numbers
    /^[a-z]{1,2}\d+/, // Short letter + number patterns
    /temp|test|demo|fake/i // Suspicious keywords
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(domain))) {
    riskScore += 30;
    recommendations.push('Suspicious domain pattern detected');
  }

  // Check for corporate domain indicators
  const corporateIndicators = [
    domain.includes('company'),
    domain.includes('corp'),
    domain.includes('tech'),
    domain.includes('solutions'),
    domain.includes('systems'),
    !domain.includes('.') || domain.split('.').length > 3
  ];

  const corporateScore = corporateIndicators.filter(Boolean).length;
  if (corporateScore >= 2) {
    riskScore -= 10;
    recommendations.push('Domain appears to be corporate - positive indicator');
  }

  // Normalize risk score to 0-100
  riskScore = Math.max(0, Math.min(100, riskScore));

  return {
    isValid: true,
    isDisposable,
    isFree,
    domain,
    riskScore,
    recommendations
  };
}

// Enhanced validation with Abstract API (if API key is available)
export async function validateEmailWithAPI(email: string): Promise<EmailValidationResult> {
  const apiKey = process.env.ABSTRACT_API_KEY;
  
  if (!apiKey) {
    console.warn('Abstract API key not found, using fallback validation');
    return validateEmail(email);
  }

  try {
    const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    let riskScore = 0;
    const recommendations: string[] = [];

    // Use API data for enhanced validation
    if (!data.is_valid_format?.value) {
      riskScore += 50;
      recommendations.push('Invalid email format');
    }

    if (data.is_disposable_email?.value) {
      riskScore += 40;
      recommendations.push('Disposable email detected - high risk');
    }

    if (data.is_free_email?.value) {
      riskScore += 20;
      recommendations.push('Free email provider - verify through official channels');
    }

    if (data.deliverability?.value === 'low') {
      riskScore += 30;
      recommendations.push('Low deliverability score - suspicious domain');
    }

    // Quality score from API (if available)
    if (data.quality_score) {
      const apiRiskScore = 100 - (data.quality_score * 100);
      riskScore = Math.max(riskScore, apiRiskScore);
    }

    return {
      isValid: data.is_valid_format?.value || false,
      isDisposable: data.is_disposable_email?.value || false,
      isFree: data.is_free_email?.value || false,
      domain: email.split('@')[1]?.toLowerCase() || '',
      riskScore: Math.max(0, Math.min(100, riskScore)),
      recommendations
    };

  } catch (error) {
    console.error('Email validation API error:', error);
    return validateEmail(email); // Fallback to basic validation
  }
}
