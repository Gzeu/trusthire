// LangChain Integration for TrustHire
// Advanced AI capabilities with LLM chains, agents, and memory

import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent, AgentExecutor } from "langchain/agents";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { VectorStoreRetriever } from "langchain/vectorstores/base";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";

export interface LangChainConfig {
  provider: 'openai' | 'groq';
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey: string;
}

export interface SecurityAnalysisChain {
  id: string;
  name: string;
  description: string;
  chain: any;
  tools: any[];
  memory?: any;
  retriever?: any;
}

export interface AgentTool {
  name: string;
  description: string;
  schema: z.ZodSchema;
  function: (input: any) => Promise<any>;
}

export interface ConversationMemory {
  sessionId: string;
  messages: any[];
  context: Record<string, any>;
  lastUpdated: string;
}

export class LangChainIntegration {
  private llm: any;
  private embeddings: any;
  private vectorStore: any;
  private chains: Map<string, SecurityAnalysisChain> = new Map();
  private memories: Map<string, ConversationMemory> = new Map();
  private tools: Map<string, AgentTool> = new Map();
  private config: LangChainConfig;

  constructor(config: LangChainConfig) {
    this.config = config;
    this.initializeLLM();
    this.initializeEmbeddings();
    this.initializeVectorStore();
    this.initializeTools();
    this.initializeChains();
  }

  // Initialize LLM based on provider
  private initializeLLM(): void {
    switch (this.config.provider) {
      case 'openai':
        this.llm = new ChatOpenAI({
          modelName: this.config.model,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens,
          openAIApiKey: this.config.apiKey,
        });
        break;
      case 'groq':
        this.llm = new ChatGroq({
          modelName: this.config.model,
          temperature: this.config.temperature,
          maxTokens: this.config.maxTokens,
          groqApiKey: this.config.apiKey,
        });
        break;
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

  // Initialize embeddings
  private initializeEmbeddings(): void {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: this.config.apiKey,
    });
  }

  // Initialize vector store for document retrieval
  private initializeVectorStore(): void {
    this.vectorStore = new MemoryVectorStore(this.embeddings);
  }

  // Initialize security analysis tools
  private initializeTools(): void {
    // Sandbox analysis tool
    this.tools.set('sandbox_analysis', {
      name: 'sandbox_analysis',
      description: 'Analyze code in a secure sandbox environment for security threats',
      schema: z.object({
        code: z.string().describe('The code to analyze'),
        language: z.string().optional().describe('Programming language of the code'),
      }),
      function: async (input) => {
        // This would integrate with the existing sandbox analyzer
        return {
          threats: ['potential_command_injection'],
          riskLevel: 'high',
          confidence: 85,
          details: 'Code contains dynamic execution patterns'
        };
      },
    });

    // Threat intelligence lookup tool
    this.tools.set('threat_lookup', {
      name: 'threat_lookup',
      description: 'Look up threat intelligence data for domains, IPs, or hashes',
      schema: z.object({
        query: z.string().describe('Domain, IP, or hash to look up'),
        type: z.enum(['domain', 'ip', 'hash']).describe('Type of threat to look up'),
      }),
      function: async (input) => {
        // This would integrate with the existing threat intelligence
        return {
          isThreat: true,
          threatType: 'malware_distribution',
          confidence: 92,
          firstSeen: '2024-01-15',
          lastSeen: '2024-04-18',
        };
      },
    });

    // Profile verification tool
    this.tools.set('profile_verification', {
      name: 'profile_verification',
      description: 'Verify the authenticity of a recruiter or company profile',
      schema: z.object({
        profileUrl: z.string().describe('URL of the profile to verify'),
        platform: z.string().describe('Platform of the profile (linkedin, email, etc.)'),
      }),
      function: async (input) => {
        // This would integrate with the existing profile analyzer
        return {
          authenticityScore: 75,
          verificationStatus: 'likely_legitimate',
          redFlags: ['new_account'],
          recommendations: ['Verify through official channels']
        };
      },
    });

    // Communication analysis tool
    this.tools.set('communication_analysis', {
      name: 'communication_analysis',
      description: 'Analyze communication patterns for legitimacy and manipulation tactics',
      schema: z.object({
        message: z.string().describe('The message to analyze'),
        context: z.object({
          platform: z.string().optional(),
          senderProfile: z.string().optional(),
          previousMessages: z.array(z.string()).optional(),
        }).optional(),
      }),
      function: async (input) => {
        // This would integrate with the existing AI analyzer
        return {
          legitimacyScore: 60,
          riskLevel: 'medium',
          suspiciousPatterns: ['urgency_tactics'],
          sentiment: 'neutral',
          recommendations: ['Verify company information']
        };
      },
    });

    // Repository analysis tool
    this.tools.set('repository_analysis', {
      name: 'repository_analysis',
      description: 'Analyze a code repository for security threats and malicious patterns',
      schema: z.object({
        repositoryUrl: z.string().describe('URL of the repository to analyze'),
        branch: z.string().optional().describe('Branch to analyze (default: main)'),
      }),
      function: async (input) => {
        // This would integrate with the existing repository scanner
        return {
          threatsFound: 3,
          riskLevel: 'high',
          suspiciousFiles: ['setup.sh', 'postinstall.js'],
          recommendations: ['Do not clone or execute code']
        };
      },
    });
  }

