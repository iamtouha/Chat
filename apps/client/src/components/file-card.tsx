import { Icons } from './icons';
import { Button } from './ui/button';
import type { FileInfo } from '@/types';

export const FileCard = ({
  fileInfo,
  dataurl,
  onClose,
}: {
  fileInfo: FileInfo;
  dataurl: string;
  onClose: () => void;
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center border bg-muted rounded-sm shadow-sm px-2 max-w-xs">
        {fileInfo.type.startsWith('image/') ? (
          <img
            src={dataurl}
            alt={fileInfo.name}
            className="w-12 h-12 object-contain"
          />
        ) : (
          <div>File</div>
        )}
        <p className="px-1 line-clamp-1 flex-1">{fileInfo.name}</p>
        <Button size={'sm'} variant={'ghost'} onClick={() => onClose()}>
          <Icons.close className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
