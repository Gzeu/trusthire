'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Cpu, 
  Database, 
  BarChart3, 
  Clock, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Settings, 
  Download, 
  Eye, 
  Zap, 
  GitBranch,
  Calendar,
  Filter,
  Search,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { Card, Button, Badge, Container, Section, Skeleton } from '@/components/ui/DesignSystem';

interface MLModel {
  id: string;
  name: string;
  type: string;
  status: 'training' | 'ready' | 'failed' | 'deprecated';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrainedAt: string;
  trainingData: {
    samples: number;
    trainSize: number;
    testSize: number;
    validationSize: number;
  };
  metrics: {
    predictions: number;
    correctPredictions: number;
    avgProcessingTime: number;
    uptime: number;
    memoryUsage: number;
  };
  hyperparameters: Record<string, any>;
  version: string;
}

interface TrainingJob {
  id: string;
  modelId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  config: {
    algorithm: string;
    epochs: number;
    batchSize: number;
    learningRate: number;
  };
  metrics?: {
    loss: number;
    accuracy: number;
    validationAccuracy: number;
    epoch: number;
  };
}

interface PredictionMetrics {
  timestamp: string;
  modelId: string;
  predictions: number;
  accuracy: number;
  processingTime: number;
  confidence: number;
}

interface ModelPerformance {
  modelId: string;
  timeWindow: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  throughput: number;
  latency: number;
  errorRate: number;
}

