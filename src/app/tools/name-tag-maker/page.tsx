'use client';
import { useEffect, useState } from 'react';
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
  staffName: { ja: '県広 花子', en: 'KENHIRO Hanako' },
  grade: { type: 'senior', number: 18 },
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
      <div className={styles.controls}>
        <div className='my-2 flex gap-2'>
          <button
            className='ml-auto mr-2 w-16 bg-red-600 font-bold text-white'
            onClick={() => {
              setTags([emptyTagData]);
              setInputCache([{ grade: { number: new Date().getFullYear() - 2003 } }]);
              localStorage.removeItem('tags');
            }}
          >
            リセット
          </button>
          <button
            className='w-12 bg-cyan-600 font-bold text-white'
            onClick={() => {
              window.print();
            }}
          >
            印刷
          </button>
          <button
            className='w-12 bg-pink-600 font-bold text-white'
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
                  className='w-16 shrink-0'
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
                  className='w-28'
                  type='text'
                  value={tag.role?.ja || ''}
                  placeholder='役職（日）'
                  onChange={(e) => {
                    updateTag(index, { ...tag, role: { ...tag.role, ja: e.target.value } });
                  }}
                />
                <input
                  className='w-full grow'
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
                  className='w-16 shrink-0'
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
                  className='w-16'
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
                  className='w-full grow'
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
                  className='w-full grow'
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
                  className='w-16'
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
                  className='w-full max-w-[8rem] grow'
                  type='text'
                  value={tag.position || ''}
                  placeholder='肩書（カスタム）'
                  onChange={(e) => {
                    updateTag(index, { ...tag, position: e.target.value || undefined });
                  }}
                />
              </div>
              <button
                className='w-12 shrink-0 bg-slate-600 font-bold text-white'
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
    </main>
  );
}
