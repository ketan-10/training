import { Download, Link, Loader, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { shortFileName } from '../../utils';
import request from '../../utils/axios.config';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

const FileUpload = ({ initialValue, onChange, onFile }) => {
  const [fileName, setFileName] = useState(initialValue || null);

  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = useMutation({
    mutationFn: (data) => {
      return request.post(`/api/files`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (res) => {
      if (res?.data?.name) {
        setFileName(res.data.name);
        onChange(res.data.name);
      }
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const fetchFile = useMutation({
    mutationFn: async (id) => {
      return request.get(`/api/files/${id}`, {
        responseType: 'blob',
      });
    },
    onSuccess: (res) => {
      const fileName = res.headers
        .get('Content-Disposition')
        .split('filename=')[1];
      const url = window.URL.createObjectURL(new File([res.data], fileName));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      link.click();
      // window.location.assign(url);
    },
  });
  return (
    <div className="flex w-full items-center gap-4">
      <div>
        <Label
          htmlFor="myfile"
          className="cursor-pointer flex gap-2 items-center h-10 w-full rounded-md border border-input bg-transparent px-5 py-2 text-sm ring-offset-background "
        >
          <div>{fileName ? shortFileName(fileName) : 'Choose File '}</div>{' '}
          <Link className="w-4 h-4" />
        </Label>
        <input
          type="file"
          hidden
          id="myfile"
          className="w-full h-full"
          onChange={(d) => {
            setIsLoading(true);
            const fd = new FormData();
            fd.append('file', d.target.files[0]);
            uploadFile.mutate(fd);
            if (onFile) {
              onFile(d);
            }
          }}
        />
      </div>

      {fileName && (
        <>
          <Button
            variant="ghost"
            className="p-0 rounded-full"
            onClick={() => {
              fetchFile.mutate(fileName);
            }}
          >
            <div className="p-2 bg-gray-100 rounded-full">
              <Download className="w-5 h-5" />
            </div>
          </Button>
          <Button
            variant="ghost"
            className="p-0 rounded-full"
            onClick={() => {
              setFileName(null);
              onChange(null);
            }}
          >
            <div className="p-2 bg-gray-100 rounded-full">
              <Trash2 className="w-5 h-5" />
            </div>
          </Button>
        </>
      )}
      {isLoading && (
        <Button variant="ghost" className="p-0 rounded-full">
          <div className="p-2 bg-gray-100 rounded-full">
            <Loader className="w-5 h-5" />
          </div>
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
