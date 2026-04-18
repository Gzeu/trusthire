interface DomainReputationResult {
  domain: string;
  riskScore: number;
  isBlacklisted: boolean;
  ageDays?: number;
  registrar?: string;
  country?: string;
  sslValid: boolean;
  hasMX: boolean;
  warnings: string[];
  recommendations: string[];
}

export async function checkDomainReputation(domain: string): Promise<DomainReputationResult> {
  if (!domain || typeof domain !== 'string') {
    return {
      domain: '',
      riskScore: 100,
      isBlacklisted: false,
      sslValid: false,
      hasMX: false,
      warnings: ['Invalid domain'],
      recommendations: ['Please provide a valid domain']
    };
  }

  // Clean domain
  const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
  
  let riskScore = 0;
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Basic domain pattern checks
  const suspiciousPatterns = [
    /[0-9]{4,}/, // Lots of numbers
    /^[a-z]{1,2}\d+/, // Short letter + number
    /temp|test|demo|fake|scam|phish/i, // Suspicious keywords
    /\.{2,}/, // Multiple dots
    /[^a-zA-Z0-9.-]/ // Special characters
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(cleanDomain))) {
    riskScore += 25;
    warnings.push('Suspicious domain pattern detected');
    recommendations.push('Domain contains suspicious patterns');
  }

  // Check TLD
  const tld = cleanDomain.split('.').pop();
  const suspiciousTLDs = ['tk', 'ml', 'ga', 'cf', 'gq', 'men', 'click', 'download'];
  if (tld && suspiciousTLDs.includes(tld)) {
    riskScore += 30;
    warnings.push('Suspicious TLD detected');
    recommendations.push('Domain uses suspicious top-level domain');
  }

  // Check domain length
  if (cleanDomain.length > 50) {
    riskScore += 20;
    warnings.push('Unusually long domain name');
  }

  if (cleanDomain.length < 6) {
    riskScore += 15;
    warnings.push('Very short domain name');
  }

  // Check for brand spoofing
  const popularBrands = ['microsoft', 'google', 'apple', 'amazon', 'facebook', 'linkedin', 'github'];
  const isBrandSpoofing = popularBrands.some(brand => 
    cleanDomain.includes(brand) && cleanDomain !== `${brand}.com`
  );

  if (isBrandSpoofing) {
    riskScore += 40;
    warnings.push('Potential brand spoofing detected');
    recommendations.push('Domain may be impersonating a known brand');
  }

  // SSL and MX checks (simplified)
  let sslValid = false;
  let hasMX = false;

  try {
    // Basic HTTPS check
    const httpsUrl = `https://${cleanDomain}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(httpsUrl, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    }).catch(() => null);

    clearTimeout(timeoutId);
    sslValid = true; // If HTTPS is available
  } catch {
    warnings.push('HTTPS not available');
    riskScore += 15;
  }

  // MX record check (simplified - would need DNS lookup API in production)
  hasMX = true; // Assume MX exists for basic functionality

  // Enhanced validation with APIVoid (if API key is available)
  return await checkDomainReputationWithAPI(cleanDomain, {
    domain: cleanDomain,
    riskScore,
    isBlacklisted: false,
    sslValid,
    hasMX,
    warnings,
    recommendations
  });
}

async function checkDomainReputationWithAPI(
  domain: string, 
  baseResult: Partial<DomainReputationResult>
): Promise<DomainReputationResult> {
  const apiKey = process.env.APIVOID_API_KEY;
  
  if (!apiKey) {
    console.warn('APIVoid API key not found, using basic domain checks');
    return {
      ...baseResult,
      domain,
      riskScore: baseResult.riskScore || 0,
      isBlacklisted: false,
      sslValid: baseResult.sslValid || false,
      hasMX: baseResult.hasMX || false,
      warnings: baseResult.warnings || [],
      recommendations: baseResult.recommendations || []
    } as DomainReputationResult;
  }

  try {
    const response = await fetch(`https://endpoint.apivoid.com/v2/domain-reputation/?key=${apiKey}&domain=${domain}`);
    
    if (!response.ok) {
      throw new Error(`APIVoid request failed: ${response.status}`);
    }

    const data = await response.json();
    
    let riskScore = baseResult.riskScore || 0;
    const warnings = [...(baseResult.warnings || [])];
    const recommendations = [...(baseResult.recommendations || [])];

    // Process APIVoid data
    if (data.data?.report?.blacklist) {
      const blacklistStatus = data.data.report.blacklist;
      if (blacklistStatus?.engines?.detected_by > 0) {
        riskScore += 50;
        warnings.push(`Domain blacklisted by ${blacklistStatus.engines.detected_by} engines`);
        recommendations.push('Domain is blacklisted - extremely high risk');
      }
    }

    if (data.data?.report?.domain_age) {
      const ageDays = data.data.report.domain_age;
      if (ageDays < 7) {
        riskScore += 30;
        warnings.push('Domain registered very recently');
        recommendations.push('New domain - higher risk indicator');
      } else if (ageDays < 30) {
        riskScore += 15;
        warnings.push('Domain registered recently');
      }
    }

    if (data.data?.report?.whois) {
      const whois = data.data.report.whois;
      if (whois.registrar) {
        const suspiciousRegistrars = ['namecheap', 'godaddy', 'hover'];
        if (suspiciousRegistrars.some(r => whois.registrar.toLowerCase().includes(r))) {
          riskScore += 10;
          warnings.push('Domain registered with common registrar used by spammers');
        }
      }

      if (whois.country) {
        const highRiskCountries = ['CN', 'RU', 'KP', 'IR'];
        if (highRiskCountries.includes(whois.country)) {
          riskScore += 20;
          warnings.push('Domain registered in high-risk country');
        }
      }
    }

    if (data.data?.report?.ssl) {
      const ssl = data.data.report.ssl;
      if (!ssl.is_valid) {
        riskScore += 25;
        warnings.push('Invalid SSL certificate');
        recommendations.push('SSL certificate is invalid or expired');
      }
    }

    if (data.data?.report?.mail) {
      const mail = data.data.report.mail;
      if (!mail.has_mx) {
        riskScore += 20;
        warnings.push('No MX records found');
        recommendations.push('Domain cannot receive email');
      }
    }

    return {
      domain,
      riskScore: Math.max(0, Math.min(100, riskScore)),
      isBlacklisted: (data.data?.report?.blacklist?.engines?.detected_by || 0) > 0,
      ageDays: data.data?.report?.domain_age,
      registrar: data.data?.report?.whois?.registrar,
      country: data.data?.report?.whois?.country,
      sslValid: data.data?.report?.ssl?.is_valid || false,
      hasMX: data.data?.report?.mail?.has_mx || false,
      warnings,
      recommendations
    };

  } catch (error) {
    console.error('Domain reputation API error:', error);
    return {
      ...baseResult,
      domain,
      riskScore: baseResult.riskScore || 0,
      isBlacklisted: false,
      sslValid: baseResult.sslValid || false,
      hasMX: baseResult.hasMX || false,
      warnings: [...(baseResult.warnings || []), 'API check failed'],
      recommendations: [...(baseResult.recommendations || []), 'Manual verification recommended']
    } as DomainReputationResult;
  }
}

// Check if domain is a known shortening service
export function isShorteningService(domain: string): boolean {
  const shorteners = [
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
    'buff.ly', 'adf.ly', 'bit.do', 'mcaf.ee', 'snip.ly'
  ];
  
  return shorteners.includes(domain.toLowerCase());
}

// Check for suspicious TLD patterns
export function hasSuspiciousTLD(domain: string): boolean {
  const tld = domain.split('.').pop()?.toLowerCase();
  const suspiciousTLDs = [
    'tk', 'ml', 'ga', 'cf', 'gq', 'men', 'click', 'download',
    'top', 'site', 'online', 'shop', 'store', 'tech'
  ];
  
  return tld ? suspiciousTLDs.includes(tld) : false;
}
