import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  fullBox: false,
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  tinfo: {
    bookingInfo: localStorage.getItem('bookingInfo')
      ? JSON.parse(localStorage.getItem('bookingInfo'))
      : { location: {} },
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    tinfoItems: localStorage.getItem('tinfoItems')
      ? JSON.parse(localStorage.getItem('tinfoItems'))
      : [],
  },
};
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FULLBOX_ON':
      return { ...state, fullBox: true };
    case 'SET_FULLBOX_OFF':
      return { ...state, fullBox: false };

    case 'tinfo_ADD_ITEM':
      // add to tinfo
      const newItem = action.payload;
      const existItem = state.tinfo.tinfoItems.find(
        (item) => item._id === newItem._id
      );
      const tinfoItems = existItem
        ? state.tinfo.tinfoItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.tinfo.tinfoItems, newItem];
      localStorage.setItem('tinfoItems', JSON.stringify(tinfoItems));
      return { ...state, tinfo: { ...state.tinfo, tinfoItems } };
    case 'tinfo_REMOVE_ITEM': {
      const tinfoItems = state.tinfo.tinfoItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('tinfoItems', JSON.stringify(tinfoItems));
      return { ...state, tinfo: { ...state.tinfo, tinfoItems } };
    }
    case 'tinfo_CLEAR':
      return { ...state, tinfo: { ...state.tinfo, tinfoItems: [] } };

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        tinfo: {
          tinfoItems: [],
          bookingInfo: {},
          paymentMethod: '',
        },
      };
    case 'SAVE_BOOKING_INFO':
      return {
        ...state,
        tinfo: {
          ...state.tinfo,
          bookingInfo: action.payload,
        },
      };
    

    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        tinfo: { ...state.tinfo, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