  // Initialize specialized chains
  private initializeChains(): void {
    // Security assessment chain
    const securityAssessmentPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a senior security analyst specializing in recruitment scams and cyber threats.
        
        Your task is to provide comprehensive security assessments for recruitment communications, 
        code repositories, and recruiter profiles. Use the available tools to gather information
        and provide detailed, actionable security recommendations.
        
        Always consider:
        1. Urgency tactics and pressure
        2. Vague job descriptions
        3. Requests for personal information
        4. Suspicious links or attachments
        5. Company verification issues
        6. Technical security indicators
        
        Provide your assessment in a structured format with:
        - Overall risk level (critical/high/medium/low)
        - Specific threats identified
        - Confidence in assessment
        - Actionable recommendations
        - Next steps for verification`
      ],
      ["human", "Assessment Request: {request}"],
      ["human", "Context: {context}"],
    ]);

    const securityAssessmentChain = securityAssessmentPrompt
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    this.chains.set('security_assessment', {
      id: 'security_assessment',
      name: 'Security Assessment Chain',
      description: 'Comprehensive security assessment using multiple tools',
      chain: securityAssessmentChain,
      tools: Array.from(this.tools.values()),
    });

    // Threat prediction chain
    const threatPredictionPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a threat intelligence analyst specializing in predicting cyber attacks and 
        recruitment scams. Your task is to analyze available information and predict potential
        threats with probability assessments.
        
        Consider these attack vectors:
        1. Phishing attacks
        2. Malware distribution
        3. Social engineering
        4. Data exfiltration
        5. Fake job scams
        6. Business email compromise
        
        For each prediction, provide:
        - Threat type
        - Probability (0-100%)
        - Timeline (immediate/short-term/long-term)
        - Impact level (critical/high/medium/low)
        - Required countermeasures
        - Confidence in prediction`
      ],
      ["human", "Threat Analysis Request: {request}"],
      ["human", "Available Data: {data}"],
    ]);

    const threatPredictionChain = threatPredictionPrompt
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    this.chains.set('threat_prediction', {
      id: 'threat_prediction',
      name: 'Threat Prediction Chain',
      description: 'Predict potential threats and attack vectors',
      chain: threatPredictionChain,
      tools: [],
    });

    // Communication analysis chain
    const communicationAnalysisPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert in communication analysis and deception detection. Your task is to 
        analyze recruitment communications for legitimacy, manipulation tactics, and security risks.
        
        Analyze for:
        1. Professionalism indicators
        2. Urgency and pressure tactics
        3. Vague or inconsistent information
        4. Suspicious requests
        5. Grammar and language patterns
        6. Contextual red flags
        
        Provide analysis with:
        - Legitimacy score (0-100)
        - Risk level assessment
        - Suspicious patterns identified
        - Sentiment analysis
        - Professionalism rating
        - Specific recommendations`
      ],
      ["human", "Message: {message}"],
      ["human", "Context: {context}"],
    ]);

    const communicationAnalysisChain = communicationAnalysisPrompt
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    this.chains.set('communication_analysis', {
      id: 'communication_analysis',
      name: 'Communication Analysis Chain',
      description: 'Deep analysis of recruitment communications',
      chain: communicationAnalysisChain,
      tools: [],
    });
  }

  // Create security agent with tools
  async createSecurityAgent(): Promise<AgentExecutor> {
    const tools = Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      schema: tool.schema,
      function: tool.function,
    }));

    const prompt = await pull(
      "hwchase17/react-chat",
      "template",
      {
        input: ["input", "agent_scratchpad", "chat_history"],
        template: `You are a helpful security analyst assistant. Use the provided tools to analyze security threats and provide comprehensive assessments.

TOOLS:
------
{tools}

Tool names: {tool_names}

Previous conversation history:
{chat_history}

