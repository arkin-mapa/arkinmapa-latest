import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import mammoth from 'mammoth';
import { toast } from 'react-hot-toast';

interface Props {
  planId: string;
  onVouchersExtracted: (vouchers: string[]) => void;
}

export function FileUploader({ planId, onVouchersExtracted }: Props) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractVouchersFromWord = async (arrayBuffer: ArrayBuffer): Promise<string[]> => {
    try {
      // Convert DOCX to HTML with custom style mappings
      const { value: html } = await mammoth.convertToHtml({
        arrayBuffer,
        transformDocument: (element) => {
          // Check for font size 14 text
          if (element.type === 'run' && element.styleId?.includes('size-14')) {
            element.styleName = 'size-14';
          }
          return element;
        },
        styleMap: [
          "table => table",
          "tr => tr",
          "td => td",
          "p[style-name='size-14'] => p.size-14",
          "r[style-name='size-14'] => span.size-14"
        ],
        includeDefaultStyleMap: true,
        preserveEmptyParagraphs: true
      });

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const vouchers = new Set<string>();

      // Function to extract voucher codes from text
      const extractCodes = (text: string) => {
        // Match numbers that are 6-14 digits long
        const matches = text.match(/\b\d{6,14}\b/g);
        if (matches) {
          matches.forEach(code => vouchers.add(code));
        }
      };

      // Extract from table cells
      doc.querySelectorAll('td').forEach(cell => {
        const text = cell.textContent?.trim() || '';
        extractCodes(text);
      });

      // Extract from text with size 14
      doc.querySelectorAll('.size-14').forEach(element => {
        const text = element.textContent?.trim() || '';
        extractCodes(text);
      });

      // Convert Set to Array and sort
      const voucherArray = Array.from(vouchers).sort();

      if (voucherArray.length === 0) {
        throw new Error('No valid voucher codes found');
      }

      return voucherArray;
    } catch (error) {
      console.error('Error extracting vouchers:', error);
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.docx')) {
      toast.error('Please upload a Word document (.docx)');
      return;
    }

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const vouchers = await extractVouchersFromWord(arrayBuffer);
      
      // Show preview
      const totalFound = vouchers.length;
      const previewCodes = vouchers.slice(0, 3).join(', ');
      
      toast(
        <div className="space-y-1">
          <p className="font-medium">Found {totalFound} voucher codes:</p>
          <p className="font-mono text-xs bg-gray-50 p-1 rounded">
            {previewCodes}...
          </p>
          <p className="text-xs text-gray-500">
            Range: {vouchers[0]} to {vouchers[vouchers.length - 1]}
          </p>
        </div>,
        { duration: 5000 }
      );

      onVouchersExtracted(vouchers);
    } catch (error) {
      console.error('Error reading document:', error);
      toast.error('No valid voucher codes found in the document');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={loading}
      />
      <button
        type="button"
        className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs border rounded ${
          loading ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50'
        }`}
        disabled={loading}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <>
            <Upload size={14} />
            Upload Vouchers
          </>
        )}
      </button>
    </div>
  );
}