export default function MLDashboard() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [predictionMetrics, setPredictionMetrics] = useState<PredictionMetrics[]>([]);
  const [performanceData, setPerformanceData] = useState<ModelPerformance[]>([]);
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data generation
  const generateMockData = useCallback(() => {
    const mockModels: MLModel[] = [
      {
        id: 'model_1',
        name: 'Threat Classification v2.1',
        type: 'classification',
        status: 'ready',
        accuracy: 0.94,
        precision: 0.92,
        recall: 0.95,
        f1Score: 0.93,
        lastTrainedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        trainingData: {
          samples: 10000,
          trainSize: 7000,
          testSize: 2000,
          validationSize: 1000
        },
        metrics: {
          predictions: 15420,
          correctPredictions: 14495,
          avgProcessingTime: 125,
          uptime: 99.8,
          memoryUsage: 512
        },
        hyperparameters: {
          learningRate: 0.001,
          epochs: 100,
          batchSize: 32,
          hiddenLayers: [128, 64, 32]
        },
        version: '2.1.0'
      },
      {
        id: 'model_2',
        name: 'Anomaly Detection Engine',
        type: 'anomaly',
        status: 'ready',
        accuracy: 0.89,
        precision: 0.87,
        recall: 0.91,
        f1Score: 0.89,
        lastTrainedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        trainingData: {
          samples: 50000,
          trainSize: 35000,
          testSize: 10000,
          validationSize: 5000
        },
        metrics: {
          predictions: 8934,
          correctPredictions: 7951,
          avgProcessingTime: 89,
          uptime: 99.5,
          memoryUsage: 256
        },
        hyperparameters: {
          contamination: 0.1,
          nEstimators: 100,
          maxDepth: 10
        },
        version: '1.3.2'
      },
      {
        id: 'model_3',
        name: 'Threat Prediction Model',
        type: 'prediction',
        status: 'training',
        accuracy: 0.0,
        precision: 0.0,
        recall: 0.0,
        f1Score: 0.0,
        lastTrainedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        trainingData: {
          samples: 25000,
          trainSize: 17500,
          testSize: 5000,
          validationSize: 2500
        },
        metrics: {
          predictions: 0,
          correctPredictions: 0,
          avgProcessingTime: 0,
          uptime: 0,
          memoryUsage: 0
        },
        hyperparameters: {
          learningRate: 0.01,
          epochs: 150,
          batchSize: 64
        },
        version: '1.0.0'
      }
    ];

    const mockTrainingJobs: TrainingJob[] = [
      {
        id: 'job_1',
        modelId: 'model_3',
        status: 'running',
        progress: 67,
        startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        config: {
          algorithm: 'neural_network',
          epochs: 150,
          batchSize: 64,
          learningRate: 0.01
        },
        metrics: {
          loss: 0.23,
          accuracy: 0.78,
          validationAccuracy: 0.75,
          epoch: 100
        }
      },
      {
        id: 'job_2',
        modelId: 'model_1',
        status: 'completed',
        progress: 100,
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        config: {
          algorithm: 'random_forest',
          epochs: 100,
          batchSize: 32,
          learningRate: 0.001
        },
        metrics: {
          loss: 0.15,
          accuracy: 0.94,
          validationAccuracy: 0.92,
          epoch: 100
        }
      }
    ];

    // Generate prediction metrics
    const mockMetrics: PredictionMetrics[] = Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
      modelId: 'model_1',
      predictions: Math.floor(Math.random() * 500) + 200,
      accuracy: 0.85 + Math.random() * 0.1,
      processingTime: 100 + Math.random() * 50,
      confidence: 0.8 + Math.random() * 0.15
    }));

    const mockPerformance: ModelPerformance[] = [
      {
        modelId: 'model_1',
        timeWindow: '1h',
        accuracy: 0.94,
        precision: 0.92,
        recall: 0.95,
        f1Score: 0.93,
        throughput: 1250,
        latency: 125,
        errorRate: 0.06
      },
      {
        modelId: 'model_1',
        timeWindow: '24h',
        accuracy: 0.93,
        precision: 0.91,
        recall: 0.94,
        f1Score: 0.92,
        throughput: 1180,
        latency: 132,
        errorRate: 0.07
      },
      {
        modelId: 'model_2',
        timeWindow: '1h',
        accuracy: 0.89,
        precision: 0.87,
        recall: 0.91,
        f1Score: 0.89,
        throughput: 2100,
        latency: 89,
        errorRate: 0.11
      }
    ];

    setModels(mockModels);
    setTrainingJobs(mockTrainingJobs);
    setPredictionMetrics(mockMetrics);
    setPerformanceData(mockPerformance);
  }, []);

  useEffect(() => {
    generateMockData();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        generateMockData();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, generateMockData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'training': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'deprecated': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'training': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'deprecated': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || model.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalModels = models.length;
  const readyModels = models.filter(m => m.status === 'ready').length;
  const trainingModels = models.filter(m => m.status === 'training').length;
  const failedModels = models.filter(m => m.status === 'failed').length;

  const avgAccuracy = models.length > 0 
    ? models.reduce((sum, m) => sum + m.accuracy, 0) / models.length 
    : 0;

  const totalPredictions = models.reduce((sum, m) => sum + m.metrics.predictions, 0);
  const avgProcessingTime = models.length > 0
    ? models.reduce((sum, m) => sum + m.metrics.avgProcessingTime, 0) / models.length
    : 0;

  return (
    <Container className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-mono font-bold text-white mb-2 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-purple-400" />
            ML Model Dashboard
          </h1>
          <p className="text-gray-400 font-mono">Monitor and manage machine learning models</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={generateMockData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <Badge variant="default" className="bg-purple-500/20 text-purple-400 border-purple-500/50">
              Total Models
            </Badge>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">{totalModels}</div>
          <div className="text-sm text-gray-400 font-mono">Active models</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/50">
              Ready
            </Badge>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">{readyModels}</div>
          <div className="text-sm text-gray-400 font-mono">Ready for production</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
            <Badge variant="default" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
              Training
            </Badge>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">{trainingModels}</div>
          <div className="text-sm text-gray-400 font-mono">Currently training</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-yellow-400" />
            </div>
            <Badge variant="default" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
              Avg Accuracy
            </Badge>
          </div>
          <div className="text-3xl font-mono font-bold text-white mb-1">{(avgAccuracy * 100).toFixed(1)}%</div>
          <div className="text-sm text-gray-400 font-mono">Model performance</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="all">All Status</option>
              <option value="ready">Ready</option>
              <option value="training">Training</option>
              <option value="failed">Failed</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Models List */}
        <Card className="p-6">
          <h2 className="text-xl font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Models
          </h2>
          
          <div className="space-y-4">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${getStatusColor(model.status)}`}>
                      {getStatusIcon(model.status)}
                    </div>
                    <div>
                      <h3 className="font-mono font-semibold text-white">{model.name}</h3>
                      <p className="text-sm text-gray-400 font-mono">{model.type} v{model.version}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-400 font-mono mb-1">Accuracy</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${model.accuracy * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-white font-mono">{(model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 font-mono mb-1">F1 Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${model.f1Score * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-white font-mono">{(model.f1Score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 font-mono">
                  <span>Last trained: {new Date(model.lastTrainedAt).toLocaleDateString()}</span>
                  <span>{model.metrics.predictions.toLocaleString()} predictions</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Training Jobs */}
        <Card className="p-6">
          <h2 className="text-xl font-mono font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Training Jobs
          </h2>
          
          <div className="space-y-4">
            {trainingJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${
                      job.status === 'running' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                      job.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                      'bg-red-500/20 text-red-400 border-red-500/50'
                    }`}>
                      {job.status === 'running' ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                       job.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                       <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-mono font-semibold text-white">
                        {job.config.algorithm} Training
                      </h3>
                      <p className="text-sm text-gray-400 font-mono">
                        {job.startedAt ? `Started: ${new Date(job.startedAt).toLocaleTimeString()}` : 'Queued'}
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant="default" className={
                    job.status === 'running' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                    job.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                    'bg-red-500/20 text-red-400 border-red-500/50'
                  }>
                    {job.status}
                  </Badge>
                </div>
                
                {job.status === 'running' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-400 font-mono mb-2">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {job.metrics && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 font-mono">Loss</p>
                      <p className="text-white font-mono">{job.metrics.loss.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-mono">Accuracy</p>
                      <p className="text-white font-mono">{(job.metrics.accuracy * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-mono font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Metrics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-mono font-semibold text-white mb-3">Total Predictions</h3>
            <div className="text-3xl font-mono font-bold text-purple-400 mb-1">
              {totalPredictions.toLocaleString()}
            </div>
            <p className="text-sm text-gray-400 font-mono">Last 24 hours</p>
          </div>
          
          <div>
            <h3 className="font-mono font-semibold text-white mb-3">Avg Processing Time</h3>
            <div className="text-3xl font-mono font-bold text-blue-400 mb-1">
              {avgProcessingTime.toFixed(0)}ms
            </div>
            <p className="text-sm text-gray-400 font-mono">Per prediction</p>
          </div>
          
          <div>
            <h3 className="font-mono font-semibold text-white mb-3">System Health</h3>
            <div className="text-3xl font-mono font-bold text-green-400 mb-1">
              99.7%
            </div>
            <p className="text-sm text-gray-400 font-mono">Uptime</p>
          </div>
        </div>
      </Card>
    </Container>
  );
}
