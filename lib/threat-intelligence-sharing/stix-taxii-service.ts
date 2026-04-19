// STIX/TAXII Threat Intelligence Sharing Service
// Complete threat intelligence sharing platform with STIX/TAXII standards

import { PrismaClient } from '@prisma/client';
import { getRedisClient } from '@/lib/redis-wrapper';

export interface STIXObject {
  id: string;
  type: string;
  created: string;
  modified: string;
  spec_version: string;
  object_marking_refs?: string[];
  object_refs?: string[];
  extensions?: Record<string, any>;
  [key: string]: any;
}

export interface STIXIndicator extends STIXObject {
  type: 'indicator';
  pattern: string;
  pattern_type: string;
  pattern_version: string;
  valid_from: string;
  valid_until?: string;
  kill_chain_phases?: STIXKillChainPhase[];
  labels: string[];
  confidence?: number;
  lang?: string;
  external_references?: STIXExternalReference[];
}

export interface STIXKillChainPhase {
  kill_chain_name: string;
  phase_name: string;
}

export interface STIXExternalReference {
  source_name: string;
  description?: string;
  url?: string;
  external_id?: string;
}

export interface STIXMalware extends STIXObject {
  type: 'malware';
  labels: string[];
  name: string;
  description?: string;
  kill_chain_phases?: STIXKillChainPhase[];
  first_seen?: string;
  last_seen?: string;
  operating_system_refs?: string[];
  execution_envs?: string[];
  architecture_execution_envs?: string[];
  capabilities?: string[];
  sample_refs?: string[];
}

export interface STIXThreatActor extends STIXObject {
  type: 'threat-actor';
  labels: string[];
  name: string;
  description?: string;
  aliases?: string[];
  roles?: string[];
  goals?: string[];
  sophistication?: string;
  resource_level?: string;
  primary_motivation?: string;
  secondary_motivations?: string[];
  personal_motivations?: string[];
}

export interface STIXAttackPattern extends STIXObject {
  type: 'attack-pattern';
  name: string;
  description?: string;
  kill_chain_phases?: STIXKillChainPhase[];
  aliases?: string[];
}

export interface STIXCampaign extends STIXObject {
  type: 'campaign';
  name: string;
  description?: string;
  aliases?: string[];
  first_seen?: string;
  last_seen?: string;
  objective?: string;
  activity?: STIXRelationship[];
}

export interface STIXRelationship extends STIXObject {
  type: 'relationship';
  relationship_type: string;
  source_ref: string;
  target_ref: string;
  description?: string;
  start_time?: string;
  stop_time?: string;
}

export interface STIXReport extends STIXObject {
  type: 'report';
  name: string;
  description?: string;
  published: string;
  object_refs: string[];
  labels: string[];
  authors?: string[];
}

export interface TAXIICollection {
  id: string;
  title: string;
  description: string;
  can_read: boolean;
  can_write: boolean;
  media_types: string[];
  objects: STIXObject[];
  manifest: TAXIIManifest[];
  created_at: string;
  updated_at: string;
  access_control: TAXIIAccessControl;
}

export interface TAXIIManifest {
  id: string;
  date_added: string;
  versions: string[];
  media_type: string;
}

export interface TAXIIAccessControl {
  authentication_required: boolean;
  authorization_required: boolean;
  allowed_users: string[];
  allowed_groups: string[];
  access_level: 'public' | 'restricted' | 'private';
}

export interface TAXIIServer {
  id: string;
  name: string;
  description: string;
  url: string;
  api_root: string;
  collections: TAXIICollection[];
  discovery: TAXIIDiscovery;
  authentication: TAXIIAuthentication;
  status: TAXIIServerStatus;
  last_sync: string;
  sync_frequency: number; // minutes
  created_at: string;
  updated_at: string;
}

export interface TAXIIDiscovery {
  title: string;
  description: string;
  contact: string;
  api_roots: string[];
  default_api_root: string;
  server_version: string;
  max_content_length: number;
}

export interface TAXIIAuthentication {
  type: 'basic' | 'bearer' | 'api_key' | 'certificate' | 'oauth';
  credentials: Record<string, string>;
  required: boolean;
}

