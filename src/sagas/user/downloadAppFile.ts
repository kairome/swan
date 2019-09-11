import api from 'utils/api';
import { GOOGLE_DRIVE_URL } from 'utils/google';

const downloadAppFile = async (token: string, fileId: string, fileName: string) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const result = await api<string>('GET', `${GOOGLE_DRIVE_URL}/${fileId}?alt=media`, undefined, headers);
  const fileNameMatch = result.data.match(/filename="([^"]*)"/);
  const fileContentMatch = result.data.match(/Content-Type: application\/json([\S\s]*?)------WebKitFormBoundary/);
  const matchFileName = fileNameMatch ? fileNameMatch[1] : null;
  const fileContent = fileContentMatch ? fileContentMatch[1] : null;
  if (matchFileName && fileContent) {
    return {
      fileName: matchFileName,
      fileContent: fileContent.trim(),
    };
  }

  if (result.data) {
    return {
      fileName,
      fileContent: result.data,
    };
  }

  return null;
};

export default downloadAppFile;
