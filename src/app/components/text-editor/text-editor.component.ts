import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

export interface TableData {
  col1: string;
  col2: string;
}

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
})
export class TextEditorComponent implements OnInit {
  alert(arg0: number) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;
  content: string = '';
  tableRows: number = 3;
  tableCols: number = 3;
  showTableForm: boolean = false;
  displayedColumns: string[] = ['col1', 'col2']; // Adjust columns as needed
  dataSource = new MatTableDataSource<TableData>();

  ngOnInit(): void {
    this.loadContent();
  }

  format(command: string, value: string = ''): void {
    document.execCommand(command, false, value);
  }

  saveContent(): void {
    this.content = this.editor.nativeElement.innerHTML;
    localStorage.setItem('content', this.content);

    Swal.fire({
      icon: 'success',
      title: 'Content saved!',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  loadContent(): void {
    const savedContent = localStorage.getItem('content');
    if (savedContent) {
      this.content = savedContent;
      this.editor.nativeElement.innerHTML = savedContent;
    }
  }

  onFontSizeChange(event: any): void {
    this.format('fontSize', event.value);
  }

  onFontFamilyChange(event: any): void {
    this.format('fontName', event.value);
  }

  alignText(align: 'left' | 'center' | 'right' | 'justify'): void {
    this.format(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`);
  }

  setHeading(heading: number): void {
    this.format('formatBlock', `<h${heading}>`);
  }

  toggleSubscript(): void {
    this.format('subscript');
  }

  toggleSuperscript(): void {
    this.format('superscript');
  }

  toggleStrikethrough(): void {
    this.format('strikeThrough');
  }

  clearFormatting(): void {
    this.format('removeFormat');
  }

  indent(): void {
    this.format('indent');
  }

  outdent(): void {
    this.format('outdent');
  }

  insertHorizontalRule(): void {
    this.format('insertHorizontalRule');
  }

  insertTable() {
    const tableData: TableData[] = [];
    for (let i = 0; i < this.tableRows; i++) {
      const rowData: TableData = { col1: '', col2: '' }; // Add more columns as needed
      tableData.push(rowData);
    }
    this.dataSource.data = tableData;
    this.showTableForm = false; // Hide the table insertion form after insertion
  }

  toggleTableForm(): void {
    this.showTableForm = !this.showTableForm;
  }

  insertLink(url: string): void {
    const selection = window.getSelection();
    if (selection) {
      const link = `<a href="${url}" target="_blank">${selection.toString()}</a>`;
      this.format('insertHTML', link);
    }
  }

  insertImage(url: string): void {
    const imageHtml = `<img src="${url}" alt="Image" style="max-width: 100%;">`;
    this.format('insertHTML', imageHtml);
  }

  setBackgroundColor(color: string): void {
    this.format('backColor', color);
  }

  setTextColor(color: string): void {
    this.format('foreColor', color);
  }

  toggleBlockquote(): void {
    this.format('formatBlock', '<blockquote>');
  }

  toggleCode(): void {
    this.format('formatBlock', '<code>');
  }

  insertDate(): void {
    const date = new Date().toLocaleDateString();
    this.format('insertHTML', date);
  }

  insertTime(): void {
    const time = new Date().toLocaleTimeString();
    this.format('insertHTML', time);
  }

  insertEmail(email: string): void {
    const emailHtml = `<a href="mailto:${email}">${email}</a>`;
    this.format('insertHTML', emailHtml);
  }

  insertHorizontalLine(): void {
    const horizontalLine = '<hr>';
    this.format('insertHTML', horizontalLine);
  }

  toggleUnderline(): void {
    this.format('underline');
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      this.editor.nativeElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  printContent(): void {
    const printWindow = window.open('', '_blank');
    printWindow!.document.write(`<html><body>${this.content}</body></html>`);
    printWindow!.document.close();
    printWindow!.print();
  }

  downloadAsHTML(): void {
    const blob = new Blob([this.content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.html';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadAsText(): void {
    const textContent = this.editor.nativeElement.innerText;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  insertSpecialCharacter(character: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(character));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  insertEmoji(emoji: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(emoji));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  getWordCount(): number {
    const text = this.editor.nativeElement.innerText || '';
    return text.trim().split(/\s+/).length;
  }

  toggleReadOnly(): void {
    const contentEditable =
      this.editor.nativeElement.getAttribute('contenteditable');
    this.editor.nativeElement.setAttribute(
      'contenteditable',
      contentEditable === 'true' ? 'false' : 'true'
    );
  }

  toggleHighlight(color: string = 'yellow'): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const currentColor = document.queryCommandValue('backColor');
      const newColor = currentColor === color ? 'transparent' : color;
      this.format('backColor', newColor);
    }
  }

  insertLineBreak(): void {
    this.format('insertHTML', '<br>');
  }
}
