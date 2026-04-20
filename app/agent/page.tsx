/**
 * Autonomous Agent Page
 * Main interface for the autonomous AI agent
 */

'use client';

import React, { useState, useEffect } from 'react';
import AutonomousAgentPanel from '@/components/ai/AutonomousAgentPanel';

export default function AgentPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300"></div>
          <p className="mt-4 text-gray-600">Loading Autonomous Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Autonomous AI Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced AI agent with personality, memory, and autonomous security analysis capabilities
          </p>
        </div>

        <AutonomousAgentPanel />
      </div>
    </div>
  );
}
