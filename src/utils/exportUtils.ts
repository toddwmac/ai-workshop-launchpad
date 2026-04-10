import type { ExportData, UserPrompt } from '../types';

export function exportAsJSON(data: ExportData, filename: string = 'ai-workshop-content.json'): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

export function exportAsMarkdown(data: ExportData, filename: string = 'ai-workshop-content.md'): void {
  const markdownContent = generateMarkdown(data);
  downloadFile(markdownContent, filename, 'text/markdown');
}

export function generateMarkdown(data: ExportData): string {
  let markdown = `# AI Workshop Content Export\n\n`;
  markdown += `**Export Date:** ${new Date(data.exportDate).toLocaleString()}\n\n`;
  markdown += `**Version:** ${data.version}\n\n`;

  // Content Sections
  markdown += `## Content by Section\n\n`;

  const sections = ['mindset', 'skillSet', 'toolSet'] as const;
  sections.forEach(section => {
    const sectionContent = data.content.filter(item => item.section === section);
    if (sectionContent.length > 0) {
      markdown += `### ${section.charAt(0).toUpperCase() + section.slice(1)}\n\n`;
      sectionContent.forEach((item, index) => {
        markdown += `#### ${index + 1}. ${item.title}\n`;
        markdown += `**Type:** ${item.type}\n\n`;
        markdown += `${item.description}\n\n`;
        if (item.url) {
          markdown += `**Link:** ${item.url}\n\n`;
        }
      });
    }
  });

  // Glossary Terms
  if (data.glossaryTerms.length > 0) {
    markdown += `## AI Mindset Glossary\n\n`;
    data.glossaryTerms.forEach(term => {
      markdown += `### ${term.term}\n`;
      markdown += `${term.definition}\n\n`;
      markdown += `[Learn More](${term.learnMoreUrl})\n\n`;
    });
  }

  // AI Tools
  if (data.aiTools.length > 0) {
    markdown += `## Popular AI Tools\n\n`;
    data.aiTools.forEach(tool => {
      markdown += `### ${tool.name}\n`;
      markdown += `**Category:** ${tool.category}\n\n`;
      markdown += `${tool.description}\n\n`;
      markdown += `[Visit Tool](${tool.url})\n\n`;
    });
  }

  return markdown;
}

export function exportUserPrompts(prompts: UserPrompt[]): void {
  const jsonContent = JSON.stringify(prompts, null, 2);
  downloadFile(jsonContent, 'my-prompts.json', 'application/json');
}

export function exportAllContent(
  content: any[],
  glossary: any[],
  tools: any[]
): void {
  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    content,
    glossaryTerms: glossary,
    aiTools: tools
  };

  exportAsJSON(data);
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}