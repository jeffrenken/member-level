import { atom } from 'recoil';

const defaultValue = [
  {
    id: 1,
    userId: 1,
    userName: 'Test User',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'This is the first ' },
            { type: 'text', marks: [{ type: 'italic' }, { type: 'bold' }], text: 'note' },
            { type: 'text', text: ' about this person. ' }
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
    userName: 'Dwight Schrute',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Can I get ' },
            { type: 'mention', attrs: { id: 'Test User', label: null } },
            { type: 'text', text: '  and ' },
            { type: 'mention', attrs: { id: 'Jim Halpert', label: null } },
            { type: 'text', text: '  to check this out?' }
          ]
        }
      ]
    },
    createdAt: '2024-08-07 15:12:12',
    memberId: 954
  },
  {
    id: 3,
    userId: 3,
    userName: 'Jim Halpert',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'mention', attrs: { id: 'Test User', label: null } },
            { type: 'text', text: ' Please check the status of medications.' }
          ]
        }
      ]
    },
    createdAt: '2024-08-13 09:53:32',
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
  default: defaultValue
  //effects: [localStorageEffect('commentTestState')]
});
