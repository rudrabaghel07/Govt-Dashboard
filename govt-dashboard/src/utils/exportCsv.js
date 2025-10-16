export function exportToCsv(filename = 'export.csv', rows = []) {
  if (!rows || rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  const header = keys.join(',') + '\n';
  const csv = rows.map(r => keys.map(k => {
    const v = r[k] ?? '';
    return '"' + String(v).replace(/"/g, '""') + '"';
  }).join(',')).join('\n');

  const blob = new Blob([header + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