export interface TAXIIServerStatus {
  status: 'online' | 'offline' | 'error';
  last_check: string;
  response_time: number;
  error_message?: string;
  collections_count: number;
  objects_count: number;
}

export interface SharingPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source_filters: SharingFilter[];
  destination_filters: SharingFilter[];
  transformation_rules: TransformationRule[];
  sharing_rules: SharingRule[];
  schedule: SharingSchedule;
  monitoring: SharingMonitoring;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface SharingFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'contains' | 'regex';
  value: any;
  required: boolean;
}

export interface TransformationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  source_format: string;
  target_format: string;
  mapping: Record<string, string>;
  transformations: Transformation[];
}

export interface Transformation {
  source_field: string;
  target_field: string;
  transformation_type: 'direct' | 'format' | 'calculate' | 'lookup' | 'conditional';
  parameters: Record<string, any>;
  required: boolean;
}

export interface SharingRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  condition: string;
  action: 'allow' | 'deny' | 'transform' | 'delay' | 'escalate';
  parameters: Record<string, any>;
  priority: number;
}

export interface SharingSchedule {
  enabled: boolean;
  frequency: number; // minutes
  timezone: string;
  retry_policy: RetryPolicy;
  batch_size: number;
  max_retries: number;
}

export interface RetryPolicy {
  max_attempts: number;
  backoff_type: 'fixed' | 'exponential' | 'linear';
  base_delay: number; // seconds
  max_delay: number; // seconds
  retry_on: ('failure' | 'timeout' | 'error')[];
}

export interface SharingMonitoring {
  enabled: boolean;
  metrics: SharingMetrics;
  alerts: SharingAlert[];
  logging: SharingLogging;
}

export interface SharingMetrics {
  total_shares: number;
  successful_shares: number;
  failed_shares: number;
  average_processing_time: number;
  last_share: string;
  error_rate: number;
  throughput: number; // objects per minute
}

export interface SharingAlert {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  condition: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  channels: AlertChannel[];
  threshold: AlertThreshold;
}

export interface AlertChannel {
  type: 'email' | 'webhook' | 'slack' | 'teams';
  destination: string;
  enabled: boolean;
  template: string;
}

export interface AlertThreshold {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
  duration: number; // minutes
}

export interface SharingLogging {
  enabled: boolean;
  level: 'debug' | 'info' | 'warning' | 'error';
  retention_days: number;
  include_sensitive: boolean;
  audit_trail: boolean;
}

export interface STIXBundle {
  type: 'bundle';
  id: string;
  spec_version: string;
  objects: STIXObject[];
}

export interface TAXIIResponse {
  success: boolean;
  data?: any;
  error?: string;
  status_code?: number;
  headers?: Record<string, string>;
}

export interface SharingSession {
  id: string;
  policy_id: string;
  source_server_id?: string;
  destination_server_id?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  objects_processed: number;
  objects_total: number;
  errors: SharingError[];
  metrics: SharingMetrics;
}

export interface SharingError {
  id: string;
  timestamp: string;
  severity: 'error' | 'warning';
  message: string;
  details?: string;
  object_id?: string;
  retry_count: number;
}

