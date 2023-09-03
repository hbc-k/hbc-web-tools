'use client';
import { useEffect, useRef, useState } from 'react';
import './style.scss';
import styles from './style.module.scss';
import { Tag, TagProps } from './tag';

function* chunkArrayGenerator(array: Array<object>, n: number) {
  for (let i = 0; i < array.length; i += n) {
    yield array.slice(i, i + n);
  }
}

type TagData = Partial<{
  role: TagProps['role'];
  grade: { type: 'junior' | 'senior'; number: number };
  staffName: TagProps['staffName'];
  gradeColor: TagProps['gradeColor'];
  position: TagProps['position'];
}>;

const rolePresets: NonNullable<TagData['role']>[] = [
  { ja: '撮影', en: 'CAMERA CREW' },
  { ja: '取材', en: 'PRESS' },
  { ja: '放送', en: 'ANNOUNCEMENT' },
  { ja: '音響', en: 'PUBLIC ADDRESS' },
  { ja: '映像', en: 'VIDEO' },
  { ja: '照明', en: 'LIGHTING' },
];

const exampleTagData: TagData = {
  role: { ja: '撮影', en: 'CAMERA CREW' },
  grade: { type: 'senior', number: 18 },
  staffName: { ja: '県広 花子', en: 'KENHIRO Hanako' },
};

const emptyTagData: TagData = {
  role: { ja: '', en: '' },
  grade: undefined,
  staffName: { ja: '', en: '' },
  gradeColor: undefined,
  position: undefined,
};