Current request: {input}
{agent_scratchpad}`,
      }
    );

    const agent = await createReactAgent({
      llm: this.llm,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      memory: new MemorySaver(),
      verbose: true,
    });

    return agentExecutor;
  }

  // Run security assessment with agent
  async runSecurityAssessment(request: string, context?: any): Promise<any> {
    const agent = await this.createSecurityAgent();
    
    const input = {
      input: request,
      chat_history: this.getConversationHistory(context?.sessionId),
    };

    const result = await agent.invoke(input);
    
    // Store conversation in memory
    if (context?.sessionId) {
      this.updateConversationMemory(context.sessionId, request, result.output);
    }

    return result;
  }

  // Run chain-based analysis
  async runChain(chainId: string, inputs: Record<string, any>): Promise<any> {
    const chain = this.chains.get(chainId);
    if (!chain) {
      throw new Error(`Chain not found: ${chainId}`);
    }

    return await chain.chain.invoke(inputs);
  }

  // Add documents to vector store for retrieval
  async addDocuments(documents: Array<{ text: string; metadata?: any }>): Promise<void> {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = documents.map(doc => 
      new Document({
        pageContent: doc.text,
        metadata: doc.metadata || {},
      })
    );

    const splitDocs = await textSplitter.splitDocuments(docs);
    await this.vectorStore.addDocuments(splitDocs);
  }

  // Retrieve relevant documents
  async retrieveDocuments(query: string, k: number = 5): Promise<Document[]> {
    const retriever = this.vectorStore.asRetriever(k);
    return await retriever.invoke(query);
  }

  // Create RAG (Retrieval-Augmented Generation) chain
  async createRAGChain(): Promise<any> {
    const retriever = this.vectorStore.asRetriever(5);
    
    const template = `Answer the following question based on the provided context. 
    If you don't know the answer, say that you don't know. Use three sentences maximum 
    and keep the answer concise.

    Context: {context}

    Question: {question}

    Helpful Answer:`;

    const prompt = ChatPromptTemplate.fromTemplate(template);
    
    const ragChain = RunnableSequence.from([
      {
        context: retriever.pipe((docs) => docs.map(doc => doc.pageContent).join("\n")),
        question: (input) => input.question,
      },
      prompt,
      this.llm,
      new StringOutputParser(),
    ]);

    return ragChain;
  }

  // Run RAG analysis
  async runRAGAnalysis(question: string): Promise<any> {
    const ragChain = await this.createRAGChain();
    return await ragChain.invoke({ question });
  }

  // Conversation memory management
  private getConversationHistory(sessionId?: string): any[] {
    if (!sessionId) return [];
    
    const memory = this.memories.get(sessionId);
    return memory?.messages || [];
  }

  private updateConversationMemory(sessionId: string, input: string, output: string): void {
    const memory = this.memories.get(sessionId) || {
      sessionId,
      messages: [],
      context: {},
      lastUpdated: new Date().toISOString(),
    };

    memory.messages.push(
      new HumanMessage(input),
      new AIMessage(output)
    );
    
    memory.lastUpdated = new Date().toISOString();
    this.memories.set(sessionId, memory);
  }

  // Get conversation memory
  getConversationMemory(sessionId: string): ConversationMemory | undefined {
    return this.memories.get(sessionId);
  }

  // Clear conversation memory
  clearConversationMemory(sessionId: string): void {
    this.memories.delete(sessionId);
  }

  // Add custom tool
  addTool(tool: AgentTool): void {
    this.tools.set(tool.name, tool);
  }

  // Get available tools
  getAvailableTools(): AgentTool[] {
    return Array.from(this.tools.values());
  }

  // Get available chains
  getAvailableChains(): SecurityAnalysisChain[] {
    return Array.from(this.chains.values());
  }

  // Update configuration
  updateConfig(config: Partial<LangChainConfig>): void {
    this.config = { ...this.config, ...config };
    this.initializeLLM();
    this.initializeEmbeddings();
  }

  // Export configuration and state
  exportState(): any {
    return {
      config: this.config,
      chains: Array.from(this.chains.entries()).map(([id, chain]) => ({
        id,
        name: chain.name,
        description: chain.description,
      })),
      tools: Array.from(this.tools.entries()).map(([name, tool]) => ({
        name,
        description: tool.description,
      })),
      memories: Array.from(this.memories.entries()).map(([sessionId, memory]) => ({
        sessionId,
        messageCount: memory.messages.length,
        lastUpdated: memory.lastUpdated,
      })),
    };
  }

  // Performance monitoring
  async benchmarkChain(chainId: string, inputs: Record<string, any>, iterations: number = 10): Promise<any> {
    const chain = this.chains.get(chainId);
    if (!chain) {
      throw new Error(`Chain not found: ${chainId}`);
    }

    const times: number[] = [];
    const results: any[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      const result = await chain.chain.invoke(inputs);
      const end = Date.now();
      
      times.push(end - start);
      results.push(result);
    }

    return {
      chainId,
      iterations,
      averageTime: times.reduce((sum, time) => sum + time, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      times,
      sampleResults: results.slice(0, 3),
    };
  }
}

// Singleton instance
export const langchainIntegration = new LangChainIntegration({
  provider: 'groq',
  model: 'mixtral-8x7b-32768',
  temperature: 0.1,
  maxTokens: 4000,
  apiKey: process.env.GROQ_API_KEY || '',
});

// React hook for using LangChain integration
export function useLangChainIntegration() {
  return langchainIntegration;
}

export default langchainIntegration;
