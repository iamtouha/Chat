import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

type Props = { file: File; onClose: () => void };

export const FileCard = ({ file, onClose }: Props) => {
  const dataUrl = URL.createObjectURL(file);
  return (
    <div className="w-full">
      <div className="flex items-center border bg-muted rounded-sm shadow-sm max-w-xs">
        {file.type.startsWith('image/') ? (
          <img
            src={dataUrl}
            alt={file.name}
            className="w-12 h-12 object-contain pl-1"
          />
        ) : (
          <Button variant={'outline'} disabled size={'icon'} className="px-1">
            <Icons.file className="h-9 w-9" />
          </Button>
        )}
        <p className="px-1 line-clamp-1 flex-1">{file.name}</p>
        <Button size={'sm'} variant={'ghost'} onClick={() => onClose()}>
          <Icons.close className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
