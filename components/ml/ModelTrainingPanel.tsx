'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Settings, 
  Database, 
  TrendingUp, 
  Play, 
  Download,
  Upload,
  Trash2,
  BarChart3,
  Target
} from 'lucide-react';

interface ModelTrainingPanelProps {
  organizationId?: string;
}

export default function ModelTrainingPanel({ organizationId = 'default' }: ModelTrainingPanelProps) {
  const [activeTab, setActiveTab] = useState('models');
  const [isTraining, setIsTraining] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [trainingData, setTrainingData] = useState<any[]>([]);

  const handleTrainModel = async (modelType: string) => {
    setIsTraining(true);
    try {
      const response = await fetch('/api/ml/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'train',
          organizationId,
          modelType,
        }),
      });

      const result = await response.json();
      if (result.success) {
        await loadModels();
      }
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const handleAddTrainingData = async (data: any) => {
    try {
      const response = await fetch('/api/ml/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_training_data',
          data: {
            ...data,
            organizationId,
            type: data.type,
            inputs: data.inputs,
            expectedOutput: data.expectedOutput,
          },
        }),
      });

      const result = await response.json();
      if (result.success) {
        await loadTrainingData();
      }
    } catch (error) {
      console.error('Failed to add training data:', error);
    }
  };

  const loadModels = async () => {
    try {
      const response = await fetch(`/api/ml/models?organizationId=${organizationId}`);
      const result = await response.json();
      if (result.success) {
        setModels(result.data);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const loadTrainingData = async () => {
    try {
      const response = await fetch(`/api/ml/models?organizationId=${organizationId}&type=training_data`);
      const result = await response.json();
      if (result.success) {
        setTrainingData(result.data);
      }
    } catch (error) {
      console.error('Failed to load training data:', error);
    }
  };

  React.useEffect(() => {
    loadModels();
    loadTrainingData();
  }, [organizationId]);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.9) return 'text-green-600';
    if (accuracy >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'communication': return <MessageSquare className="w-4 h-4" />;
      case 'threat': return <Shield className="w-4 h-4" />;
      case 'behavioral': return <Activity className="w-4 h-4" />;
      case 'profile': return <User className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Custom ML Models - {organizationId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="models" className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                Models
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center gap-1">
                <Database className="w-4 h-4" />
                Training Data
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="deployment" className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Deployment
              </TabsTrigger>
            </TabsList>

            {/* Models Tab */}
            <TabsContent value="models" className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {['communication', 'threat', 'behavioral', 'profile'].map((type) => (
                  <Card key={type}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getModelTypeIcon(type)}
                          <span className="font-medium capitalize">{type}</span>
                        </div>
                        <Badge variant={models.find(m => m.type === type)?.isActive ? 'default' : 'outline'}>
                          {models.find(m => m.type === type)?.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      {models.find(m => m.type === type) && (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Accuracy:</span>
                            <span className={`ml-2 ${getAccuracyColor(models.find(m => m.type === type)?.accuracy || 0)}`}>
                              {((models.find(m => m.type === type)?.accuracy || 0) * 100).toFixed(1)}%
                            </span>
                          </div>
                          
                          <div className="text-sm">
                            <span className="font-medium">Data:</span>
                            <span className="ml-2">{models.find(m => m.type === type)?.trainingDataSize || 0} samples</span>
                          </div>
                          
                          <div className="text-sm">
                            <span className="font-medium">Version:</span>
                            <span className="ml-2">{models.find(m => m.type === type)?.version || '1.0.0'}</span>
                          </div>
                          
                          <Button 
                            onClick={() => handleTrainModel(type)}
                            disabled={isTraining}
                            className="w-full mt-2"
                            size="sm"
                          >
                            {isTraining ? (
                              <>
                                <Play className="w-3 h-3 mr-1 animate-spin" />
                                Training...
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 mr-1" />
                                Train Model
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {models.length > 0 && (
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-4">Model Details</h4>
                    <div className="space-y-4">
                      {models.map((model) => (
                        <div key={model.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getModelTypeIcon(model.type)}
                              <span className="font-medium">{model.name}</span>
                              <Badge variant={model.isActive ? 'default' : 'outline'}>
                                {model.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="w-3 h-3 mr-1" />
                                Export
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Accuracy:</span>
                              <div className={getAccuracyColor(model.accuracy)}>
                                {(model.accuracy * 100).toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <span className="font-medium">Precision:</span>
                              <div>{(model.precision * 100).toFixed(1)}%</div>
                            </div>
                            <div>
                              <span className="font-medium">Recall:</span>
                              <div>{(model.recall * 100).toFixed(1)}%</div>
                            </div>
                            <div>
                              <span className="font-medium">F1 Score:</span>
                              <div>{(model.f1Score * 100).toFixed(1)}%</div>
                            </div>
                          </div>
                          
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Model Type:</span> {model.modelType} | 
                            <span className="font-medium ml-2">Training Data:</span> {model.trainingDataSize} samples |
                            <span className="font-medium ml-2">Last Trained:</span> {new Date(model.lastTrained).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Training Data Tab */}
            <TabsContent value="training" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Training Data ({trainingData.length} samples)</h4>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <h5 className="font-medium mb-2">Add Training Sample</h5>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="communication">Communication</option>
                          <option value="threat">Threat</option>
                          <option value="behavioral">Behavioral</option>
                          <option value="profile">Profile</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Input Data</label>
                        <textarea
                          className="w-full p-2 border rounded-md"
                          rows={3}
                          placeholder="JSON input data..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Expected Output</label>
                        <textarea
                          className="w-full p-2 border rounded-md"
                          rows={2}
                          placeholder="Expected output..."
                        />
                      </div>
                      
                      <Button className="w-full">
                        <Database className="w-4 h-4 mr-2" />
                        Add Sample
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <h5 className="font-medium mb-2">Training Statistics</h5>
                    <div className="space-y-3">
                      {['communication', 'threat', 'behavioral', 'profile'].map((type) => {
                        const count = trainingData.filter(d => d.type === type).length;
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getModelTypeIcon(type)}
                              <span className="capitalize">{type}</span>
                            </div>
                            <Badge variant="outline">{count} samples</Badge>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Samples</span>
                        <Badge>{trainingData.length}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {trainingData.length > 0 && (
                <Card>
                  <CardContent className="pt-4">
                    <h5 className="font-medium mb-4">Recent Training Data</h5>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {trainingData.slice(-10).reverse().map((data) => (
                        <div key={data.id} className="border rounded p-3 text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {getModelTypeIcon(data.type)}
                              <span className="capitalize">{data.type}</span>
                            </div>
                            <span className="text-gray-500">
                              {new Date(data.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-gray-600 truncate">
                            Input: {JSON.stringify(data.inputs).substring(0, 100)}...
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <h5 className="font-medium mb-4">Model Performance</h5>
                    <div className="space-y-4">
                      {models.map((model) => (
                        <div key={model.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">{model.type}</span>
                            <span className={getAccuracyColor(model.accuracy)}>
                              {(model.accuracy * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${model.accuracy * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <h5 className="font-medium mb-4">Training Data Distribution</h5>
                    <div className="space-y-4">
                      {['communication', 'threat', 'behavioral', 'profile'].map((type) => {
                        const count = trainingData.filter(d => d.type === type).length;
                        const percentage = trainingData.length > 0 ? (count / trainingData.length) * 100 : 0;
                        return (
                          <div key={type} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="capitalize">{type}</span>
                              <span>{count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-4">
                  <h5 className="font-medium mb-4">Improvement Recommendations</h5>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Increase Training Data</div>
                        <div className="text-sm text-gray-600">
                          Add more diverse samples to improve model accuracy
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Feature Engineering</div>
                        <div className="text-sm text-gray-600">
                          Consider adding new features to improve prediction quality
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Settings className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Hyperparameter Tuning</div>
                        <div className="text-sm text-gray-600">
                          Optimize model hyperparameters for better performance
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Deployment Tab */}
            <TabsContent value="deployment" className="space-y-4">
              <Card>
                <CardContent className="pt-4">
                  <h5 className="font-medium mb-4">Model Deployment</h5>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          <span className="font-medium">Production Models</span>
                        </div>
                        <Badge className="bg-green-500">Live</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Models deployed to production environment
                      </p>
                      <div className="space-y-2">
                        {models.filter(m => m.isActive).map((model) => (
                          <div key={model.id} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{model.type}</span>
                            <span>v{model.version}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">Staging Models</span>
                        </div>
                        <Badge className="bg-yellow-500">Testing</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Models in staging environment for testing
                      </p>
                      <Button className="w-full">
                        Deploy to Production
                      </Button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          <span className="font-medium">Model Export</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Export trained models for backup or deployment
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export All
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Import Model
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Import missing icons
import { MessageSquare, Shield, Activity, User } from 'lucide-react';
