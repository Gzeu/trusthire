"use strict";
/**
 * Autonomous Agent Example
 * Complete example of autonomous agent analyzing the entire TrustHire system
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCompleteSystemAnalysis = runCompleteSystemAnalysis;
var autonomous_agent_1 = require("@/lib/ai/autonomous-agent");
function runCompleteSystemAnalysis() {
    return __awaiter(this, void 0, void 0, function () {
        var systemAnalysisTask, threatHuntingTask, documentationTask, learningTask, reportingTask, checkProgress, i, finalStatus, memorySnapshot, recentFindings, patterns, knowledgeItems, experiences;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('=== Starting Complete System Analysis ===');
                    // Start the autonomous agent if not already running
                    return [4 /*yield*/, autonomous_agent_1.autonomousAgent.start()];
                case 1:
                    // Start the autonomous agent if not already running
                    _a.sent();
                    // Wait for agent to initialize
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 3000); })];
                case 2:
                    // Wait for agent to initialize
                    _a.sent();
                    systemAnalysisTask = autonomous_agent_1.autonomousAgent.addTask('custom_command', 'high', {
                        command: 'Perform comprehensive security analysis of the entire TrustHire system including all components, APIs, databases, and infrastructure',
                        context: {
                            analysisScope: 'complete_system',
                            includeVulnerabilities: true,
                            includeThreats: true,
                            includePerformance: true,
                            includeCompliance: true,
                            timestamp: new Date().toISOString()
                        }
                    });
                    console.log("Added system analysis task: ".concat(systemAnalysisTask));
                    threatHuntingTask = autonomous_agent_1.autonomousAgent.addTask('threat_hunting', 'high', {
                        context: {
                            timeRange: '24h',
                            targetSystems: ['web', 'api', 'database', 'infrastructure'],
                            focusAreas: ['authentication', 'authorization', 'data_protection', 'network_security']
                        }
                    });
                    console.log("Added threat hunting task: ".concat(threatHuntingTask));
                    documentationTask = autonomous_agent_1.autonomousAgent.addTask('documentation', 'medium', {
                        context: {
                            documentationScope: 'all',
                            includeAPI: true,
                            includeCode: true,
                            includeConfiguration: true,
                            includeSecurity: true
                        }
                    });
                    console.log("Added documentation task: ".concat(documentationTask));
                    learningTask = autonomous_agent_1.autonomousAgent.addTask('learning', 'medium', {
                        context: {
                            learningScope: 'comprehensive',
                            recentExperiences: 'last_30_days',
                            focusAreas: ['threat_patterns', 'vulnerabilities', 'performance', 'user_behavior']
                        }
                    });
                    console.log("Added learning task: ".concat(learningTask));
                    reportingTask = autonomous_agent_1.autonomousAgent.addTask('reporting', 'high', {
                        context: {
                            reportType: 'comprehensive',
                            includeMetrics: true,
                            includeFindings: true,
                            includeRecommendations: true,
                            timeframe: '24h'
                        }
                    });
                    console.log("Added reporting task: ".concat(reportingTask));
                    // Wait for initial tasks to complete
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10000); })];
                case 3:
                    // Wait for initial tasks to complete
                    _a.sent(); // 10 seconds
                    checkProgress = function () { return __awaiter(_this, void 0, void 0, function () {
                        var status, memory;
                        return __generator(this, function (_a) {
                            status = autonomous_agent_1.autonomousAgent.getAgentStatus();
                            memory = autonomous_agent_1.autonomousAgent.getMemorySnapshot();
                            console.log('\n=== Agent Status ===');
                            console.log("Status: ".concat(status.status));
                            console.log("Current Task: ".concat(status.currentTask || 'None'));
                            console.log("Tasks Completed: ".concat(status.statistics.tasksCompleted));
                            console.log("Analyses Performed: ".concat(finalStatus.statistics.analysesPerformed || 0));
                            console.log("Discoveries Made: ".concat(status.statistics.discoveriesMade));
                            console.log("Learning Events: ".concat(status.statistics.learningEvents));
                            console.log("Uptime: ".concat(status.statistics.uptime, "ms"));
                            console.log('\n=== Memory Overview ===');
                            console.log("Short-term Conversations: ".concat(memory.shortTerm.conversations.length));
                            console.log("Current Tasks: ".concat(memory.shortTerm.currentTasks.length));
                            console.log("Recent Findings: ".concat(memory.shortTerm.recentFindings.length));
                            console.log("Long-term Patterns: ".concat(memory.longTerm.patterns.length));
                            console.log("Knowledge Items: ".concat(memory.longTerm.knowledge.length));
                            console.log("Episodic Experiences: ".concat(memory.episodic.experiences.length));
                            return [2 /*return*/, status];
                        });
                    }); };
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < 12)) return [3 /*break*/, 8];
                    return [4 /*yield*/, checkProgress()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 6:
                    _a.sent(); // 5 seconds intervals
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 4];
                case 8:
                    console.log('\n=== Analysis Complete ===');
                    return [4 /*yield*/, checkProgress()];
                case 9:
                    finalStatus = _a.sent();
                    memorySnapshot = autonomous_agent_1.autonomousAgent.getMemorySnapshot();
                    console.log('\n=== Final Results ===');
                    console.log("Total Tasks Completed: ".concat(finalStatus.statistics.tasksCompleted));
                    console.log("Total Analyses Performed: ".concat(finalStatus.analysesPerformed));
                    console.log("Total Discoveries Made: ".concat(finalStatus.statistics.discoveriesMade));
                    console.log("Learning Events: ".concat(finalStatus.statistics.learningEvents));
                    console.log("Total Uptime: ".concat(formatUptime(finalStatus.statistics.uptime)));
                    recentFindings = memorySnapshot.shortTerm.recentFindings.slice(0, 10);
                    if (recentFindings.length > 0) {
                        console.log('\n=== Recent Findings ===');
                        recentFindings.forEach(function (finding, index) {
                            console.log("".concat(index + 1, ". ").concat(finding.type, " (").concat(Math.round(finding.confidence * 100), "% confidence)"));
                            console.log("   Content: ".concat(finding.content.substring(0, 100), "..."));
                        });
                    }
                    patterns = memorySnapshot.longTerm.patterns.slice(0, 5);
                    if (patterns.length > 0) {
                        console.log('\n=== Identified Patterns ===');
                        patterns.forEach(function (pattern, index) {
                            console.log("".concat(index + 1, ". ").concat(pattern.pattern, " (frequency: ").concat(pattern.frequency, ")"));
                            console.log("   Significance: ".concat(pattern.significance));
                            console.log("   Last Seen: ".concat(pattern.lastSeen.toLocaleString()));
                        });
                    }
                    knowledgeItems = memorySnapshot.longTerm.knowledge.slice(0, 5);
                    if (knowledgeItems.length > 0) {
                        console.log('\n=== Knowledge Base ===');
                        knowledgeItems.forEach(function (item, index) {
                            console.log("".concat(index + 1, ". ").concat(item.domain, ": ").concat(item.fact));
                            console.log("   Source: ".concat(item.source, " (").concat(Math.round(item.confidence * 100), "% confidence)"));
                            console.log("   Learned: ".concat(item.learnedAt.toLocaleString()));
                        });
                    }
                    experiences = memorySnapshot.episodic.experiences.slice(0, 5);
                    if (experiences.length > 0) {
                        console.log('\n=== Recent Experiences ===');
                        experiences.forEach(function (experience, index) {
                            console.log("".concat(index + 1, ". Event: ").concat(experience.event));
                            console.log("   Outcome: ".concat(experience.outcome));
                            console.log("   Lesson: ".concat(experience.lesson));
                            console.log("   Emotional Weight: ".concat(experience.emotionalWeight));
                            console.log("   Timestamp: ".concat(experience.timestamp.toLocaleString()));
                        });
                    }
                    // Stop the agent
                    return [4 /*yield*/, autonomous_agent_1.autonomousAgent.stop()];
                case 10:
                    // Stop the agent
                    _a.sent();
                    console.log('\n=== Agent Stopped ===');
                    return [2 /*return*/, {
                            finalStatus: finalStatus,
                            memorySnapshot: memorySnapshot,
                            recentFindings: recentFindings,
                            patterns: patterns,
                            knowledgeItems: knowledgeItems,
                            experiences: experiences
                        }];
            }
        });
    });
}
// Helper function to format uptime
function formatUptime(ms) {
    var seconds = Math.floor(ms / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    if (hours > 0)
        return "".concat(hours, "h ").concat(minutes % 60, "m ").concat(seconds % 60, "s");
    if (minutes > 0)
        return "".concat(minutes, "m ").concat(seconds % 60, "s");
    return "".concat(seconds, "s");
}
// Example usage
if (require.main === module) {
    runCompleteSystemAnalysis()
        .then(function (results) {
        console.log('\n=== Example Complete ===');
        console.log('System analysis completed successfully!');
    })
        .catch(function (error) {
        console.error('Error during system analysis:', error);
    });
}
exports.default = runCompleteSystemAnalysis;
