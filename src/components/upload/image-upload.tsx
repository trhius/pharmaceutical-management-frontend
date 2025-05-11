
import React, { useState, createRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';

import { handleError } from 'src/utils/notify';

import { useUploadFileMutation } from 'src/app/api/file/fileApiSlice';

import Loading from '../auth/Loading';
//------------------------------------------------------------
type ImageUploaderProps = {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  removable?: boolean;
  disabled?: boolean;
  saveable?: boolean;
};

const ImageUploader = ({
  imageUrl,
  setImageUrl,
  removable,
  disabled,
  saveable,
}: ImageUploaderProps) => {
  // const { t } = useTranslation('profile', { keyPrefix: 'image.tooltip' });
  const [image, _setImage] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<File | undefined>();
  const inputFileRef = createRef<HTMLInputElement>();
  const [uploadFile] = useUploadFileMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [isDoneUploading, setIsDoneUploading] = useState(false);

  useEffect(() => {
    _setImage(imageUrl);
  }, [imageUrl]);

  const cleanup = () => {
    if (!image) return;
    URL.revokeObjectURL(image);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const setImage = (newImage: string | null) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
  };

  const handleUploadButtonClick = () => {
    inputFileRef.current?.click();
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setRawImage(newImage);
      setImage(URL.createObjectURL(newImage));
      setIsDoneUploading(false);
    }

    if (!saveable) {
      handleSaveClick(newImage);
    }
  };

  const handleSaveClick = async (rawImageFile: File | undefined) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      if (rawImageFile) {
        formData.append('file', rawImageFile);
      } else if (rawImage) {
        formData.append('file', rawImage);
      }
      const { data } = await uploadFile({ formData }).unwrap();
      const { url } = data;
      setImageUrl(url);
      setIsDoneUploading(true);
    } catch (error) {
      handleError(error, 'Error uploading image');
    }
    setIsUploading(false);
  };

  useEffect(() => {}, [rawImage, uploadFile, setImageUrl]);

  return (
    <Stack direction="row">
      {image ? (
        <Box>
          <Box
            component="img"
            src={image}
            alt="photoURL"
            sx={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: '5px',
              mb: 1,
            }}
            onClick={handleUploadButtonClick}
          />
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            sx={{ fontWeight: 400 }}
            onClick={handleUploadButtonClick}
          >
            Upload
          </Button>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: '5px',
              background: '#eee',
              mb: 1,
            }}
          />
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            sx={{ fontWeight: 400 }}
            onClick={handleUploadButtonClick}
          >
            Upload
          </Button>
        </Box>
      )}
      {isUploading && (
        <Stack
          sx={{
            width: 120,
            height: 120,
            position: 'absolute',
            objectFit: 'cover',
            borderRadius: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <Loading />
        </Stack>
      )}
      {isDoneUploading && (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{
            width: 120,
            height: 120,
            position: 'absolute',
            objectFit: 'cover',
            borderRadius: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <DoneIcon color="success" style={{ fontSize: '40px' }} />
        </Stack>
      )}

      <input
        ref={inputFileRef}
        accept="image/*"
        hidden
        id="upload"
        type="file"
        onChange={handleOnChange}
        disabled={disabled}
      />
    </Stack>
  );
};

export default ImageUploader;
