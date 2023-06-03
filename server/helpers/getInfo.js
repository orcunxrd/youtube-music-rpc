import axios from 'axios';

export default async (videoId) => {
  const data = JSON.stringify({
    "videoId": videoId,
    "context": {
      "client": {
        "hl": "tr",
        "gl": "TR",
        "deviceMake": "",
        "deviceModel": "",
        "clientName": "WEB_REMIX",
        "clientVersion": "1.20230524.01.00",
        "osName": "Windows",
        "osVersion": "10.0",
        "originalUrl": "https://music.youtube.com/",
        "platform": "DESKTOP",
        "clientFormFactor": "UNKNOWN_FORM_FACTOR",
        "configInfo": {
          "appInstallData": ""
        },
        "browserName": "Chrome",
        "browserVersion": "114.0.0.0",
        "screenWidthPoints": 1920,
        "screenHeightPoints": 929,
        "screenPixelDensity": 1,
        "screenDensityFloat": 1,
        "utcOffsetMinutes": 180,
        "userInterfaceTheme": "USER_INTERFACE_THEME_DARK",
        "connectionType": "CONN_CELLULAR_4G",
        "timeZone": "Europe/Istanbul",
        "playerType": "UNIPLAYER",
        "tvAppInfo": {
          "livingRoomAppMode": "LIVING_ROOM_APP_MODE_UNSPECIFIED"
        },
        "clientScreen": "WATCH_FULL_SCREEN"
      }
    },
    "params": "8AUB",
    "captionParams": {}
  });

  const headers = {
    'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
    'sec-ch-ua-arch': '"x86"',
    'sec-ch-ua-platform-version': '"15.0.0"',
    'sec-ch-ua-full-version-list': '"Not.A/Brand";v="8.0.0.0", "Chromium";v="114.0.5735.90", "Google Chrome";v="114.0.5735.90"',
    'sec-ch-ua-wow64': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-bitness': '"64"',
    'sec-ch-ua-platform': '"Windows"',
    'X-Youtube-Bootstrap-Logged-In': 'false',
    'sec-ch-ua-mobile': '?0',
    'Content-Type': 'application/json',
    'sec-ch-ua-full-version': '"114.0.5735.90"',
    'X-Youtube-Client-Name': '67',
    'X-Youtube-Client-Version': '1.20230524.01.00',
  }

  const response = await axios('https://music.youtube.com/youtubei/v1/player', {
    method: 'POST',
    headers,
    data
  });

  return response.data;
}