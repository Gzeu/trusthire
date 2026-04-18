interface CompanyVerificationResult {
  companyName: string;
  domain: string;
  isValid: boolean;
  riskScore: number;
  warnings: string[];
  recommendations: string[];
  companyData?: {
    founded?: number;
    employees?: string;
    industry?: string;
    description?: string;
    website?: string;
    socialProfiles?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
    };
  };
}

export async function verifyCompany(companyName: string, domain?: string): Promise<CompanyVerificationResult> {
  if (!companyName) {
    return {
      companyName: '',
      domain: domain || '',
      isValid: false,
      riskScore: 100,
      warnings: ['No company name provided'],
      recommendations: ['Please provide a company name for verification']
    };
  }

  const warnings: string[] = [];
  const recommendations: string[] = [];
  let riskScore = 0;

  // Extract domain from company name if not provided
  const targetDomain = domain || extractDomainFromCompanyName(companyName);

  // Basic company name validation
  if (companyName.length < 2) {
    warnings.push('Company name too short');
    riskScore += 30;
  }

  // Check for suspicious company name patterns
  const suspiciousPatterns = [
    /(tech|solutions|systems|digital|global|worldwide|international)$/i,
    /(microsoft|google|apple|amazon|facebook|linkedin|github).*(tech|solutions|systems|inc|corp)/i,
    /^[A-Z]{2,}\d+/, // Pattern like "AB123", "XYZ789"
    /\s+(tech|solutions|inc|corp|llc)$/i // Generic suffixes
  ];

  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(companyName)) {
      warnings.push('Suspicious company name pattern detected');
      riskScore += 25;
    }
  });

  // Domain analysis
  if (targetDomain) {
    const domainAnalysis = await analyzeCompanyDomain(targetDomain);
    warnings.push(...domainAnalysis.warnings);
    riskScore += domainAnalysis.riskScore;
    recommendations.push(...domainAnalysis.recommendations);
  }

  // Try to get company information from public sources
  const companyData = await getCompanyPublicData(companyName, targetDomain) || undefined;
  
  // Validate company data consistency
  if (companyData) {
    if (companyData.founded && companyData.founded > new Date().getFullYear() - 1) {
      warnings.push('Company founded in future - suspicious');
      riskScore += 40;
    }

    if (companyData.founded && companyData.founded > new Date().getFullYear() - 2) {
      warnings.push('Very new company - exercise caution');
      riskScore += 20;
    }

    if (companyData.employees === '1-10' && companyName.includes('Tech')) {
      warnings.push('Small company with generic tech name');
      riskScore += 15;
    }

    // Check for consistency between name and domain
    if (targetDomain && !targetDomain.includes(companyName.toLowerCase().replace(/\s+/g, ''))) {
      warnings.push('Company name and domain don\'t match');
      riskScore += 10;
    }
  } else {
    warnings.push('No public company information found');
    riskScore += 25;
    recommendations.push('Verify company through official business registries');
  }

  // Calculate overall validity
  const isValid = riskScore < 50 && warnings.length < 4;

  if (!isValid) {
    recommendations.push('Request additional verification from recruiter');
    recommendations.push('Check company registration with business authorities');
    recommendations.push('Look for employee reviews on Glassdoor or similar platforms');
  }

  return {
    companyName,
    domain: targetDomain,
    isValid,
    riskScore: Math.max(0, Math.min(100, riskScore)),
    warnings,
    recommendations,
    companyData
  };
}

function extractDomainFromCompanyName(companyName: string): string {
  // Remove common suffixes and spaces, convert to lowercase
  const cleanName = companyName
    .replace(/\s+(Tech|Solutions|Systems|Inc|Corp|LLC|Ltd|GmbH)$/i, '')
    .replace(/\s+/g, '')
    .toLowerCase();
  
  return `${cleanName}.com`; // Default assumption
}

