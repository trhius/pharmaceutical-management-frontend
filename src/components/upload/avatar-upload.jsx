import PropTypes from 'prop-types';
// import { useTranslation } from 'react-i18next';
import React, { useState, createRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { showErrorMessage } from 'src/utils/notify';

import { useUploadFileMutation } from 'src/app/api/file/fileApiSlice';

const AvatarUpload = ({ imageUrl, setImageUrl, name }) => {
  // const { t } = useTranslation('profile', { keyPrefix: 'avatar.tooltip' });
  const [image, _setImage] = useState(imageUrl);
  const [rawImage, setRawImage] = useState();
  const inputFileRef = createRef(null);
  const [uploadFile] = useUploadFileMutation();
  const [canPerformSave, setCanPerformSave] = useState(false);

  const cleanup = () => {
    URL.revokeObjectURL(image);
    inputFileRef.current.value = null;
  };

  const setImage = (newImage) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
  };

  const handleUploadButtonClick = () => {
    inputFileRef.current.click();
  };

  const handleOnChange = (event) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setRawImage(newImage);
      setImage(URL.createObjectURL(newImage));
      setCanPerformSave(true);
    }
  };

  const handleRemoveClick = (event) => {
    event.preventDefault();
    if (canPerformSave) {
      setImage(imageUrl);
      setCanPerformSave(false);
      setRawImage(null);
    } else if (image) {
      setImage(null);
      setCanPerformSave(true);
    }
  };

  const handleSaveClick = async () => {
    if (!rawImage) {
      setImageUrl("");
      setCanPerformSave(false);
    } else {
      try {
        const formData = new FormData();
        formData.append('file', rawImage);
        const { data } = await uploadFile({ formData }).unwrap();
        const { url } = data;
        setImageUrl(url);
        setCanPerformSave(false);
        setRawImage(null);
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

  useEffect(() => { }, [rawImage, uploadFile, setImageUrl]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Avatar
        src={image}
        alt={name}
        sx={{
          borderRadius: 50,
          width: 120,
          height: 120,
          cursor: 'pointer',
        }}
      />
      <Box>
        <Tooltip title="Upload">
          <IconButton
            sx={canPerformSave ? { display: "none" } : { position: 'absolute', top: -30, right: 20, background: 'white' }}
            onClick={handleUploadButtonClick}
          >
            <FileUploadIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
          </IconButton>
        </Tooltip>
      </Box>

      <input
        ref={inputFileRef}
        accept="image/*"
        hidden
        id="upload"
        type="file"
        onChange={handleOnChange}
      />

      {(imageUrl || canPerformSave) && <Tooltip title={canPerformSave ? "Cancel" : "Remove"}>
        <IconButton
          sx={
            canPerformSave
              ? { position: 'absolute', top: -15, right: -8, background: 'white', color: "red", border: "1px solid red" }
              : { position: 'absolute', top: -15, right: -8, background: 'white' }
          }
          onClick={handleRemoveClick}
        >
          <CloseIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
        </IconButton>
      </Tooltip>}

      <Tooltip title="Save">
        <IconButton
          sx={
            canPerformSave
              ? { position: 'absolute', top: 10, right: -28.5, background: 'white', color: "green", border: "1px solid green" }
              : { display: 'none' }
          }
          onClick={handleSaveClick}
        >
          <CheckIcon sx={{ cursor: 'pointer', fontSize: '13px' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

AvatarUpload.propTypes = {
  imageUrl: PropTypes.string,
  setImageUrl: PropTypes.func,
  name: PropTypes.string
};

export default AvatarUpload;
