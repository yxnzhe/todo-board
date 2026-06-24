import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { exportService } from '@/services/export.service';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

export function ExportImport() {
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState('');

  async function handleExport() {
    setExporting(true);
    setStatus('');
    try {
      const json = await exportService.exportAll();
      const filename = `workboard-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
      exportService.downloadJson(json, filename);
      setStatus('Export complete');
    } catch (err: any) {
      setStatus(`Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.version && data.data) {
          setStatus(`Loaded backup from ${data.exported_at}. Import functionality coming soon.`);
        } else {
          setStatus('Invalid backup file format');
        }
      } catch {
        setStatus('Failed to parse backup file');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-4 py-2 border-b border-border bg-bg-secondary">
        <h2 className="text-sm font-semibold text-text-primary">Export & Backup</h2>
      </div>
      <div className="p-4 space-y-4 max-w-md">
        <div className="bg-bg-secondary border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold text-text-primary mb-2">Export Data</h3>
          <p className="text-[11px] text-text-muted mb-3">
            Download your complete workspace as a JSON file including all tasks, comments, decisions, worklogs, and notes.
          </p>
          <Button variant="primary" onClick={handleExport} disabled={exporting}>
            <Download size={13} />
            {exporting ? 'Exporting...' : 'Export JSON'}
          </Button>
        </div>

        <div className="bg-bg-secondary border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold text-text-primary mb-2">Import Backup</h3>
          <p className="text-[11px] text-text-muted mb-3">
            Restore from a previously exported backup file.
          </p>
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-bg-tertiary hover:bg-bg-hover border border-border rounded cursor-pointer transition-colors">
            <Upload size={13} />
            Choose File
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        {status && (
          <p className="text-xs text-text-secondary bg-bg-tertiary rounded px-3 py-2">{status}</p>
        )}
      </div>
    </div>
  );
}
