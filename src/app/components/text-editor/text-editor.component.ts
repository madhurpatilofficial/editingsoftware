import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { marked } from 'marked';
import Swal from 'sweetalert2';

export interface TableData {
  col1: string;
  col2: string;
}
interface Comment {
  text: string;
  range: Range;
}
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
})
export class TextEditorComponent implements OnInit {
comments: any;
  alert(arg0: number) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDivElement>;
  content: string = '';
  shortcuts: { [key: string]: () => void } = {};
  recognition: any;
  isVoiceTyping: boolean = false;


  ngOnInit(): void {
    this.loadContent();
    this.autoSave();
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
  insertLineBreak(): void {
    this.format('insertHTML', '<br>');
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
  // Commenting System
  addComment(text: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const comment: Comment = { text, range };
      this.comments.push(comment);
    }
  }
  downloadAsPDF(): void {
    html2canvas(this.editor.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('content.pdf');
    });
  }
  // Table Insertion and Management
  insertTable(rows: number, cols: number): void {
    let table = '<table border="1">';
    for (let i = 0; i < rows; i++) {
      table += '<tr>';
      for (let j = 0; j < cols; j++) {
        table += '<td>&nbsp;</td>';
      }
      table += '</tr>';
    }
    table += '</table>';
    this.format('insertHTML', table);
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const keyCombo = `${event.ctrlKey ? 'Ctrl+' : ''}${event.key}`;
    if (this.shortcuts[keyCombo]) {
      event.preventDefault();
      this.shortcuts[keyCombo]();
    }
  }


  autoSave(): void {
    setInterval(() => {
      this.saveContent();
    }, 300000);
  }
  versionHistory: string[] = [];
  revertToVersion(index: number): void {
    if (this.versionHistory[index]) {
      this.content = this.versionHistory[index];
      this.editor.nativeElement.innerHTML = this.content;
    }
  }

  // Voice Typing
  startVoiceTyping(): void {
    if (!this.recognition) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            this.editor.nativeElement.innerHTML += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error(event.error);
      };
    }

    if (this.isVoiceTyping) {
      this.recognition.stop();
      this.isVoiceTyping = false;
    } else {
      this.recognition.start();
      this.isVoiceTyping = true;
    }
  }
}