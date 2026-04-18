'use client';

import { useState, useCallback } from 'react';
import { 
  Download, 
  FileText, 
  Mail, 
  Share2, 
  Printer, 
  Database, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  Info,
  FileSpreadsheet,
  FileImage,
  Code,
  Globe
} from 'lucide-react';

interface ExportOption {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  format: string;
  extension: string;
  mimeType: string;
  available: boolean;
}

interface ExportData {
  scans: any[];
  timestamp: number;
  format: string;
  metadata: {
    version: string;
    generatedBy: string;
    totalScans: number;
    dateRange: string;
  };
}

export default function ExportManager() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [lastExport, setLastExport] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('json');

  const exportOptions: ExportOption[] = [
    {
      id: 'json',
      label: 'JSON',
      description: 'Machine-readable format for developers',
      icon: Code,
      format: 'json',
      extension: '.json',
      mimeType: 'application/json',
      available: true
    },
    {
      id: 'csv',
      label: 'CSV',
      description: 'Spreadsheet-compatible format',
      icon: FileSpreadsheet,
      format: 'csv',
      extension: '.csv',
      mimeType: 'text/csv',
      available: true
    },
    {
      id: 'pdf',
      label: 'PDF',
      description: 'Professional report format',
      icon: FileText,
      format: 'pdf',
      extension: '.pdf',
      mimeType: 'application/pdf',
      available: true
    },
    {
      id: 'excel',
      label: 'Excel',
      description: 'Microsoft Excel format',
      icon: FileSpreadsheet,
      format: 'xlsx',
      extension: '.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      available: true
    },
    {
      id: 'xml',
      label: 'XML',
      description: 'Structured data format',
      icon: Code,
      format: 'xml',
      extension: '.xml',
      mimeType: 'application/xml',
      available: true
    },
    {
      id: 'png',
      label: 'PNG Image',
      description: 'Image format for sharing',
      icon: FileImage,
      format: 'png',
      extension: '.png',
      mimeType: 'image/png',
      available: true
    }
  ];

  const generateMockData = useCallback((): ExportData => {
    const scans = [
      {
        id: 'scan_1',
        type: 'github',
        target: 'https://github.com/user/repo',
        timestamp: Date.now() - 86400000, // 1 day ago
        score: 85,
        risk: 'medium',
        status: 'completed',
        details: {
          filesScanned: 67,
          suspiciousFiles: 2,
          vulnerabilities: 1,
          dependencies: 23,
          riskFactors: ['postinstall script detected', 'obfuscated code']
        }
      },
      {
        id: 'scan_2',
        type: 'linkedin',
        target: 'https://linkedin.com/in/recruiter',
        timestamp: Date.now() - 172800000, // 2 days ago
        score: 92,
        risk: 'low',
        status: 'completed',
        details: {
          profileAge: 18,
          connections: 342,
          postsCount: 45,
          verificationStatus: 'verified',
          riskFactors: []
        }
      },
      {
        id: 'scan_3',
        type: 'image',
        target: 'profile-image.jpg',
        timestamp: Date.now() - 259200000, // 3 days ago
        score: 78,
        risk: 'medium',
        status: 'completed',
        details: {
          matchesFound: 8,
          platforms: 3,
          confidence: 85,
          isStock: false,
          riskFactors: ['profile used on multiple platforms']
        }
      }
    ];

    return {
      scans,
      timestamp: Date.now(),
      format: selectedFormat,
      metadata: {
        version: '1.0.0',
        generatedBy: 'TrustHire Scanner',
        totalScans: scans.length,
        dateRange: 'Last 3 days'
      }
    };
  }, [selectedFormat]);

  const exportToJSON = useCallback((data: ExportData) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadFile(blob, 'trusthire-scan-results.json');
  }, []);

  const exportToCSV = useCallback((data: ExportData) => {
    const headers = [
      'ID',
      'Type',
      'Target',
      'Timestamp',
      'Score',
      'Risk',
      'Status',
      'Files Scanned',
      'Vulnerabilities',
      'Risk Factors'
    ];

    const csvContent = [
      headers.join(','),
      ...data.scans.map(scan => [
        scan.id,
        scan.type,
        scan.target,
        new Date(scan.timestamp).toISOString(),
        scan.score,
        scan.risk,
        scan.status,
        scan.details?.filesScanned || '',
        scan.details?.vulnerabilities || '',
        scan.details?.riskFactors ? scan.details.riskFactors.join('; ') : ''
      ])
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, 'trusthire-scan-results.csv');
  }, []);

  const exportToPDF = useCallback(async (data: ExportData) => {
    setExportProgress(0);
    setIsExporting(true);

    try {
      // Create PDF content (simplified - in production, use a proper PDF library)
      const pdfContent = generatePDFContent(data);
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      downloadFile(blob, 'trusthire-scan-results.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, []);

  const exportToExcel = useCallback(async (data: ExportData) => {
    setExportProgress(0);
    setIsExporting(true);

    try {
      // Create Excel content (simplified - in production, use a proper Excel library)
      const excelContent = generateExcelContent(data);
      const blob = new Blob([excelContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      downloadFile(blob, 'trusthire-scan-results.xlsx');
    } catch (error) {
      console.error('Excel export failed:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, []);

  const exportToXML = useCallback((data: ExportData) => {
    const xmlContent = generateXMLContent(data);
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    downloadFile(blob, 'trusthire-scan-results.xml');
  }, []);

  const exportToPNG = useCallback(async (data: ExportData) => {
    setExportProgress(0);
    setIsExporting(true);

    try {
      // Create PNG content (simplified - in production, use a proper image generation library)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 800;
      canvas.height = 600;
      
      // Draw header
      if (ctx) {
        ctx.fillStyle = '#0A0A0B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('TrustHire Scan Results', 50, 50);
        
        // Draw metadata
        ctx.font = '14px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Generated: ${new Date(data.timestamp).toLocaleString()}`, 50, 100);
        ctx.fillText(`Total Scans: ${data.metadata.totalScans}`, 50, 130);
        ctx.fillText(`Format: ${data.format.toUpperCase()}`, 50, 160);
        
        // Draw scan results
        let yPosition = 220;
        ctx.font = '12px monospace';
        data.scans.forEach((scan, index) => {
          ctx.fillStyle = scan.risk === 'low' ? '#16A34A' : scan.risk === 'medium' ? '#CA8A04' : '#DC2626';
          ctx.fillText(`${index + 1}. ${scan.type.toUpperCase()} - Score: ${scan.score} - Risk: ${scan.risk.toUpperCase()}`, 50, yPosition);
          yPosition += 25;
        });
      }
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          downloadFile(blob, 'trusthire-scan-results.png');
        }
      }, 'image/png');
    } catch (error) {
      console.error('PNG export failed:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, []);

  const generatePDFContent = (data: ExportData): string => {
    let pdfContent = `%PDF-1.4
1 0 obj
<< /Title (TrustHire Scan Results)
/Creator (TrustHire Scanner)
/Producer (TrustHire v${data.metadata.version})
/CreationDate (D:${new Date(data.timestamp).toISOString().split('T')[0].replace(/-/g, '')})
>>
<< /Subject (Security Scan Report - ${data.metadata.dateRange})>>
2 0 obj
<< /Font <<
/BBox [0 0 612 792] /Rect [0 0 612 792] /Resources <<
/Font <<
/F1 12 Helvetica>>
>>
endobj
trailer
<< /Info (This report contains ${data.metadata.totalScans} security scans) >>
endobj
`;

    // Add scan results
    data.scans.forEach((scan, index) => {
      pdfContent += `
2 0 obj
<< /Type /Paragraph>>
<< /Text (${index + 1}. ${scan.type.toUpperCase()} Scan)>>
endobj
<< /Text (Target: ${scan.target})>>
endobj
<< /Text (Score: ${scan.score} / Risk: ${scan.risk.toUpperCase()})>>
endobj
`;
    });

    pdfContent += `endstream
obj
<< /Length ${pdfContent.length} >>
stream
${pdfContent}
endobj`;

    return pdfContent;
  };

  const generateExcelContent = (data: ExportData): string => {
    // Simplified Excel XML format
    return `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    <row r="1">
      <c t="inlineStr" s="1"><v>ID</v></c>
      <c t="inlineStr" s="1"><v>Type</v></c>
      <c t="inlineStr" s="1"><v>Target</v></c>
      <c t="inlineStr" s="1"><v>Timestamp</v></c>
      <c t="inlineStr" s="1"><v>Score</v></c>
      <c t="inlineStr" s="1"><v>Risk</v></c>
      <c t="inlineStr" s="1"><v>Status</v></c>
    </row>
    ${data.scans.map(scan => `
    <row>
      <c t="inlineStr"><v>${scan.id}</v></c>
      <c t="inlineStr"><v>${scan.type}</v></c>
      <c t="inlineStr"><v>${scan.target}</v></c>
      <c t="inlineStr"><v>${new Date(scan.timestamp).toISOString()}</v></c>
      <c t="inlineStr"><v>${scan.score}</v></c>
      <c t="inlineStr"><v>${scan.risk}</v></c>
      <c t="inlineStr"><v>${scan.status}</v></c>
    </row>`).join('')}
  </sheetData>
</worksheet>`;
  };

  const generateXMLContent = (data: ExportData): string => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<trusthire-scan-results>
  <metadata>
    <version>${data.metadata.version}</version>
    <generated-by>${data.metadata.generatedBy}</generated-by>
    <timestamp>${data.timestamp}</timestamp>
    <total-scans>${data.metadata.totalScans}</total-scans>
    <date-range>${data.metadata.dateRange}</date-range>
  </metadata>
  <scans>
    ${data.scans.map(scan => `
    <scan id="${scan.id}">
      <type>${scan.type}</type>
      <target>${scan.target}</target>
      <timestamp>${scan.timestamp}</timestamp>
      <score>${scan.score}</score>
      <risk>${scan.risk}</risk>
      <status>${scan.status}</status>
      <details>
        ${Object.entries(scan.details || {}).map(([key, value]) => `<${key}>${value}</${key}>`).join('\n        ')}
      </details>
    </scan>`).join('')}
  </scans>
</trusthire-scan-results>`;
  };

  const downloadFile = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setLastExport(filename);
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const data = generateMockData();
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 20) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      switch (selectedFormat) {
        case 'json':
          exportToJSON(data);
          break;
        case 'csv':
          exportToCSV(data);
          break;
        case 'pdf':
          await exportToPDF(data);
          break;
        case 'excel':
          await exportToExcel(data);
          break;
        case 'xml':
          exportToXML(data);
          break;
        case 'png':
          await exportToPNG(data);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [selectedFormat]);

  const shareResults = useCallback(() => {
    const data = generateMockData();
    const shareText = `TrustHire Scan Results\n\n${data.metadata.totalScans} scans completed\nDate range: ${data.metadata.dateRange}\n\nTop results:\n${data.scans.slice(0, 3).map((scan, index) => 
      `${index + 1}. ${scan.type}: ${scan.score} score (${scan.risk} risk)`
    ).join('\n')}`;

    if (navigator.share) {
      navigator.share({
        title: 'TrustHire Scan Results',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
      }).catch(console.error);
    }
  }, []);

  const sendEmail = useCallback(() => {
    const data = generateMockData();
    const subject = encodeURIComponent('TrustHire Scan Results');
    const body = encodeURIComponent(
      `TrustHire Scan Results\n\n${data.metadata.totalScans} scans completed\nDate range: ${data.metadata.dateRange}\n\nView full results at: ${window.location.href}`
    );
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, []);

  const printResults = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="bg-[#111113] border border-white/5 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-mono text-white">Export Manager</h3>
            <p className="text-sm text-white/60 font-mono">Export scan results in multiple formats</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={shareResults}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm rounded-xl transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={sendEmail}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-mono text-sm rounded-xl transition-all duration-200"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={printResults}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-mono text-sm rounded-xl transition-all duration-200"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold font-mono text-white mb-4">Export Format</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedFormat(option.id)}
                className={`
                  p-4 rounded-xl border transition-all duration-200
                  ${selectedFormat === option.id
                    ? 'border-blue-500/30 bg-blue-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }
                  ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={!option.available}
              >
                <div className="flex flex-col items-center gap-3">
                  <Icon className={`w-8 h-8 ${selectedFormat === option.id ? 'text-blue-400' : 'text-white/60'}`} />
                  <span className="font-mono text-sm font-medium">{option.label}</span>
                  <span className="text-xs text-white/50 text-center">{option.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold rounded-2xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Exporting... {exportProgress}%</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Export Results ({selectedFormat.toUpperCase()})</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {isExporting && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-400 font-mono text-sm">Exporting...</span>
            <span className="text-blue-400 font-mono text-sm">{exportProgress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Last Export */}
      {lastExport && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono text-sm">
              Last exported: {lastExport}
            </span>
          </div>
        </div>
      )}

      {/* Export Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/60 font-mono">Total Exports</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {Math.floor(Math.random() * 100) + 50}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-xs text-white/60 font-mono">This Week</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {Math.floor(Math.random() * 20) + 5}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/60 font-mono">All Time</span>
          </div>
          <div className="text-2xl font-mono text-white">
            {Math.floor(Math.random() * 500) + 100}
          </div>
        </div>
      </div>

      {/* Format Information */}
      <div className="mt-8 space-y-4">
        <h4 className="text-lg font-semibold font-mono text-white">Format Information</h4>
        {exportOptions.map((option) => (
          <div key={option.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              selectedFormat === option.id ? 'bg-blue-500/20' : 'bg-white/10'
            }`}>
              <option.icon className={`w-4 h-4 ${selectedFormat === option.id ? 'text-blue-400' : 'text-white/60'}`} />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold font-mono text-white">{option.label}</h5>
              <p className="text-xs text-white/60 font-mono">{option.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/40 font-mono">Format: {option.format}</span>
                <span className="text-xs text-white/40 font-mono">Extension: {option.extension}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
