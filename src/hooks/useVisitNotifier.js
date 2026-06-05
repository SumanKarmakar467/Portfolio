import { useEffect } from 'react';

const VISIT_PING_KEY = 'discord_notified';

function getBrowserName(userAgent) {
  if (/Edg\//.test(userAgent)) return 'Edge';
  if (/OPR\//.test(userAgent) || /Opera/.test(userAgent)) return 'Opera';
  if (/Firefox\//.test(userAgent)) return 'Firefox';
  if (/Chrome\//.test(userAgent) || /CriOS\//.test(userAgent)) return 'Chrome';
  if (/Safari\//.test(userAgent) && /Version\//.test(userAgent)) return 'Safari';
  return 'Unknown';
}

function getOSName(userAgent) {
  if (/Windows/i.test(userAgent)) return 'Windows';
  if (/Macintosh|Mac OS X/i.test(userAgent)) return 'Mac';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
  if (/Linux/i.test(userAgent)) return 'Linux';
  return 'Unknown';
}

export default function useVisitNotifier() {
  useEffect(() => {
    async function notifyDiscord() {
      try {
        if (sessionStorage.getItem(VISIT_PING_KEY)) return;
        sessionStorage.setItem(VISIT_PING_KEY, 'true');

        const now = new Date();
        const timeStr = now.toUTCString();
        const userAgent = navigator.userAgent || '';
        const referrer = document.referrer || 'Direct / No Referrer';
        const resolution = `${screen.width}x${screen.height}`;
        const deviceType = /Mobi|Android/i.test(userAgent) ? 'Mobile' : 'Desktop';
        const browser = getBrowserName(userAgent);
        const os = getOSName(userAgent);
        const language = navigator.language || 'Unknown';
        let city = 'Unknown';
        let region = 'Unknown';
        let country = 'Unknown';
        let ip = 'Unknown';

        try {
          const geoResponse = await fetch('https://ipapi.co/json/');
          const geo = await geoResponse.json();
          city = geo?.city || 'Unknown';
          region = geo?.region || 'Unknown';
          country = geo?.country_name || 'Unknown';
          ip = geo?.ip || 'Unknown';
        } catch {
          city = 'Unknown';
          region = 'Unknown';
          country = 'Unknown';
          ip = 'Unknown';
        }

        const payload = {
          username: 'Portfolio Visitor Bot',
          avatar_url: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
          embeds: [
            {
              title: 'New Visitor on Your Portfolio',
              color: 0x5865f2,
              fields: [
                { name: 'Time', value: timeStr, inline: false },
                { name: 'Location', value: `${city}, ${region}, ${country}`, inline: false },
                { name: 'IP', value: ip, inline: true },
                { name: 'Page', value: window.location.href, inline: false },
                { name: 'Referrer', value: referrer, inline: false },
                { name: 'Device', value: deviceType, inline: true },
                { name: 'Screen', value: resolution, inline: true },
                { name: 'Browser', value: browser, inline: true },
                { name: 'OS', value: os, inline: true },
                { name: 'Language', value: language, inline: true },
              ],
              footer: { text: 'suman-karmakar.vercel.app' },
              timestamp: now.toISOString(),
            },
          ],
        };

        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        });
      } catch {
        // Never let visitor notifications break the portfolio.
      }
    }

    notifyDiscord();
  }, []);
}
