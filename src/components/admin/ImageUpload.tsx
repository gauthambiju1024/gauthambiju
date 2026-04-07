import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, folder = 'images', className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please sign in via the sidebar to upload images.');
      setUploading(false);
      return;
    }
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from('uploads').upload(path, file);
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
    onChange(urlData.publicUrl);
    setUploading(false);
    toast.success('Image uploaded');
  };

  return (
    <div className={className}>
      {value && (
        <div className="relative inline-block mb-2">
          <img src={value} alt="Upload" className="h-24 rounded-md object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={() => onChange('')}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
        {value && (
          <Input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Or paste URL"
            className="text-xs flex-1"
          />
        )}
      </div>
    </div>
  );
}