export default function Page() {
  const [tags, setTags] = useState<TagData[]>([exampleTagData]);
  const [inputCache, setInputCache] = useState<{ grade: Partial<TagData['grade']> }[]>([
    { grade: exampleTagData.grade },
  ]);
  const [backup, setBackup] = useState<string>('');
  const file = useRef<HTMLInputElement>(null);

  const addTag = (tag: TagData) => {
    setTags((tags) => {
      const newTags = [...tags, tag];
      localStorage.setItem('tags', JSON.stringify(newTags));
      return newTags;
    });
    setInputCache((cache) => [
      ...cache,
      { grade: { number: tag.grade?.number || new Date().getFullYear() - 2003 } },
    ]);
  };

  const removeTag = (index: number) => {
    setTags((tags) => {
      if (tags.length === 1) {
        localStorage.removeItem('tags');
        return [emptyTagData];
      }
      const newTags = tags.filter((_, i) => i !== index);
      localStorage.setItem('tags', JSON.stringify(newTags));
      return newTags;
    });
    setInputCache((cache) => cache.filter((_, i) => i !== index));
  };

  const updateTag = (index: number, tag: TagData) => {
    setTags((tags) => {
      const newTags = tags.map((t, i) => (i === index ? tag : t));
      localStorage.setItem('tags', JSON.stringify(newTags));
      return newTags;
    });
  };

  const updateGradeNumberCache = (index: number, number: number) => {
    setInputCache((cache) => {
      const newCache = [...cache];
      newCache[index] = { ...newCache[index], grade: { number } };
      return newCache;
    });
  };

  const chunkedTags: Partial<TagProps>[][] = Array.from(
    chunkArrayGenerator(
      tags.map((tag) => ({
        role: tag.role,
        staffName: tag.staffName,
        gradeColor:
          tag.gradeColor !== undefined
            ? tag.gradeColor
            : tag.grade &&
              (tag.grade.type === 'junior'
                ? ((tag.grade.number - 1) % 6) + 1
                : ((tag.grade.number + 2) % 6) + 1),
        position:
          tag.position ||
          (tag.grade &&
            `${tag.grade?.type === 'junior' ? 'Junior' : 'Senior'}: ${tag.grade?.number}th`),
      })),
      4,
    ),
  );

  useEffect(() => {
    const tags = localStorage.getItem('tags');
    if (tags) {
      const cachedTags: TagData[] = JSON.parse(tags);
      setTags(cachedTags);
      setInputCache(
        cachedTags.map((tag) => ({
          grade: { number: tag.grade?.number || new Date().getFullYear() - 2003 },
        })),
      );
    }
  }, []);

  return (
    <main>
      <div className='mx-auto my-4 max-w-7xl px-2'>
        <div className='my-2 flex gap-2'>
          <button
            className='ml-auto mr-2 rounded-md bg-slate-600 p-2 font-bold text-white transition-colors hover:bg-slate-500 active:bg-slate-700'
            onClick={() => {
              setTags([emptyTagData]);
              setInputCache([{ grade: { number: new Date().getFullYear() - 2003 } }]);
              localStorage.removeItem('tags');
            }}
          >
            リセット
          </button>
          <button
            className='rounded-md bg-cyan-600 p-2 py-0.5 font-bold text-white transition-colors hover:bg-cyan-500 active:bg-cyan-700'
            onClick={() => {
              window.print();
            }}
          >
            印刷
          </button>
          <button
            className='rounded-md bg-pink-600 p-2 py-0.5 font-bold text-white transition-colors hover:bg-pink-500 active:bg-pink-700'
            onClick={() => {
              addTag(emptyTagData);
            }}
          >
            追加
          </button>
        </div>
        <div className='my-2'>
          {tags.map((tag, index) => (
            <div key={index} className='my-1 flex gap-2'>
              <div className='flex w-6 shrink-0 items-center'>
                <span className='block'>{index + 1}.</span>
              </div>
              <div className='flex grow gap-1'>
                <select
                  className='block w-16 shrink-0 rounded border px-0.5 py-0.5'
                  value={tag.role?.ja || ''}
                  onChange={(e) => {
                    updateTag(index, {
                      ...tag,
                      role: rolePresets.find((role) => role.ja === e.target.value),
                    });
                  }}
                >
                  <option value=''>-</option>
                  {rolePresets.map((role, index) => (
                    <option key={index} value={role.ja}>
                      {role.ja}
                    </option>
                  ))}
                </select>
                <input
                  className='block w-28 rounded border px-1.5 py-0.5'
                  type='text'
                  value={tag.role?.ja || ''}
                  placeholder='役職（日）'
                  onChange={(e) => {
                    updateTag(index, { ...tag, role: { ...tag.role, ja: e.target.value } });
                  }}
                />
                <input
                  className='block w-full grow rounded border px-1.5 py-0.5'
                  type='text'
                  value={tag.role?.en || ''}
                  placeholder='役職（英）'
                  onChange={(e) => {
                    updateTag(index, { ...tag, role: { ...tag.role, en: e.target.value } });
                  }}
                />
              </div>
              <div className='flex grow gap-1'>
                <select
                  className='block w-16 shrink-0 rounded border px-0.5 py-0.5'
                  value={tag.grade?.type || ''}
                  onChange={(e) => {
                    if (e.target.value === 'junior' || e.target.value === 'senior') {
                      updateTag(index, {
                        ...tag,
                        grade: {
                          type: e.target.value === 'junior' ? 'junior' : 'senior',
                          number:
                            tag.grade?.number ||
                            inputCache[index]?.grade?.number ||
                            new Date().getFullYear() - 2003,
                        },
                        gradeColor: undefined,
                      });
                    } else {
                      updateTag(index, { ...tag, grade: undefined, gradeColor: 0 });
                    }
                  }}
                >
                  <option value=''>-</option>
                  <option value='junior'>中学</option>
                  <option value='senior'>高校</option>
                </select>
                <input
                  className='block w-16 rounded border px-1.5 py-0.5 disabled:bg-gray-200'
                  type='number'
                  value={
                    tag.grade?.number ||
                    inputCache[index]?.grade?.number ||
                    new Date().getFullYear() - 2003
                  }
                  disabled={tag.grade?.type === undefined}
                  onChange={(e) => {
                    updateGradeNumberCache(index, Number(e.target.value));
                    if (tag.grade?.type === undefined) return;
                    updateTag(index, {
                      ...tag,
                      grade: {
                        type: tag.grade.type,
                        number: Number(e.target.value),
                      },
                    });
                  }}
                />
                <input
                  className='block w-full grow rounded border px-1.5 py-0.5'
                  type='text'
                  value={tag.staffName?.ja || ''}
                  placeholder='氏名（日）'
                  onChange={(e) => {
                    updateTag(index, {
                      ...tag,
                      staffName: { ...tag.staffName, ja: e.target.value },
                    });
                  }}
                />
                <input
                  className='block w-full grow rounded border px-1.5 py-0.5'
                  type='text'
                  value={tag.staffName?.en || ''}
                  placeholder='氏名（英）'
                  onChange={(e) => {
                    updateTag(index, {
                      ...tag,
                      staffName: { ...tag.staffName, en: e.target.value },
                    });
                  }}
                />
              </div>
              <div className='flex gap-1'>
                <select
                  className='block w-12 shrink-0 rounded border px-0.5 py-0.5'
                  value={tag.gradeColor !== undefined ? tag.gradeColor : 'undefined'}
                  onChange={(e) => {
                    updateTag(index, {
                      ...tag,
                      gradeColor:
                        Number(e.target.value) === 0
                          ? 0
                          : Number(e.target.value) === 1
                          ? 1
                          : Number(e.target.value) === 2
                          ? 2
                          : Number(e.target.value) === 3
                          ? 3
                          : Number(e.target.value) === 4
                          ? 4
                          : Number(e.target.value) === 5
                          ? 5
                          : Number(e.target.value) === 6
                          ? 6
                          : undefined,
                    });
                  }}
                >
                  <option value='undefined'>-</option>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
                <input
                  className='block w-full max-w-[12rem] grow rounded border px-1.5 py-0.5'
                  type='text'
                  value={tag.position || ''}
                  placeholder='肩書（カスタム）'
                  onChange={(e) => {
                    updateTag(index, { ...tag, position: e.target.value || undefined });
                  }}
                />
              </div>
              <button
                className='shrink-0 rounded bg-slate-600 px-2 font-bold text-white transition-colors hover:bg-slate-500 active:bg-slate-700'
                onClick={() => removeTag(index)}
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.printArea}>
        {chunkedTags.map((chunk, index) => (
          <section key={index} className={styles.page}>
            <div className={styles.pageContent}>
              <div className={styles.printMarks}>
                <div className={styles.printMarksHorizontal}>
                  <div className={styles.printMarksHorizontalLine} />
                  <div className={styles.printMarksHorizontalLine} />
                  <div className={styles.printMarksHorizontalLine} />
                </div>
                <div className={styles.printMarksVertical}>
                  <div className={styles.printMarksVerticalLine} />
                  <div className={styles.printMarksVerticalLine} />
                  <div className={styles.printMarksVerticalLine} />
                  <div className={styles.printMarksVerticalLine} />
                </div>
              </div>
              <div className={styles.tags}>
                {chunk.map((tag, index) => (
                  <Tag key={index} {...tag} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className='mx-auto my-4 max-w-7xl px-2'>
        <textarea
          className='block w-full rounded border px-1.5 py-0.5'
          value={backup}
          onChange={(e) => {
            setBackup(e.target.value);
          }}
        />
        <div className='my-2 flex gap-2'>
          <button
            className='ml-auto rounded-md bg-slate-600 p-2 font-bold text-white transition-colors hover:bg-slate-500 active:bg-slate-700'
            onClick={() => {
              setBackup(JSON.stringify(tags));
            }}
          >
            エクスポート
          </button>
          <button
            className='mr-2 rounded-md bg-slate-600 p-2 font-bold text-white transition-colors hover:bg-slate-500 active:bg-slate-700 disabled:bg-slate-400'
            disabled={backup === ''}
            onClick={() => {
              const blob = new Blob([JSON.stringify(tags)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `イベント名札メーカー_${((date) =>
                date.getFullYear() +
                String(date.getMonth() + 1).padStart(2, '0') +
                String(date.getDate()).padStart(2, '0') +
                String(date.getHours()).padStart(2, '0') +
                String(date.getMinutes()).padStart(2, '0') +
                String(date.getSeconds()).padStart(2, '0'))(new Date())}.json`;
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
          >
            ファイルに保存
          </button>
          <button
            className='rounded-md bg-slate-600 p-2 font-bold text-white transition-colors hover:bg-slate-500 active:bg-slate-700'
            onClick={() => {
              file.current?.click();
            }}
          >
            ファイルを開く
          </button>
          <input
            ref={file}
            className='hidden'
            type='file'
            accept='application/json'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                setBackup(reader.result as string);
              };
              reader.readAsText(file);
            }}
          />
          <button
            className='rounded-md bg-slate-600 p-2 font-bold text-white transition-colors hover:bg-slate-500 active:bg-slate-700 disabled:bg-slate-400'
            disabled={backup === ''}
            onClick={() => {
              try {
                const importedTags: TagData[] = JSON.parse(backup);
                setTags(importedTags);
                setInputCache(
                  importedTags.map((tag) => ({
                    grade: { number: tag.grade?.number || new Date().getFullYear() - 2003 },
                  })),
                );
                localStorage.setItem('tags', JSON.stringify(importedTags));
              } catch (e) {
                alert('インポートに失敗しました。');
              }
            }}
          >
            インポート
          </button>
        </div>
      </div>
    </main>
  );
}
