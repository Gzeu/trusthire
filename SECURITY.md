# Security Configuration Guide

## **IMPORTANT: API Keys and Environment Variables**

### **Never Commit API Keys to Git!**

This project uses multiple AI services that require API keys. **NEVER** commit actual API keys to the repository.

### **Environment Variables Setup**

1. **Copy the example file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Add your actual API keys to `.env.local`:**
   ```env
   # Replace with your actual API keys
   OPENAI_API_KEY="your-openai-api-key-here"
   GROQ_API_KEY="your-groq-api-key-here"
   MISTRAL_API_KEY="your-mistral-api-key-here"
   ```

3. **The `.env.local` file is automatically ignored by Git**

### **API Keys Required:**

- **OpenAI API Key**: For LangChain integration
- **Groq API Key**: For AI analysis features
- **Mistral API Key**: For advanced security analysis

### **Security Best Practices:**

1. **Never share your `.env.local` file**
2. **Use different API keys for development and production**
3. **Rotate API keys regularly**
4. **Monitor API usage and costs**
5. **Use environment-specific configurations**

### **Git Protection:**

The following files are automatically ignored by `.gitignore`:
- `.env.local`
- `.env.production`
- `.env.development`
- `*.key`
- `secrets/`

### **Production Deployment:**

For production deployment, set environment variables in your hosting platform:
- **Vercel**: Environment Variables settings
- **Docker**: Environment file or docker-compose
- **Kubernetes**: Secrets and ConfigMaps
- **AWS**: Parameter Store or Secrets Manager

### **Troubleshooting:**

If you see API key errors:
1. Check that `.env.local` exists and is properly configured
2. Verify API keys are valid and active
3. Ensure you have sufficient API credits/quotas
4. Check network connectivity and firewall settings

### **Security Monitoring:**

- Monitor API usage logs for unusual activity
- Set up alerts for API rate limits
- Regular security audits of API access
- Implement IP restrictions if needed

---

**Remember: API keys are like passwords - keep them secret and secure!**
