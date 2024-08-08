import { atom } from 'recoil';

const defaultValue = [
  {
    id: 1,
    userId: 1,
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'This is the first ' },
            { type: 'text', marks: [{ type: 'italic' }], text: 'note' },
            { type: 'text', text: ' about this person. ' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'Gonna style this somehow.' }
          ]
        }
      ]
    },
    createdAt: '2024-08-07 15:11:55',
    memberId: 954
  },
  {
    id: 2,
    userId: 2,
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: "Here's " },
            { type: 'text', marks: [{ type: 'underline' }], text: 'another' },
            { type: 'text', text: ' one left by someone else.' }
          ]
        }
      ]
    },
    createdAt: '2024-08-07 15:12:12',
    memberId: 954
  }
];
const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const commentTestState = atom({
  key: 'commentTestState',
  default: defaultValue,
  effects: [localStorageEffect('commentTestState')]
});