async function analyzeCompanyDomain(domain: string): Promise<{
  warnings: string[];
  riskScore: number;
  recommendations: string[];
}> {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let riskScore = 0;

  // Check domain age (simplified - would need WHOIS API in production)
  const suspiciousTLDs = ['tk', 'ml', 'ga', 'cf', 'gq', 'men'];
  const tld = domain.split('.').pop();
  
  if (tld && suspiciousTLDs.includes(tld)) {
    warnings.push(`Suspicious TLD: .${tld}`);
    riskScore += 30;
    recommendations.push('Legitimate companies typically use established TLDs');
  }

  // Check domain pattern
  if (domain.includes('tech') || domain.includes('solutions')) {
    warnings.push('Generic domain with common keywords');
    riskScore += 15;
  }

  // Check for numbers in domain (often suspicious for companies)
  if (/\d/.test(domain)) {
    warnings.push('Domain contains numbers - unusual for companies');
    riskScore += 10;
  }

  // Check domain length
  if (domain.length > 20) {
    warnings.push('Unusually long domain name');
    riskScore += 10;
  }

  return { warnings, riskScore, recommendations };
}

async function getCompanyPublicData(companyName: string, domain: string): Promise<CompanyVerificationResult['companyData']> {
  // In a real implementation, this would call APIs like:
  // - Crunchbase API
  // - LinkedIn Company API  
  // - Google Places API
  // - Business registration APIs
  // - OpenCorporates API
  
  // For now, return mock data based on patterns
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock company data for demonstration
    if (companyName.toLowerCase().includes('microsoft')) {
      return {
        founded: 1975,
        employees: '181,000+',
        industry: 'Technology',
        description: 'Multinational technology company',
        website: 'https://microsoft.com',
        socialProfiles: {
          linkedin: 'https://linkedin.com/company/microsoft',
          twitter: 'https://twitter.com/microsoft',
          github: 'https://github.com/microsoft'
        }
      };
    }

    if (companyName.toLowerCase().includes('google')) {
      return {
        founded: 1998,
        employees: '139,995+',
        industry: 'Technology',
        description: 'Multinational technology company',
        website: 'https://google.com',
        socialProfiles: {
          linkedin: 'https://linkedin.com/company/google',
          twitter: 'https://twitter.com/google',
          github: 'https://github.com/google'
        }
      };
    }

    // For unknown companies, return limited data
    return {
      founded: new Date().getFullYear() - Math.floor(Math.random() * 20) - 5,
      employees: '11-50',
      industry: 'Technology',
      description: `${companyName} is a technology company`,
      website: `https://${domain}`
    };

  } catch (error) {
    console.error('Company data fetch error:', error);
    return undefined;
  }
}

// Enhanced verification with multiple data sources
export async function comprehensiveCompanyVerification(
  companyName: string, 
  domain: string, 
  recruiterEmail?: string
): Promise<CompanyVerificationResult & {
  emailVerification?: any;
  domainReputation?: any;
  socialMediaVerification?: any;
}> {
  const basicVerification = await verifyCompany(companyName, domain);
  
  // Add email domain verification
  let emailVerification = null;
  if (recruiterEmail) {
    const emailDomain = recruiterEmail.split('@')[1];
    if (emailDomain !== domain) {
      basicVerification.warnings.push('Recruiter email domain doesn\'t match company domain');
      basicVerification.riskScore += 20;
      basicVerification.recommendations.push('Verify if email is from legitimate company domain');
    }
  }

  // Add domain reputation check
  const { checkDomainReputation } = await import('./domainReputation');
  const domainReputation = await checkDomainReputation(domain);
  
  if (domainReputation.riskScore > 50) {
    basicVerification.warnings.push('Company domain has poor reputation');
    basicVerification.riskScore += 30;
  }

  // Social media verification
  const socialMediaVerification = await verifySocialMediaPresence(companyName, domain);

  return {
    ...basicVerification,
    emailVerification,
    domainReputation,
    socialMediaVerification
  };
}

async function verifySocialMediaPresence(companyName: string, domain: string): Promise<{
  hasLinkedIn: boolean;
  hasTwitter: boolean;
  hasGithub: boolean;
  profileAge?: number;
  warnings: string[];
}> {
  const warnings: string[] = [];
  
  // In production, this would use actual API calls to LinkedIn, Twitter, GitHub
  // For now, simulate based on domain patterns
  
  const hasLinkedIn = !domain.includes('test') && !domain.includes('temp');
  const hasTwitter = hasLinkedIn; // Assume same as LinkedIn
  const hasGithub = hasLinkedIn; // Assume same as LinkedIn
  
  if (!hasLinkedIn) {
    warnings.push('No LinkedIn company profile found');
  }
  
  return {
    hasLinkedIn,
    hasTwitter,
    hasGithub,
    profileAge: hasLinkedIn ? new Date().getFullYear() - 2010 : undefined,
    warnings
  };
}
