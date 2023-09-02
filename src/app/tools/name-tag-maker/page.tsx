'use client';
import { useState } from 'react';
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
  const [inputCache, setInputCache] = useState<{ grade: Partial<TagData['grade']> }[]>([]);

  const addTag = (tag: TagData) => {
    setTags((tags) => [...tags, tag]);
    setInputCache((cache) => [
      ...cache,
      { grade: { number: tag.grade?.number || new Date().getFullYear() - 2003 } },
    ]);
  };
  const removeTag = (index: number) => {
    setTags((tags) => tags.filter((_, i) => i !== index));
    setInputCache((cache) => cache.filter((_, i) => i !== index));
    if (tags.length === 1) {
      addTag(emptyTagData);
    }
  };
  const updateTag = (index: number, tag: TagData) => {
    setTags((tags) => tags.map((t, i) => (i === index ? tag : t)));
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

  return (
    <main>
      <div className={styles.controls}>
        <button
          onClick={() => {
            addTag(emptyTagData);
          }}
        >
          Add Tag
        </button>
        <button
          onClick={() => {
            removeTag(tags.length - 1);
          }}
        >
          Remove Tag
        </button>
        <div>
          {tags.map((tag, index) => (
            <div key={index}>
              <input
                type='text'
                value={tag.role?.ja}
                onChange={(e) => {
                  updateTag(index, { ...tag, role: { ...tag.role, ja: e.target.value } });
                }}
              />
              <input
                type='text'
                value={tag.role?.en}
                onChange={(e) => {
                  updateTag(index, { ...tag, role: { ...tag.role, en: e.target.value } });
                }}
              />
              <select
                value={tag.grade?.type || 'undefined'}
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
                <option value='undefined'>-</option>
                <option value='junior'>中学</option>
                <option value='senior'>高校</option>
              </select>
              <input
                type='number'
                value={
                  tag.grade?.number ||
                  inputCache[index]?.grade?.number ||
                  new Date().getFullYear() - 2003
                }
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
                type='text'
                value={tag.staffName?.ja}
                onChange={(e) => {
                  updateTag(index, { ...tag, staffName: { ...tag.staffName, ja: e.target.value } });
                }}
              />
              <input
                type='text'
                value={tag.staffName?.en}
                onChange={(e) => {
                  updateTag(index, { ...tag, staffName: { ...tag.staffName, en: e.target.value } });
                }}
              />
              <select
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
                type='text'
                value={tag.position}
                onChange={(e) => {
                  updateTag(index, { ...tag, position: e.target.value });
                }}
              />
              <button onClick={() => removeTag(index)}>×</button>
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
