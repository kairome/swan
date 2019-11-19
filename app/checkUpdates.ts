import axios from 'axios';

const checkUpdates = async () => {
  const response = await axios.get('https://github.com/kairome/swan/releases/latest');
  const redirectUrl = response.request.res.responseUrl;
  const tag = redirectUrl ? redirectUrl.split('tag/')[1] : '';
  const version = tag.replace('v', '').trim();
  return version && version !== process.env.APP_VERSION ? version : '';
};

export default checkUpdates;
