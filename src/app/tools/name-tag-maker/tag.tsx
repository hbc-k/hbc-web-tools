'use client';
import styles from './tag.module.scss';
import localFont from 'next/font/local';
import { Noto_Sans_JP } from 'next/font/google';
import { useEffect, useRef } from 'react';

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '900'],
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
});

const bahnschrift = localFont({
  src: './bahnschrift.woff2',
  variable: '--font-bahnschrift',
});

export type TagProps = {
  role: Partial<{ ja: string; en: string }>;
  staffName: Partial<{ ja: string; en: string }>;
  position: string;
  gradeColor: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

export function Tag(props: Partial<TagProps>) {
  const { role, staffName, position, gradeColor } = props;

  const mmToPx = (mm: number) => (mm * 96) / 25.4;

  const roleJaRef = useRef<HTMLParagraphElement>(null);
  const roleEnRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (roleJaRef.current) {
      roleJaRef.current.style.scale = `${Math.min(
        mmToPx(96) / roleJaRef.current.getBoundingClientRect().width,
        1,
      )} 1`;
    }
    if (roleEnRef.current) {
      roleEnRef.current.style.scale = `${Math.min(
        mmToPx(96) / roleEnRef.current.getBoundingClientRect().width,
        1,
      )} 1`;
    }
  });

  return (
    <article className={`${notoSansJP.variable} ${bahnschrift.variable} ${styles.tag}`}>
      <div className={styles.background}>
        <div className={styles.backgroundWrapper}>
          <div className={styles.backgroundCyanBox} />
          <div className={styles.backgroundMagentaBox} />
        </div>
      </div>
      <div className={styles.frameTop}>
        <div className={styles.frameTopBackground}></div>
        <div className={styles.frameTopForeground}>
          <div className={styles.frameTopLogo}>
            {/* prettier-ignore */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200"><path d="M 109.49106,200 V 0 h 37.68913 V 200 Z M 0,200 V 0 H 37.689133 V 200 Z M 17.469051,118.98212 V 82.6685 H 133.97524 v 36.31362 z"/><path d="m 184.50619,200 v -36.31362 h 63.82393 q 12.92985,0 19.94498,-6.18982 7.15269,-6.32737 7.15269,-17.6066 v -0.41266 q 0,-11.41678 -7.15269,-17.6066 -7.01513,-6.32737 -19.94498,-6.32737 H 184.50619 V 79.229711 h 63.82393 q 11.69189,0 18.01926,-5.914717 6.46492,-5.91472 6.46492,-16.643744 v 0 q 0,-9.76616 -6.46492,-14.99312 -6.32737,-5.364513 -18.01926,-5.364513 H 184.50619 V 0 h 65.0619 q 29.16093,0 45.11692,14.167813 16.09353,14.167813 16.09353,40.027509 v 0 q 0,17.469052 -10.31637,28.885832 -10.17881,11.279232 -28.88583,14.442918 19.94498,2.751028 30.81155,15.268228 11.00413,12.37964 11.00413,32.32462 v 0.41265 q 0,25.99725 -16.09353,40.30262 Q 281.20495,200 251.90646,200 Z M 168,200 V 0 h 37.68913 v 200 z"/><path d="m 421.38281,0 a 100,100 0 0 0 -100,100 100,100 0 0 0 100,100 A 100,100 0 0 0 500,161.42188 L 470.12109,138.07812 A 62,62 0 0 1 421.38281,162 a 62,62 0 0 1 -62,-62 62,62 0 0 1 62,-62 62,62 0 0 1 47.47266,22.164062 L 497.9707,35.734375 A 100,100 0 0 0 421.38281,0 Z"/></svg>
          </div>
          <div className={styles.frameTopText}>
            <p>Staff Card</p>
          </div>
        </div>
      </div>
      {role && (
        <div className={styles.role}>
          <div className={styles.roleContent}>
            {role.ja && (
              <div className={styles.roleItem}>
                <p ref={roleJaRef} className={styles.roleJa}>
                  {role.ja.split('').map((char, index) => (
                    <span key={index} className={styles.roleJaChar}>
                      {char}
                    </span>
                  ))}
                </p>
              </div>
            )}
            <hr className={styles.roleItem} />
            {role.en && (
              <div className={styles.roleItem}>
                <p ref={roleEnRef} className={styles.roleEn}>
                  {role.en.split('').map((char, index) => (
                    <span key={index} className={styles.roleEnChar}>
                      {char}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {staffName && (
        <div className={styles.staffName}>
          {gradeColor !== undefined && (
            <div
              className={`${styles.gradeColor} ${
                gradeColor !== 0 ? styles[`gradeColor${gradeColor}`] : ''
              }`}
            />
          )}
          <div className={styles.staffNameText}>
            {position && (
              <div className={`${styles.staffNameTextItem} ${styles.staffNamePosition}`}>
                <div className={styles.staffNamePositionWrapper}>
                  <p className={styles.staffNamePositionScaler}>{position}</p>
                </div>
              </div>
            )}
            {staffName.ja && (
              <p className={`${styles.staffNameTextItem} ${styles.staffNameJa}`}>{staffName.ja}</p>
            )}
            {staffName.en && (
              <p className={`${styles.staffNameTextItem} ${styles.staffNameEn}`}>{staffName.en}</p>
            )}
          </div>
        </div>
      )}
      <div className={styles.orgName}>
        <p>
          <span>広島県立広島中学校・広島高等学校</span>
        </p>
        <p>
          <span>放送部</span>
        </p>
      </div>
      <div className={styles.frameBottom}>
        <div className={styles.frameBottomBackground}></div>
        <div className={styles.frameBottomForeground}>
          <div className={styles.frameBottomText}>
            <div className={styles.frameBottomTextWrapper}>
              <p className={styles.frameBottomTextScaler}>
                <span>Hiroshima Broadcasting Club</span>
                <span>Hiroshima Broadcasting Club</span>
                <span>Hiroshima Broadcasting Club</span>
                <span>Hiroshima Broadcasting Club</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
