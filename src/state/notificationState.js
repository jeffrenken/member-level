import { atom } from 'recoil';

const defaultValue = [
  { id: 2, name: 'Dwight', action: 'mentioned', target: 'You', time: '36 mins ago', type: 'members', typeId: 954, is_read: false },
  { id: 3, name: 'Jim', action: 'mentioned', target: 'You', time: '3 hours ago', type: 'members', typeId: 954, is_read: false }
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

export const notificationState = atom({
  key: 'notificationState',
  default: defaultValue
  //effects: [localStorageEffect('notificationState')]
});