class STIXTAXIIService {
  private prisma: PrismaClient;
  private redis: any;
  private servers: Map<string, TAXIIServer> = new Map();
  private collections: Map<string, TAXIICollection> = new Map();
  private policies: Map<string, SharingPolicy> = new Map();
  private sessions: Map<string, SharingSession> = new Map();
  private isProcessing = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = getRedisClient();
    this.initializeDefaultServers();
    this.initializeDefaultPolicies();
    this.startSharingProcessor();
  }

  // Add TAXII server
  async addServer(server: Omit<TAXIIServer, 'id' | 'created_at' | 'updated_at' | 'status' | 'last_sync'>): Promise<TAXIIServer> {
    try {
      const newServer: TAXIIServer = {
        ...server,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: {
          status: 'offline',
          last_check: new Date().toISOString(),
          response_time: 0,
          collections_count: 0,
          objects_count: 0
        },
        last_sync: new Date().toISOString()
      };

      // Store in database
      await this.prisma.taxiiServer.create({
        data: {
          id: newServer.id,
          name: newServer.name,
          description: newServer.description,
          url: newServer.url,
          apiRoot: newServer.api_root,
          discovery: JSON.stringify(newServer.discovery),
          authentication: JSON.stringify(newServer.authentication),
          status: JSON.stringify(newServer.status),
          lastSync: new Date(newServer.last_sync),
          syncFrequency: newServer.sync_frequency,
          createdAt: new Date(newServer.created_at),
          updatedAt: new Date(newServer.updated_at)
        }
      });

      // Store in memory
      this.servers.set(newServer.id, newServer);

      return newServer;
    } catch (error) {
      console.error('Failed to add TAXII server:', error);
      throw error;
    }
  }

  // Add sharing policy
  async addPolicy(policy: Omit<SharingPolicy, 'id' | 'created_at' | 'updated_at'>): Promise<SharingPolicy> {
    try {
      const newPolicy: SharingPolicy = {
        ...policy,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store in database
      await this.prisma.sharingPolicy.create({
        data: {
          id: newPolicy.id,
          name: newPolicy.name,
          description: newPolicy.description,
          enabled: newPolicy.enabled,
          priority: newPolicy.priority,
          sourceFilters: JSON.stringify(newPolicy.source_filters),
          destinationFilters: JSON.stringify(newPolicy.destination_filters),
          transformationRules: JSON.stringify(newPolicy.transformation_rules),
          sharingRules: JSON.stringify(newPolicy.sharing_rules),
          schedule: JSON.stringify(newPolicy.schedule),
          monitoring: JSON.stringify(newPolicy.monitoring),
          createdBy: newPolicy.created_by,
          createdAt: new Date(newPolicy.created_at),
          updatedAt: new Date(newPolicy.updated_at)
        }
      });

      // Store in memory
      this.policies.set(newPolicy.id, newPolicy);

      return newPolicy;
    } catch (error) {
      console.error('Failed to add sharing policy:', error);
      throw error;
    }
  }

  // Connect to TAXII server
  async connectToServer(serverId: string): Promise<TAXIIResponse> {
    try {
      const server = this.servers.get(serverId);
      if (!server) {
        return { success: false, error: 'Server not found' };
      }

      // Test server connectivity
      const startTime = Date.now();
      const response = await this.testServerConnection(server);
      const responseTime = Date.now() - startTime;

      // Update server status
      server.status = {
        status: response.success ? 'online' : 'error',
        last_check: new Date().toISOString(),
        response_time: responseTime,
        error_message: response.error,
        collections_count: server.collections.length,
        objects_count: server.collections.reduce((sum, col) => sum + col.objects.length, 0)
      };

      if (response.success) {
        // Discover collections
        await this.discoverCollections(server);
      }

      return response;
    } catch (error) {
      console.error('Failed to connect to TAXII server:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Connection failed' };
    }
  }

  // Test server connection
  private async testServerConnection(server: TAXIIServer): Promise<TAXIIResponse> {
    try {
      // Mock connection test - in production, this would make actual HTTP requests
      const mockResponse = {
        success: true,
        status_code: 200,
        headers: {
          'content-type': 'application/taxii+json',
          'x-taxii-server': 'TrustHire TAXII Server 1.0'
        }
      };

      return mockResponse;
    } catch (error) {
      console.error('Server connection test failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Connection test failed' };
    }
  }

  // Discover collections
  private async discoverCollections(server: TAXIIServer): Promise<void> {
    try {
      // Mock collection discovery - in production, this would query the TAXII server
      const mockCollections: TAXIICollection[] = [
        {
          id: 'collection-1',
          title: 'Indicators',
          description: 'Malicious indicators collection',
          can_read: true,
          can_write: false,
          media_types: ['application/stix+json'],
          objects: [],
          manifest: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          access_control: {
            authentication_required: true,
            authorization_required: false,
            allowed_users: [],
            allowed_groups: [],
            access_level: 'public'
          }
        },
        {
          id: 'collection-2',
          title: 'Malware',
          description: 'Malware samples and analysis',
          can_read: true,
          can_write: true,
          media_types: ['application/stix+json'],
          objects: [],
          manifest: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          access_control: {
            authentication_required: true,
            authorization_required: true,
            allowed_users: ['admin'],
            allowed_groups: ['analysts'],
            access_level: 'restricted'
          }
        }
      ];

      server.collections = mockCollections;
      mockCollections.forEach(collection => {
        this.collections.set(collection.id, collection);
      });
    } catch (error) {
      console.error('Failed to discover collections:', error);
    }
  }

  // Get objects from collection
  async getObjects(serverId: string, collectionId: string, filters?: {
    type?: string;
    added_after?: string;
    limit?: number;
    offset?: number;
  }): Promise<TAXIIResponse> {
    try {
      const server = this.servers.get(serverId);
      if (!server) {
        return { success: false, error: 'Server not found' };
      }

      const collection = server.collections.find(c => c.id === collectionId);
      if (!collection) {
        return { success: false, error: 'Collection not found' };
      }

      // Mock object retrieval - in production, this would query the TAXII server
      const mockObjects: STIXObject[] = [
        {
          id: 'indicator-1',
          type: 'indicator',
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          spec_version: '2.1',
          pattern: "[file:hashes.MD5 = 'd41d8cd98f00b204e9800998ecf8427e']",
          pattern_type: 'stix',
          pattern_version: '2.1',
          valid_from: new Date().toISOString(),
          labels: ['malicious-activity'],
          confidence: 80
        },
        {
          id: 'malware-1',
          type: 'malware',
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          spec_version: '2.1',
          name: 'Backdoor.Sample',
          labels: ['trojan'],
          description: 'Sample backdoor malware'
        }
      ];

      // Apply filters
      let filteredObjects = mockObjects;
      if (filters?.type) {
        filteredObjects = filteredObjects.filter(obj => obj.type === filters.type);
      }
      if (filters?.added_after) {
        const afterDate = new Date(filters.added_after);
        filteredObjects = filteredObjects.filter(obj => new Date(obj.created) >= afterDate);
      }
      if (filters?.limit) {
        const start = filters.offset || 0;
        filteredObjects = filteredObjects.slice(start, start + filters.limit);
      }

      return {
        success: true,
        data: {
          objects: filteredObjects,
          more: false,
          next: null
        }
      };
    } catch (error) {
      console.error('Failed to get objects:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get objects' };
    }
  }

  // Add objects to collection
  async addObjects(serverId: string, collectionId: string, objects: STIXObject[]): Promise<TAXIIResponse> {
    try {
      const server = this.servers.get(serverId);
      if (!server) {
        return { success: false, error: 'Server not found' };
      }

      const collection = server.collections.find(c => c.id === collectionId);
      if (!collection) {
        return { success: false, error: 'Collection not found' };
      }

      if (!collection.can_write) {
        return { success: false, error: 'Write access not allowed' };
      }

      // Validate objects
      const validationErrors = this.validateSTIXObjects(objects);
      if (validationErrors.length > 0) {
        return { success: false, error: `Validation errors: ${validationErrors.join(', ')}` };
      }

      // Mock object addition - in production, this would POST to the TAXII server
      collection.objects.push(...objects);

      return {
        success: true,
        data: {
          added: objects.length,
          objects: objects.map(obj => ({ id: obj.id, type: obj.type }))
        }
      };
    } catch (error) {
      console.error('Failed to add objects:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add objects' };
    }
  }

  // Validate STIX objects
  private validateSTIXObjects(objects: STIXObject[]): string[] {
    const errors: string[] = [];

    for (const obj of objects) {
      // Check required fields
      if (!obj.id) errors.push(`Object missing id`);
      if (!obj.type) errors.push(`Object missing type`);
      if (!obj.created) errors.push(`Object ${obj.id} missing created`);
      if (!obj.modified) errors.push(`Object ${obj.id} missing modified`);
      if (!obj.spec_version) errors.push(`Object ${obj.id} missing spec_version`);

      // Validate ID format
      if (obj.id && !obj.id.match(/^[a-z-]+--[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
        errors.push(`Object ${obj.id} has invalid ID format`);
      }

      // Validate type-specific fields
      if (obj.type === 'indicator') {
        const indicator = obj as STIXIndicator;
        if (!indicator.pattern) errors.push(`Indicator ${obj.id} missing pattern`);
        if (!indicator.pattern_type) errors.push(`Indicator ${obj.id} missing pattern_type`);
        if (!indicator.valid_from) errors.push(`Indicator ${obj.id} missing valid_from`);
      }
    }

    return errors;
  }

  // Execute sharing policy
  async executePolicy(policyId: string): Promise<SharingSession> {
    try {
      const policy = this.policies.get(policyId);
      if (!policy) {
        throw new Error(`Policy ${policyId} not found`);
      }

      const session: SharingSession = {
        id: crypto.randomUUID(),
        policy_id: policyId,
        status: 'pending',
        started_at: new Date().toISOString(),
        objects_processed: 0,
        objects_total: 0,
        errors: [],
        metrics: {
          total_shares: 0,
          successful_shares: 0,
          failed_shares: 0,
          average_processing_time: 0,
          last_share: '',
          error_rate: 0,
          throughput: 0
        }
      };

      this.sessions.set(session.id, session);

      // Start sharing process
      await this.startSharingSession(session);

      return session;
    } catch (error) {
      console.error('Failed to execute policy:', error);
      throw error;
    }
  }

  // Start sharing session
  private async startSharingSession(session: SharingSession): Promise<void> {
    try {
      session.status = 'running';
      session.started_at = new Date().toISOString();

      const policy = this.policies.get(session.policy_id);
      if (!policy) return;

      // Get source objects
      const sourceObjects = await this.getSourceObjects(policy);
      session.objects_total = sourceObjects.length;

      // Process each object
      for (const obj of sourceObjects) {
        try {
          await this.processObject(session, obj, policy);
          session.objects_processed++;
          session.metrics.successful_shares++;
        } catch (error) {
          session.metrics.failed_shares++;
          session.errors.push({
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            severity: 'error',
            message: error instanceof Error ? error.message : 'Processing failed',
            object_id: obj.id,
            retry_count: 0
          });
        }
      }

      // Update session status
      session.status = session.metrics.failed_shares === 0 ? 'completed' : 'completed';
      session.completed_at = new Date().toISOString();
      session.metrics.total_shares = session.objects_processed;
      session.metrics.error_rate = session.metrics.failed_shares / session.objects_total;
      session.metrics.last_share = new Date().toISOString();

    } catch (error) {
      console.error('Sharing session failed:', error);
      session.status = 'failed';
      session.completed_at = new Date().toISOString();
    }
  }

  // Get source objects
  private async getSourceObjects(policy: SharingPolicy): Promise<STIXObject[]> {
    try {
      // Mock source objects - in production, this would query internal databases
      const mockObjects: STIXObject[] = [
        {
          id: 'indicator-internal-1',
          type: 'indicator',
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          spec_version: '2.1',
          pattern: "[file:hashes.MD5 = 'e2fc714c4727ee9395f324cd2e7f331f']",
          pattern_type: 'stix',
          pattern_version: '2.1',
          valid_from: new Date().toISOString(),
          labels: ['malicious-activity'],
          confidence: 90
        },
        {
          id: 'malware-internal-1',
          type: 'malware',
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          spec_version: '2.1',
          name: 'Trojan.Sample',
          labels: ['trojan'],
          description: 'Internal trojan sample'
        }
      ];

      // Apply source filters
      let filteredObjects = mockObjects;
      for (const filter of policy.source_filters) {
        filteredObjects = this.applyFilter(filteredObjects, filter);
      }

      return filteredObjects;
    } catch (error) {
      console.error('Failed to get source objects:', error);
      return [];
    }
  }

  // Apply filter
  private applyFilter(objects: STIXObject[], filter: SharingFilter): STIXObject[] {
    return objects.filter(obj => {
      const value = this.getFieldValue(obj, filter.field);
      return this.applyOperator(value, filter.operator, filter.value);
    });
  }

  // Get field value
  private getFieldValue(obj: STIXObject, field: string): any {
    const parts = field.split('.');
    let value: any = obj;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    return value;
  }

  // Apply operator
  private applyOperator(value: any, operator: string, conditionValue: any): boolean {
    switch (operator) {
      case 'eq':
        return value === conditionValue;
      case 'ne':
        return value !== conditionValue;
      case 'gt':
        return Number(value) > Number(conditionValue);
      case 'lt':
        return Number(value) < Number(conditionValue);
      case 'gte':
        return Number(value) >= Number(conditionValue);
      case 'lte':
        return Number(value) <= Number(conditionValue);
      case 'in':
        return Array.isArray(conditionValue) && conditionValue.includes(value);
      case 'not_in':
        return Array.isArray(conditionValue) && !conditionValue.includes(value);
      case 'contains':
        return String(value).includes(String(conditionValue));
      case 'regex':
        return new RegExp(conditionValue).test(String(value));
      default:
        return false;
    }
  }

  // Process object
  private async processObject(session: SharingSession, obj: STIXObject, policy: SharingPolicy): Promise<void> {
    try {
      // Apply transformation rules
      let transformedObj = obj;
      for (const rule of policy.transformation_rules) {
        if (rule.enabled) {
          transformedObj = await this.transformObject(transformedObj, rule);
        }
      }

      // Apply sharing rules
      for (const rule of policy.sharing_rules) {
        if (rule.enabled && this.evaluateRuleCondition(transformedObj, rule.condition)) {
          await this.executeRuleAction(transformedObj, rule);
        }
      }

      // Send to destination servers
      await this.sendToDestinations(transformedObj, policy);

    } catch (error) {
      console.error('Failed to process object:', error);
      throw error;
    }
  }

  // Transform object
  private async transformObject(obj: STIXObject, rule: TransformationRule): Promise<STIXObject> {
    try {
      const transformed = { ...obj };

      for (const transformation of rule.transformations) {
        const sourceValue = this.getFieldValue(obj, transformation.source_field);
        
        switch (transformation.transformation_type) {
          case 'direct':
            this.setFieldValue(transformed, transformation.target_field, sourceValue);
            break;
          case 'format':
            const formattedValue = this.formatValue(sourceValue, transformation.parameters);
            this.setFieldValue(transformed, transformation.target_field, formattedValue);
            break;
          case 'calculate':
            const calculatedValue = this.calculateValue(obj, transformation.parameters);
            this.setFieldValue(transformed, transformation.target_field, calculatedValue);
            break;
          case 'lookup':
            const lookedUpValue = this.lookupValue(sourceValue, transformation.parameters);
            this.setFieldValue(transformed, transformation.target_field, lookedUpValue);
            break;
          case 'conditional':
            const conditionalValue = this.applyConditionalLogic(obj, transformation.parameters);
            this.setFieldValue(transformed, transformation.target_field, conditionalValue);
            break;
        }
      }

      return transformed;
    } catch (error) {
      console.error('Failed to transform object:', error);
      return obj;
    }
  }

  // Set field value
  private setFieldValue(obj: STIXObject, field: string, value: any): void {
    const parts = field.split('.');
    let current: any = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }

  // Format value
  private formatValue(value: any, parameters: Record<string, any>): any {
    const format = parameters.format || 'string';
    
    switch (format) {
      case 'uppercase':
        return String(value).toUpperCase();
      case 'lowercase':
        return String(value).toLowerCase();
      case 'timestamp':
        return new Date(value).toISOString();
      case 'hash':
        return this.hashValue(value);
      default:
        return value;
    }
  }

  // Calculate value
  private calculateValue(obj: STIXObject, parameters: Record<string, any>): any {
    const expression = parameters.expression;
    // Mock calculation - in production, this would evaluate expressions
    return expression;
  }

  // Lookup value
  private lookupValue(value: any, parameters: Record<string, any>): any {
    const lookupTable = parameters.table || {};
    return lookupTable[value] || value;
  }

  // Apply conditional logic
  private applyConditionalLogic(obj: STIXObject, parameters: Record<string, any>): any {
    const conditions = parameters.conditions || [];
    for (const condition of conditions) {
      if (this.evaluateRuleCondition(obj, condition.condition)) {
        return condition.value;
      }
    }
    return parameters.default;
  }

  // Hash value
  private hashValue(value: any): string {
    // Mock hash - in production, use actual hashing
    return `hash_${String(value)}`;
  }

  // Evaluate rule condition
  private evaluateRuleCondition(obj: STIXObject, condition: string): boolean {
    // Mock condition evaluation - in production, use proper expression parser
    return true;
  }

  // Execute rule action
  private async executeRuleAction(obj: STIXObject, rule: SharingRule): Promise<void> {
    try {
      switch (rule.action) {
        case 'allow':
          // Continue processing
          break;
        case 'deny':
          throw new Error('Access denied by sharing rule');
        case 'delay':
          const delay = rule.parameters.delay || 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          break;
        case 'escalate':
          await this.escalateObject(obj, rule);
          break;
      }
    } catch (error) {
      console.error('Failed to execute rule action:', error);
      throw error;
    }
  }

  // Escalate object
  private async escalateObject(obj: STIXObject, rule: SharingRule): Promise<void> {
    // Mock escalation - in production, this would notify administrators
    console.log(`Object escalated: ${obj.id} - ${rule.description}`);
  }

  // Send to destinations
  private async sendToDestinations(obj: STIXObject, policy: SharingPolicy): Promise<void> {
    try {
      // Mock sending to destinations - in production, this would send to actual TAXII servers
      console.log(`Sending object ${obj.id} to destinations`);
    } catch (error) {
      console.error('Failed to send to destinations:', error);
      throw error;
    }
  }

  // Create STIX bundle
  createBundle(objects: STIXObject[]): STIXBundle {
    return {
      type: 'bundle',
      id: `bundle--${crypto.randomUUID()}`,
      spec_version: '2.1',
      objects
    };
  }

  // Parse STIX bundle
  parseBundle(bundleData: any): STIXBundle {
    try {
      if (bundleData.type !== 'bundle') {
        throw new Error('Invalid bundle type');
      }

      return bundleData as STIXBundle;
    } catch (error) {
      console.error('Failed to parse STIX bundle:', error);
      throw error;
    }
  }

  // Get sharing session
  async getSession(sessionId: string): Promise<SharingSession | null> {
    try {
      return this.sessions.get(sessionId) || null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  // Get all sessions
  async getSessions(filters?: {
    policy_id?: string;
    status?: string;
    date_range?: {
      start: string;
      end: string;
    };
  }): Promise<SharingSession[]> {
    try {
      let sessions = Array.from(this.sessions.values());

      // Apply filters
      if (filters?.policy_id) {
        sessions = sessions.filter(session => session.policy_id === filters.policy_id);
      }
      if (filters?.status) {
        sessions = sessions.filter(session => session.status === filters.status);
      }
      if (filters?.date_range) {
        const start = new Date(filters.date_range.start).getTime();
        const end = new Date(filters.date_range.end).getTime();
        sessions = sessions.filter(session => {
          const startTime = new Date(session.started_at).getTime();
          return startTime >= start && startTime <= end;
        });
      }

      return sessions;
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return [];
    }
  }

  // Initialize default servers
  private initializeDefaultServers(): void {
    // Mock TAXII server
    const defaultServer: TAXIIServer = {
      id: 'default-taxii-server',
      name: 'Default TAXII Server',
      description: 'Default TAXII server for threat intelligence sharing',
      url: 'https://taxii.example.com',
      api_root: 'https://taxii.example.com/api',
      collections: [],
      discovery: {
        title: 'TrustHire TAXII Server',
        description: 'Threat intelligence sharing platform',
        contact: 'security@trusthire.com',
        api_roots: ['/api'],
        default_api_root: '/api',
        server_version: '2.1',
        max_content_length: 10485760
      },
      authentication: {
        type: 'api_key',
        credentials: { api_key: 'default-api-key' },
        required: true
      },
      status: {
        status: 'offline',
        last_check: new Date().toISOString(),
        response_time: 0,
        collections_count: 0,
        objects_count: 0
      },
      last_sync: new Date().toISOString(),
      sync_frequency: 60,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.servers.set(defaultServer.id, defaultServer);
  }

  // Initialize default policies
  private initializeDefaultPolicies(): void {
    // Default sharing policy
    const defaultPolicy: SharingPolicy = {
      id: 'default-sharing-policy',
      name: 'Default Sharing Policy',
      description: 'Default policy for threat intelligence sharing',
      enabled: true,
      priority: 'medium',
      source_filters: [
        {
          field: 'type',
          operator: 'in',
          value: ['indicator', 'malware'],
          required: true
        },
        {
          field: 'confidence',
          operator: 'gte',
          value: 70,
          required: false
        }
      ],
      destination_filters: [
        {
          field: 'access_level',
          operator: 'eq',
          value: 'public',
          required: true
        }
      ],
      transformation_rules: [
        {
          id: 'default-transformation',
          name: 'Default Transformation',
          description: 'Default transformation rules',
          enabled: true,
          source_format: 'stix',
          target_format: 'stix',
          mapping: {},
          transformations: [
            {
              source_field: 'confidence',
              target_field: 'confidence',
              transformation_type: 'direct',
              parameters: {},
              required: false
            }
          ]
        }
      ],
      sharing_rules: [
        {
          id: 'default-rule',
          name: 'Default Sharing Rule',
          description: 'Default rule for sharing objects',
          enabled: true,
          condition: 'type == "indicator" && confidence >= 70',
          action: 'allow',
          parameters: {},
          priority: 1
        }
      ],
      schedule: {
        enabled: true,
        frequency: 60,
        timezone: 'UTC',
        retry_policy: {
          max_attempts: 3,
          backoff_type: 'exponential',
          base_delay: 60,
          max_delay: 3600,
          retry_on: ['failure', 'timeout']
        },
        batch_size: 100,
        max_retries: 3
      },
      monitoring: {
        enabled: true,
        metrics: {
          total_shares: 0,
          successful_shares: 0,
          failed_shares: 0,
          average_processing_time: 0,
          last_share: '',
          error_rate: 0,
          throughput: 0
        },
        alerts: [
          {
            id: 'error-rate-alert',
            name: 'High Error Rate Alert',
            description: 'Alert when error rate exceeds threshold',
            enabled: true,
            condition: 'error_rate > 0.1',
            severity: 'high',
            channels: [
              {
                type: 'email',
                destination: 'security-team@trusthire.com',
                enabled: true,
                template: 'error-rate-alert'
              }
            ],
            threshold: {
              metric: 'error_rate',
              operator: 'gt',
              value: 0.1,
              duration: 5
            }
          }
        ],
        logging: {
          enabled: true,
          level: 'info',
          retention_days: 30,
          include_sensitive: false,
          audit_trail: true
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'system'
    };

    this.policies.set(defaultPolicy.id, defaultPolicy);
  }

  // Start sharing processor
  private startSharingProcessor(): void {
    setInterval(() => {
      if (!this.isProcessing) {
        this.processScheduledSharing();
      }
    }, 60000); // Check every minute
  }

  // Process scheduled sharing
  private async processScheduledSharing(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      // Get active policies with schedules
      const activePolicies = Array.from(this.policies.values())
        .filter(policy => policy.enabled && policy.schedule.enabled);

      for (const policy of activePolicies) {
        // Check if it's time to execute
        const lastExecution = await this.getLastExecutionTime(policy.id);
        const nextExecution = new Date(lastExecution.getTime() + policy.schedule.frequency * 60000);
        
        if (new Date() >= nextExecution) {
          await this.executePolicy(policy.id);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Get last execution time
  private async getLastExecutionTime(policyId: string): Promise<Date> {
    // Mock implementation - in production, this would query the database
    return new Date(Date.now() - 60 * 60000); // 1 hour ago
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    activeServers: number;
    totalServers: number;
    activePolicies: number;
    totalPolicies: number;
    activeSessions: number;
    lastExecution: string | null;
    errors: string[];
  }> {
    try {
      const activeServers = Array.from(this.servers.values())
        .filter(server => server.status.status === 'online').length;
      const totalServers = this.servers.size;
      const activePolicies = Array.from(this.policies.values())
        .filter(policy => policy.enabled).length;
      const totalPolicies = this.policies.size;
      const activeSessions = Array.from(this.sessions.values())
        .filter(session => session.status === 'running').length;

      const status = activeServers === 0 ? 'critical' : 
                   activePolicies === 0 ? 'warning' : 'healthy';

      return {
        status,
        activeServers,
        totalServers,
        activePolicies,
        totalPolicies,
        activeSessions,
        lastExecution: null,
        errors: []
      };
    } catch (error) {
      console.error('STIX/TAXII health check failed:', error);
      return {
        status: 'critical',
        activeServers: 0,
        totalServers: 0,
        activePolicies: 0,
        totalPolicies: 0,
        activeSessions: 0,
        lastExecution: null,
        errors: [error instanceof Error ? error.message : 'Health check failed']
      };
    }
  }
}

// Singleton instance
export const stixTAXIIService = new STIXTAXIIService();
